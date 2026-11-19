/* Design preview: native navigation and local form review. No lead transmission. */
(() => {
 'use strict';
 const menu=document.querySelector('.menu-button'),nav=document.querySelector('#site-nav');
 if(menu&&nav){
  menu.hidden=false;document.documentElement.classList.add('js');
  function close(){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){close();menu.focus();}});
 }
 const form=document.querySelector('#quote-form'),dialog=document.querySelector('#quote-dialog');
 if(!form||!dialog)return;
 const selected=new URLSearchParams(location.search).get('product');
 const select=form.elements.product;
 if([...select.options].some(o=>o.value===selected))select.value=selected;
 // Keep the preview from sending any form data even on browsers without dialog support.
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const summary=document.querySelector('#enquiry-summary');summary.replaceChildren();
  const data=new FormData(form);
  for(const [label,key] of [['Name','name'],['Company','company'],['Product','product'],['Quantity','quantity'],['City','city']]){
   const value=data.get(key);if(!value)continue;
   const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;summary.append(dt,dd);
  }
  if(typeof dialog.showModal==='function')dialog.showModal();
  else document.querySelector('#form-status').textContent='Preview complete. Nothing has been sent or saved. Please call or email for an enquiry.';
 });
 for(const button of dialog.querySelectorAll('button'))button.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 // Enable fields only after the preview handler is attached. No-JS mode cannot submit personal data.
 form.querySelector('.preview-fields').disabled=false;
})();
