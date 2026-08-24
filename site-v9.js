
(function(){
  var nav=document.getElementById('nav'), bar=document.getElementById('sbar'),
      ground=document.querySelector('.ground'),
      fields=Array.prototype.slice.call(document.querySelectorAll('.field')).filter(function(el){return !el.closest('form');}); /* wash never touches form fields (.field landmine, Part 0.12) */
  var hero=document.querySelector('.hero');
  function onScroll(){
    var y=window.scrollY||document.documentElement.scrollTop;
    var trigger=hero?hero.offsetHeight-140:120;
    if(hero) nav.classList.toggle('scrolled', y>trigger);
    var h=document.documentElement.scrollHeight-window.innerHeight;
    if(bar) bar.style.width=(h>0?Math.min(100,(y/h)*100):0)+'%';
    /* the journey pipe draws to the point the reader has reached */
    var pf=document.getElementById('pipefill');
    if(pf){
      var mainEl=document.getElementById('main');
      var reached=y+window.innerHeight*0.6-mainEl.offsetTop;
      pf.style.height=Math.max(0,Math.min(mainEl.offsetHeight,reached))+'px';
      document.querySelectorAll('.pipe .stop').forEach(function(s){
        s.classList.toggle('lit', parseFloat(s.style.top)<=reached);
      });
    }
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* The colour wash. Stronger amplitude than the first build so the change is
     actually legible, while every tone stays inside the 21-token set and every
     card stays paper — contrast never depends on scroll position. */
  /* 13 Aug light-palette ruling: grounds cycle through the approved light
     surfaces only — paper, sand, teal/50-200, sage/100-200. */
  /* R5: pastel only — never near-white */
  var CYCLE=[['--sand','--sage200','--teal200'],
             ['--sage100','--sage200','--teal100'],
             ['--teal100','--teal200','--sage200'],
             ['--sage200','--sage100','--teal100'],
             ['--teal50','--teal200','--sage200'],
             ['--sage100','--teal100','--sage200']];
  var cs=getComputedStyle(document.documentElement);
  function tok(n){return cs.getPropertyValue(n).trim();}
  function paint(i){
    var s=CYCLE[i%CYCLE.length];
    if(ground) ground.style.background=tok(s[0]);
    if(fields[0]) fields[0].style.background=tok(s[1]);
    if(fields[1]) fields[1].style.background=tok(s[2]);
  }
  var sections=Array.prototype.slice.call(document.querySelectorAll('section'));
  if('IntersectionObserver' in window){
    sections.forEach(function(s,i){ s.dataset.wi=i; });
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting) paint(parseInt(e.target.dataset.wi,10)); });
    },{rootMargin:'-45% 0px -45% 0px',threshold:0});
    sections.forEach(function(s){io.observe(s);});
    if(hero){
      new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting) paint(0); });
      },{rootMargin:'-45% 0px -45% 0px',threshold:0}).observe(hero);
    }
  }

  /* Tabs */
  var tabs=document.querySelectorAll('.chip[role="tab"]');
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(o){
        o.setAttribute('aria-selected','false');
        var p=document.getElementById(o.getAttribute('aria-controls')); if(p) p.hidden=true;
      });
      t.setAttribute('aria-selected','true');
      var p=document.getElementById(t.getAttribute('aria-controls')); if(p) p.hidden=false;
    });
    t.addEventListener('keydown',function(e){
      var l=Array.prototype.slice.call(tabs), i=l.indexOf(t);
      if(e.key==='ArrowRight') l[(i+1)%l.length].focus();
      if(e.key==='ArrowLeft') l[(i-1+l.length)%l.length].focus();
    });
  });

  /* Carousel arrows — scroll whichever tab panel is visible */
  document.querySelectorAll('.harr[data-dir]').forEach(function(b){
    b.addEventListener('click',function(){
      var p=document.querySelector('.hscroll[role="tabpanel"]:not([hidden])');
      if(p) p.scrollBy({left:parseInt(b.dataset.dir,10)*(264+24)*2,behavior:'smooth'});
    });
  });

  /* Drag-to-scroll on the card rows (desktop) */
  document.querySelectorAll('.hscroll').forEach(function(row){
    var down=false,sx=0,sl=0,moved=false;
    row.addEventListener('pointerdown',function(e){down=true;moved=false;sx=e.clientX;sl=row.scrollLeft;});
    window.addEventListener('pointermove',function(e){
      if(!down) return;
      var dx=e.clientX-sx;
      if(Math.abs(dx)>6){moved=true;row.scrollLeft=sl-dx;}
    });
    window.addEventListener('pointerup',function(){down=false;});
    row.addEventListener('click',function(e){ if(moved){e.preventDefault();} },true);
  });

  /* Explore tabs — strict 3s cycle: travellers → interests → month → trending.
     Pauses only while the pointer is over the tabs or cards, resumes after. */
  var exploreTabs=Array.prototype.slice.call(document.querySelectorAll('.tabrow .chip[role="tab"]'));
  var exploreSec=document.getElementById('explore');
  var hoverPause=false, ti=0;
  if(exploreTabs.length){
    setInterval(function(){
      if(hoverPause||document.hidden) return;
      var r=exploreSec.getBoundingClientRect();
      if(r.bottom<0||r.top>window.innerHeight) return;
      ti=(ti+1)%exploreTabs.length;
      exploreTabs[ti].click();
    },3000);
    exploreTabs.forEach(function(t,i){t.addEventListener('pointerdown',function(){ti=i;});});
    document.querySelectorAll('#explore .tabrow, #explore .hscroll, .cararea .harr').forEach(function(el){
      el.addEventListener('pointerenter',function(){hoverPause=true;});
      el.addEventListener('pointerleave',function(){hoverPause=false;});
    });
  }

  /* Arrows only when the active row actually overflows */
  function syncArrows(){
    var p=document.querySelector('.hscroll[role="tabpanel"]:not([hidden])');
    var need=p && p.scrollWidth>p.clientWidth+8;
    document.querySelectorAll('.cararea .harr').forEach(function(b){b.hidden=!need;});
  }
  window.addEventListener('resize',syncArrows);
  document.querySelectorAll('.tabrow .chip').forEach(function(t){t.addEventListener('click',function(){setTimeout(syncArrows,50);});});
  setTimeout(syncArrows,300);

  /* Zubi answers when poked — example lines drawn from the real journeys */
  var ZEG=['ex: I’m looking for a family trip in December',
    'ex: Ladakh with friends in June',
    'ex: Kerala backwaters with my parents',
    'ex: Kashmir in tulip season, 6 nights',
    'ex: Rajasthan for first-timers, 8 nights',
    'ex: a spiritual trip to Varanasi',
    'ex: Spiti with a group that likes hard roads'];
  var zubiEl=document.getElementById('zubi'), egi=0, intentInput=document.getElementById('intent');
  if(zubiEl&&intentInput){
    zubiEl.addEventListener('click',function(){
      egi=(egi+1)%ZEG.length;
      intentInput.placeholder=ZEG[egi];
      if(window.gsap) gsap.fromTo(zubiEl,{scale:1},{scale:1.12,duration:.14,yoyo:true,repeat:1,ease:'power2.out'});
    });
  }

  /* Zubi Recommended — hover/click a mini card to change the preview;
     auto-cycles until the visitor interacts. */
  var ZREC=[
    {href:'j-ladakh-by-road.html',img:'j-ladakh.webp',meta:'Ladakh · Moderate · 9 nights',title:'Ladakh by Road',
     desc:'Nine days over the high passes to Nubra and Pangong, at a pace that lets everyone sleep well at altitude: oxygen in every vehicle, doctors’ numbers in every driver’s phone.',
     from:'From ₹70,000 per person'},
    {href:'j-kashmir-tulip-season.html',img:'j-kashmir.webp',meta:'Kashmir · Gentle · 6 nights',title:'Kashmir in Tulip Season',
     desc:'Six nights across Srinagar, Gulmarg and Pahalgam in the fortnight the tulips are actually out, with a houseboat night your children will talk about for years.',
     from:'Price pending'},
    {href:'j-kerala-backwaters-slowly.html',img:'j-kerala.webp',meta:'Kerala · Gentle · 7 nights',title:'Kerala Backwaters, Slowly',
     desc:'Seven unhurried nights from Kochi through Alleppey to Kumarakom and the hills: a houseboat, a spice garden, and afternoons with nothing in them, on purpose.',
     from:'From ₹58,000 per person'}
  ];
  var minis=Array.prototype.slice.call(document.querySelectorAll('.zmini'));
  if(minis.length){
    var zsel=0, zuser=false;
    function zshow(i){
      if(!ZREC[i]) return;
      zsel=i; var d=ZREC[i];
      minis.forEach(function(m,j){m.setAttribute('aria-selected',String(j===i));});
      var a=document.getElementById('zprev'); if(!a) return;
      a.href=d.href;
      var img=document.getElementById('zprev-img');
      function swap(){
        img.src=d.img;
        document.getElementById('zprev-meta').textContent=d.meta;
        document.getElementById('zprev-title').textContent=d.title;
        document.getElementById('zprev-desc').textContent=d.desc;
        document.getElementById('zprev-from').textContent=d.from;
      }
      /* Mosby's Files-style transition: the whole page card tilts out from
         the folder side and settles flat, image sweeping open under it */
      if(window.gsap && !reduced){
        var prev=document.getElementById('zprev');
        gsap.to(img,{opacity:0,duration:.16,onComplete:function(){
          swap();
          gsap.fromTo(prev,
            {rotate:-7,scale:.72,x:-90,opacity:.5,transformOrigin:'left bottom'},
            {rotate:0,scale:1,x:0,opacity:1,duration:.75,ease:'power3.out',clearProps:'transform'});
          gsap.fromTo(img,
            {opacity:1,clipPath:'inset(0 100% 0 0)'},
            {clipPath:'inset(0 0% 0 0)',duration:.6,ease:'power3.inOut',clearProps:'clipPath'});
          gsap.fromTo('#zprev .body',{y:22,opacity:0},{y:0,opacity:1,duration:.5,ease:'power2.out',delay:.2});
        }});
      }else{ swap(); }
    }
    minis.forEach(function(m,i){
      m.addEventListener('mouseenter',function(){zuser=true;zshow(i);});
      m.addEventListener('click',function(){zuser=true;zshow(i);});
    });
    setInterval(function(){ if(!zuser&&!document.hidden) zshow((zsel+1)%ZREC.length); },4000);
  }

  /* MAP — region-driven and data-driven.
     REGIONS: one entry per region tab, each with its accurate map file
     (viewBox read from the file itself). Journeys carry region+state — the
     tab row, map and cards all populate from this data. Add an outbound
     journey with {region:'Dubai', map:'uae.svg', st:'...'} and its tab, map
     and card appear with no other change. Today only India has confirmed
     journeys (outbound list is with Sachin), so only India renders. */
  var REGIONS={'India':{map:'india.svg',viewBox:'0 0 612 696'}};
  var PINS=[
    {st:'jk',dx:26,dy:-6, r:'Ladakh',   href:'j-ladakh-by-road.html',        img:'j-ladakh.webp',   meta:'Ladakh · 9 nights · Moderate',   title:'Ladakh by Road',              desc:'Nine days over the high passes to Nubra and Pangong.'},
    {st:'jk',dx:-24,dy:6, r:'Kashmir',  href:'j-kashmir-tulip-season.html',  img:'j-kashmir.webp',  meta:'Kashmir · 6 nights · Gentle',    title:'Kashmir in Tulip Season',     desc:'Srinagar, Gulmarg and Pahalgam when the tulips are out.'},
    {st:'hp',dx:8,dy:-4,  r:'Spiti',    href:'j-spiti-middle-land.html',     img:'j-spiti.webp',    meta:'Spiti · 8 nights · Demanding',   title:'Spiti: The Middle Land',      desc:'The high desert between Shimla and Manali.'},
    {st:'rj',dx:0,dy:0,   r:'Rajasthan',href:'j-rajasthan-first-timers.html',img:'j-rajasthan.webp',meta:'Rajasthan · 8 nights · Moderate',title:'Rajasthan for First-Timers',  desc:'Jaipur, Jodhpur, Jaisalmer and Udaipur, in the right order.'},
    {st:'gj',dx:-10,dy:6, r:'Gujarat',  href:'j-dwarka-somnath-road.html',   img:'j-dwarka.webp',   meta:'Gujarat · 5 nights · Gentle',    title:'Dwarka & Somnath by Road',    desc:'The Saurashtra coast, temple to temple.'},
    {st:'up',dx:30,dy:12, r:'Varanasi', href:'j-varanasi-ganga.html',        img:'j-varanasi.webp', meta:'Varanasi · 4 nights · Gentle',   title:'Varanasi & the Ganga',        desc:'The oldest living city, at dawn and at aarti.'},
    {st:'sk',dx:0,dy:-2,  r:'Sikkim',   href:'j-sikkim-darjeeling-bloom.html',img:'j-sikkim.webp',  meta:'Sikkim · 7 nights · Gentle',     title:'Sikkim & Darjeeling in Bloom',desc:'Toy train to rhododendron valleys, in April.'},
    {st:'as',dx:6,dy:0,   r:'Assam',    href:'j-assam-tea-majuli.html',      img:'j-assam.webp',    meta:'Assam · 6 nights · Gentle',      title:'Assam: Tea, River, Island',   desc:'Tea country, the Brahmaputra, and Majuli.'},
    {st:'kl',dx:0,dy:0,   r:'Kerala',   href:'j-kerala-backwaters-slowly.html',img:'j-kerala.webp', meta:'Kerala · 7 nights · Gentle',     title:'Kerala Backwaters, Slowly',   desc:'Kochi through Alleppey to Kumarakom and the hills.'},
    {st:'an',dx:-4,dy:-20,r:'Andaman',  href:'j-andaman-unhurried.html',     img:'j-andaman.webp',  meta:'Andaman · 6 nights · Gentle',    title:'Andaman, Unhurried',          desc:'The only window we will sell it in.'}
  ];
  PINS.forEach(function(p){p.region=p.region||'India';});
  var pinsG=document.getElementById('mappins'), statesG=document.getElementById('mapstates');
  var curRegion='India';
  function showPin(i,viaHover){
    var d=PINS[i];
    document.querySelectorAll('.mappin').forEach(function(p,j){p.classList.toggle('on',j===i);});
    document.querySelectorAll('#mapstates path').forEach(function(p){p.classList.toggle('active',p.id==='st-'+d.st);});
    var a=document.getElementById('mapcard'); a.href=d.href;
    document.getElementById('mapcard-img').src=d.img;
    document.getElementById('mapcard-meta').textContent=d.meta;
    document.getElementById('mapcard-title').textContent=d.title;
    document.getElementById('mapcard-desc').textContent=d.desc;
    var hint=document.getElementById('maphint-region'); if(hint) hint.textContent=d.r;
    if(window.gsap&&!reduced&&viaHover){
      gsap.fromTo('#mapcard',{scale:.97,opacity:.7},{scale:1,opacity:1,duration:.35,ease:'power2.out'});
    }
  }
  function loadRegion(name){
    var reg=REGIONS[name]; if(!reg) return;
    curRegion=name;
    document.querySelectorAll('#mapregions button').forEach(function(b){
      b.setAttribute('aria-selected',String(b.dataset.region===name));});
    fetch(reg.map).then(function(r){return r.text();}).then(function(txt){
      var doc=new DOMParser().parseFromString(txt,'image/svg+xml');
      var src=doc.documentElement;
      var im=document.getElementById('indiamap');
      if(src.getAttribute('viewBox')) im.setAttribute('viewBox',src.getAttribute('viewBox'));
      var SVGNS='http://www.w3.org/2000/svg';
      statesG.innerHTML=''; pinsG.innerHTML='';
      doc.querySelectorAll('path').forEach(function(p){
        var np=document.createElementNS(SVGNS,'path');
        np.setAttribute('d',p.getAttribute('d'));
        np.id='st-'+p.id;
        statesG.appendChild(np);
      });
      PINS.forEach(function(d,i){
        if(d.region!==name) return;
        var sp=document.getElementById('st-'+d.st);
        if(!sp) return;
        var b=sp.getBBox();
        var x=b.x+b.width/2+(d.dx||0), y=b.y+b.height/2+(d.dy||0);
        var g=document.createElementNS(SVGNS,'g'); g.setAttribute('class','mappin');
        g.setAttribute('transform','translate('+x+' '+y+')');
        var pulse=document.createElementNS(SVGNS,'circle'); pulse.setAttribute('class','pulse'); pulse.setAttribute('r','8');
        var core=document.createElementNS(SVGNS,'circle'); core.setAttribute('class','core'); core.setAttribute('r','6.5');
        var label=document.createElementNS(SVGNS,'text'); label.setAttribute('x','11'); label.setAttribute('y','4');
        label.textContent=d.r;
        g.appendChild(pulse); g.appendChild(core); g.appendChild(label);
        g.addEventListener('pointerenter',function(){showPin(i,true);});
        g.addEventListener('click',function(){window.location.href=d.href;});
        pinsG.appendChild(g);
      });
    }).catch(function(){ /* map is decorative; the card still works via its link */ });
  }
  if(pinsG){
    /* Region tabs render from the journey data — a region appears the moment
       a journey claims it and its map file exists */
    var regbar=document.getElementById('mapregions');
    Object.keys(REGIONS).forEach(function(name){
      if(!PINS.some(function(p){return p.region===name;})) return;
      var b=document.createElement('button');
      b.textContent=name; b.dataset.region=name; b.setAttribute('role','tab');
      b.setAttribute('aria-selected',String(name===curRegion));
      b.addEventListener('click',function(){loadRegion(name);});
      regbar.appendChild(b);
    });
    /* Outbound tabs — journeys are live; tabs go straight to the journey
       until per-country map files land */
    [{n:'Dubai',h:'j-dubai-abu-dhabi-tour.html'},
     {n:'Vietnam',h:'j-vietnam-tour-north-to-south.html'},
     {n:'Japan',h:'j-japan-cherry-blossom-tour.html'},
     {n:'Bali',h:'j-bali-tour-beyond-pool-villa.html'},
     {n:'Beyond India',h:'journeys.html'}].forEach(function(o){
      var b=document.createElement('button');
      b.textContent=o.n; b.setAttribute('role','link');
      b.addEventListener('click',function(){window.location.href=o.h;});
      regbar.appendChild(b);
    });
    if(window.gsap && !reduced){
      gsap.to('#mapregions button',{y:-5,duration:1.6,ease:'sine.inOut',yoyo:true,repeat:-1,stagger:.28});
    }
    loadRegion('India');
    var mi=0, mHover=false;
    var im=document.getElementById('indiamap');
    im.addEventListener('pointerenter',function(){mHover=true;});
    im.addEventListener('pointerleave',function(){mHover=false;});
    setInterval(function(){
      if(mHover||document.hidden) return;
      var idxs=PINS.map(function(p,i){return p.region===curRegion?i:-1;}).filter(function(i){return i>-1;});
      if(!idxs.length) return;
      mi=(mi+1)%idxs.length; showPin(idxs[mi],false);
    },3500);
  }

  /* Journey pipe stops — one per section, placed after layout settles */
  function buildStops(){
    var pipe=document.querySelector('.pipe'); if(!pipe) return;
    pipe.querySelectorAll('.stop').forEach(function(s){s.remove();});
    var mainTop=document.getElementById('main').offsetTop;
    document.querySelectorAll('main section, .intent-band').forEach(function(sec){
      var s=document.createElement('span'); s.className='stop';
      s.style.top=(sec.getBoundingClientRect().top+window.scrollY-mainTop+40)+'px';
      pipe.appendChild(s);
    });
    onScroll();
  }
  window.addEventListener('load',function(){setTimeout(function(){
    buildStops();
    /* R7: async layout (map fetch, pipe stops) shifts the page after the
       scroll triggers are measured — refresh them or the bag spin, the
       Step Outside spin and the count-ups fire at the wrong places. */
    if(window.ScrollTrigger) ScrollTrigger.refresh();
  },600);});
  window.addEventListener('resize',function(){setTimeout(function(){
    buildStops(); if(window.ScrollTrigger) ScrollTrigger.refresh();
  },300);});

  /* Testimonial arrows */
  var TESTS=[
    {t:'“Sachin from Zubilant did an excellent job organizing a tour of the Badami and Hampi area for us. From a comfortable car and driver to hotels, sites and guide. We had a wonderful experience on our first trip to India.”',n:'Rhina Todd',m:'7 months ago · Google review'},
    {t:'“I have traveled to Sikkim for 13 Feb to 17 Feb 2026, it was a family leisure trip, 2 adults and 3 kids, whole trip was made memorable due to Zubilant travel, as they all correctly arranged airport pick up from Bagdogra airport to Gangtok.”',n:'Sanjay Dhurve',m:'6 months ago · Google review'},
    {t:'“I had requested for an itinerary for Aurangabad for 3 days. It was very well planned and executed. Right from my airport pick up till the last day drop at the airport was very well coordinated. Would love to experience the same on my next trip.”',n:'Sweety Bangera',m:'7 months ago · Google review'}
  ];
  var tqi=0, tqp=document.getElementById('tq-prev'), tqn=document.getElementById('tq-next');
  function tqshow(i){
    tqi=(i+TESTS.length)%TESTS.length;
    var d=TESTS[tqi];
    document.getElementById('tq-text').textContent=d.t;
    document.getElementById('tq-name').textContent=d.n;
    document.getElementById('tq-meta').textContent=d.m;
  }
  if(tqp){tqp.addEventListener('click',function(){tqshow(tqi-1);});}
  if(tqn){tqn.addEventListener('click',function(){tqshow(tqi+1);});}
  /* R7: arrows removed — quotes rotate themselves */
  if(document.getElementById('tq-text')){
    setInterval(function(){ if(!document.hidden) tqshow(tqi+1); },5000);
  }

  /* Journey index filter */
  var fchips=document.querySelectorAll('.chip[data-filter]');
  fchips.forEach(function(c){
    c.addEventListener('click',function(){
      fchips.forEach(function(o){o.setAttribute('aria-selected','false');});
      c.setAttribute('aria-selected','true');
      var f=c.getAttribute('data-filter');
      document.querySelectorAll('[data-tags]').forEach(function(el){
        el.hidden = !(f==='all' || (el.getAttribute('data-tags')||'').indexOf('|'+f+'|')>-1);
      });
      var n=document.querySelectorAll('[data-tags]:not([hidden])').length;
      var c2=document.getElementById('jcount'); if(c2) c2.textContent=n+(n===1?' journey':' journeys');
    });
  });

  /* Phone menu — builds a real overlay from the nav links and toggles a class.
     No injected inline styles (site-v9.css owns the look). Esc closes,
     body scroll locks, focus returns to the burger. */
  var burger=document.querySelector('.burger'), links=document.querySelector('.navlinks');
  if(burger&&links){
    var menu=null;
    function build(){
      if(menu) return menu;
      menu=document.createElement('div');
      menu.className='navmenu';
      menu.setAttribute('role','dialog');
      menu.setAttribute('aria-modal','true');
      menu.setAttribute('aria-label','Menu');
      var brand=document.querySelector('.brand .lg-col');
      var tel=document.querySelector('.navtel');
      var cta=document.querySelector('.nav .btn');
      var top=document.createElement('div'); top.className='nmtop';
      top.innerHTML='<img src="'+(brand?brand.getAttribute('src'):'logo.png')+'" alt="Zubilant">'+
                    '<button class="nmclose" type="button" aria-label="Close menu">&times;</button>';
      var body=document.createElement('div'); body.className='nmbody'; var ban=null;
      links.querySelectorAll('.mhead,a').forEach(function(el){
        if(el.closest('.mfoot')) return;
        if(el.classList.contains('mhead')){
          var h=document.createElement('div'); h.className='mhead';
          h.innerHTML=el.innerHTML; body.appendChild(h); return;
        }
        if(el.classList.contains('mban')){ban=el.cloneNode(true); return;}
        var a=el.cloneNode(true);
        var c=a.querySelector('.cev'); if(c) c.remove();
        body.appendChild(a);
      });
      if(ban) body.appendChild(ban);
      var foot=document.createElement('div'); foot.className='nmfoot';
      if(cta){var c2=cta.cloneNode(true); foot.appendChild(c2);}
      if(tel){var t2=document.createElement('a'); t2.className='nmtel';
        t2.href=tel.getAttribute('href'); t2.textContent='Call '+tel.textContent.trim();
        foot.appendChild(t2);}
      menu.appendChild(top); menu.appendChild(body); menu.appendChild(foot);
      document.body.appendChild(menu);
      menu.querySelector('.nmclose').addEventListener('click',close);
      return menu;
    }
    function open(){
      build();
      document.body.classList.add('navopen');
      burger.setAttribute('aria-expanded','true');
      var f=menu.querySelector('a,button'); if(f) f.focus();
    }
    function close(){
      document.body.classList.remove('navopen');
      burger.setAttribute('aria-expanded','false');
      burger.focus();
    }
    burger.addEventListener('click',function(){
      (burger.getAttribute('aria-expanded')==='true'?close:open)();
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&document.body.classList.contains('navopen')) close();
    });
  }
  /* HERO ROTATION — the Jitter "Destination" pattern: crossfade every 3s,
     slow Ken Burns zoom on the active slide. Pauses when the tab is hidden. */
  var slides=Array.prototype.slice.call(document.querySelectorAll('.hero .slide'));
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(slides.length>1 && !reduced){
    var cur=0;
    setInterval(function(){
      if(document.hidden) return;
      slides[cur].classList.remove('on');
      cur=(cur+1)%slides.length;
      var s=slides[cur]; s.classList.add('on');
      if(window.gsap) gsap.fromTo(s,{scale:1.08},{scale:1,duration:3.2,ease:'power1.out',overwrite:true});
    },3000);
  }

  /* GSAP layer — hero entrance, Zubi, pinned metrics. All guarded: if the CDN
     fails or reduced motion is set, the page is complete without it. */
  function inr(n){ n=Math.round(n); var s=String(n), l=s.length;
    if(l<=3) return s;
    var head=s.slice(0,l-3), tail=s.slice(l-3), parts=[];
    while(head.length>2){ parts.unshift(head.slice(-2)); head=head.slice(0,-2); }
    if(head) parts.unshift(head);
    return parts.join(',')+','+tail; }
  window.addEventListener('load',function(){
    if(!window.gsap || reduced) return;
    if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance — eyebrow, title, sub, chips, buttons stagger up */
    gsap.from('.hero .eyebrow, .hero h1, .hero .sub, .hero .trust, .hero .btnrow',
      {y:36,opacity:0,duration:.9,ease:'power3.out',stagger:.12,clearProps:'all'});
    gsap.fromTo('.hero .slide.on',{scale:1.08},{scale:1,duration:3.2,ease:'power1.out'});

    if(!window.ScrollTrigger) return;

    /* Zubi comes up from behind the enquiry card, then idles with a bounce */
    var zubi=document.getElementById('zubi');
    if(zubi){
      gsap.set(zubi,{opacity:1,y:70});
      gsap.to(zubi,{y:0,duration:.8,ease:'back.out(1.6)',
        scrollTrigger:{trigger:'.intent',start:'top 78%',once:true}});
      /* R7: Zubi holds still; he bobs only while the box is hovered */
      var zbob=null, intentBox=document.querySelector('.intent');
      if(intentBox){
        intentBox.addEventListener('pointerenter',function(){
          if(!zbob) zbob=gsap.to(zubi,{y:-9,duration:.7,ease:'sine.inOut',yoyo:true,repeat:-1});
          else zbob.play();
        });
        intentBox.addEventListener('pointerleave',function(){
          if(zbob){zbob.pause(); gsap.to(zubi,{y:0,duration:.4,ease:'power2.out'});}
        });
      }
    }

    /* Step Outside — the oval spins with scroll, like the bag */
    gsap.to('.so-oval',{rotateZ:540,ease:'none',
      scrollTrigger:{trigger:'.stepout',start:'top bottom',end:'bottom top',scrub:.8}});

    /* Metrics — numbers hold their starting values until the strip is
       actually on screen, then count up. Bag spins with scroll. */
    document.querySelectorAll('.metrics .cnt').forEach(function(el){
      var o={v:parseFloat(el.dataset.from)}, to=parseFloat(el.dataset.to), fmt=el.dataset.fmt;
      gsap.to(o,{v:to,duration:1.8,ease:'power2.out',
        scrollTrigger:{trigger:'.metrics',start:'top 60%',once:true},
        onUpdate:function(){ el.textContent = fmt==='in' ? inr(o.v) : String(Math.round(o.v)); }});
    });
    gsap.to('#msymbol',{rotateZ:720,ease:'none',
      scrollTrigger:{trigger:'.metrics',start:'top bottom',end:'bottom top',scrub:1}});

    /* R4 creative pass — the page breathes:
       · every heading and card drifts up as it arrives
       · the hero image drifts slower than the page (parallax)
       · pcards tilt a degree toward the cursor */
    gsap.utils.toArray('main section').forEach(function(sec){
      var kids=sec.querySelectorAll('h2, .lead, .mstat, .award, .howcard, .zmini, .zprev, .tstory, .mapgrid, .steps .step');
      if(!kids.length) return;
      gsap.from(kids,{y:30,opacity:0,duration:.8,ease:'power3.out',stagger:.09,
        scrollTrigger:{trigger:sec,start:'top 76%',once:true}});
    });
    /* R7: hero parallax removed — it opened a band above the image */
    document.querySelectorAll('.pcard,.howcard,.mapcard').forEach(function(card){
      card.addEventListener('pointermove',function(e){
        var r=card.getBoundingClientRect();
        var rx=((e.clientY-r.top)/r.height-.5)*-2.4, ry=((e.clientX-r.left)/r.width-.5)*2.4;
        gsap.to(card,{rotateX:rx,rotateY:ry,transformPerspective:700,duration:.4,ease:'power2.out'});
      });
      card.addEventListener('pointerleave',function(){
        gsap.to(card,{rotateX:0,rotateY:0,duration:.5,ease:'power2.out'});
      });
    });

    /* How-we-work birds — pop over the cards as the strip scrolls in,
       then keep a gentle bounce. */
    var birds=document.querySelectorAll('.howbird');
    if(birds.length){
      gsap.set(birds,{opacity:1,y:44,scale:.6});
      gsap.to(birds,{y:0,scale:1,duration:.7,ease:'back.out(1.9)',stagger:.18,
        scrollTrigger:{trigger:'.howgrid',start:'top 78%',once:true},
        onComplete:function(){
          birds.forEach(function(b,i){
            gsap.to(b,{y:-9,duration:.85,ease:'sine.inOut',yoyo:true,repeat:-1,delay:i*.25});
          });
        }});
    }
  });
})();

