#!/usr/bin/env python3
"""
Zubilant structural guard.

Why this exists
---------------
Every card on this site is hand-authored HTML of the shape:

    <a class="pcard ..."> <img> <div class="body"> ... </div> </a>

If the closing </div> for .body is omitted, the browser does NOT throw. It
silently leaves that div open, and every element that follows -- including the
*other tab panels* -- gets parsed as a child of that one card. The visible
result is that the default tab looks broken and the Interests / Month /
Trending tabs render nothing at all, because hiding the first panel hides the
panels nested inside it.

That failure shipped once. This script makes it impossible to ship again: it
parses each page with html5lib (the same tree-construction algorithm Chrome
uses, adoption-agency and all) and asserts the invariants that were violated.

Run:  python3 tools/check-structure.py
Exit: 0 = clean, 1 = a structural defect. CI fails the build on 1.
"""

import glob
import os
import re
import sys

try:
    import html5lib
except ImportError:
    sys.exit("html5lib is required:  pip install html5lib")

NS = "{http://www.w3.org/1999/xhtml}"
CARD_CLASS_RE = re.compile(r"\b(pcard|jcard|zcard|folder)\b")


def classes(el):
    return (el.get("class") or "").split()


def has_card_class(el):
    return bool(CARD_CLASS_RE.search(el.get("class") or ""))


def tag(el):
    t = el.tag
    return t[len(NS):] if isinstance(t, str) and t.startswith(NS) else t


def describe(el):
    bits = tag(el)
    if el.get("id"):
        bits += "#" + el.get("id")
    if el.get("class"):
        bits += "." + ".".join(classes(el))[:60]
    if el.get("href"):
        bits += ' href="%s"' % el.get("href")
    return bits


def check(path):
    with open(path, encoding="utf-8") as fh:
        raw = fh.read()
    doc = html5lib.parse(raw, namespaceHTMLElements=True)

    parents = {child: parent for parent in doc.iter() for child in parent}
    problems = []

    def ancestors(el):
        cur = parents.get(el)
        while cur is not None:
            yield cur
            cur = parents.get(cur)

    # 1. No anchor inside an anchor. This is the direct fingerprint of an
    #    unclosed div swallowing the cards that follow it.
    for el in doc.iter("%sa" % NS):
        for anc in ancestors(el):
            if tag(anc) == "a":
                problems.append(
                    "anchor nested inside another anchor: %s inside %s "
                    "(an unclosed <div> in the outer card?)"
                    % (describe(el), describe(anc))
                )
                break

    # 2. No tab panel inside another tab panel. When this happens, hiding the
    #    default panel hides every other tab's content.
    panels = [el for el in doc.iter() if el.get("role") == "tabpanel"]
    for el in panels:
        for anc in ancestors(el):
            if anc.get("role") == "tabpanel":
                problems.append(
                    "tab panel nested inside another tab panel: %s inside %s "
                    "-- the outer panel's 'hidden' attribute will hide this one too"
                    % (describe(el), describe(anc))
                )
                break

    # 3. Every tab button's aria-controls target must exist.
    ids = {el.get("id") for el in doc.iter() if el.get("id")}
    for el in doc.iter():
        target = el.get("aria-controls")
        if el.get("role") == "tab" and target and target not in ids:
            problems.append(
                'tab "%s" points at aria-controls="%s", which does not exist'
                % (describe(el), target)
            )

    # 4. No card inside another card.
    cards = [el for el in doc.iter() if has_card_class(el)]
    for el in cards:
        for anc in ancestors(el):
            if has_card_class(anc):
                problems.append(
                    "card nested inside another card: %s inside %s"
                    % (describe(el), describe(anc))
                )
                break

    # 5. Every .pcard must be a direct child of a .hscroll rail. A card that
    #    has floated out of its rail is a card nobody can reach.
    for el in cards:
        if "pcard" not in classes(el):
            continue
        parent = parents.get(el)
        if parent is None or "hscroll" not in classes(parent):
            problems.append(
                "pcard is not a direct child of an .hscroll rail: %s "
                "(its parent is %s)"
                % (describe(el), describe(parent) if parent is not None else "nothing")
            )

    # 6. The number of cards the browser builds must equal the number the
    #    author wrote. A mismatch means the parser dropped or merged elements.
    written = len(re.findall(r'class="[^"]*\bpcard\b', raw))
    parsed = len([el for el in cards if "pcard" in classes(el)])
    if written != parsed:
        problems.append(
            "%d pcards written in source but %d in the parsed DOM"
            % (written, parsed)
        )

    return problems


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    files = sorted(glob.glob(os.path.join(root, "*.html")))
    if not files:
        sys.exit("no HTML files found next to tools/")

    total = 0
    for path in files:
        problems = check(path)
        if problems:
            total += len(problems)
            print("\nFAIL  %s" % os.path.basename(path))
            for p in problems:
                print("      - %s" % p)

    if total:
        print(
            "\n%d structural problem(s) across %d file(s).\n"
            "Most of these come from one cause: a card whose "
            '<div class="body"> was never closed.\n'
            "Every card must end  ...</div></div></a>  -- one </div> for .foot, "
            "one for .body.\n" % (total, len(files))
        )
        return 1

    print("OK  %d page(s) structurally sound." % len(files))
    return 0


if __name__ == "__main__":
    sys.exit(main())
