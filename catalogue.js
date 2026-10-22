/* Raised-center product carousel; native links remain usable without JavaScript. */
(() => {
 const root=document.querySelector('.seal-carousel'); if(!root)return;
 const viewport=root.querySelector('.seal-viewport');
 const cards=[...root.querySelectorAll('.seal-card')], controls=root.querySelector('.seal-controls');
 const play=root.querySelector('[data-carousel-play]'), quote=root.querySelector('.seal-quote');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=2, playing=!reduced.matches, visible=false, timer, frame, touching=false;
 root.classList.add('is-enhanced'); controls.hidden=false;
 function render(){
  cards.forEach((card,i)=>{card.classList.toggle('is-active',i===active);if(i===active)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');});
  const card=cards[active];
  root.querySelector('.seal-position').textContent=String(active+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
  quote.dataset.quoteProduct=card.dataset.cardProduct;
  root.querySelector('.seal-selected-name').textContent=card.dataset.cardProduct;
  quote.setAttribute('aria-label','Get a quote for '+card.dataset.cardProduct);
  play.textContent=playing?'Pause':'Play';
  play.setAttribute('aria-label',playing?'Pause product auto-scroll':'Start product auto-scroll');
 }
 function schedule(){
  clearTimeout(timer);
  if(playing&&visible&&!document.hidden&&(!root.contains(document.activeElement)||controls.contains(document.activeElement))&&!touching)
   timer=setTimeout(()=>go(active+1),4000);
 }
 function go(index){
  active=(index+cards.length)%cards.length;render();
  const card=cards[active];
  viewport.scrollTo({left:card.offsetLeft-(viewport.clientWidth-card.offsetWidth)/2,behavior:reduced.matches?'instant':'smooth'});
  schedule();
 }
 root.querySelector('[data-carousel-prev]').addEventListener('click',()=>go(active-1));
 root.querySelector('[data-carousel-next]').addEventListener('click',()=>go(active+1));
 play.addEventListener('click',()=>{playing=!playing;render();schedule();});
 viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(active+(e.key==='ArrowRight'?1:-1));}});
 viewport.addEventListener('scroll',()=>{
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const center=viewport.scrollLeft+viewport.clientWidth/2;
   let nearest=0;cards.forEach((card,i)=>{if(Math.abs(card.offsetLeft+card.offsetWidth/2-center)<Math.abs(cards[nearest].offsetLeft+cards[nearest].offsetWidth/2-center))nearest=i;});
   if(nearest!==active){active=nearest;render();}schedule();
  });
 },{passive:true});
 viewport.addEventListener('pointerdown',()=>{touching=true;clearTimeout(timer);});
 window.addEventListener('pointerup',()=>{if(touching){touching=false;schedule();}});
 window.addEventListener('pointercancel',()=>{touching=false;schedule();});
 root.addEventListener('focusin',schedule);
 root.addEventListener('focusout',()=>setTimeout(schedule,0));
 document.addEventListener('visibilitychange',schedule);
 reduced.addEventListener('change',()=>{playing=!reduced.matches;render();schedule();});
 if('IntersectionObserver' in window){
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)root.classList.add('has-entered');schedule();},{threshold:.2}).observe(viewport);
 }else{visible=true;root.classList.add('has-entered');}
 function align(){const card=cards[active];viewport.scrollTo({left:card.offsetLeft-(viewport.clientWidth-card.offsetWidth)/2,behavior:'instant'});}
 if('ResizeObserver' in window)new ResizeObserver(align).observe(viewport);
 align();
 root.querySelector('a[href="#range-comparison"]').addEventListener('click',()=>{document.querySelector('#range-comparison').open=true;});
 render();schedule();
})();
