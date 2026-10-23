# Global Seals — Version 2

Standalone HTML/CSS/JavaScript redesign. The original global-seals folder remains unchanged; its exact backup is global-seals-final-backup-20261005-204525.

## Preview
Serve this directory over HTTP (for example, php -S 127.0.0.1:8767 -t .). The external SVG object's document needs a same-origin HTTP preview for animation. Opening index.html as file:// may display only the static artwork.

## Architecture
- index.html: accessible page content, shared header, products, applications, about, industries and quote form.
- styles.css: responsive industrial design; only the journey is sticky.
- app.js: existing menu, catalogue and mailto enquiry adapted for natural scrolling.
- products.js and six product SVGs: preserved catalogue information and artwork.
- journey-state.js: pure scroll-progress model and chapter content.
- journey.js: renders transforms on scroll/resize only. No autoplay frame loop.
- assets/: layered yard, port, truck, loaded vessel and one persistent container/seal scene.

The container is the same SVG node throughout. Its demonstration ID is GSXU 240 817; seal ID is 000043. These are fictional illustration labels, not actual shipments. The vessel has 20 background containers and an open slot for the primary container. The crane makes vertical lifts, horizontal transfers and vertical placements. Wheel rotation and environmental movement stop when scrolling stops.

Desktop uses one 800svh story including the hero. Mobile uses a shorter 430svh storyboard with fewer controlled states and a different composition. Products are directly selectable without a second pinned section. Skip-to-products and quote links remain available. Reduced-motion and very short screens switch to a manually selectable static storyboard.

## Content and limitations
Global Seals is a Karachi security-seal supplier/manufacturer, not a cargo operator. No fleet, route coverage, customer metrics or certification claims have been added. The Customer perspectives section uses three sample testimonials, visibly labelled as illustrative and not verified; replace them with real, permitted customer quotes before publication (no Review schema is emitted). Illustrations are original, simplified 2.5D diagrams, not photographs or engineering simulations. Product illustrations are not exact model specifications.

The quote form validates required fields and prepares an email draft. It does not submit to a backend. Catalogue product guidance and company information are reused from the original site. Confirm product specifications before production publication.

The browser integration was unavailable during this session; visual browser QA remains to be performed. Structural, JavaScript runtime and journey continuity checks are documented in the delivery conversation.

