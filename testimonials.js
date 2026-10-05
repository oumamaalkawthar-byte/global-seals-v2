/* Native scroll-snap with accessible manual navigation; all reviews stay in HTML. */
(() => {
 const section=document.querySelector('#testimonials');if(!section)return;
 const track=section.querySelector('#perspectives-track');
 const cards=[...section.querySelectorAll('.perspective-card')];
 const buttons=[...section.querySelectorAll('[data-perspective]')];
 const prev=section.querySelector('#perspective-prev'),next=section.querySelector('#perspective-next');
 const position=section.querySelector('#perspective-position');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const desktop=matchMedia('(min-width:1100px)');
 let active=-1,queued=false;
 const offset=card=>card.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;
 function update(){
  queued=false;const max=Math.max(0,track.scrollWidth-track.clientWidth);
  const target=track.scrollLeft;let index=0,distance=Infinity;
  cards.forEach((card,i)=>{const d=Math.abs(Math.min(max,offset(card))-target);if(d<distance){distance=d;index=i;}});
  if(target>=max-2 && max>0)index=cards.length-1;
  prev.disabled=target<=2;next.disabled=target>=max-2;
  track.tabIndex=desktop.matches?-1:0;
  if(index===active)return;active=index;
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  position.textContent='0'+(index+1)+' / 0'+cards.length;
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
 function go(index){const n=Math.max(0,Math.min(cards.length-1,index));track.scrollTo({left:Math.min(track.scrollWidth-track.clientWidth,offset(cards[n])),behavior:reduced.matches?'instant':'smooth'});}
 // Step by real scroll position: when two cards fit (tablet), active+-1 can resolve to the current position and not move.
 function previous(){const max=Math.max(0,track.scrollWidth-track.clientWidth);const before=cards.map((card,i)=>({i,x:Math.min(max,offset(card))})).filter(p=>p.x<track.scrollLeft-2);go(before.length?before[before.length-1].i:0);}
 function following(){const i=cards.findIndex(card=>offset(card)>track.scrollLeft+2);go(i<0?cards.length-1:i);}
 prev.addEventListener('click',previous);next.addEventListener('click',following);
 buttons.forEach((button,i)=>button.addEventListener('click',()=>go(i)));
 track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'){event.preventDefault();following();}else if(event.key==='ArrowLeft'){event.preventDefault();previous();}else if(event.key==='Home'){event.preventDefault();go(0);}else if(event.key==='End'){event.preventDefault();go(cards.length-1);}});
 track.addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});desktop.addEventListener('change',schedule);
 section.querySelector('.perspectives-controls').hidden=false;update();
})();
