/* Static release checks. Run after node build-site.cjs. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=__dirname;
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html')).concat(fs.readdirSync(path.join(root,'guides')).filter(f=>f.endsWith('.html')).map(f=>'guides/'+f));
const docs=new Map(files.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
let checked=0;
for(const [file,html] of docs){
 if(!html.includes('site.css?v=b2b-1'))continue;
 checked++;
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file+': exactly one H1');
 assert.equal((html.match(/<main(?:\s|>)/g)||[]).length,1,file+': exactly one main');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,file+': duplicate IDs');
 assert(html.includes('rel="canonical"'),file+': canonical');
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(match[1]);assert(Array.isArray(data));
  assert(!match[1].includes('aggregateRating'),'No fabricated ratings');
 }
 for(const match of html.matchAll(/(?:href|src)="([^\"]+)"/g)){
  const raw=match[1].replaceAll('&amp;','&');
  if(/^(?:https?:|mailto:|tel:|data:)/.test(raw))continue;
  const resolved=new URL(raw,'https://preview.test/'+file);
  const target=decodeURIComponent(resolved.pathname.slice(1))||'index.html';
  assert(fs.existsSync(path.join(root,target)),`${file}: missing ${target}`);
  if(resolved.hash&&target.endsWith('.html')){
   const body=docs.get(target)||fs.readFileSync(path.join(root,target),'utf8');
   assert(body.includes('id="'+resolved.hash.slice(1)+'"'),`${file}: missing anchor ${target}${resolved.hash}`);
  }
  if(resolved.searchParams.has('product'))assert(['Container Seal','Plastic Seal','Lead Seal','Meter Seal','Roto Seal','Sealing Wire','Help me choose'].includes(resolved.searchParams.get('product')),'Valid product preselection');
 }
 for(const match of html.matchAll(/<img\b[^>]*>/g)){assert(/\balt="/.test(match[0]),file+': image alt');assert(/\bwidth="/.test(match[0])&&/\bheight="/.test(match[0]),file+': reserved image dimensions');}
}
assert.equal(checked,19,'Expected 14 core pages and five guides');
assert(docs.get('contact.html').includes('<fieldset class="preview-fields" disabled>'),'No-JS form must not submit');
const clientJS=fs.readFileSync(path.join(root,'site.js'),'utf8');
assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/.test(clientJS),'Design preview must not transmit/store leads');
assert(docs.get('index.html').includes('sample feedback, not verified customer testimonials'));
assert(!docs.get('index.html').includes('journey.js'),'Homepage must not load old animated journey');
console.log(`PASS: ${checked} pages; internal links, anchors, unique IDs, metadata, JSON-LD, images, product quote links and preview privacy checks.`);
