/* LITERASA — bantuan gerak & interaksi bersama (tanpa pustaka luar) */
(function(){
'use strict';
var RM=false;try{RM=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){}
var L=window.Lit={RM:RM};

/* latar aurora */
(function(){var b=document.body;if(!b||b.getAttribute('data-aurora')==='off'||document.querySelector('.aurora'))return;
  var a=document.createElement('div');a.className='aurora';a.setAttribute('aria-hidden','true');a.innerHTML='<i></i><i></i><i></i>';b.insertBefore(a,b.firstChild)})();

/* riak sentuh pada tombol */
document.addEventListener('pointerdown',function(e){
  var b=e.target.closest&&e.target.closest('.btn,.rp,button.b');if(!b||RM||b.disabled)return;
  var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,i=document.createElement('span');
  i.className='rip';i.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(e.clientX-r.left-s/2)+'px;top:'+(e.clientY-r.top-s/2)+'px';
  b.appendChild(i);setTimeout(function(){i.remove()},700)});

/* kartu miring mengikuti kursor (hanya mouse) */
document.addEventListener('pointermove',function(e){
  if(RM||e.pointerType!=='mouse')return;
  var t=e.target.closest&&e.target.closest('[data-tilt]');
  if(L._t&&L._t!==t){L._t.style.transform='';L._t=null}
  if(!t)return;L._t=t;var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  t.style.transform='perspective(800px) rotateX('+(-y*7).toFixed(2)+'deg) rotateY('+(x*9).toFixed(2)+'deg) translateY(-4px)'});
document.addEventListener('pointerleave',function(){if(L._t){L._t.style.transform='';L._t=null}},true);

/* parallax lembut: elemen [data-depth] di dalam [data-parallax] */
var ph=null;
if(!RM)document.addEventListener('pointermove',function(e){
  if(e.pointerType!=='mouse'||ph)return;
  ph=requestAnimationFrame(function(){ph=null;
    var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    document.querySelectorAll('[data-depth]').forEach(function(el){var d=parseFloat(el.getAttribute('data-depth'))||1;
      el.style.transform='translate3d('+(x*d*26).toFixed(1)+'px,'+(y*d*20).toFixed(1)+'px,0)'})})});

/* muncul bertahap saat digulir */
L.reveal=function(root,sel){
  if(RM||!('IntersectionObserver' in window))return;
  root=root||document;sel=sel||'.card,.q,details,.nd,.t,.m,.bd,.hero-card';
  if(!L._io)L._io=new IntersectionObserver(function(es){var k=0;
    es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target,d=(k++)*70;L._io.unobserve(t);
      t.style.transitionDelay=d+'ms';t.classList.add('rv-in');
      setTimeout(function(){t.classList.remove('rv','rv-in');t.style.transitionDelay=''},d+900)})},
    {threshold:0,rootMargin:'0px 0px -2% 0px'});
  root.querySelectorAll(sel).forEach(function(el){if(el._rv)return;el._rv=1;el.classList.add('rv');L._io.observe(el)})};

/* ledakan emoji dari sebuah elemen / titik */
L.burst=function(src,n,set){
  if(RM||!document.body.animate)return;
  var r=src.getBoundingClientRect?src.getBoundingClientRect():{left:src.x,top:src.y,width:0,height:0};
  var cx=r.left+r.width/2,cy=r.top+r.height/2;set=set||['✨','⭐','🎉','💫'];n=n||10;
  for(var i=0;i<n;i++){(function(i){
    var s=document.createElement('span');s.textContent=set[i%set.length];
    s.style.cssText='position:fixed;left:'+cx+'px;top:'+cy+'px;z-index:400;pointer-events:none;margin:-10px 0 0 -10px;font-size:'+(14+Math.random()*14)+'px';
    document.body.appendChild(s);
    var a=Math.random()*Math.PI*2,d=50+Math.random()*80;
    s.animate([{transform:'translate(0,0) scale(.3)',opacity:1},
      {transform:'translate('+Math.cos(a)*d+'px,'+(Math.sin(a)*d-30)+'px) scale(1.2) rotate('+(Math.random()*180-90)+'deg)',opacity:1,offset:.6},
      {transform:'translate('+Math.cos(a)*d*1.25+'px,'+(Math.sin(a)*d+34)+'px) scale(.6)',opacity:0}],
      {duration:800+Math.random()*500,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=function(){s.remove()}})(i)}};

/* hujan konfeti emoji layar penuh */
L.confetti=function(n,set){
  if(RM)return;set=set||['🎉','⭐','💌','✨','🏅','🎈'];n=n||28;
  for(var i=0;i<n;i++){var e=document.createElement('span');e.className='cf';e.textContent=set[i%set.length];
    e.style.left=Math.random()*100+'vw';e.style.fontSize=(1.2+Math.random()*1.2)+'rem';
    e.style.setProperty('--dx',(Math.random()*160-80)+'px');e.style.animationDelay=(Math.random()*.7)+'s';
    document.body.appendChild(e);(function(e){setTimeout(function(){e.remove()},3200)})(e)}};

/* angka menghitung naik */
L.count=function(el,to,ms,fmt){
  if(!el)return;fmt=fmt||String;
  if(RM||!to){el.textContent=fmt(to);return}
  var t0=performance.now();ms=ms||800;
  (function f(t){var k=Math.min(1,(t-t0)/ms);el.textContent=fmt(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)})(t0)};
})();
