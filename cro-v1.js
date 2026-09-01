/* ═══════════════════════════════════════════════════════════════
   ZUBILANT · cro-v1.js — conversion layer, 24 Aug 2026.

   Own file on purpose. index.html runs its own inline copy of site-v9.js
   (board lesson 1.3), so anything appended there has to be written twice
   and drifts. This file is linked by all 72 pages and written once.

   Nothing here invents a fact. Prices, seasons, titles and images are read
   out of the DOM or ZUBI_DATA, which is generated from journeys.html canon.

   Modules
     1  track()          event layer — GA4 reads it the day an ID exists
     2  shortlist        save-for-later, localStorage only, no backend
     3  recently viewed  standard journey cards above the footer block
                       on index/journeys, localStorage only
     4  sticky bar       phone-only conversion bar on journey pages
     5  season badge     honest urgency from real travel windows
     6  risk reversal    microcopy at conversion points
     7  exit intent      one offer, frequency-capped, never a fake timer
     8  form assist      +91 default, remembered details, WhatsApp-first
     9  whatsapp context every bare wa.me link prefilled from the page
   ═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

var WA='918108117770';
var LS={saved:'zub_saved',recent:'zub_recent',exit:'zub_exit',me:'zub_me'};

/* ── OFFER ─────────────────────────────────────────────────────
   CEO ruling, 24 Aug: the exit offer is 10% off a first booking.
   Every word of it lives here so it can be changed, or switched off,
   in one line. `on:false` reverts the modal to the itinerary capture
   with no commercial promise attached. */
var OFFER={
  on:true,
  code:'ZUBFIRST10',
  eyebrow:'Before you go',
  head:'10% off your first journey with Zubilant.',
  sub:'Tell us where you are headed and we will send the itinerary and a costed plan on WhatsApp, with the first-booking discount applied to your quote.',
  cta:'Send me my plan',
  terms:'offer-terms.html'
};
var NOOFFER={
  eyebrow:'Before you go',
  head:'Take the itinerary with you.',
  sub:'We will send this journey and a costed plan to your WhatsApp. No payment, no obligation, and a person writes back.',
  cta:'Send it to me',
  terms:''
};