## Mobile-first sections
- testimonials.css/.js: native swipe track on phones and tablets, three-column grid from 1100px. Previous/Next step by actual card position, so they work when two cards fit (tablet). No autoplay.
- sections.css owns applications, about, industries, contact and footer. Base rules are the phone layout; min-width 701px and 1000px add tablet and desktop layouts. The old desktop-first rules for these sections were removed from styles.css.
- Application cards and industry rows link to the relevant product panel (#seal-*), which catalogue.js selects via hashchange. "Compare the range" opens the comparison table.
- Quote form: optional approximate quantity field (included in the email draft); 16px inputs on phones to avoid iOS focus zoom.
- Footer: explore links, product links and contact details.
- Testimonials use the supplied dark photo-card design. Photos (assets/testimonials/placeholder-1..3.jpg), the "John Doe" names and quotes are placeholders; swap the files in place when real content arrives, then remove the sample disclosure.
- Design system pass: one brand type pair (Barlow Condensed + DM Sans, loaded once via a preconnected link in index.html; no CSS @imports), one palette (navy, navy-deep, cyan, seal-yellow accent) and shared radius tokens (--radius, --radius-sm in styles.css) across all sections. Testimonials and blog keep their supplied layouts but use these tokens.
- Section rhythm: product (light), applications, about, industries, blog (dark highlighted band), testimonials (light), contact (dark).
- Product range auto-rotates every 3s (catalogue.js) only while on screen, including while the mouse is over it; keyboard focus pauses it, it stops for good once a visitor picks a product or touches the range, has a Pause/Play control, and is off for reduced motion. A yellow line on the active tab shows the 3s progress.
- Scroll reveal (app.js + styles.css) fades sections up as they arrive; elements already on screen at load are never hidden.
- Removed unused runtime code: products.js is no longer loaded by the page (build-catalogue.cjs still reads it) and old catalogue CSS was deleted.
- Blog (blog.css, #blog) follows the supplied "Behind the lens" spec, adapted: static HTML instead of React/Supabase, and site illustrations instead of videos. Posts, titles and links (#blog) are placeholders until real articles exist.
- Full-page QA via headless Chrome (DevTools protocol) at 390x844 mobile, 1280x720, 1280x800 and 1440x900: no horizontal overflow, no JS/network errors, journey reaches the destination state, product tabs/industry chips/comparison/menu/quote draft all work.
- Journey fixes from that pass: the road-parallax foreground no longer reappears (shifted and zoomed) at destination inspection; the desktop hero heading is sized to keep "Big confidence." on one line; the "Follow one seal" link hides on desktop screens up to 820px tall, where it collided with the seal inset.
- Not yet tested on physical iOS/Android devices or Safari/Firefox.

## Product showroom update
Six product panels now ship directly in index.html, including application, feature, construction and real product-detail links. Run node build-catalogue.cjs after editing products.js to regenerate this content and the ItemList schema. No prices, reviews or certification claims are fabricated. Catalogue tabs are progressively enhanced: without JavaScript, all six product articles remain readable. Keyboard arrow keys, Home/End, deep links, native-dialog image inspection and reduced-motion support are included. The visual treatment is lightweight 2.5D illustration, not a 360-degree or engineering model. Product-specific enquiry links and a comparison table support procurement decisions.

## Completion pass (7 October)
Preserved the latest section designs. Replaced blog placeholder links with four locally authored application guides and a guide index; added mobile-first procurement FAQs. Sample testimonial names now identify the sample perspective instead of fictitious people. Previous version saved in global-seals-v2-before-completion-20261007. Enquiry remains an email draft, not a backend order submission.

## Product pages (7 October)
- Six product detail pages at the live site's URLs (container-seal.html, plastic-seal.html, lead-seal.html, meter-seal.html, roto-seal.html, sealing-wire.html) so existing rankings carry over. Generated by `node build-products.cjs` from products.js plus the per-product details at the top of that script; re-run it after editing either. The script also writes sitemap.xml and robots.txt, points homepage/guide product links at the local pages and adds the brand font link to guides.
- SEO: unique title (<=60 chars) and meta description (<=160), canonical, Open Graph, one H1 with ordered headings, Product + BreadcrumbList + FAQPage JSON-LD, sized images (no layout shift), internal links to related products and the closest guide. No prices, reviews or certifications are invented, so Product markup has no offers/rating.
- CTAs: hero Request a quote + call; desktop sticky section nav with a quote button; phone/tablet bottom bar that appears once the hero buttons scroll away and hides at the form; mid-page "Help me choose" band; quote form at the end with the product preselected.
- Mobile UI: tap targets >= 44-48px, body copy 16px, no text under 12px, the quote button sits in the first screen at 390x844 (the bottom bar covers smaller phones), no interstitials.
- Styles in product.css, behaviour in product.js; header, footer, quote form and mailto logic are shared with the homepage (copied from index.html at build time).

## "Not just for containers" section (20 October)
- Replaces the earlier Applications and Industries sections with one artwork-led band (id stays #industries, so existing links work). Eight sectors where security seals are typically used: shipping containers, trucks & trailers, meters, fuel tanks & valves, cash & courier bags, fire & safety equipment, ballot & document boxes, warehouses & storage. Each tile shows the suitable seal types and links to the matching product page.
- Artwork: spotlit poster-style vector scenes in assets/sectors/*.svg (~14 KB total) with the real product illustration layered on top (position per tile via --sx/--sy/--sw in index.html). Styles in sectors.css. The About panel uses the same dark spotlight treatment with the container seal.
- Sector uses are general industry practice, phrased as typical applications; the section asks visitors to confirm the suitable model. Swap in real photography later by replacing the scene SVGs.
- Hero/journey untouched.
- About panel (21 October): the seal image and raster brand icon were replaced by an inline vector rebuild of the globe mark (brand-icon.svg is a PNG inside an SVG, so it cannot be animated). It builds in once when scrolled into view (bands, the white node dots, then the seal tag), then loops: band segments slide to suggest a turning globe, dots pulse in sequence, the glow breathes. The panel holds only the mark (no wordmark, location text or orbit). Reduced motion shows the finished, still mark. Styles in sections.css (.lg-*), trigger in app.js.
- Product pages, "Explore other security seals" (21 October): the five other products sit in one row of embossed (soft neumorphic) cards with each seal in a debossed well. Every 3s the next card lifts and its seal rises and tilts; on narrow screens the row scrolls itself to centre that card, and the cycle wraps around. Runs only while the row is on screen; keyboard focus pauses it; a Pause/Play button gives explicit control; off for reduced motion. Styles in product.css, behaviour in product.js; re-run `node build-products.cjs` after template changes.

Homepage product carousel photographs are sourced from the existing Global Seals catalogue at https://www.globalseals.pk/our-products.html (images/container-seal.jpg, plastic-seal.jpg, lead-seal.jpg, meter-seal.jpg, roto-seal.jpg and sealing-wire.jpg). Originals are preserved in assets/products/ and displayed without cropping. Product pages and journey illustrations retain their existing artwork pending the product-page redesign.
