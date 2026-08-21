/* ═══════════════════════════════════════════════════════════════
   ZUBILANT · zubi-chat.js — "Ask Zubi", the site guide. 21 Aug 2026.

   Client-side only, by ruling: no LLM, no API key, no server. Zubi answers
   from two sources and nothing else —
     1. window.ZUBI_DATA  (zubi-data.js, generated from journeys.html canon)
     2. the CONFIRMED facts block below (every line traceable to the board)
   Anything outside those two routes to a human: the callback hand-off.

   Callback hand-off: per the 21 Aug ruling all CTAs lead to one journey —
   plan-your-journey.html — so Zubi prefills that page via the query string.
   When 2.1 #6 (where enquiries land) is answered, swap sendCallback() for a
   fetch() to the Worker. Nothing else needs to change.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  if(window.__zubiChat) return; window.__zubiChat=true;
  var D=window.ZUBI_DATA||{journeys:[],syn:{}};
  var J=D.journeys, SYN=D.syn;
  var PHONE='+91 81081 17770', TEL='tel:+918108117770', WA='https://wa.me/918108117770', MAIL='experience@zubilant.co.in';
  var PLAN='plan-your-journey.html';
  var AVATAR='zubi-watching.webp';

  /* ── helpers ── */
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function inr(n){return '₹'+String(n).replace(/\B(?=(\d\d)+(\d)(?!\d))/g,',');}
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function byHref(h){for(var i=0;i<J.length;i++){if(J[i].h===h) return J[i];} return null;}
  function href(u,extra){return u+(extra||'');}

  /* current page context */
  var path=(location.pathname.split('/').pop()||'index.html');
  var HERE=byHref(path);                         // a journey page?
  var PAGE=path.replace('.html','');

  /* ── the catalogue search (same method as the homepage smart search) ── */
  var STOP=['the','and','for','with','trip','tour','holiday','want','looking','nights','days','from','journey','somewhere','please','can','you','about','what','which','any','have','there','this','that','need','some','show','find','suggest','recommend','good','best','would','like','into','going','plan','planning','cost','much','price','does','time','when','visit','many','enough','ideal'];
  function tokens(q){
    q=q.toLowerCase().replace(/[^a-z0-9\s]/g,' ');
    var t=q.split(/\s+/).filter(function(w){return w.length>2&&STOP.indexOf(w)<0;});
    var ex=[]; t.forEach(function(w){ex.push(w); if(SYN[w]) ex=ex.concat(SYN[w].split(' ')); if(w.length>3&&/s$/.test(w)){var r=w.slice(0,-1); if(ex.indexOf(r)<0){ex.push(r); if(SYN[r]) ex=ex.concat(SYN[r].split(' '));}}});
    return ex.filter(function(w,i){return ex.indexOf(w)===i;});
  }
  function budget(q){var m=q.replace(/,/g,'').match(/(\d{2,3})\s*k\b|(\d{4,6})/i); if(!m) return 0; return m[1]?+m[1]*1000:+m[2];}
  function nightsWanted(q){var m=q.match(/(\d{1,2})\s*(nights?|days?|n\b)/i); return m?+m[1]:0;}
  function search(q,limit){
    var ex=tokens(q), b=budget(q), n=nightsWanted(q);
    var scored=J.map(function(d){
      var s=0, t=d.t.toLowerCase();
      ex.forEach(function(w){ if(t.indexOf(w)>-1) s+=3; else if(d.tags.indexOf(w)>-1) s+=2.5; else if(new RegExp('(^|[^a-z0-9])'+w+'(?![a-z0-9])').test(d.k)) s+=1.5; });
      if(b){ if(d.p<=b) s+=1; else s-=2; }
      if(n){ if(Math.abs(d.n-n)<=1) s+=1; else if(Math.abs(d.n-n)>3) s-=1; }
      return {d:d,s:s};
    }).filter(function(x){return x.s>0;});
    scored.sort(function(a,b){return b.s-a.s;});
    return scored.slice(0,limit||3).map(function(x){return x.d;});
  }

  /* ── CONFIRMED facts. Board §11 and live site copy only. Never add a number
        or claim here that is not on the board as confirmed. ── */
  var F={
    about:'<p>Zubilant is the experiences division of <b>Stuti Tourism Pvt. Ltd.</b>, designing journeys since <b>2009</b> — <b>800,000+</b> travellers so far, rated <b>4.9 on Google</b>.</p><p>We plan <b>private, FIT trips</b> (free independent travel): your dates, your pace, no fixed group departure. Family holidays, spiritual journeys, Senior Travel Saathi for older parents, couples, friends and company teams.</p>',
    fit:'<p>Every Zubilant journey is <b>private and on your dates</b> — we don’t run fixed group departures. The itinerary on each page is the shape; we fit it to the people actually travelling.</p>',
    price:'<p>Every journey page shows a <b>starting price per person</b>. Those are <b>indicative</b> — the final number depends on your dates, hotels and how many are travelling, and we confirm it on a quick call before anything is booked.</p>',
    incl:'<p>Inclusions differ journey by journey, so the honest answer lives on each journey page. What’s <b>not</b> settled on the site yet is flights versus land-only for every trip — that’s confirmed on the call with your quote.</p>',
    contact:'<p>Call or WhatsApp <a href="'+TEL+'">'+PHONE+'</a> (<a href="'+WA+'" target="_blank" rel="noopener">open WhatsApp</a>), or email <a href="mailto:'+MAIL+'">'+MAIL+'</a>. One person reads it and replies.</p>',
    seniors:'<p><b>Senior Travel Saathi</b> is built for older parents: gentler pacing, shorter drives, doctors’ numbers with every driver and managed darshan on pilgrimages. Many families send their parents with us while they stay home.</p>',
    family:'<p>Family holidays are most of what we do — including three generations at once. Tell me roughly who’s going and when, and I’ll point at the right journeys.</p>',
    spiritual:'<p>Spiritual journeys are paced for elders, with managed darshan where that matters — Char Dham, Ayodhya, Varanasi, Tirupati, Vaishno Devi, Dwarka–Somnath and more.</p>',
    corporate:'<p>For companies we do offsites, incentive trips and team travel — planned around the group and the budget. The corporate page has the tour types and clients.</p>',
    inbound:'<p>Yes — we host international visitors to India too. The Inbound India page is the place to start.</p>',
    visa:'<p>We keep a <b>visa-free escapes</b> list for Indian passport holders who want abroad without the paperwork. For other destinations, visa requirements are confirmed with you on the call — I won’t guess at rules that change.</p>',
    safety:'<p>How we handle safety, medical cover and logistics is written up on the Safety &amp; Logistics page — oxygen in vehicles at altitude, doctors’ numbers with drivers, that sort of thing.</p>',
    unknown_policy:'<p>That’s a question I’d rather a human answered precisely than I answered approximately — payment terms, cancellations and refunds are confirmed in writing with your quote.</p>',
    fallback:['<p>I may not have that one. I’m best at pointing you to the right journey, prices and the basics — for anything specific, a real person is one tap away.</p>','<p>Not sure I caught that. Try a place, a month, a budget, or who’s travelling — or ask for a call back.</p>']
  };

  /* ── intents: [regex, handler]. First match wins; order matters. ── */
  function R(s){return new RegExp(s,'i');}
  var INTENTS=[
    [R('^(hi|hello|hey|namaste|hola|good (morning|afternoon|evening))\\b'), function(){return {html:'<p>'+pick(['Namaste! ','Hello! ','Hi there! '])+'I’m Zubi. Where are we thinking of going?</p>',chips:startChips()};}],
    [R('\\b(call ?back|call me|ring me|talk to (a )?(human|person|someone|expert)|speak (to|with)|human|agent|advisor|consultant|get a quote|quote|request a call|contact me)\\b'), callbackIntent],
    [R('\\b(phone|whatsapp|email|e-mail|number|contact|reach (you|zubilant)|office|address|where are you (based|located))\\b'), function(){return {html:F.contact+'<p>Or I can have someone call you — just say <b>call me back</b>.</p>',links:[['contact.html','Contact page →']]};}],
    [R('\\b(what (is|does) zubilant|who are you|about (you|zubilant|the company)|stuti|since when|how long|how old|trust|legit|genuine|reviews?|rating|google)\\b'), function(){return {html:F.about,links:[['about.html','About Zubilant →']]};}],
    [R('\\b(group|fixed departure|batch|join (a|the) group|other (people|travell?ers)|private|custom|tailor|bespoke|personali[sz]ed)\\b'), function(){return {html:F.fit,chips:['Show me journeys','Request a call back']};}],
    [R('\\b(cancel\\w*|refund\\w*|payments?|pay|paid|emi|instal?l?ments?|advance|deposit|terms|policy|policies|insurance|insured)\\b'), function(){return {html:F.unknown_policy,chips:['Request a call back','Call '+PHONE]};}],
    [R('\\b(includ|inclusion|exclu|flight|airfare|air ?fare|land.?only|what do i get|covered|meals|hotel category)\\b'), function(){
      var h=F.incl; if(HERE) h+='<p>For <b>'+esc(HERE.t)+'</b>, scroll down to the inclusions on this page, or ask me for a quote.</p>';
      return {html:h,chips:['Get a quote for this trip','Request a call back']};}],
    [R('\\b(visa|passport|visa.?free|on.?arrival)\\b'), function(q){var r=poolAnswer(q,'visa-free','visa-free journey','journeys.html?f=visa-free',F.visa);
      if(!budget(q)){ var named=search(q.replace(/visa[- ]?free|visa|passport|on[- ]?arrival/gi,' '),2).filter(function(d){return d.tags.indexOf('visa-free')<0;}); if(named.length){ r.cards=named.concat(r.cards||[]).slice(0,3); r.html='<p>For <b>'+esc(named[0].t)+'</b> the visa is handled with you on the call — I won’t guess at rules that change.</p>'+F.visa; } r.links=[['journeys.html?f=visa-free','Visa-free escapes →']]; }
      return r;}],
    [R('\\b(safe|safety|medical|doctor|emergency|security)\\b'), function(){return {html:F.safety,links:[['safety-and-logistics.html','Safety &amp; Logistics →']]};}],
    [R('\\b(corporate|compan(y|ies)|offsite|off-site|team|incentive|mice|employees|conference)\\b'), function(){return {html:F.corporate,links:[['corporate.html','Corporate travel →']]};}],
    [R('\\b(inbound|foreign(er)?s? (visiting|coming)|visit(ing)? india|coming to india|international (guests|visitors)|nri)\\b'), function(){return {html:F.inbound,links:[['inbound-india.html','Inbound India →']]};}],
    [R('\\b(price|cost|how much|budget|rate|charges?|expensive|cheap|afford|under|below|within|₹|rs\\.?|inr)\\b'), priceIntent],
    [R('\\b(how many (days|nights)|enough (days|nights)|ideal duration|how long (is|should|does) (the )?(trip|journey|tour)|duration)\\b'), function(q){
      var c=search(q,3);
      if(HERE&&(!c.length||c[0]===HERE)) return {html:'<p><b>'+esc(HERE.t)+'</b> is built as <b>'+HERE.n+' nights</b> at a '+esc(HERE.pace.toLowerCase())+' pace — that’s the length we think it needs to be done properly, not rushed. It can stretch; it shouldn’t shrink much.</p>',chips:['Best time to go','Price for this trip']};
      if(c.length) return {html:'<p>How long we think these need:</p><p>'+c.map(function(d){return '<b>'+esc(d.t)+'</b> — '+d.n+' nights, '+esc(d.pace.toLowerCase());}).join('<br>')+'</p>',cards:c};
      return {html:'<p>Tell me the place and I’ll tell you how many nights our itinerary gives it.</p>'};}],
    [R('\\b(best (time|month|season)|when (to|should) (go|visit|travel)|weather|monsoon|season)\\b'), seasonIntent],
    [R('\\b(parent|parents|senior|seniors|elderly|older|mother|father|mom|dad|mummy|papa|aged|retire|saathi)\\b'), function(q){
      if(HERE&&/\b(this|it|here|suit|right for|ok for|fine for)\b/i.test(q)){
        var ok=HERE.tags.some(function(t){return /^(seniors|senior-citizen-friendly|multi-generational)$/.test(t);});
        var h=ok?'<p><b>'+esc(HERE.t)+'</b> is one we plan for older travellers — '+esc(HERE.pace)+' pace, and the day-by-day on this page shows the drive lengths. Tell us ages and mobility in the enquiry and we shape it around them.</p>'
                :'<p><b>'+esc(HERE.t)+'</b> is listed as <b>'+esc(HERE.pace)+'</b> pace and isn’t tagged as a seniors journey. That doesn’t rule it out — because every trip is private, pace and drives can be softened. Best confirmed on a quick call.</p>';
        return {html:h,links:[['senior-travel-saathi.html','Senior Travel Saathi →']],chips:['Gentler journeys for parents','Request a call back']};
      }
      return {html:F.seniors,links:[['senior-travel-saathi.html','Senior Travel Saathi →']],cards:search(q+' seniors senior-citizen-friendly gentle',3),more:'journeys.html?f=seniors'};}],
    [R('\\b(spiritual|pilgrim|temple|darshan|yatra|dham|devi|tirupati|ayodhya|varanasi|kashi|rameswaram|somnath|dwarka|amritsar|golden temple)\\b'), function(q){return {html:F.spiritual,links:[['spiritual-journeys.html','Spiritual journeys →']],cards:search(q+' spiritual-and-pilgrimage',3),more:'journeys.html?f=spiritual-and-pilgrimage'};}],
    [R('\\b(kid|kids|child|children|toddler|family|families|grandparents|three generations|multi.?gen)\\b'), function(q){return {html:F.family,links:[['family-holidays.html','Family holidays →']],cards:search(q+' family-travel',3),more:'journeys.html?f=family-travel'};}],
    [R('\\b(honeymoon|couple|anniversary|romantic|wife|husband|partner)\\b'), function(q){return {html:'<p>For two, these are the ones people keep choosing:</p>',cards:search(q+' honeymoon couples',3),more:'journeys.html?f=honeymoon'};}],
    [R('\\b(short|weekend|long weekend|quick|few days|3 nights|4 nights)\\b'), function(q){return {html:'<p>Short breaks, four nights or under:</p>',cards:search(q+' gentle',3),more:'journeys.html?f=n:0-4'};}],
    [R('\\b(abroad|international|overseas|outside india|foreign|europe|asia|africa)\\b'), function(q){return {html:'<p>International journeys — many are first-trip-abroad friendly:</p>',cards:search(q+' intl first-international-trip',3),more:'journeys.html?f=intl'};}],
    [R('\\b(this (trip|journey|one|page|itinerary)|here)\\b'), function(q){ if(HERE) return hereIntent(q); return null; }],
    [R('\\b(journeys?|destinations?|places?|where (can|should|do)|options|catalog|list|all)\\b'), function(q){
      var c=search(q,3);
      if(c.length) return {html:'<p>Here’s what matches:</p>',cards:c,more:'journeys.html'};
      return {html:'<p>We have <b>'+J.length+' journeys</b> across India and abroad. Tell me who’s going, a month or a budget and I’ll narrow it — or browse them all.</p>',links:[['journeys.html','All journeys →']],chips:startChips()};}],
  ];

  function startChips(){
    if(HERE) return ['Price for this trip','Best time to go','Is it right for older parents?','Get a quote for this trip'];
    if(PAGE==='corporate') return ['What do you do for companies?','Request a call back','Visa-free team offsites'];
    return ['Plan a trip for my parents','Visa-free holidays under ₹80,000','What does Zubilant actually do?','Request a call back'];
  }

  /* pool answer that respects a stated budget honestly: never show ₹95,000 to someone who said ₹60,000 */
  function poolAnswer(q,poolTag,label,more,intro){
    var b=budget(q), pool=poolTag?J.filter(function(d){return d.tags.indexOf(poolTag)>-1;}):J;
    if(!b) return {html:intro,cards:search(q+' '+(poolTag||''),3),more:more};
    var under=pool.filter(function(d){return d.p<=b;}).sort(function(x,y){return y.p-x.p;});
    if(!under.length){
      var cheapest=pool.slice().sort(function(x,y){return x.p-y.p;}).slice(0,3);
      return {html:'<p>Straight answer: no '+label+' starts under <b>'+inr(b)+'</b> right now — the lowest is <b>'+inr(cheapest[0].p)+'</b>. These are the closest, and because every trip is private, a shorter version is often possible.</p>',cards:cheapest,more:more,chips:['Request a call back','Journeys under '+inr(b)]};
    }
    var hits=search(q+' '+(poolTag||''),6).filter(function(d){return d.p<=b;}).slice(0,3);
    under.forEach(function(d){ if(hits.length<3&&hits.indexOf(d)<0) hits.push(d); });
    return {html:'<p>'+under.length+' '+label+(under.length>1?'s':'')+' start under <b>'+inr(b)+'</b>:</p>',cards:hits,more:more};
  }
  function priceIntent(q){
    var b=budget(q), c=search(q,3);
    if(HERE&&!/\b(under|below|within|budget)\b/i.test(q)){
      return {html:'<p><b>'+esc(HERE.t)+'</b> starts from <b>'+inr(HERE.p)+' per person</b> for '+HERE.n+' nights — an indicative price, confirmed on your dates before anything is booked.</p>',chips:['What’s included?','Get a quote for this trip']};
    }
    if(b) return poolAnswer(q,null,'journey','journeys.html?f=p:0-'+(b<=50000?'50000':'100000'),'');
    if(c.length) return {html:F.price+'<p>Starting prices for what you mentioned:</p>',cards:c};
    return {html:F.price,links:[['journeys.html?f=p:0-50000','Journeys under ₹50,000 →']],chips:['Under ₹50,000','Under ₹1,00,000','Request a call back']};
  }
  function seasonIntent(q){
    var c=search(q,3);
    if(HERE&&!c.length||HERE&&c[0]===HERE) return {html:'<p><b>'+esc(HERE.t)+'</b> is planned for <b>'+esc(HERE.season||'its best season')+'</b> — the itinerary is timed around that window.</p>',chips:['Price for this trip','Get a quote for this trip']};
    if(c.length) return {html:'<p>Best windows, from the journey pages:</p><p>'+c.map(function(d){return '<b>'+esc(d.t)+'</b> — '+esc(d.season||'see page');}).join('<br>')+'</p>',cards:c};
    var m=q.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
    if(m) return {html:'<p>Good in '+m[1].charAt(0).toUpperCase()+m[1].slice(1).toLowerCase()+':</p>',cards:search(m[1].toLowerCase(),3),more:'journeys.html?f='+m[1].toLowerCase()};
    return {html:'<p>Tell me a month or a place and I’ll tell you what’s in season.</p>',chips:['December holidays','Summer in the mountains','October long weekend']};
  }
  function hereIntent(q){
    return {html:'<p><b>'+esc(HERE.t)+'</b>: '+esc(HERE.d)+'</p><p>'+HERE.n+' nights · '+esc(HERE.pace)+' pace · from '+inr(HERE.p)+' per person (indicative).</p>',chips:['Is it right for older parents?','What’s included?','Get a quote for this trip']};
  }
  function callbackIntent(){ return {html:'<p>Happy to. Leave a name and number and someone from Zubilant will call you — no call centre, no script.</p>',form:true}; }

  /* ── FAQ repository (zubi-faq.js): word-overlap match against q[] variants ── */
  var FAQ=window.ZUBI_FAQ||[];
  var FSTOP=['the','and','for','with','you','your','can','does','do','is','are','i','we','my','our','a','an','to','of','in','on','it','me','us','what','how','any','there','this','that','will','be','have','has'];
  function fwords(s){return s.toLowerCase().replace(/[^a-z0-9\s\/]/g,' ').split(/\s+/).filter(function(w){return w&&FSTOP.indexOf(w)<0;});}
  function faq(q){
    var qw=fwords(q), ql=' '+q.toLowerCase().replace(/[^a-z0-9\s\/]/g,' ').replace(/\s+/g,' ')+' ';
    if(!qw.length) return null;
    var best=null,bs=0;
    FAQ.forEach(function(f){
      var s=0;
      f.q.forEach(function(v){
        var vl=' '+v.toLowerCase()+' ';
        if(ql.indexOf(vl)>-1){ s=Math.max(s,10+v.length/10); return; }        // phrase hit
        var vw=fwords(v), hit=0; vw.forEach(function(w){ if(qw.indexOf(w)>-1) hit++; });
        if(hit){ var frac=hit/vw.length; var sc=hit*2+frac*3; if(frac>=0.6||hit>=2) s=Math.max(s,sc); }
      });
      if(s>bs){bs=s;best=f;}
    });
    if(!best||bs<3) return null;
    return {html:best.a,links:best.links,chips:best.chips};
  }

  /* ── answer(): the router ── */
  function answer(q){
    var s=q.trim(); if(!s) return null;
    var fq=faq(s); if(fq&&/(^(thank|zubi|who are you|are you (a )?(bot|human|ai)|awards?|un.?cefact|sachin|founder|stuti|how do i book|languages?)|\b(hours|timings?|altitude|acclimati|oxygen|child (discount|price|pricing|fare)|infant|room|sharing|complaint|escalat|documents?|passport|confirmation|voucher)\b)/i.test(s)) return fq;
    for(var i=0;i<INTENTS.length;i++){
      if(INTENTS[i][0].test(s)){ var r=INTENTS[i][1](s); if(r) return r; }
    }
    var c=search(s,3);
    /* a named journey beats a generic FAQ: "hornbill festival" should show the Hornbill journey, not the festivals FAQ */
    var named=c.length&&tokens(s).some(function(w){return w.length>3&&new RegExp('(^|[^a-z])'+w+'(?![a-z])').test(c[0].t.toLowerCase());});
    if(named) return {html:'<p>These look closest to what you’re after:</p>',cards:c,more:'journeys.html'};
    if(fq) return fq;
    if(c.length) return {html:'<p>These look closest to what you’re after:</p>',cards:c,more:'journeys.html'};
    return {html:pick(F.fallback),chips:startChips().slice(0,3).concat(['Request a call back'])};
  }

  /* ── DOM ── */
  var root=document.createElement('div'); root.className='zbc-root';
  root.innerHTML=
    '<div class="zbc-nudge" role="status" aria-live="polite"><b>Zubi here.</b> '+(HERE?'Questions about '+esc(HERE.t)+'? Ask away.':'Looking for the right journey? I can help you find it.')+'<button type="button" aria-label="Dismiss">&times;</button></div>'+
    '<button type="button" class="zbc-launch" aria-haspopup="dialog" aria-expanded="false" aria-controls="zbc-panel"><span class="zbc-av"><img src="'+AVATAR+'" alt="" width="34" height="34"></span><span class="zbc-lbl">Ask Zubi</span><span class="zbc-dot" aria-hidden="true"></span></button>'+
    '<div class="zbc-panel" id="zbc-panel" role="dialog" aria-modal="false" aria-label="Ask Zubi" tabindex="-1">'+
      '<div class="zbc-head"><span class="zbc-av"><img src="'+AVATAR+'" alt="" width="36" height="36"></span><div class="zbc-who"><b>Zubi</b><span><i></i>Zubilant’s guide · replies instantly</span></div>'+
      '<button type="button" class="zbc-x" aria-label="Close chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
      '<div class="zbc-log" aria-live="polite" aria-relevant="additions"></div>'+
      '<form class="zbc-in" autocomplete="off"><input type="text" name="q" placeholder="Ask about a place, a month, a budget…" aria-label="Your question" maxlength="240"><button type="submit" class="zbc-send" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button></form>'+
      '<div class="zbc-foot">Zubi answers from this site. For anything specific, a person calls you back.</div>'+
    '</div>';
  document.body.appendChild(root);

  var launch=root.querySelector('.zbc-launch'), panel=root.querySelector('.zbc-panel'), log=root.querySelector('.zbc-log'),
      form=root.querySelector('.zbc-in'), input=form.querySelector('input'), xbtn=root.querySelector('.zbc-x'), nudge=root.querySelector('.zbc-nudge');
  var opened=false, greeted=false, nudgeShown=false;

  function scroll(){ log.scrollTop=log.scrollHeight; }
  function bot(html){ var m=document.createElement('div'); m.className='zbc-msg zbc-bot'; m.innerHTML='<span class="zbc-av"><img src="'+AVATAR+'" alt="" width="22" height="22"></span><div class="zbc-b">'+html+'</div>'; log.appendChild(m); scroll(); return m; }
  function me(text){ var m=document.createElement('div'); m.className='zbc-msg zbc-me'; m.innerHTML='<div class="zbc-b">'+esc(text)+'</div>'; log.appendChild(m); scroll(); }
  function typing(){ var m=document.createElement('div'); m.className='zbc-msg zbc-bot zbc-typing'; m.innerHTML='<span class="zbc-av"><img src="'+AVATAR+'" alt="" width="22" height="22"></span><div class="zbc-b"><i></i><i></i><i></i></div>'; log.appendChild(m); scroll(); return m; }
  function cards(list){ if(!list||!list.length) return; var w=document.createElement('div'); w.className='zbc-cards';
    w.innerHTML=list.map(function(d){return '<a class="zbc-card" href="'+esc(d.h)+'"><img src="'+esc(d.g)+'" alt="" loading="lazy" width="68" height="52"><span><b>'+esc(d.t)+'</b><em>'+esc(d.r)+' · '+d.n+' nights · from '+inr(d.p)+'</em></span><i aria-hidden="true">→</i></a>';}).join(''); log.appendChild(w); scroll(); }
  function links(list){ if(!list||!list.length) return; list.forEach(function(l){ var a=document.createElement('a'); a.className='zbc-more'; a.href=l[0]; a.innerHTML=l[1]; log.appendChild(a); }); scroll(); }
  function chips(list){ if(!list||!list.length) return; var w=document.createElement('div'); w.className='zbc-chips';
    list.forEach(function(t){ var b=document.createElement('button'); b.type='button'; b.className='zbc-chip'; b.textContent=t; b.addEventListener('click',function(){ w.remove(); ask(t); }); w.appendChild(b); });
    log.appendChild(w); scroll(); }
  function clearChips(){ var old=log.querySelectorAll('.zbc-chips'); for(var i=0;i<old.length;i++) old[i].remove(); }

  function callbackForm(){
    var w=document.createElement('form'); w.className='zbc-form'; w.noValidate=true;
    w.innerHTML='<label for="zbc-n">Your name</label><input id="zbc-n" name="name" type="text" autocomplete="name" required>'+
      '<label for="zbc-p">Phone (WhatsApp is fine)</label><input id="zbc-p" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>'+
      '<div class="zbc-err">A name and a phone number, please — that’s all we need to call.</div>'+
      '<label for="zbc-t">Best time to call</label><select id="zbc-t" name="when"><option>Any time today</option><option>Morning (10–1)</option><option>Afternoon (1–5)</option><option>Evening (5–8)</option></select>'+
      '<button type="submit" class="zbc-go">Request my call back</button>';
    w.addEventListener('submit',function(e){
      e.preventDefault();
      var n=w.name.value.trim(), p=w.phone.value.trim(), t=w.when.value;
      if(!n||p.replace(/\D/g,'').length<8){ w.classList.add('zbc-bad'); return; }
      w.classList.remove('zbc-bad');
      sendCallback({name:n,phone:p,when:t});
    });
    log.appendChild(w); scroll(); w.name.focus();
  }
  /* Hand-off. Today: prefill plan-your-journey.html (the one journey, by ruling).
     Tomorrow: POST to the Worker once 2.1 #6 names a destination. */
  function sendCallback(d){
    var notes='Call back requested via Zubi · best time: '+d.when+(HERE?' · about: '+HERE.t:'')+' · from: '+path;
    var qs='?via=zubi&name='+encodeURIComponent(d.name)+'&contact='+encodeURIComponent(d.phone)+'&when='+encodeURIComponent(d.when)+'&notes='+encodeURIComponent(notes)+(HERE?'&journey='+encodeURIComponent(HERE.t):'');
    bot('<p>Thanks, '+esc(d.name.split(' ')[0])+'. Taking you to one last step so this reaches a person — your details are already filled in.</p>');
    setTimeout(function(){ location.href=PLAN+qs; },900);
  }

  function respond(r){
    var t=typing();
    setTimeout(function(){
      t.remove();
      if(r.html) bot(r.html);
      cards(r.cards);
      if(r.more) links([[r.more,'See all matching journeys →']]);
      links(r.links);
      if(r.form) callbackForm();
      chips(r.chips);
    }, 420+Math.min(600,(r.html||'').length*2));
  }
  function ask(text){
    text=(text||'').trim(); if(!text) return;
    clearChips(); me(text);
    if(/^call \+?91/i.test(text)){ location.href=TEL; return; }
    var r=answer(text)||{html:pick(F.fallback),chips:startChips()};
    respond(r);
  }
  function greet(){
    if(greeted) return; greeted=true;
    var h=HERE?'<p>Hi, I’m Zubi. You’re looking at <b>'+esc(HERE.t)+'</b> — '+HERE.n+' nights, from '+inr(HERE.p)+' per person. What would you like to know?</p>'
                :'<p>Hi, I’m Zubi — Zubilant’s guide. I can point you to the right journey, explain prices, or get a person to call you. Where shall we start?</p>';
    bot(h); chips(startChips());
  }

  function open(){
    root.classList.add('zbc-open'); launch.setAttribute('aria-expanded','true'); hideNudge(); opened=true;
    if(window.innerWidth<=640) document.documentElement.classList.add('zbc-lock');
    greet(); setTimeout(function(){ input.focus(); },50);
  }
  function close(){
    root.classList.remove('zbc-open'); launch.setAttribute('aria-expanded','false');
    document.documentElement.classList.remove('zbc-lock'); launch.focus();
  }
  function hideNudge(){ nudge.classList.remove('show'); }

  launch.addEventListener('click',open);
  xbtn.addEventListener('click',close);
  nudge.querySelector('button').addEventListener('click',function(e){ e.stopPropagation(); hideNudge(); });
  nudge.addEventListener('click',open);
  form.addEventListener('submit',function(e){ e.preventDefault(); var v=input.value; input.value=''; ask(v); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&root.classList.contains('zbc-open')) close(); });

  /* nudge once, 7s in, only if the visitor hasn't opened it and isn't mid-scroll on a phone */
  setTimeout(function(){ if(!opened&&!nudgeShown){ nudgeShown=true; nudge.classList.add('show'); setTimeout(hideNudge,9000); } },7000);

  /* lift above the journey-page sticky bar when it is showing */
  var bar=document.querySelector('.stickybar');
  if(bar&&'MutationObserver' in window){
    var sync=function(){ root.classList.toggle('zbc-lift', bar.classList.contains('show')&&window.innerWidth<=1080); };
    new MutationObserver(sync).observe(bar,{attributes:true,attributeFilter:['class']});
    window.addEventListener('resize',sync); sync();
  }

  /* body scroll lock for the phone sheet */
  var st=document.createElement('style'); st.textContent='html.zbc-lock,html.zbc-lock body{overflow:hidden!important}'; document.head.appendChild(st);

  /* deep-link: any element with data-zubi opens the chat with that question */
  document.addEventListener('click',function(e){ var el=e.target.closest&&e.target.closest('[data-zubi]'); if(!el) return; e.preventDefault(); open(); var q=el.getAttribute('data-zubi'); if(q) ask(q); });
  if(/[?&]zubi=1/.test(location.search)) open();
})();
