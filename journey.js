/* Scene rendering: one frame per scroll/resize; no motion while scroll is idle. */
(() => {
 'use strict';
 const story=document.querySelector('#journey');
 const sticky=story.querySelector('.story-sticky');
 const art=document.querySelector('#story-scene');
 const mobile=matchMedia('(max-width:700px)');
 const still=matchMedia('(prefers-reduced-motion:reduce)');
 const short=matchMedia('(max-height:560px)');
 const buttons=[...document.querySelectorAll('[data-story-progress]')];
 const hero=document.querySelector('#hero-copy'),copy=document.querySelector('#chapter-copy');
 let svg=null,parts={},pending=false,manual=0,lastChapter='';
 const trans=(id,value)=>parts[id]?.setAttribute('transform',value);
 const opacity=(id,value)=>parts[id]?.setAttribute('opacity',String(value));
 function render() {
  pending=false;
  const bounds=story.getBoundingClientRect();
  const progress=still.matches||short.matches?manual:SealStory.clamp(-bounds.top/Math.max(1,story.offsetHeight-sticky.offsetHeight));
  // Mobile uses fewer controlled states within a shorter vertical storyboard.
  const mobileStates=[0,.10,.23,.30,.38,.405,.44,.48,.56,.65,.69,.75,.79,.825,.87,.92,.98];
  const p=mobile.matches && !still.matches && !short.matches && progress>.055
   ? mobileStates[Math.min(mobileStates.length-1,Math.floor(progress*(mobileStates.length-1))+1)] : progress;
  const s=SealStory.sample(p);
  hero.hidden=s.hero===0;hero.style.opacity=s.hero;hero.style.transform='translateY('+(-24*(1-s.hero))+'px)';
  // Hidden links cannot remain in the keyboard focus order.
  copy.hidden=s.hero>.01;
  document.querySelector('#seal-inset').hidden=!s.inset;
  if(lastChapter!==s.chapter.label){
   lastChapter=s.chapter.label;
   document.querySelector('#chapter-label').textContent=s.chapter.label;
   document.querySelector('#chapter-title').textContent=s.chapter.title;
   document.querySelector('#chapter-description').textContent=s.chapter.description;
   document.querySelector('#chapter-detail').textContent=s.chapter.detail;
  }
  document.querySelector('#scene-status').textContent=s.p>=.24?'SEAL 000043 / '+(s.p>=.95?'DESTINATION CHECK':'APPLIED'):s.chapter.detail;
  document.querySelector('#story-progress').style.transform='scaleX('+progress+')';
  const active=s.p<.065?-1:s.p<.32?0:s.p<.49?1:s.p<.60?2:s.p<.715?3:s.p<.95?4:5;
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
  if(!svg)return;
  // Fit mobile scenes instead of cropping a portrait viewport into the far right.
  if (mobile.matches) {
   const t=s.destination;
   const start=[380,95,980,680],end=[580,300,700,340];
   svg.setAttribute('viewBox',start.map((v,i)=>v+(end[i]-v)*t).join(' '));
   svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  } else {
   svg.setAttribute('viewBox','0 0 1400 800');
   svg.setAttribute('preserveAspectRatio','xMidYMid slice');
  }
  trans('camera','translate(900 490) scale('+s.camera+') translate(-900 -490)');
  trans('primary-container','translate('+s.x+' '+s.y+') scale('+s.scale+')');
  trans('door-left','scale('+(.5+.5*s.doors)+' 1)');
  trans('door-right','translate(120 0) scale('+(.5+.5*s.doors)+' 1) translate(-120 0)');
  trans('locking-handle','rotate('+(-65*(1-s.handle))+' 86 90)');
  trans('seal-pin','translate(0 '+(-42*(1-s.pin))+')');
  trans('seal-barrel','translate(0 '+(32*(1-s.barrel))+')');
  opacity('seal-pin',s.sealVisible);opacity('seal-barrel',s.sealVisible);opacity('seal-ring',s.inspection*.8);
  opacity('yard',s.yard);trans('yard','translate('+s.yardX+' 0)');
  trans('distant','translate('+(s.yardX*.22)+' 0)');opacity('distant',1-s.departure);
  opacity('ground',s.ground);opacity('road',s.ground);trans('road','translate('+s.roadX+' 0)');
  opacity('foreground',s.foreground);trans('foreground','translate('+(s.roadX*.35)+' 0)');
  opacity('terminal',s.port);opacity('ocean',s.ocean);trans('water-lines','translate('+s.waterX+' 0)');
  opacity('vessel',s.ship);trans('vessel','translate('+s.shipX+' '+s.shipY+') scale(1.05)');
  opacity('truck',s.truckVisible);trans('truck','translate('+s.truckX+' '+s.truckY+') scale('+s.truckScale+')');
  for(let i=0;i<3;i++)trans('wheel-'+i,'rotate('+s.wheelAngle+')');
  opacity('crane',s.crane);
  trans('spreader','translate('+s.spreaderX+' '+s.spreaderY+') scale('+s.spreaderScale+')');
  const cableA=s.spreaderX+30*s.scale,cableB=s.spreaderX+390*s.scale;
  parts.cables?.setAttribute('d','M'+cableA+' 120V'+s.spreaderY+'M'+cableB+' 120V'+s.spreaderY);
  parts.trolley?.setAttribute('x',String((cableA+cableB)/2-62));
  opacity('inspection',s.inspection);
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(render);}}
 function connect(){
  try{svg=art.contentDocument?.documentElement;if(!svg||svg.tagName.toLowerCase()!=='svg'){svg=null;return;}
   svg.querySelectorAll('[id]').forEach(el=>{parts[el.id]=el;});schedule();
  }catch{svg=null;}
 }
 art.addEventListener('load',connect);connect();
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 [mobile,still,short].forEach(query=>query.addEventListener('change',schedule));
 buttons.forEach(button=>button.addEventListener('click',()=>{
  manual=Number(button.dataset.storyProgress);
  if ((still.matches||short.matches) && manual===.14) manual=.26;
  if(still.matches||short.matches){render();return;}
  const top=story.getBoundingClientRect().top+scrollY;
  scrollTo({top:top+(story.offsetHeight-sticky.offsetHeight)*manual,behavior:'instant'});
  schedule();
 }));
 const follow=document.querySelector('.follow-story');
 follow.addEventListener('click',event=>{event.preventDefault();buttons[0].click();buttons[0].focus({preventScroll:true});});
 schedule();
})();
