/* Rebuild the static, crawlable catalogue from the preserved source data. Run: node build-catalogue.cjs */
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=__dirname;const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'products.js'),'utf8'),ctx);
const products=ctx.window.globalSealProducts;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const descriptions=['Freight containers','Flexible closures','Wire & crimp','Meter access','Rotating wire lock','Compatible closures'];
const forms=['Bolt + barrel','Pull-tight seal','Crimped wire seal','Single-use closure','One-way rotating lock','Sealing wire'];
const ids=['container','plastic','lead','meter','roto','wire'];
const tabs=products.map((p,i)=>`<a class="range-tab" id="tab-${ids[i]}" href="#seal-${ids[i]}" data-product-tab="${i}"><span class="range-tab-index">0${i+1}</span><img src="${p.image}" width="96" height="96" loading="lazy" alt=""><span class="range-tab-copy"><strong>${esc(p.name)}</strong><small>${descriptions[i]}</small></span><span class="range-tab-arrow" aria-hidden="true">&#8599;</span></a>`).join('\n');
const panels=products.map((p,i)=>`<article id="seal-${ids[i]}" class="range-panel" data-product-panel="${i}" aria-labelledby="name-${ids[i]}">
 <div class="product-studio" style="--product-accent:${p.color}">
  <div class="studio-top"><span>0${i+1} / PRODUCT STUDY</span><span>GLOBAL SEALS</span></div>
  <div class="studio-stage"><div class="studio-orbit" aria-hidden="true"></div><div class="studio-plinth" aria-hidden="true"></div><img class="studio-product" src="${p.image}" width="620" height="620" loading="lazy" alt="${esc(p.name)} &mdash; ${esc(p.label.toLowerCase())} product illustration"></div>
  <button class="studio-zoom" type="button" data-zoom="${i}" aria-label="Enlarge ${esc(p.name)} illustration" hidden><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M10 7v6m-3-3h6"/></svg>Inspect product</button>
  <div class="studio-bottom"><span>${esc(p.label)}</span><small>Illustration &mdash; supplied model may vary</small></div>
 </div>
 <div class="product-specification"><p class="eyebrow">SECURITY SEAL RANGE / 0${i+1}</p><h3 id="name-${ids[i]}">${i===0?'Container Bolt Seal':esc(p.name)}</h3><p class="product-lead">${esc(p.title)}</p><span class="application-tag">${descriptions[i]}</span>
 <dl class="specification-list"><div><dt>Application</dt><dd>${esc(p.usage)}</dd></div><div><dt>Key features</dt><dd>${esc(p.features)}</dd></div><div><dt>Construction &amp; selection</dt><dd>${esc(p.quality)}</dd></div></dl>
 <div class="product-actions"><a class="button" href="#contact" data-quote-product="${esc(p.name)}">Request a quote <span aria-hidden="true">&#8599;</span></a><a class="text-link" href="https://globalseals.pk/${p.source}">${esc(p.name)} details <span aria-hidden="true">&#8599;</span></a></div>
 <p class="procurement-note">Share your application, quantity and marking requirements. We will help confirm the suitable specification.</p></div>
</article>`).join('\n');
const rows=products.map((p,i)=>`<tr><th scope="row"><a href="#seal-${ids[i]}" data-select-product="${i}">${esc(p.name)} &#8599;</a></th><td>${descriptions[i]}</td><td>${forms[i]}</td><td><a href="#contact" data-quote-product="${esc(p.name)}">Enquire<span class="sr-only"> about ${esc(p.name)}</span> &#8599;</a></td></tr>`).join('');
const section=`<section id="product" class="product-range section-shell" aria-labelledby="range-heading">
 <div class="range-heading"><div><p class="eyebrow">THE GLOBAL SEALS PRODUCT RANGE</p><h2 id="range-heading">Small components.<br><span>Considered specifications.</span></h2></div><div class="range-intro"><p>Six security sealing solutions. Find the right starting point for your application, then discuss the details with our team.</p><a href="#range-comparison" class="range-compare-link">Compare the range <span aria-hidden="true">&#8595;</span></a></div></div>
 <nav class="range-selector" aria-label="Security seal products">${tabs}</nav>
 <div class="range-panels">${panels}</div>
 <p class="sr-only" id="range-status" role="status" aria-live="polite"></p>
 <details id="range-comparison" class="range-comparison"><summary><span><strong>Find your starting point.</strong><small>Compare all six sealing solutions</small></span><span class="comparison-plus" aria-hidden="true">+</span></summary><div class="comparison-scroll" tabindex="0" role="region" aria-label="Security seal comparison"><table><caption>Security seal range: applications and closure types</caption><thead><tr><th scope="col">Product</th><th scope="col">Typical application</th><th scope="col">Closure / format</th><th scope="col">Next step</th></tr></thead><tbody>${rows}</tbody></table></div><p class="comparison-note">Application guidance only. Confirm model, dimensions, marking and compatibility with our team before ordering.</p></details>
 <div class="range-assistance"><span class="assistance-mark" aria-hidden="true">?</span><div><strong>Not sure which seal fits?</strong><p>Start with your application. We will help you narrow down the range.</p></div><a href="#contact" class="text-link" data-quote-product="Help me choose">Discuss your requirements &#8599;</a></div>
 <dialog id="product-viewer" aria-labelledby="viewer-title"><div class="viewer-header"><div><span class="eyebrow">PRODUCT STUDY</span><h3 id="viewer-title">Product illustration</h3></div><button type="button" id="viewer-close" aria-label="Close product illustration">&#215;</button></div><div class="viewer-stage"><img id="viewer-image" width="620" height="620" alt=""></div><p>Illustrative view. Confirm the exact supplied model and specification with Global Seals.</p></dialog>
</section>`;
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace(/<section id="product"[\s\S]*?<\/section>/,section);
if(!html.includes('catalogue.css'))html=html.replace('<link rel="stylesheet" href="styles.css">','<link rel="stylesheet" href="styles.css">\n<link rel="stylesheet" href="catalogue.css?v=showroom-1">');
if(!html.includes('catalogue.js'))html=html.replace('</head>','<script src="catalogue.js?v=showroom-1" defer></script>\n</head>');
const schema={'@context':'https://schema.org','@type':'ItemList',name:'Global Seals security seal range',numberOfItems:products.length,itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:'https://globalseals.pk/'+p.source}))};
html=html.replace(/<script id="range-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,'');
html=html.replace('</head>','<script id="range-schema" type="application/ld+json">'+JSON.stringify(schema)+'</script>\n</head>');
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('Built six static product panels, real product links and ItemList structured data.');
