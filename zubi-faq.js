/* ═══════════════════════════════════════════════════════════════
   ZUBILANT · zubi-faq.js — Zubi's FAQ repository. 21 Aug 2026.

   HOW TO ADD ONE (no code knowledge needed):
     { q:['how a visitor might ask it','another way','a third way'],
       a:'<p>The answer, in Zubilant's voice. Short. Honest.</p>',
       links:[['page.html','Label →']],            // optional
       chips:['Follow-up 1','Follow-up 2'] }        // optional
   Rules:
   · Every fact here must already be true on the live site or on the board's
     CONFIRMED list. If you are not sure, the answer is "confirmed on the call".
   · No prices in this file. Prices come from zubi-data.js (the catalogue).
   · Matching is by word overlap with the q[] variants, so write variants the
     way people type, not the way we write.
   ═══════════════════════════════════════════════════════════════ */
window.ZUBI_FAQ=[
  /* ── booking & how it works ── */
  { q:['how do i book','how does booking work','how to book a trip','how do i start','what happens after i enquire','process','next steps','how does it work'],
    a:'<p>Three steps. You tell us who’s travelling and roughly when — via the enquiry form, a call or WhatsApp. One person reads it and comes back with a shaped itinerary and a quote. You change whatever you like, and only then is anything booked.</p>',
    links:[['plan-your-journey.html','Plan your journey →']], chips:['Request a call back','Show me journeys'] },
  { q:['can i customise','can i customize','change the itinerary','add a day','remove a day','tailor made','make my own trip','different hotels','can we modify'],
    a:'<p>Yes — every itinerary on this site is a starting shape, not a fixed product. Add nights, drop a city, change the hotel category, slow the pace. Because trips are private and on your dates, nothing is locked until you say so.</p>',
    chips:['Request a call back','Is it a group tour?'] },
  { q:['how far in advance','how early should i book','last minute','book next week','minimum notice','how much notice'],
    a:'<p>Earlier is better for peak dates (Diwali, Christmas–New Year, summer holidays) and for permits like Ladakh’s Inner Line. For everything else, tell us your dates and we’ll say honestly whether they work — there’s no minimum notice rule.</p>',
    chips:['Request a call back'] },
  { q:['do you book flights','flights included','can you arrange flights','air tickets','train tickets','rail','do you book trains'],
    a:'<p>Flights and rail can usually be arranged as part of the journey — confirm it when you enquire. Whether the starting price on a page includes flights is confirmed with your quote — it isn’t settled for every journey on the site yet, and I’d rather say that than guess.</p>',
    chips:['What’s included?','Request a call back'] },
  { q:['do you provide a guide','tour guide','escort','someone travel with us','tour manager','accompany','who will be with us'],
    a:'<p>It depends on the journey — Ladakh by Road, for example, has a Zubilant escort throughout, airport to airport. Each journey page says exactly what is included for that trip, so check the inclusions there or ask me about a specific one.</p>' },
  { q:['hotels','what kind of hotels','hotel category','star rating','accommodation','where will we stay','homestay','houseboat'],
    a:'<p>Hotel category is chosen with you — comfortable and well-located by default, and upgradable. On Senior Travel Saathi journeys every hotel has a lift. The day-by-day on each journey page names the kind of stay each night (houseboat, camp, heritage hotel and so on).</p>' },
  { q:['food','vegetarian','jain food','pure veg','meals included','dietary','fasting','halal'],
    a:'<p>Dietary needs are normal for us — vegetarian, Jain, fasting days, allergies. Put it in the enquiry notes and it’s built into the hotel and restaurant choices, not added as an afterthought. Which meals are included varies by journey and is listed on each page.</p>' },

  /* ── who it is for ── */
  { q:['solo','travelling alone','single traveller','alone','by myself','solo woman'],
    a:'<p>Yes, solo travellers are welcome — several journeys are tagged solo-friendly. Because trips are private rather than group departures, a solo trip is priced for one and built around one.</p>',
    links:[['journeys.html','Browse journeys →']], chips:['Request a call back'] },
  { q:['wheelchair','mobility','walking difficulty','knee problems','cannot walk much','disabled','accessible','elderly mobility'],
    a:'<p>Tell us. On Senior Travel Saathi journeys drives are capped at four hours with tea stops, every hotel has a lift, wheelchairs are arranged with notice, and the nearest hospital is named with the travel time from every stop. For other journeys we’ll say honestly which days are hard and how to soften them.</p>',
    links:[['senior-travel-saathi.html','Senior Travel Saathi →']] },
  { q:['school trip','college trip','students','educational','school tour','student group','institution'],
    a:'<p>We run educational expeditions for schools and colleges, and we understand the committee cycle — the brochure goes round, questions come back, six weeks pass. Start from the Educational Expeditions page, or tell me the age group and I’ll get someone to call.</p>',
    links:[['educational-expeditions.html','Educational Expeditions →']], chips:['Request a call back'] },
  { q:['pets','dog','take my dog','pet friendly'],
    a:'<p>Honest answer: pet-friendly journeys aren’t something the site covers, and I won’t promise what I can’t see. Ask on the call and someone will tell you what is realistic for your destination.</p>', chips:['Request a call back'] },
  { q:['destination wedding','wedding','anniversary celebration','birthday trip','surprise','proposal'],
    a:'<p>Because every trip is private, a celebration can be built into it — tell us the occasion in the enquiry notes. Destination weddings are a different scale of project; tell us the numbers and a person will say honestly what’s possible.</p>', chips:['Honeymoon ideas','Request a call back'] },

  /* ── trust & company ── */
  { q:['who is sachin mehta','founder','ceo','who runs zubilant','owner','who started'],
    a:'<p><b>Sachin Mehta</b> is Zubilant’s founder and CEO. He also serves as Travel and Tourism Domain Coordinator at <b>UN/CEFACT</b>, the United Nations body that sets global standards for travel and trade data — which is why the operational detail on this site reads the way it does.</p>',
    links:[['about.html','About Zubilant →']] },
  { q:['un cefact','uncefact','united nations','what is un/cefact','standards'],
    a:'<p>UN/CEFACT is the United Nations Centre for Trade Facilitation and Electronic Business — the body that sets global standards for travel and trade data. Zubilant’s founder is its Travel and Tourism Domain Coordinator.</p>',
    links:[['about.html','About Zubilant →']] },
  { q:['awards','recognition','award winning','certified','accreditation','ficci'],
    a:'<p>Recognition on record: <b>FICCI Travel &amp; Tourism Excellence Awards 2019</b> — Special Contribution in Travel &amp; Tourism Industry; <b>World Travel Brands Award 2013</b> — Best Customised Tour Organisers in Maharashtra; Best Entrepreneur Award, Brihanmumbai Vocational Education Development Committee; and <b>Rashtriya Udyog Ratna 2011</b>.</p>',
    links:[['about.html','About Zubilant →']] },
  { q:['stuti tourism','stuti','parent company','is zubilant a new company','how old is the company','registered company','legit company'],
    a:'<p>Zubilant is the experiences division of <b>Stuti Tourism Pvt. Ltd.</b>, founded in <b>2009</b> — seventeen years and 800,000+ travellers on. The brand is newer; the company, the team and the supplier relationships are not.</p>',
    links:[['about.html','About Zubilant →']] },
  { q:['where are you based','which city','office location','mumbai','are you in delhi','bangalore office','branch'],
    a:'<p>We’re based in <b>Mumbai</b>, and we plan journeys for travellers from anywhere in India — most of our conversations happen on the phone and WhatsApp. The office address is on the contact page.</p>',
    links:[['contact.html','Contact →']] },
  { q:['clients','corporate clients','who have you worked with','companies you work with','logos'],
    a:'<p>Named corporate clients and institutions are listed on the Corporate and About pages — more than seventy institutions over the years.</p>',
    links:[['corporate.html','Corporate →'],['about.html','About →']] },
  { q:['google reviews','where can i read reviews','testimonials','feedback from travellers','are you rated'],
    a:'<p>We’re rated <b>4.9 on Google</b>; the homepage shows verbatim reviews with a link to the live Google listing so you can read them at source rather than take my word for it.</p>',
    links:[['index.html#reviews','Reviews on the homepage →']] },

  /* ── practical ── */
  { q:['opening hours','working hours','office hours','hours','what time do you open','are you open on sunday','office timings','timings','when can i call'],
    a:'<p>I don’t have office hours I can vouch for, so I won’t invent them. WhatsApp <a href="https://wa.me/918108117770" target="_blank" rel="noopener">+91 81081 17770</a> any time and a person replies when they’re in; or leave a call-back request and pick the slot that suits you.</p>',
    chips:['Request a call back'] },
  { q:['languages','do you speak hindi','gujarati','marathi','english','language'],
    a:'<p>Hindi and English are fine on a call. Say which you prefer when you enquire and we’ll match you with the right person.</p>' },
  { q:['currency','forex','foreign exchange','sim card','international roaming','travel adapter'],
    a:'<p>Forex, SIMs and the small practical things are best answered for your actual destination and dates — ask on the call and you’ll get specifics rather than a generic list.</p>' },
  { q:['weather','what to pack','packing list','clothes','cold','how cold'],
    a:'<p>Packing depends on the journey and the month — Ladakh in June and Kerala in December are different planets. Each journey page shows its season; ask on the call for what to pack for your actual dates.</p>', chips:['Best time to go'] },
  { q:['travel insurance','insurance included','medical insurance','is insurance included'],
    a:'<p>Whether insurance is included in a given quote is confirmed in writing with that quote — I won’t guess at cover. For older travellers and international trips we strongly recommend it either way.</p>', chips:['Request a call back'] },
  { q:['children free','child discount','kids price','infant','child below 5','discount for children'],
    a:'<p>Child pricing depends on age and the hotel’s policy, so it’s quoted per trip rather than as a blanket rule. Tell us ages in the enquiry and the quote will show it line by line.</p>' },
  { q:['discount','offer','deal','cheaper','negotiate','best price','coupon','sale'],
    a:'<p>We don’t run coupon-style offers or show struck-out “was” prices. Starting prices are indicative; the real lever is dates, hotel category and nights, and a person will tell you honestly where the money goes.</p>', chips:['Journeys under ₹50,000','Request a call back'] },
  { q:['video','youtube','instagram','social media','photos of past trips'],
    a:'<p>Traveller photographs are on the homepage and journey pages; social links are in the footer of every page.</p>' },
  { q:['zubi','who are you zubi','are you a bot','are you human','are you ai','robot','chatbot','what can you do'],
    a:'<p>I’m Zubi — a kingfisher, and a bot. I answer from what’s on this site: 59 journeys, prices, who each trip suits, and the basics about Zubilant. I don’t guess. For anything beyond that I hand you to a person, who is always one tap away.</p>',
    chips:['Request a call back','Show me journeys'] },
  { q:['thank you','thanks','great','perfect','ok bye','goodbye','cheers'],
    a:'<p>Pleasure. I’m in the corner whenever you need me — happy travels.</p>' },

  /* ── from research, 21 Aug: the questions Indian travellers actually ask
        (People-Also-Ask style FAQs on SOTC, Thomas Cook, Ladakh/Kerala operators,
        senior-tour operators). Answers still only from confirmed facts. ── */
  { q:['is it safe for family','is it safe with kids','safe for children','safe for women','is it safe to travel','safe with my parents','is india safe'],
    a:'<p>Every journey here is private — your vehicle, your driver, your dates — which is the single biggest safety lever there is. Drivers carry doctors’ numbers, vehicles at altitude carry oxygen, and for older travellers the nearest hospital is named with the travel time from every stop. Ask me about a specific journey and I’ll tell you what that page says.</p>',
    links:[['safety-and-logistics.html','Safety &amp; Logistics →']], chips:['Request a call back'] },
  { q:['permit','inner line permit','ilp','do i need a permit','nubra permit','pangong permit','protected area permit'],
    a:'<p>For Ladakh, Inner Line Permits for Nubra and Pangong are <b>included</b> and arranged by us — it’s listed in the inclusions on the Ladakh by Road page. For other restricted areas (Arunachal, Sikkim’s high passes, Lakshadweep), permits are handled as part of the journey and confirmed with your quote.</p>',
    links:[['j-ladakh-by-road.html','Ladakh by Road →']] },
  { q:['altitude sickness','ams','acclimatise','acclimatization','acclimatisation','high altitude','oxygen','breathing problem in leh','is ladakh ok for parents'],
    a:'<p>Our Ladakh itinerary spends the first two days at 3,500 m deliberately doing very little — altitude is not a race — and every vehicle carries an oxygen cylinder. That first 48 hours is the difference between a trip your family remembers and one it endures. Anyone with a heart or lung condition should clear it with their doctor first; we’ll say so plainly on the call.</p>',
    links:[['j-ladakh-by-road.html','Ladakh by Road →']], chips:['Is it right for older parents?'] },
  { q:['what documents do i need','documents required','id proof','aadhaar','which id to carry','passport validity','documents for international trip','passport'],
    a:'<p>As a rule: within India, a government photo ID for every traveller, including children, for flights and hotels. Abroad, a passport usually valid for at least six months beyond your return, plus whatever visa the destination needs. The exact list for your trip comes with your quote.</p>' },
  { q:['two people in one room','room sharing','triple sharing','3 adults one room','extra bed','single room','single supplement','twin sharing','per person price means'],
    a:'<p>Starting prices are per person on twin sharing — two to a room. Triple sharing, a single room or a child on an extra bed changes the number, so the quote shows rooming line by line. Tell us who shares with whom and it’s built in.</p>' },
  { q:['how to reach','how do i reach','nearest airport','which airport','fly into','train to','how to get there','starting point','where does the trip start'],
    a:'<p>Each journey page opens with where the trip starts and ends (the airport or station we meet you at). Getting you to that point — flights or rail from your city — can be part of the plan; say where you’re travelling from when you enquire.</p>', chips:['Do you book flights?'] },
  { q:['can family join a senior tour','family members join','parents and us together','three generations','grandparents and kids together','mixed ages'],
    a:'<p>Yes — and it’s one of the things we do most. Because there is no fixed group, a Senior Travel Saathi journey can carry the whole family: the pace is set for the oldest traveller and the kids get their afternoons. Tell us ages and we shape it.</p>',
    links:[['senior-travel-saathi.html','Senior Travel Saathi →']] },
  { q:['winter trip','snow trip','december trip to mountains','travel in winter','kashmir in winter','ladakh in winter','snowfall'],
    a:'<p>For snow: Gulmarg in winter (skiing for beginners) and the higher Himalaya in December–February. Kashmir in tulip season is April; Ladakh by road runs June–September. Tell me the month and I’ll show what’s in season.</p>', chips:['Gulmarg in winter','December holidays'] },
  { q:['festival','festivals','festival trips','diwali trip','holi trip','christmas new year','new year trip'],
    a:'<p>Festival journeys on the site: Rann of Kutch in Rann Utsav season, the Hornbill Festival in Nagaland, Kashmir in tulip season, Japan in cherry blossom. For Diwali and Christmas–New Year dates, book early — those weeks fill first.</p>', chips:['Rann of Kutch','Hornbill Festival','Kashmir tulips'] },
  { q:['confirmation','will i get a confirmation','booking confirmation','voucher','itinerary document','what do i receive'],
    a:'<p>Nothing is booked until you confirm the shaped itinerary and quote in writing; what you receive after that, and when, is confirmed with your quote. I won’t describe a process I can’t see.</p>' },
  { q:['complaint','escalate','not happy','something went wrong','grievance','problem during the trip','who do i call on tour'],
    a:'<p>The office number — <a href="tel:+918108117770">+91 81081 17770</a>, also WhatsApp — reaches a person. If something goes wrong, call; if it isn’t fixed, email <a href="mailto:experience@zubilant.co.in">experience@zubilant.co.in</a> and a person, not a ticket system, replies.</p>' },
  { q:['budget friendly','cheapest trip','low budget','pocket friendly','under 30000','affordable trip','economical'],
    a:'<p>The lowest starting prices on the site are short domestic journeys — Varanasi, Dwarka–Somnath, Tirupati and the like. Say a budget and I’ll filter the catalogue to it honestly, including telling you when nothing fits.</p>', chips:['Journeys under ₹50,000','Short breaks'] },
  { q:['first international trip','first time abroad','never been abroad','easy first foreign trip','first passport stamp'],
    a:'<p>For a first trip abroad we steer people to the easy stamps: Singapore &amp; Malaysia, Dubai, Thailand, Bhutan, Nepal, Sri Lanka — short flights, familiar food, light paperwork. Several are visa-free for Indian passports.</p>', chips:['Visa-free escapes','First international trip'] }
];
