# Global Seals — Pakistan B2B design preview

A static, responsive redesign for a Karachi-based security-seal manufacturer. Brand logo, six product photographs, contact details and published client names come from the existing Global Seals website. The manufacturing position is confirmed by the client.

## Build and check

- `node build-site.cjs` builds 14 core pages and five retained buying guides.
- `node check-site.cjs` checks all 19 pages for local links, anchors, metadata, image dimensions, JSON-LD, product quote links and design-preview privacy requirements.
- `node --check site.js` checks client JavaScript syntax.
- Preview using a static HTTP server from this directory.
- The old `build-products.cjs`, `build-catalogue.cjs` and `build-carousel.cjs` commands delegate to the new generator; they cannot overwrite the redesign with old templates.

## Source files

- `build-site.cjs`: shared header, footer, card components, metadata, sitemap and page builder.
- `content/home.cjs`: homepage sections.
- `content/pages.cjs`: catalogue, six product details, About and Clients.
- `content/contact-policies.cjs`: contact form and draft policies.
- `content/business.json`: verified contact details, published client names and clearly labelled sample testimonials.
- `content/product-details.cjs`: applications, product attributes and selection questions.
- `content/guides.json`: retained guidance content.
- `site.css` and `site.js`: responsive layout, menu, product preselection and local enquiry preview.

## Design scope and current limitations

This phase is design only, as requested. No SMTP, spreadsheet, WhatsApp, analytics, external form service or lead storage is connected. A validated form opens an enquiry preview and explicitly says that nothing has been sent or saved. Fields are disabled until the preview handler is attached, including without JavaScript. No personal values are interpolated as HTML. The official landline and email remain available.

The client strip uses typographic company-name labels based on the existing clientele list, not fabricated original logos. Swap in approved logo artwork in a subsequent content pass. Testimonials are visible design samples, explicitly labelled, with no review schema or invented star ratings. Replace with approved customer quotations before production launch.

Privacy and terms pages are draft website copy reflecting this preview. Review and update them with the final business arrangements and actual lead-processing services before production activation. Phone/address and historical client relationships should also be reconfirmed then.

The long scroll-driven cargo scene has been replaced by a compact hero and six visible product cards. Old animation assets remain unused for possible reuse. Existing product URLs are preserved. Canonicals and sitemap target globalseals.pk, the intended production domain; GitHub Pages is the review location, not an additional SEO property.

Browser UI access timed out during this pass. Automated structure and DOM interaction checks are separate from rendered visual QA; desktop/mobile screenshot review remains pending.

## Design and content rationale

- Make the manufacturer, location, product image and next action immediately clear.
- Group each product's identity, application, image and enquiry action in one card.
- Put specific attributes in tables, buying steps in ordered lists and common questions in native disclosure controls.
- Preserve crawlable links and existing product URLs; use unique page descriptions, Product and Breadcrumb structured data where appropriate. No unsupported certification, capacity, price or rating claims.
- Use local assets/system fonts, reserved image dimensions, responsive grids, visible keyboard focus, native controls, reduced-motion support and mobile call/quote actions.

References consulted:
- https://wesglow.com/ — reference for product-led manufacturer presentation; no copied brand assets or competitor claims.
- https://searchengineland.com/visual-semantics-topical-authority-482254 — Koray Tugberk Gubur's visual-semantics approach, used as a layout/content model rather than a ranking guarantee.
- https://patents.google.com/patent/US12393768B2/en — layout-aware document understanding; a patent is not evidence that a particular ranking implementation is deployed.
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials
- https://developers.google.com/search/docs/appearance/page-experience
- https://www.globalseals.pk/our-products.html
- https://www.globalseals.pk/about-us.html
- https://www.globalseals.pk/contact.html
- https://www.globalseals.pk/clientele.html
