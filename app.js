(function(){
  var q=document.getElementById('q'), free=document.getElementById('freeonly');
  var chips=[].slice.call(document.querySelectorAll('.chip'));
  var active='all';
  function apply(){
    var term=(q.value||'').toLowerCase().trim(), now=Date.now();
    [].forEach.call(document.querySelectorAll('li.ev'),function(li){
      var ok=true;
      if(free.checked && li.dataset.free!=='1') ok=false;
      if(active!=='all' && li.dataset.cat!==active) ok=false;
      if(term && li.dataset.text.indexOf(term)<0) ok=false;
      if(li.dataset.end && Date.parse(li.dataset.end)<now) ok=false; /* hide events that ended since the last build */
      li.classList.toggle('hidden',!ok);
    });
    [].forEach.call(document.querySelectorAll('.daygroup'),function(g){
      g.classList.toggle('hidden',!g.querySelector('li.ev:not(.hidden)'));
    });
    [].forEach.call(document.querySelectorAll('section.sec'),function(s){
      var any=!!s.querySelector('li.ev:not(.hidden)');
      var e=s.querySelector('.empty'); if(e) e.classList.toggle('hidden',any);
    });
  }
  chips.forEach(function(c){c.addEventListener('click',function(){
    active=c.dataset.cat; chips.forEach(function(x){x.classList.toggle('on',x===c);}); apply();
  });});
  q.addEventListener('input',apply); free.addEventListener('change',apply);
  apply();
})();
