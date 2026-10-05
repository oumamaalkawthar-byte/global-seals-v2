/* Accessible progressive enhancement. Product copy and links remain in HTML. */
(() => {
 'use strict';
 const root=document.querySelector('#product');if(!root)return;
 const tabs=[...root.querySelectorAll('[data-product-tab]')];
 const panels=[...root.querySelectorAll('[data-product-panel]')];
 const selector=root.querySelector('.range-selector');
 const status=root.querySelector('#range-status');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const pointer=matchMedia('(hover:hover) and (pointer:fine)');
 let active=0;
 selector.setAttribute('role','tablist');
 tabs.forEach((tab,i)=>{
  tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[i].id);
  panels[i].setAttribute('role','tabpanel');panels[i].setAttribute('aria-labelledby',tab.id);panels[i].tabIndex=0;
 });
 root.classList.add('range-enhanced');
 function select(index,{focus=false,updateURL=false,announce=true}={}){
  if(index<0||index>=panels.length)return;
  active=index;
  panels.forEach((panel,i)=>{panel.hidden=i!==index;});
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  if(focus)tabs[index].focus({preventScroll:true});
  if(updateURL)history.replaceState(null,'','#'+panels[index].id);
  if(announce)status.textContent=tabs[index].querySelector('strong').textContent+' selected.';
 }
 function selectHash(){const i=panels.findIndex(panel=>'#'+panel.id===location.hash);if(i>=0)select(i,{announce:false});}
 select(0,{announce:false});selectHash();
 addEventListener('hashchange',selectHash);
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',event=>{event.preventDefault();select(i,{updateURL:true});});
  tab.addEventListener('keydown',event=>{
   let target=i;
   if(event.key==='ArrowRight')target=(i+1)%tabs.length;
   else if(event.key==='ArrowLeft')target=(i+tabs.length-1)%tabs.length;
   else if(event.key==='Home')target=0;
   else if(event.key==='End')target=tabs.length-1;
   else if(event.key===' '){event.preventDefault();select(i);return;}
   else return;
   event.preventDefault();select(target,{focus:true});
  });
 });
 root.querySelectorAll('[data-select-product]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();select(Number(link.dataset.selectProduct),{updateURL:true});
  panels[active].focus({preventScroll:true});panels[active].scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
 }));
 root.querySelector('.range-compare-link').addEventListener('click',()=>{root.querySelector('#range-comparison').open=true;});
 const dialog=root.querySelector('#product-viewer');
 const viewerImage=root.querySelector('#viewer-image');
 const viewerTitle=root.querySelector('#viewer-title');
 let opener=null;
 if(typeof dialog.showModal==='function')root.querySelectorAll('[data-zoom]').forEach(button=>{
  button.hidden=false;
  button.addEventListener('click',()=>{
   const index=Number(button.dataset.zoom),image=panels[index].querySelector('.studio-product');
   opener=button;viewerImage.src=image.getAttribute('src');viewerImage.alt=image.alt;
   viewerTitle.textContent=tabs[index].querySelector('strong').textContent;
   dialog.showModal();
  });
 });
 root.querySelector('#viewer-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{opener?.focus({preventScroll:true});});
 // Restrained perspective, only for fine pointers; never a simulated 360-degree model.
 panels.forEach(panel=>{
  const stage=panel.querySelector('.studio-stage'),image=panel.querySelector('.studio-product');
  const reset=()=>{image.style.removeProperty('--tilt-x');image.style.removeProperty('--tilt-y');};
  stage.addEventListener('pointermove',event=>{
   if(reduced.matches||!pointer.matches)return;
   const r=stage.getBoundingClientRect();
   image.style.setProperty('--tilt-x',((.5-(event.clientY-r.top)/r.height)*6).toFixed(2)+'deg');
   image.style.setProperty('--tilt-y',(((event.clientX-r.left)/r.width-.5)*10).toFixed(2)+'deg');
  },{passive:true});
  stage.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);pointer.addEventListener('change',reset);
 });
})();