/* ANIMATION WATCHDOG (14 Aug) — content must never stay invisible. If the
   animation ticker stalls or a scroll reveal never fires, anything hidden by
   an entrance/reveal tween gets forced visible after the page has been
   visible for 3 seconds. Animations are an enhancement, never a dependency. */
(function(){
  function rescue(){
    try{
      var sels='.hero h1,.hero .sub,.hero .eyebrow,main h2,main .lead,main .pcard,main .card,.mstat,.zrec,.jgrid,.daylist li,.intent';
      document.querySelectorAll(sels).forEach(function(el){
        var c=getComputedStyle(el);
        if(parseFloat(c.opacity)<0.15){
          el.style.opacity='1';
          el.style.transform='none';
          el.style.visibility='visible';
        }
      });
    }catch(e){}
  }
  var armed=false;
  function arm(){
    if(armed||document.hidden) return;
    armed=true;
    setTimeout(function(){
      rescue();
      var t; window.addEventListener('scroll',function(){clearTimeout(t); t=setTimeout(rescue,400);},{passive:true});
    },3000);
  }
  document.addEventListener('visibilitychange',arm);
  window.addEventListener('load',arm);
  arm();
})();

/* ── Zubi Recommended ⇒ ⚡ Trending badge, automatic wherever journey cards render (r10) ── */
window.ZREC=['j-rajasthan-first-timers.html','j-golden-triangle-delhi-agra-jaipur.html','j-kerala-backwaters-slowly.html','j-ladakh-by-road.html','j-ayodhya-prayagraj-chitrakoot-ram-path.html','j-dubai-abu-dhabi-tour.html','j-vietnam-tour-north-to-south.html'];
(function(){
  function zap(){
    [].slice.call(document.querySelectorAll('.jcard')).forEach(function(c){
      var a=c.querySelector('.jhit');if(!a)return;
      if(window.ZREC.indexOf(a.getAttribute('href'))<0)return;
      var fig=c.querySelector('.jfig');if(!fig||fig.querySelector('.b-zap'))return;
      var old=fig.querySelector('.jbadge');if(old)old.parentNode.removeChild(old);
      var s=document.createElement('span');s.className='jbadge b-zap';s.textContent='⚡️ Trending';
      fig.insertBefore(s,fig.firstChild);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',zap);else zap();
})();

/* ── Quick view, shared (r15). Every .jcard on every page gets the journeys-index
   Quick view. Built from the card's own DOM, so nothing is duplicated or invented.
   journeys.html ships its own data-driven copy and is skipped (it owns #qvbd). ── */
(function(){
  function init(){
    if(document.getElementById('qvbd')) return;
    var cards=[].slice.call(document.querySelectorAll('.jcard'));
    if(!cards.length) return;
    var bd=document.createElement('div');bd.className='qvbd';bd.id='qvbd';
    bd.setAttribute('role','dialog');bd.setAttribute('aria-modal','true');bd.setAttribute('aria-labelledby','qvt');
    bd.innerHTML='<div class="qv" id="qv"></div>';document.body.appendChild(bd);
    var qv=bd.firstChild,lastFocus=null;
    var PIN='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14.5S13 10.4 13 6.6A5 5 0 0 0 3 6.6C3 10.4 8 14.5 8 14.5Z"/><circle cx="8" cy="6.5" r="1.9"/></svg>';
    cards.forEach(function(c,i){
      var fig=c.querySelector('.jfig');if(!fig||fig.querySelector('.jqv'))return;
      var b=document.createElement('button');b.type='button';b.className='jqv';b.setAttribute('data-qv',i);
      b.innerHTML=PIN+' Quick view';fig.appendChild(b);
    });
    function esc(s){return String(s||'').replace(/</g,'&lt;');}
    function open(c){
      lastFocus=document.activeElement;
      var a=c.querySelector('.jhit'),img=c.querySelector('.jfig img'),h=c.querySelector('h3'),
          p=c.querySelector('.jbody p'),pr=c.querySelector('.jprice'),href=a?a.getAttribute('href'):'#';
      var tags=[].slice.call(c.querySelectorAll('.jattrs span')).map(function(s){return esc(s.textContent.trim());});
      var trend=c.querySelector('.b-zap');
      var ask='contact.html'+(h?'?journey='+encodeURIComponent(h.textContent.trim()):'')+'#enquire';
      qv.innerHTML='<button class="qvx" aria-label="Close">&times;</button>'+
        (img?'<img src="'+img.getAttribute('src')+'" alt="">':'')+
        '<div class="qvb"><h3 id="qvt">'+(h?h.innerHTML:'')+'</h3>'+
        '<div class="qvrow">'+tags.map(function(t){return '<span class="qvt">'+t+'</span>';}).join('')+
        (trend?'<span class="qvt" style="background:var(--sun100)">⚡️ Trending</span>':'')+'</div>'+
        (p?'<p>'+p.innerHTML+'</p>':'')+
        (pr?'<div class="qvp">'+pr.innerHTML.replace(/<i>.*?<\/i>/,' per person <span style="color:var(--orange600)">(indicative)</span>')+'</div>':'')+
        '<div class="qvcta"><a class="btn btn-primary" href="'+href+'">View the full journey <span class="arw">→</span></a>'+
        '<a class="btn btn-secondary" href="'+ask+'">Ask about it</a></div></div>';
      bd.classList.add('show');document.body.style.overflow='hidden';
      qv.querySelector('.qvx').onclick=close;qv.querySelector('.qvx').focus();
    }
    function close(){bd.classList.remove('show');document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
    bd.addEventListener('click',function(e){if(e.target===bd)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&bd.classList.contains('show'))close();});
    document.addEventListener('click',function(e){
      var b=e.target.closest('.jqv');if(!b)return;
      e.preventDefault();e.stopPropagation();
      var c=b.closest('.jcard');if(c)open(c);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* ── ENQUIRY FORMS r2 (22 Aug) ─ validation + delivery.
   /api/enquiry does not exist yet (board 2.1 #37). Submit tries it; when it
   fails, the visitor gets a one-tap WhatsApp or email send with their details
   pre-filled instead of a 404. When the Worker lands, set EP and this whole
   fallback becomes invisible. */
(function(){
  var EP='/api/enquiry', WA='918108117770', TO='experience@zubilant.co.in';
  function init(){
    document.querySelectorAll('form[action="/api/enquiry"]').forEach(function(f){
      f.setAttribute('novalidate','');
      function slot(el){var w=el.closest('.field');if(!w)return null;
        var e=w.querySelector('.ferr');
        if(!e){e=document.createElement('span');e.className='ferr';w.appendChild(e);}
        return e;}
      function err(el,msg){var e=slot(el);if(!e)return;e.textContent=msg;
        el.closest('.field').classList.add('err');el.setAttribute('aria-invalid','true');}
      f.addEventListener('input',function(e){var w=e.target.closest('.field');
        if(w){w.classList.remove('err');e.target.removeAttribute('aria-invalid');}});
      f.addEventListener('submit',function(ev){
        ev.preventDefault();
        var name=f.querySelector('[name="name"]'),contact=f.querySelector('[name="contact"]'),bad=[];
        if(name&&!name.value.trim()){err(name,'We need a name to reply to.');bad.push(name);}
        if(contact&&!contact.value.trim()){err(contact,'A phone number or email, so a person can reach you.');bad.push(contact);}
        if(bad.length){bad[0].focus();return;}
        var pairs=[];
        f.querySelectorAll('.field').forEach(function(w){
          var l=w.querySelector('label'),c=w.querySelector('input,select,textarea');
          if(!l||!c||!c.value.trim())return;
          pairs.push(l.childNodes[0].textContent.trim()+': '+c.value.trim());
        });
        var txt='New enquiry via zubilant.co.in\n'+pairs.join('\n');
        var btn=f.querySelector('button[type="submit"]');
        if(btn){btn.disabled=true;btn.dataset.l=btn.innerHTML;btn.textContent='Sending\u2026';}
        var ctrl=('AbortController' in window)?new AbortController():null;
        var t=ctrl?setTimeout(function(){ctrl.abort();},4000):null;
        function done(sent){
          if(t)clearTimeout(t);
          if(btn){btn.disabled=false;btn.innerHTML=btn.dataset.l;}
          var p=f.querySelector('.fsend');
          if(!p){p=document.createElement('div');p.className='fsend';f.appendChild(p);}
          if(sent){
            p.innerHTML='<h4>Sent. Thank you.</h4>'+
              '<p class="ink700" style="font-size:15.5px">One person reads it and replies. Nothing is booked until you say so.</p>';
          }else{
            p.innerHTML='<h4>Ready to send. One tap.</h4>'+
              '<p class="ink700" style="font-size:15px">Your details are written out below. Send them the way you prefer and a person replies there.</p>'+
              '<div class="sum"></div>'+
              '<div class="btnrow"><a class="btn btn-primary" target="_blank" rel="noopener">Send on WhatsApp <span class="arw" aria-hidden="true">\u2192</span></a>'+
              '<a class="btn btn-secondary">Send by email</a></div>'+
              '<button type="button" class="editl">\u2190 Edit my details</button>';
            p.querySelector('.sum').textContent=txt;
            p.querySelector('.btn-primary').href='https://wa.me/'+WA+'?text='+encodeURIComponent(txt);
            p.querySelector('.btn-secondary').href='mailto:'+TO+'?subject='+encodeURIComponent('Website enquiry')+'&body='+encodeURIComponent(txt);
            p.querySelector('.editl').addEventListener('click',function(){f.classList.remove('zsend');p.remove();});
          }
          f.classList.add('zsend');
          p.scrollIntoView({block:'nearest'});
        }
        try{
          fetch(EP,{method:'POST',body:new FormData(f),signal:ctrl?ctrl.signal:undefined})
            .then(function(r){if(!r.ok)throw 0;done(true);})
            .catch(function(){done(false);});
        }catch(e){done(false);}
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
