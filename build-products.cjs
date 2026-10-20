/* Build the six product detail pages, sitemap.xml and robots.txt from products.js. Run: node build-products.cjs
   Pages keep the live site's URLs (container-seal.html, ...) so existing search rankings carry over.
   Copy comes only from products.js and the details below; no prices, reviews or certifications are invented. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=__dirname;const SITE='https://globalseals.pk/';const TODAY=new Date().toISOString().slice(0,10);
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'products.js'),'utf8'),ctx);
const products=ctx.window.globalSealProducts;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=p=>p.source.replace(/\.html$/,'');
// Page-level details. "uses" are taken from each product's usage text; "guide" is the closest application guide.
const extra={
 'Container Seal':{h1:'Container Bolt Seal',format:'Bolt + barrel',sector:'Logistics & shipping',uses:['Freight containers','Cargo handovers','Dispatch checks','Destination inspection'],guide:'choosing-container-seals',
  seoTitle:'Container Bolt Seal for Freight Containers | Global Seals',meta:'Tamper-evident container bolt seal with matching pin and barrel numbers and anti-spin construction. Request a quote from Global Seals, Karachi.'},
 'Plastic Seal':{h1:'Pull-Tight Plastic Seal',format:'Pull-tight seal',sector:'Logistics & general security',uses:['Bags','Truck curtains','First-aid boxes','Fire extinguishers'],guide:'seal-marking-options',
  seoTitle:'Pull-Tight Plastic Security Seal | Global Seals',meta:'Adjustable pull-tight plastic seal with serial numbering and marking options for bags, truck curtains and extinguishers. Request a quote.'},
 'Lead Seal':{h1:'Lead Seal',format:'Crimped wire seal',sector:'Utilities & transport',uses:['Utility meters','Boxes','Transport','Wire-and-seal closures'],guide:'meter-seal-selection',
  seoTitle:'Lead Seal for Wire and Crimp Closures | Global Seals',meta:'Compact lead seal used with sealing wire, carrying an identifying impression for meters, boxes and transport. Ask about size and tooling.'},
 'Meter Seal':{h1:'Single-Use Meter Seal',format:'Single-use closure',sector:'Utilities & metering',uses:['Meter enclosures','Closed equipment','Restricted access points'],guide:'meter-seal-selection',
  seoTitle:'Single-Use Meter Seal for Utility Meters | Global Seals',meta:'Single-use meter seal with a visible locking body for meter enclosures and closed equipment, destroyed on removal. Request a quote.'},
 'Roto Seal':{h1:'Roto Seal',format:'One-way rotating lock',sector:'Utilities & metering',uses:['Utility meters','Cabinets','Valves','Fuel tanks'],guide:'seal-marking-options',
  seoTitle:'Roto Seal: Rotating Wire Security Seal | Global Seals',meta:'One-way rotating roto seal for meters, cabinets, valves and fuel tanks, with numbering, logo and barcode options. Request a quote.'},
 'Sealing Wire':{h1:'Sealing Wire',format:'Sealing wire',sector:'Utilities & equipment',uses:['Meter closures','Valve closures','Equipment closures'],guide:'meter-seal-selection',
  seoTitle:'Sealing Wire for Security Wire Seals | Global Seals',meta:'Sealing wire to pair with compatible wire seals on meter, valve and equipment closures. Confirm length, material and diameter with us.'},
};
const guideTitles={'choosing-container-seals':'Choosing the Right Container Seal for Your Shipment','destination-seal-checklist':'Inspecting a Seal at Destination: A Simple Checklist','meter-seal-selection':'Meter Seals: Where They Fit in Routine Utility Checks','seal-marking-options':'Numbering, Logos and Barcodes: Marking Options Explained'};
for(const p of products){const x=extra[p.name];if(!x)throw new Error('missing details for '+p.name);
 if(x.seoTitle.length>60)throw new Error('title too long: '+x.seoTitle);if(x.meta.length>160)throw new Error('meta too long ('+x.meta.length+'): '+p.name);
 if(!fs.existsSync(path.join(root,'guides',x.guide+'.html')))throw new Error('guide missing: '+x.guide);}

// Shared chrome is copied from the homepage so menus and footer never drift apart.
let home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const between=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<0)throw new Error('marker '+a);return s.slice(i,j+b.length);};
const toHome=html=>html.replace(/href="#([a-z][^"]*)"/g,(m,id)=>`href="index.html#${id}"`).replace(/href="#"/g,'href="index.html"');
const productHref=html=>{for(const p of products)html=html.split(`index.html#seal-${({'Container Seal':'container','Plastic Seal':'plastic','Lead Seal':'lead','Meter Seal':'meter','Roto Seal':'roto','Sealing Wire':'wire'})[p.name]}"`).join(`${p.source}"`);return html;};
const chromeTop=productHref(toHome(between(home,'<div class="topbar">','</header>')));
const chromeFooter=productHref(toHome(between(home,'<footer class="footer">','</footer>'))).replace('href="index.html">Back to top','href="#main">Back to top');
const fontLinks='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap">';
const icon={check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
 phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="currentColor"/></svg>'};

function page(p,i){
 const x=extra[p.name],s=slug(p),url=SITE+p.source,num=String(i+1).padStart(2,'0');
 const others=products.filter(o=>o!==p);
 const faqs=[
  [`What is the ${p.name} used for?`,p.usage],
  [`What are the key features of the ${p.name}?`,p.features],
  [`Can I request numbering or marking on the ${p.name}?`,`Yes, share your numbering or marking requirements in your enquiry. Our team will confirm the options available for the exact model you need.`],
  [`Is the product illustration the exact model supplied?`,`No. Illustrations are indicative. Confirm the model, dimensions, marking and compatibility with our team before ordering.`],
  [`How do I request a quote for the ${p.name}?`,`Use the quote form on this page or email info@globalseals.pk with your application, approximate quantity and marking requirements.`],
 ];
 const schema=[
  {'@context':'https://schema.org','@type':'Product',name:x.h1,description:`${p.usage} ${p.features}`,image:SITE+p.image,url,category:'Security seals',
   brand:{'@type':'Brand',name:'Global Seals'},manufacturer:{'@type':'Organization',name:'Global Seals',url:SITE,email:'info@globalseals.pk',telephone:'+92 21 3242 1220',address:{'@type':'PostalAddress',addressLocality:'Karachi',addressCountry:'PK'}}},
  {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE},{'@type':'ListItem',position:2,name:'Security seals',item:SITE+'#product'},{'@type':'ListItem',position:3,name:p.name,item:url}]},
  {'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
 ];
 const options=products.map(o=>`<option${o===p?' selected':''}>${esc(o.name)}</option>`).join('')+'<option>Help me choose</option>';
 return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(x.seoTitle)}</title>
<meta name="description" content="${esc(x.meta)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#102d3b">
<meta property="og:type" content="product"><meta property="og:site_name" content="Global Seals"><meta property="og:title" content="${esc(x.seoTitle)}"><meta property="og:description" content="${esc(x.meta)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}brand-logo.png"><meta name="twitter:card" content="summary">
<link rel="icon" href="brand-icon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="${p.image}" fetchpriority="high">
${fontLinks}
<link rel="stylesheet" href="styles.css?v=4"><link rel="stylesheet" href="sections.css?v=2"><link rel="stylesheet" href="product.css?v=2">
<script src="app.js?v=sections-2" defer></script><script src="product.js?v=1" defer></script>
${schema.map(o=>'<script type="application/ld+json">'+JSON.stringify(o)+'</script>').join('\n')}
</head>
<body class="pd-page" style="--product-accent:${p.color}">
<a class="skip-link" href="#main">Skip to content</a>
${chromeTop}
<main id="main">
<nav class="pd-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="index.html#product">Security seals</a></li><li><span aria-current="page">${esc(p.name)}</span></li></ol></nav>
<section class="pd-hero" aria-labelledby="pd-title">
 <div class="pd-head"><p class="eyebrow">SECURITY SEAL RANGE / ${num}</p><h1 id="pd-title">${esc(x.h1)}</h1><p class="pd-lead">${esc(p.title)}</p></div>
 <figure class="pd-media"><div class="pd-studio"><img src="${p.image}" width="620" height="620" fetchpriority="high" alt="${esc(x.h1)}: ${esc(p.label.toLowerCase())} security seal illustration"></div><figcaption><span>${esc(p.label)}</span><span>Illustration &mdash; supplied model may vary</span></figcaption></figure>
 <div class="pd-body">
  <p class="pd-summary">${esc(p.usage)}</p>
  <ul class="pd-facts"><li><span>Best for</span><strong>${esc(x.sector)}</strong></li><li><span>Closure</span><strong>${esc(x.format)}</strong></li><li><span>Typical uses</span><strong>${x.uses.slice(0,2).map(esc).join(', ')}</strong></li></ul>
  <div class="pd-actions" id="pd-hero-actions"><a class="button pd-primary" href="#quote" data-quote-product="${esc(p.name)}">Request a quote <span aria-hidden="true">&#8599;</span></a><a class="pd-secondary" href="tel:+922132421220">${icon.phone}Call +92 21 3242 1220</a></div>
  <p class="pd-reassure">No obligation. Share your application and quantity, and we will help confirm the suitable specification.</p>
  <ul class="pd-assurance"><li>${icon.check}Product guidance</li><li>${icon.check}Stock enquiries</li><li>${icon.check}After-sales support</li></ul>
 </div>
</section>
<nav class="pd-subnav" aria-label="On this page"><div><a href="#overview">Overview</a><a href="#uses">Uses</a><a href="#before-you-order">Before you order</a><a href="#faq">FAQ</a></div><a class="button pd-subnav-cta" href="#quote" data-quote-product="${esc(p.name)}">Request a quote <span aria-hidden="true">&#8599;</span></a></nav>
<section id="overview" class="pd-section pd-overview" aria-labelledby="overview-title">
 <div class="pd-section-head"><p class="eyebrow">PRODUCT DETAILS</p><h2 id="overview-title">${esc(p.name)} at a glance.</h2><p>${esc(p.title)} Confirm the exact model and specification with our team before ordering.</p></div>
 <dl class="pd-specs"><div><dt>Application</dt><dd>${esc(p.usage)}</dd></div><div><dt>Key features</dt><dd>${esc(p.features)}</dd></div><div><dt>Construction &amp; selection</dt><dd>${esc(p.quality)}</dd></div><div><dt>Closure / format</dt><dd>${esc(x.format)}</dd></div><div><dt>Sector</dt><dd>${esc(x.sector)}</dd></div></dl>
</section>
<section id="uses" class="pd-section pd-uses" aria-labelledby="uses-title">
 <div class="pd-section-head"><p class="eyebrow">APPLICATIONS</p><h2 id="uses-title">Where the ${esc(p.name)} is used.</h2></div>
 <ul class="pd-use-grid">${x.uses.map((u,k)=>`<li><span class="pd-use-index">${String(k+1).padStart(2,'0')}</span>${icon.check}<strong>${esc(u)}</strong></li>`).join('')}</ul>
</section>
<section class="pd-band" aria-labelledby="band-title">
 <div><h2 id="band-title">Not sure the ${esc(p.name)} is the right fit?</h2><p>Compare all six sealing solutions, or tell us about your application and we will help you choose.</p></div>
 <div class="pd-band-actions"><a class="button button-white" href="#quote" data-quote-product="Help me choose">Help me choose <span aria-hidden="true">&#8599;</span></a><a class="pd-band-link" href="index.html#range-comparison">Compare the range <span aria-hidden="true">&#8599;</span></a></div>
</section>
<section id="before-you-order" class="pd-section pd-order" aria-labelledby="order-title">
 <div class="pd-section-head"><p class="eyebrow">BEFORE YOU ORDER</p><h2 id="order-title">Four things to include in your enquiry.</h2></div>
 <ol class="pd-steps"><li><strong>Your application</strong><span>What you are sealing and how the locking point is arranged.</span></li><li><strong>Approximate quantity</strong><span>A one-off quantity or a regular monthly requirement.</span></li><li><strong>Numbering &amp; marking</strong><span>Serial numbers, logo or other identification you need.</span></li><li><strong>Compatibility</strong><span>Dimensions, wire or fitting requirements for your sealing points.</span></li></ol>
 <a class="pd-guide" href="guides/${x.guide}.html"><span class="eyebrow">RELATED GUIDE</span><strong>${esc(guideTitles[x.guide])}</strong><span class="pd-guide-arrow" aria-hidden="true">&#8599;</span></a>
</section>
<section id="faq" class="pd-section pd-faq" aria-labelledby="faq-title">
 <div class="pd-section-head"><p class="eyebrow">QUESTIONS</p><h2 id="faq-title">${esc(p.name)} FAQs.</h2></div>
 <div class="pd-faq-list">${faqs.map(([q,a],k)=>`<details${k===0?' open':''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</section>
<section class="pd-section pd-related" aria-labelledby="related-title">
 <div class="pd-section-head"><p class="eyebrow">THE GLOBAL SEALS RANGE</p><h2 id="related-title">Explore other security seals.</h2></div>
 <ul class="pd-related-grid">${others.map(o=>`<li><a href="${o.source}"><span class="pd-related-media"><img src="${o.image}" width="620" height="620" loading="lazy" alt=""></span><strong>${esc(o.name)}</strong><span>${esc(o.title)}</span></a></li>`).join('')}</ul>
</section>
<section id="quote" class="contact section-shell" aria-labelledby="quote-title">
 <div class="contact-intro"><p class="eyebrow light">REQUEST A QUOTE</p><h2 id="quote-title">Ready to order<br><span>the ${esc(p.name)}?</span></h2><p>Tell us your application, quantity and marking needs. We will help confirm the suitable specification.</p>
 <ul class="contact-channels"><li><a href="mailto:info@globalseals.pk"><span>EMAIL</span><strong>info@globalseals.pk</strong><i aria-hidden="true">&#8599;</i></a></li><li><a href="tel:+922132421220"><span>PHONE</span><strong>+92 21 3242 1220</strong><i aria-hidden="true">&#8599;</i></a></li><li><div><span>BASED IN</span><strong>Karachi, Pakistan</strong></div></li></ul></div>
 <form id="quote-form" class="quote-form"><p class="form-intro"><strong>Request a quote</strong><span>Fields marked * are required.</span></p>
 <div class="form-row"><label>Your name *<input name="name" autocomplete="name" placeholder="Full name" required maxlength="100"></label><label>Work email *<input name="email" type="email" autocomplete="email" placeholder="you@company.com" required maxlength="160"></label></div>
 <div class="form-row"><label>Company<input name="company" autocomplete="organization" placeholder="Company name" maxlength="160"></label><label>Approximate quantity<input name="quantity" placeholder="e.g. 5,000 per month" maxlength="80"></label></div>
 <label>Product<select name="product" id="enquiry-product">${options}</select></label>
 <label>Your requirements *<textarea name="requirements" rows="4" placeholder="Application, numbering or marking, and any timeline&hellip;" required maxlength="2000"></textarea></label>
 <button class="button button-white" type="submit">Prepare email enquiry <span aria-hidden="true">&#8599;</span></button><p class="form-note" id="form-status" role="status">Opens your email app with your enquiry ready to send.</p></form>
</section>
</main>
${chromeFooter}
<div class="pd-sticky-cta" id="pd-sticky-cta" hidden><a class="button" href="#quote" data-quote-product="${esc(p.name)}">Request a quote <span aria-hidden="true">&#8599;</span></a><a class="pd-sticky-call" href="tel:+922132421220" aria-label="Call Global Seals on +92 21 3242 1220">${icon.phone}</a></div>
</body>
</html>
`;
}
products.forEach((p,i)=>fs.writeFileSync(path.join(root,p.source),page(p,i)));

// Homepage and guides: point product links at the new local pages (idempotent).
const ids={'Container Seal':'container','Plastic Seal':'plastic','Lead Seal':'lead','Meter Seal':'meter','Roto Seal':'roto','Sealing Wire':'wire'};
for(const p of products){home=home.split(`href="https://globalseals.pk/${p.source}"`).join(`href="${p.source}"`);home=home.replace(new RegExp(`(<nav class="footer-col" aria-label="Product range">[\\s\\S]*?)href="#seal-${ids[p.name]}"`),`$1href="${p.source}"`);}
fs.writeFileSync(path.join(root,'index.html'),home);
for(const f of fs.readdirSync(path.join(root,'guides')).filter(f=>f.endsWith('.html'))){
 let g=fs.readFileSync(path.join(root,'guides',f),'utf8');
 if(!g.includes('fonts.googleapis.com'))g=g.replace('<link rel="stylesheet" href="../styles.css">',fontLinks.replace(/\n/g,'')+'<link rel="stylesheet" href="../styles.css">');
 for(const p of products)g=g.split(`href="https://globalseals.pk/${p.source}"`).join(`href="../${p.source}"`);
 fs.writeFileSync(path.join(root,'guides',f),g);
}
// Sitemap and robots for the whole static site.
const urls=['',...products.map(p=>p.source),'guides/',...fs.readdirSync(path.join(root,'guides')).filter(f=>f.endsWith('.html')&&f!=='index.html').map(f=>'guides/'+f)];
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log('Built',products.length,'product pages, sitemap.xml ('+urls.length+' URLs) and robots.txt; linked homepage and guides to local product pages.');