/* ── helpers ───────────────────────────────────────────────────── */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function ls(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lset(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function ss(k,d){try{var v=sessionStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function sset(k,v){try{sessionStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function el(t,c,h){var n=document.createElement(t);if(c)n.className=c;if(h!=null)n.innerHTML=h;return n;}
function txt(n){return n?(n.textContent||'').trim():'';}
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function inr(n){return '\u20B9'+String(n).replace(/\B(?=(\d\d)+(\d)(?!\d))/g,',');}
var PAGE=(location.pathname.split('/').pop()||'index.html');

/* ── 1 · EVENT LAYER ───────────────────────────────────────────
   Board 2.1 #16: there is no analytics ID yet. Every event is queued
   here and mirrored into dataLayer, so the day a GA4 or Plausible
   snippet lands it starts reading real conversion events with no
   further work. */
window.zcroEvents=window.zcroEvents||[];
window.dataLayer=window.dataLayer||[];
function track(name,props){
  var p=props||{}; p.event=name; p.page=PAGE; p.ts=Date.now();
  window.zcroEvents.push(p);
  try{window.dataLayer.push(p);}catch(e){}
  if(typeof window.gtag==='function'){try{window.gtag('event',name,props||{});}catch(e){}}
}
window.zcroTrack=track;

/* ── card reading ──────────────────────────────────────────────── */
function cardData(card){
  var a=$('.jhit',card)||$('a[href]',card);
  var img=$('img',card);
  return {
    href:a?a.getAttribute('href'):'',
    title:txt($('h3',card))||(a?a.getAttribute('aria-label'):'')||'',
    img:img?img.getAttribute('src'):'',
    price:txt($('.jprice',card)).replace(/\s+/g,' '),
    n:card.getAttribute('data-n')||''
  };
}

/* ── 2 · SHORTLIST ─────────────────────────────────────────────── */
var HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.9-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9c0 5.3-7.5 10.2-7.5 10.2Z" stroke-linejoin="round"/></svg>';
function saved(){return ls(LS.saved,[]);}
function isSaved(h){return saved().some(function(x){return x.href===h;});}
function toggleSave(d){
  var list=saved(), i=-1;
  list.forEach(function(x,k){if(x.href===d.href)i=k;});
  if(i>=0){list.splice(i,1);track('shortlist_remove',{journey:d.title});}
  else{list.unshift(d);list=list.slice(0,24);track('shortlist_add',{journey:d.title,price:d.price});}
  lset(LS.saved,list); paintSaves(); return i<0;
}
function paintSaves(){
  var n=saved().length;
  $$('.zsave').forEach(function(b){
    b.setAttribute('aria-pressed',isSaved(b.getAttribute('data-h'))?'true':'false');
  });
  var pill=$('.znavsave');
  if(pill){ pill.hidden=n===0; var b=$('b',pill); if(b)b.textContent=n; }
  var dl=$('.zdlist'); if(dl&&$('.zdrawbd.show')) fillDrawer();
}
function injectSaves(root){
  $$('.jcard',root||document).forEach(function(card){
    var fig=$('.jfig',card); if(!fig||$('.zsave',card))return;
    var d=cardData(card); if(!d.href)return;
    var b=el('button','zsave',HEART);
    b.type='button'; b.setAttribute('data-h',d.href);
    b.setAttribute('aria-label','Save '+d.title+' to your shortlist');
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var added=toggleSave(d);
      b.setAttribute('aria-pressed',added?'true':'false');
      if(added&&!ss('zub_drawer_hint',false)){sset('zub_drawer_hint',true);openDrawer();}
    });
    fig.appendChild(b);
  });
  paintSaves();
}

/* nav pill + drawer */
function buildDrawer(){
  if($('.zdrawbd'))return;
  var bd=el('div','zdrawbd'); document.body.appendChild(bd);
  var d=el('aside','zdraw',
    '<header><h3>Your shortlist</h3><button class="zdx" type="button" aria-label="Close shortlist">&times;</button></header>'+
    '<div class="zdlist"></div>'+
    '<footer>'+
      '<a class="btn btn-primary zdsend" href="#">Send my shortlist on WhatsApp <span class="arw" aria-hidden="true">&rarr;</span></a>'+
      '<a class="btn btn-secondary" href="journeys.html">Keep browsing journeys</a>'+
      '<p class="zmicro">Saved on this device only. Nothing is booked, nothing is charged, and a person replies.</p>'+
    '</footer>');
  d.setAttribute('aria-label','Your shortlist'); d.hidden=true;
  document.body.appendChild(d);
  bd.addEventListener('click',closeDrawer);
  $('.zdx',d).addEventListener('click',closeDrawer);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&bd.classList.contains('show'))closeDrawer();});
}
function fillDrawer(){
  var list=saved(), box=$('.zdlist'); if(!box)return;
  if(!list.length){box.innerHTML='<p class="zdempty">Nothing saved yet. Tap the heart on any journey and it waits for you here.</p>';
    var s=$('.zdsend'); if(s)s.style.display='none'; return;}
  var s2=$('.zdsend'); if(s2)s2.style.display='';
  box.innerHTML='';
  list.forEach(function(x){
    var r=el('div','zdrow',
      '<img src="'+x.img+'" alt="" loading="lazy">'+
      '<div><a href="'+x.href+'">'+x.title+'</a><i>'+(x.price||'')+'</i></div>'+
      '<button type="button" aria-label="Remove '+x.title+'">&times;</button>');
    $('button',r).addEventListener('click',function(){toggleSave(x);fillDrawer();});
    $('a',r).addEventListener('click',function(){track('shortlist_open_journey',{journey:x.title});});
    box.appendChild(r);
  });
  var txtmsg='My Zubilant shortlist\n'+list.map(function(x){return '• '+x.title+(x.price?' ('+x.price.replace(/per person\*?/,'pp')+')':'');}).join('\n')+
    '\n\nCould you send me plans and prices for these?';
  var send=$('.zdsend');
  if(send){send.href='https://wa.me/'+WA+'?text='+encodeURIComponent(txtmsg);
    send.target='_blank'; send.rel='noopener';
    send.onclick=function(){track('shortlist_send_whatsapp',{count:list.length});};}
}
function openDrawer(){buildDrawer();fillDrawer();var bd=$('.zdrawbd'),d=$('.zdraw');
  d.hidden=false;bd.classList.add('show');requestAnimationFrame(function(){d.classList.add('show');});
  track('shortlist_open',{count:saved().length});}
function closeDrawer(){var bd=$('.zdrawbd'),d=$('.zdraw');if(!bd)return;
  bd.classList.remove('show');d.classList.remove('show');
  setTimeout(function(){d.hidden=true;},320);}
function injectNavPill(){
  var nr=$('.navright'); if(!nr||$('.znavsave'))return;
  var b=el('button','znavsave','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.9-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9c0 5.3-7.5 10.2-7.5 10.2Z" stroke-linejoin="round"/></svg><span>Saved</span><b>0</b>');
  b.type='button'; b.hidden=true; b.setAttribute('aria-label','Open your shortlist');
  b.addEventListener('click',openDrawer);
  nr.insertBefore(b,nr.firstChild);
}

/* ── 3 · RECENTLY VIEWED ─────────────────────────────────────────
   Krishna, 1 Sep: "The Step outside is also a footer. Pick up where you
   left off - should be above the footer in the standard card format."

   So: the section is inserted immediately BEFORE the Step Outside band,
   which puts it above the whole footer block — .stepout and <footer> are
   one continuous teal100 unit and read as one thing. It also restores the
   `.stepout + footer` adjacency rule the old insert point silently broke.
   Deliberately OUTSIDE <main>: the homepage journey pipe and its stop dots
   are measured off #main, and a section added inside it moves them.

   Cards are the site's standard `.jcard`, built from ZUBI_DATA (generated
   from journeys.html canon), falling back to what recordView captured off
   the page itself. Nothing here is invented. Hearts and season chips
   attach themselves because these are real .jcards. ── */
var RECENT_MAX=3;   /* one clean row at desktop, matching .jgrid2 related-trips.
                       Change this one number to show more. */

var RVI={
  star:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4 4.2 13.4l.7-4.3-3.1-3 4.3-.6z"/></svg>',
  moon:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M13 9.2A5.4 5.4 0 0 1 6.8 3a5.6 5.6 0 1 0 6.2 6.2Z"/></svg>',
  pin:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14.5S13 10.4 13 6.6A5 5 0 0 0 3 6.6C3 10.4 8 14.5 8 14.5Z"/><circle cx="8" cy="6.5" r="1.9"/></svg>',
  pace:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 11.5a6.4 6.4 0 1 1 12 0"/><path d="M8 11.5 11 6.9"/></svg>'
};

function recordView(){
  if(PAGE.indexOf('j-')!==0)return;
  var price=txt($('.jside .price'))||txt($('.pval'));
  var d={href:PAGE,title:txt($('.hero h1')).replace(/\.$/,''),
         img:($('.hero.short img')||{}).getAttribute?$('.hero.short img').getAttribute('src'):'',
         price:price?'From '+price:''};
  if(!d.title)return;
  var r=ls(LS.recent,[]).filter(function(x){return x.href!==d.href;});
  r.unshift(d); lset(LS.recent,r.slice(0,8));
}

function canonFor(href){
  var D=window.ZUBI_DATA&&window.ZUBI_DATA.journeys;
  if(!D)return null;
  for(var i=0;i<D.length;i++){if(D[i].h===href)return D[i];}
  return null;
}

/* The standard journey card, same markup as journeys.html ships. */
function recentCard(x){
  var j=canonFor(x.href);
  var title=(j&&j.t)||x.title||'';
  var img=(j&&j.g)||x.img||'';
  if(!title)return null;
  var alt=(j&&j.r)?title+', '+j.r+'.':title;
  var attrs='';
  if(j){
    if(j.n)attrs+='<span>'+RVI.moon+' '+esc(j.n)+' nights</span>';
    if(j.r)attrs+='<span>'+RVI.pin+' '+esc(j.r)+'</span>';
    if(j.pace)attrs+='<span>'+RVI.pace+' '+esc(j.pace)+'</span>';
  }
  var price=(j&&j.p)?'From <strong>'+inr(j.p)+'</strong><i>per person*</i>'
                    :(x.price?'<strong>'+esc(x.price)+'</strong>':'');
  var c=el('article','jcard zrvcard');
  c.setAttribute('data-title',title);
  c.innerHTML='<a class="jhit" href="'+esc(x.href)+'" aria-label="'+esc(title)+'"></a>'+
    '<div class="jfig">'+(img?'<img src="'+esc(img)+'" alt="'+esc(alt)+'" loading="lazy" width="800" height="600">':'')+'</div>'+
    '<div class="jbody">'+
      '<div class="jrate">'+RVI.star+'<b>4.9</b><span>Zubilant on Google</span></div>'+
      '<h3>'+esc(title)+'</h3>'+
      (attrs?'<div class="jattrs">'+attrs+'</div>':'')+
      ((j&&j.d)?'<p>'+esc(j.d)+'</p>':'')+
      '<div class="jfoot"><span class="jprice">'+price+'</span>'+
        '<span class="jgo">View journey <b aria-hidden="true">&rarr;</b></span></div>'+
    '</div>';
  return c;
}

function renderRecent(){
  if(PAGE!=='index.html'&&PAGE!=='journeys.html'&&PAGE!=='')return;
  var r=ls(LS.recent,[]); if(r.length<2)return;
  var step=$('#stepout'), foot=$('footer');
  if(!step&&!foot)return;

  var sec=el('section','zrv tint-clay');
  sec.setAttribute('aria-label','Journeys you looked at');
  sec.innerHTML='<div class="wrap"><div class="zrvhead"><h2>Pick up where you left off</h2>'+
    '<button class="zrvclear" type="button">Clear</button></div><div class="zrvgrid"></div></div>';
  var grid=$('.zrvgrid',sec);

  r.slice(0,RECENT_MAX).forEach(function(x){
    if(!x||!x.href)return;
    var c=recentCard(x); if(!c)return;
    c.addEventListener('click',function(){track('recent_click',{journey:x.title});});
    grid.appendChild(c);
  });
  if(!grid.children.length)return;

  $('.zrvclear',sec).addEventListener('click',function(){
    lset(LS.recent,[]); sec.remove(); refreshST(); track('recent_clear',{});
  });

  if(step)step.parentNode.insertBefore(sec,step);
  else foot.parentNode.insertBefore(sec,foot);

  try{injectSaves(sec);}catch(e){}
  /* Brand rule: any injected DOM is followed by a ScrollTrigger refresh.
     This now matters — the section sits ABOVE the Step Outside band, whose
     reveal is scroll-scrubbed, so every trigger below it has moved. */
  refreshST();
  track('recent_shown',{count:grid.children.length});
}

function refreshST(){
  try{
    if(window.ScrollTrigger&&window.ScrollTrigger.refresh){
      requestAnimationFrame(function(){window.ScrollTrigger.refresh();});
      window.addEventListener('load',function(){
        try{window.ScrollTrigger.refresh();}catch(e){}
      },{once:true});
    }
  }catch(e){}
}

/* ── 5 · SEASON — honest urgency ─────────────────────────────── */
var MON=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
var MONFULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
function seasonMonths(s){
  if(!s)return null;
  var out={}, parts=String(s).toLowerCase().split(/\s*(?:,|\/|&|and)\s*/);
  parts.forEach(function(p){
    var r=p.split(/\s*[–—-]\s*/);
    var a=MON.indexOf(r[0].slice(0,3));
    if(a<0)return;
    if(r.length<2){out[a]=1;return;}
    var b=MON.indexOf(r[1].slice(0,3)); if(b<0){out[a]=1;return;}
    var i=a; for(var g=0;g<12;g++){out[i]=1;if(i===b)break;i=(i+1)%12;}
  });
  var keys=Object.keys(out); return keys.length?out:null;
}
function seasonBadge(s){
  var m=seasonMonths(s); if(!m)return null;
  var now=new Date().getMonth(), next=(now+1)%12;
  var CAL='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke-linecap="round"/></svg>';
  if(m[now])return{cls:'zseason',t:'In season now'};
  if(m[next])return{cls:'zseason soon',t:'Season opens in '+MONFULL[next]};
  var i=next,c=1;
  while(c<12&&!m[i]){i=(i+1)%12;c++;}
  if(c>=12)return null;
  return{cls:'zseason',t:'Best window from '+MONFULL[i],cal:CAL};
}
function applySeason(){
  var D=window.ZUBI_DATA&&window.ZUBI_DATA.journeys;
  var CAL='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke-linecap="round"/></svg>';
  if(D){
    var byHref={}; D.forEach(function(j){byHref[j.h]=j;});
    /* cards */
    $$('.jcard').forEach(function(c){
      if($('.zseason',c))return;
      var a=$('.jhit',c)||$('a[href]',c); if(!a)return;
      var j=byHref[a.getAttribute('href')]; if(!j)return;
      var b=seasonBadge(j.season); if(!b||b.cls==='zseason'&&b.t.indexOf('Best window')===0)return;
      var host=$('.jattrs',c)||$('.jbody',c); if(!host)return;
      host.appendChild(el('span',b.cls,CAL+b.t));
    });
    /* detail page */
    if(PAGE.indexOf('j-')===0){
      var j2=byHref[PAGE], side=$('.jside .pnote');
      if(j2&&side){
        var b2=seasonBadge(j2.season);
        if(b2&&!$('.jside .zseason')){
          var t2=b2.t;
          var hasRange=j2.season&&/[–—-]|,|\//.test(j2.season);
          if(t2.indexOf('Best window')===0) t2=hasRange?'Best window: '+j2.season:'Best window: '+t2.replace('Best window from ','');
          else if(hasRange) t2=t2+' &middot; '+j2.season;
          side.parentNode.insertBefore(el('span',b2.cls,CAL+t2),side.nextSibling);
        }
      }
    }
  }
}

/* ── 6 · RISK REVERSAL ───────────────────────────────────────── */
var RRTICK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function rr(items){
  return el('div','zrr',items.map(function(t){return '<span>'+RRTICK+t+'</span>';}).join(''));
}
function applyRR(){
  var set=['No payment now','Nothing is booked until you say so','A person replies, not a bot'];
  var strip=$('.sumstrip');
  if(strip&&!$('.zrr',strip))strip.appendChild(rr(set));
  var side=$('.jside .cline');
  if(side&&!$('.jside .zrr'))side.parentNode.insertBefore(rr(['Free, and no obligation']),side);
  $$('form.fgrid').forEach(function(f){
    if($('.zrr',f))return;
    var btn=f.querySelector('button[type="submit"]');
    var host=btn?btn.parentNode:null;
    if(host){var d=rr(set);d.style.gridColumn='1/-1';host.appendChild(d);}
  });
}

/* ── 4 · STICKY PHONE BAR ──────────────────────────────────────── */
function stickyBar(){
  if(PAGE.indexOf('j-')!==0)return;
  var price=txt($('.jside .price'))||txt($('.pval')); if(!price)return;
  var title=txt($('.hero h1')).replace(/\.$/,'');
  var quote=$('.jside .btn-primary'); var href=quote?quote.getAttribute('href'):'contact.html#enquire';
  var bar=el('div','zbar',
    '<div class="zbp"><k>From</k><b>'+price+'</b> <i>per person*</i></div>'+
    '<a class="btn btn-primary zbq" href="'+href+'">Get a free quote</a>'+
    '<a class="zbwa" target="_blank" rel="noopener" aria-label="Ask about this journey on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884Z"/></svg></a>');
  document.body.appendChild(bar);
  document.body.classList.add('zhasbar');
  $('.zbwa',bar).href='https://wa.me/'+WA+'?text='+encodeURIComponent('Hello Zubilant. I am looking at '+title+' ('+price+' per person) on your website. Could you send me a plan and price?');
  $('.zbq',bar).addEventListener('click',function(){track('sticky_cta_click',{journey:title});});
  $('.zbwa',bar).addEventListener('click',function(){track('sticky_whatsapp_click',{journey:title});});
  var seen=false;
  function upd(){
    var hero=$('.hero'), h=hero?hero.offsetHeight:400;
    var deep=window.scrollY>h*0.75;
    /* yield to the phone nav overlay and to any open modal — board 2.3 #26 */
    var blocked=document.body.classList.contains('navopen')||document.body.classList.contains('noscroll')||
                !!$('.qvbd.show')||!!$('.zxbd.show')||!!$('.zdrawbd.show')||
                document.documentElement.classList.contains('navopen');
    /* and to the sticky quote card's own CTA when it is on screen */
    var q=$('.sumstrip .btn')||$('.jside .btn-primary');
    if(q){var r=q.getBoundingClientRect(); if(r.top<window.innerHeight&&r.bottom>0)deep=false;}
    bar.classList.toggle('on',deep&&!blocked);
    if(deep&&!seen){seen=true;track('sticky_bar_shown',{journey:title});}
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  setInterval(upd,600); upd();
}

/* ── 7 · EXIT INTENT ─────────────────────────────────────────── */
function exitIntent(){
  var CFG={
    clientY:10,
    armMs:10000,
    scrollGate:0.25,
    scrollVh:1.5,
    scrollGateMs:20000,
    velocity:15,
    idleMs:30000,
    blurMs:1500,
    dismissDays:7,
    backButton:true
  };
  var SKIP={'contact.html':1,'plan-your-journey.html':1,'offer-terms.html':1};
  if(SKIP[PAGE])return;

  var st=ls(LS.exit,{}), now=Date.now();
  if(st.done)return;
  if(st.until&&now<st.until)return;
  if(ss('zub_exit_seen',false))return;

  var TOUCH=(window.matchMedia&&window.matchMedia('(hover:none)').matches)||('ontouchstart' in window);

  var O=OFFER.on?OFFER:NOOFFER;
  var fired=false, armedAt=now+CFG.armMs, engaged=false;
  var lastY=window.scrollY, lastT=now, lastAct=now, idleTimer=null, blurTimer=null;
  var popped=false;

  function scrolled(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    return h<=40?1:(window.scrollY/h);
  }
  function mark(){
    if(engaged)return;
    if(scrolled()>=CFG.scrollGate||
       window.scrollY>=window.innerHeight*CFG.scrollVh||
       Date.now()-now>=CFG.scrollGateMs)engaged=true;
  }
  function ready(){
    if(Date.now()<armedAt)return false;
    mark();
    return engaged;
  }
  setInterval(mark,1000);
  function busy(){
    return !!($('.qvbd.show')||$('.zdrawbd.show')||$('.zbc-open')||
              document.body.classList.contains('navopen'));
  }
  function fire(how){
    if(fired||busy()||!ready())return;
    fired=true; sset('zub_exit_seen',true);
    if(idleTimer)clearTimeout(idleTimer);
    show(how);
  }

  document.documentElement.addEventListener('mouseleave',function(e){
    if(e.relatedTarget!==null&&typeof e.relatedTarget!=='undefined')return;
    if(e.clientY>CFG.clientY)return;
    fire('mouseleave');
  });

  window.addEventListener('scroll',function(){
    var y=window.scrollY,t=Date.now(),dy=lastY-y,dt=Math.max(1,t-lastT);
    lastAct=t; mark(); resetIdle();
    if(TOUCH&&dy>0&&(dy/dt)*16.7>CFG.velocity&&y<window.innerHeight*2)fire('scrollup');
    lastY=y; lastT=t;
  },{passive:true});

  function resetIdle(){
    if(idleTimer)clearTimeout(idleTimer);
    if(!TOUCH)return;
    idleTimer=setTimeout(function(){
      if(document.visibilityState==='visible')fire('idle');
    },CFG.idleMs);
  }
  ['pointerdown','touchstart','keydown','wheel'].forEach(function(ev){
    document.addEventListener(ev,function(){lastAct=Date.now();resetIdle();},{passive:true});
  });
  resetIdle();

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='hidden'){
      blurTimer=setTimeout(function(){fire('blur');},CFG.blurMs);
    }else if(blurTimer){clearTimeout(blurTimer);blurTimer=null;}
  });

  if(TOUCH&&CFG.backButton&&'pushState' in history){
    setTimeout(function(){
      if(fired||popped)return;
      try{history.pushState({zx:1},'',location.href);popped=true;}catch(e){}
    },CFG.armMs);
    window.addEventListener('popstate',function(e){
      if(!popped)return;
      popped=false;
      if(fired)return;
      fire('back');
      if(!fired)history.back();
    });
  }

  function journeyCtx(){
    if(PAGE.indexOf('j-')===0)return txt($('.hero h1')).replace(/\.$/,'');
    var s=saved(); if(s.length)return s.map(function(x){return x.title;}).slice(0,3).join(', ');
    return '';
  }

  function show(how){
    var bd=el('div','zxbd show');
    var ctx=journeyCtx();
    var terms=O.terms?'<p class="zmicro" style="margin-top:2px"><a href="'+O.terms+'">Offer terms</a> &middot; new travellers only</p>':'';
    bd.innerHTML='<div class="zx" role="dialog" aria-modal="true" aria-labelledby="zxh" tabindex="-1">'+
      '<button class="zxx" type="button" aria-label="Close">&times;</button>'+
      '<div class="zxtop"><div class="zxe">'+O.eyebrow+'</div><h3 id="zxh">'+O.head+'</h3><p>'+O.sub+'</p></div>'+
      '<div class="zxb">'+
        '<form class="zxf" novalidate>'+
          '<input type="text" name="zname" placeholder="Your name" autocomplete="name" aria-label="Your name">'+
          '<input type="tel" name="zphone" placeholder="WhatsApp number" inputmode="tel" autocomplete="tel" aria-label="WhatsApp number" value="+91 ">'+
          '<span class="zxerr">We need a name and a number a person can reply to.</span>'+
          '<button class="btn btn-primary" type="submit">'+O.cta+' <span class="arw" aria-hidden="true">&rarr;</span></button>'+
        '</form>'+
        '<div class="zxfoot"><button class="zno" type="button">No thanks, I am just looking</button>'+terms+'</div>'+
        '<div class="zxtrust"><span>4.9 on Google</span><span>800,000+ travellers</span><span>Designing journeys since 2009</span></div>'+
      '</div></div>';
    document.body.appendChild(bd);
    track('exit_intent_shown',{trigger:how,offer:OFFER.on?OFFER.code:'itinerary',context:ctx});

    var me=ls(LS.me,{});
    if(me.name)$('input[name="zname"]',bd).value=me.name;
    if(me.phone)$('input[name="zphone"]',bd).value=me.phone;

    var opener=document.activeElement;
    var card=$('.zx',bd);
    function tabbables(){
      return $$('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',card)
        .filter(function(n){return !n.disabled&&n.offsetParent!==null;});
    }
    function onKey(e){
      if(e.key==='Escape'){close('escape');return;}
      if(e.key!=='Tab')return;
      var f=tabbables(); if(!f.length)return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
    document.addEventListener('keydown',onKey);
    setTimeout(function(){try{card.focus();}catch(e){}},40);

    function close(reason){
      document.removeEventListener('keydown',onKey);
      bd.remove();
      if(opener&&opener.focus)try{opener.focus();}catch(e){}
      var s=ls(LS.exit,{}); s.until=Date.now()+CFG.dismissDays*24*3600*1000; lset(LS.exit,s);
      track('exit_intent_dismissed',{reason:reason,trigger:how});
    }
    $('.zxx',bd).addEventListener('click',function(){close('close');});
    $('.zno',bd).addEventListener('click',function(){close('no_thanks');});
    bd.addEventListener('click',function(e){if(e.target===bd)close('backdrop');});

    $('form',bd).addEventListener('submit',function(e){
      e.preventDefault();
      var n=$('input[name="zname"]',bd).value.trim();
      var p=$('input[name="zphone"]',bd).value.replace(/[^\d+]/g,'');
      if(n.length<2||p.replace(/\D/g,'').length<10){card.classList.add('err');return;}
      card.classList.remove('err');
      lset(LS.me,{name:n,phone:p});
      var s=ls(LS.exit,{}); s.done=true; lset(LS.exit,s);
      var lines=['Hello Zubilant. I am '+n+'.'];
      if(ctx)lines.push('I am looking at: '+ctx+'.');
      lines.push('Please send me the itinerary and a costed plan.');
      if(OFFER.on)lines.push('Offer code: '+OFFER.code+' (first-booking discount).');
      lines.push('My WhatsApp: '+p);
      var url='https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n'));
      track('exit_intent_converted',{offer:OFFER.on?OFFER.code:'itinerary',context:ctx,trigger:how});
      window.open(url,'_blank','noopener');
      $('.zxb',bd).innerHTML='<h3 style="font-size:23px;letter-spacing:-.01em">Sent. Thank you, '+n.split(' ')[0]+'.</h3>'+
        '<p style="font-size:15px;color:var(--ink700);margin-top:10px">WhatsApp is open in another tab with your details written out. '+
        'Press send there and a person picks it up. If the tab did not open, '+
        '<a href="'+url+'" target="_blank" rel="noopener" style="font-weight:700;color:var(--teal600)">tap here</a>.</p>'+
        '<div class="zxfoot" style="margin-top:18px"><button class="zno" type="button">Close</button></div>';
      $('.zno',bd).addEventListener('click',function(){
        document.removeEventListener('keydown',onKey);
        bd.remove(); if(opener&&opener.focus)try{opener.focus();}catch(e){}
      });
      setTimeout(function(){try{card.focus();}catch(e){}},40);
    });
  }
}

