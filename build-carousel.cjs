const fs = require('fs');
const vm = require('vm');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('products.js','utf8'), context);
const products = context.window.globalSealProducts;
let html=fs.readFileSync('index.html','utf8');
const cards=products.map((p,i)=>`<a class="seal-card" href="${p.source}" style="--card-accent:${p.color}" data-card-product="${p.name}" aria-label="Explore ${p.name}"><span class="seal-card-label">${p.label}</span><img src="${p.image}" width="620" height="620" loading="lazy" alt="${p.name} product illustration"><span class="seal-card-caption"><span><strong>${p.name}</strong><small>${p.title}</small></span><span class="seal-card-arrow" aria-hidden="true">&#8599;</span></span></a>`).join('\n');
const carousel=`<div class="seal-carousel" role="region" aria-roledescription="carousel" aria-label="Security seal products"><div class="seal-viewport" tabindex="0" aria-label="Product cards. Use left and right arrow keys to browse."><div class="seal-track">${cards}</div></div><div class="seal-controls" hidden><button type="button" data-carousel-prev aria-label="Previous product">&#8592;</button><span class="seal-position" aria-live="off">01 / 06</span><button type="button" data-carousel-next aria-label="Next product">&#8594;</button><button type="button" data-carousel-play aria-label="Pause product auto-scroll">Pause</button></div><p class="seal-selection">EXPLORE THE RANGE <span aria-hidden="true">/</span> <strong class="seal-selected-name">Lead Seal</strong></p><div class="seal-cta"><a class="button seal-quote" href="#contact" data-quote-product="Container Seal">Get a Quote <span aria-hidden="true">&#8599;</span></a><a class="text-link" href="#range-comparison">Compare all products &#8595;</a></div><p class="seal-art-note">Product illustrations. Supplied models may vary.</p></div>`;
html=html.replace(/<nav class="range-selector"[\s\S]*?<p class="sr-only" id="range-status"[^>]*>[\s\S]*?<\/p>/,carousel);
html=html.replace(/<dialog id="product-viewer"[\s\S]*?<\/dialog>/,'');
products.forEach((p,i)=>{html=html.replace(new RegExp('href="#seal-[^"]+" data-select-product="'+i+'"','g'),'href="'+p.source+'"');});
const ids=['container','plastic','lead','meter','roto','wire'];
ids.forEach((id,i)=>{html=html.replaceAll('href="#seal-'+id+'"','href="'+products[i].source+'"');});
html=html.replace('Small components.<br><span>Considered specifications.</span>','Find your seal.<br><span>Secure what matters.</span>');
html=html.replace('catalogue.css?v=showroom-2','catalogue.css?v=carousel-2').replace('catalogue.js?v=showroom-3','catalogue.js?v=carousel-2');
fs.writeFileSync('index.html',html.replace(/^[ \t]+$/gm,''));

