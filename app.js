(function(){
  var q=document.getElementById('q'), free=document.getElementById('freeonly');
  var chips=[].slice.call(document.querySelectorAll('.chip'));
  var active='all';
  /* TODAY: events that have ended (data-end = end, or start + 2h) move into the gray "Ended earlier today" block */
  var blk=document.getElementById('ended'), endedUl=blk&&blk.querySelector('ul'), todayUl=document.getElementById('todaylist');
  var hd=blk&&blk.querySelector('.endedhd'), act=blk&&blk.querySelector('.endedact'), cnt=blk&&blk.querySelector('.endedn');
  function setOpen(open){
    if(!blk) return;
    blk.classList.toggle('collapsed',!open); hd.setAttribute('aria-expanded',open?'true':'false');
    act.textContent=open?'Hide':'Show';
  }
  if(blk){
    hd.addEventListener('click',function(ev){ev.stopPropagation(); setOpen(blk.classList.contains('collapsed'));});
    blk.addEventListener('click',function(ev){ if(blk.classList.contains('collapsed')){ev.preventDefault(); setOpen(true);} });
  }
  function place(now){
    if(!blk||!todayUl) return;
    var items=[].slice.call(document.querySelectorAll('#today li.ev'));
    items.sort(function(a,b){return a.dataset.i-b.dataset.i;});
    var ended=[], live=[];
    items.forEach(function(li){ (Date.parse(li.dataset.end)<=now?ended:live).push(li); });
    ended.sort(function(a,b){return (Date.parse(a.dataset.start)-Date.parse(b.dataset.start))||(a.dataset.i-b.dataset.i);});
    ended.forEach(function(li){ endedUl.appendChild(li); });
    live.forEach(function(li){ todayUl.appendChild(li); });
  }
  function apply(){
    var term=(q.value||'').toLowerCase().trim(), now=Date.now();
    place(now);
    [].forEach.call(document.querySelectorAll('li.ev'),function(li){
      var ok=true;
      if(free.checked && li.dataset.free!=='1') ok=false;
      if(active!=='all' && li.dataset.cat!==active) ok=false;
      if(term && li.dataset.text.indexOf(term)<0) ok=false;
      /* outside Today, ended events are hidden (upcoming page only; past-page items have no data-end) */
      if(li.dataset.end && !li.closest('#today') && Date.parse(li.dataset.end)<now) ok=false;
      li.classList.toggle('hidden',!ok);
    });
    if(blk){
      var n=endedUl.querySelectorAll('li.ev:not(.hidden)').length;
      cnt.textContent=n; blk.classList.toggle('hidden',n===0);
    }
    [].forEach.call(document.querySelectorAll('.daygroup'),function(g){
      var vis=g.querySelectorAll('li.ev:not(.hidden)').length;
      g.classList.toggle('hidden',!vis);
      var dn=g.querySelector('.dayn'); if(dn) dn.textContent=vis;
      if(g.classList.contains('fold')) g.classList.toggle('searchopen',!!term && vis>0);
    });
    var tn=document.querySelector('#today h2 .dayn');
    var tv=document.querySelectorAll('#today li.ev:not(.hidden)').length;
    if(tn) tn.textContent=tv;
    var ts=document.getElementById('today'); if(ts) ts.classList.toggle('searchopen',!!term && tv>0);
    [].forEach.call(document.querySelectorAll('section.sec'),function(s){
      var any=!!s.querySelector('li.ev:not(.hidden)');
      var e=s.querySelector('.empty'); if(e) e.classList.toggle('hidden',any);
    });
  }
  chips.forEach(function(c){c.addEventListener('click',function(){
    active=c.dataset.cat; chips.forEach(function(x){x.classList.toggle('on',x===c);}); apply();
  });});
  [].forEach.call(document.querySelectorAll('.daygroup.fold > h3.day'),function(h){
    function tog(){ var g=h.parentNode; if(g.classList.contains('searchopen')) return;
      var f=g.classList.toggle('folded'); h.setAttribute('aria-expanded',f?'false':'true'); }
    h.addEventListener('click',tog);
    h.addEventListener('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ev.preventDefault(); tog();} });
  });
  var th=document.querySelector('#today h2.todayhd');
  if(th){
    var ttog=function(){ var s=document.getElementById('today'); if(s.classList.contains('searchopen')) return;
      var f=s.classList.toggle('folded'); th.setAttribute('aria-expanded',f?'false':'true'); };
    th.addEventListener('click',ttog);
    th.addEventListener('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ev.preventDefault(); ttog();} });
  }
  q.addEventListener('input',apply); free.addEventListener('change',apply);
  setOpen(false);
  apply();
  setInterval(apply,60000);   /* re-evaluate every minute so items move into the block as they end */
})();