/* ── 8 · FORM ASSIST ───────────────────────────────────────────── */
function formAssist(){
  $$('form.fgrid').forEach(function(f){
    var c=f.querySelector('[name="contact"]');
    if(c){
      c.setAttribute('inputmode','text');
      c.setAttribute('autocomplete','tel');
      if(!c.value&&/phone|whatsapp|number/i.test(c.getAttribute('placeholder')||''))c.value='+91 ';
    }
    var n=f.querySelector('[name="name"]');
    var me=ls(LS.me,{});
    if(n&&!n.value&&me.name)n.value=me.name;
    if(c&&!c.value.replace(/[^\d]/g,'')&&me.phone)c.value=me.phone;
    f.addEventListener('submit',function(){
      var d={};
      if(n&&n.value.trim())d.name=n.value.trim();
      if(c&&c.value.trim())d.phone=c.value.trim();
      if(d.name||d.phone)lset(LS.me,d);
      track('enquiry_submit',{form:PAGE});
    });
  });
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a,button'); if(!a)return;
    var h=a.getAttribute&&a.getAttribute('href')||'';
    if(h.indexOf('wa.me')===0||h.indexOf('https://wa.me')===0)track('whatsapp_click',{where:PAGE});
    else if(h.indexOf('tel:')===0)track('call_click',{where:PAGE});
    else if(h.indexOf('plan-your-journey')===0||a.hasAttribute&&a.hasAttribute('data-open-enquiry'))
      track('enquiry_cta_click',{where:PAGE,label:txt(a).slice(0,40)});
  },true);
}

/* ── 9 · WHATSAPP CONTEXT ────────────────────────────────────── */
function waMessage(){
  if(PAGE.indexOf('j-')===0){
    var t=txt($('.hero h1')).replace(/\.$/,'');
    if(t)return 'Hello Zubilant. I am looking at '+t+' on your website. Can we talk?';
  }
  var MAP={
    'family-holidays.html':'Hello Zubilant. I am planning a family holiday. Can we talk?',
    'spiritual-journeys.html':'Hello Zubilant. I am planning a spiritual journey. Can we talk?',
    'senior-travel-saathi.html':'Hello Zubilant. I am planning a journey for my parents. Can we talk?',
    'inbound-india.html':'Hello Zubilant. I am planning a trip to India. Can we talk?',
    'corporate.html':'Hello Zubilant. I am planning a trip for my team. Can we talk?',
    'educational-expeditions.html':'Hello Zubilant. I am planning an educational expedition. Can we talk?',
    'safety-and-logistics.html':'Hello Zubilant. I am planning an educational expedition. Can we talk?'
  };
  return MAP[PAGE]||'Hello Zubilant. Can we talk about a journey?';
}
function waContext(){
  var enc='https://wa.me/'+WA+'?text='+encodeURIComponent(waMessage());
  function fix(a){
    var h=a.getAttribute('href')||'';
    if(h.indexOf('wa.me/'+WA)<0||h.indexOf('text=')>-1)return;
    a.setAttribute('href',enc);
    if(!a.getAttribute('target')){a.setAttribute('target','_blank');a.setAttribute('rel','noopener');}
  }
  $$('a[href*="wa.me/"]').forEach(fix);
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="wa.me/"]');
    if(a)fix(a);
  },true);
}

/* ── boot ──────────────────────────────────────────────────────── */
function init(){
  try{recordView();}catch(e){}
  try{injectNavPill();}catch(e){}
  try{injectSaves();}catch(e){}
  try{renderRecent();}catch(e){}
  try{applySeason();}catch(e){}
  try{applyRR();}catch(e){}
  try{stickyBar();}catch(e){}
  try{waContext();}catch(e){}
  try{formAssist();}catch(e){}
  try{exitIntent();}catch(e){}
  var grid=$('.jgrid')||$('#jgrid');
  if(grid&&'MutationObserver' in window){
    var mo=new MutationObserver(function(){injectSaves(grid);applySeason();});
    mo.observe(grid,{childList:true});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
