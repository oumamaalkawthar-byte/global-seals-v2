const groups = [
  {
    id: 'transport', theme: 'navy', title: 'Loading trucks & freight containers',
    intro: 'At the loading bay, the door hardware determines which seal fits. At the destination, the receiving team needs a number it can check against the dispatch record.',
    alt: 'Loading bay worker checking a yellow bolt seal on a truck door',
    uses: [
      ['Rigid cargo doors', 'For a container or truck door with a compatible bolt hasp, check the opening size and record the bolt seal number on the delivery note.', 'container-seal', 'Container Seal'],
      ['Curtain-sided trucks', 'Where the curtain has a suitable eyelet, an adjustable strap can pass through the closure. Confirm strap length before ordering.', 'plastic-seal', 'Plastic Seal']
    ]
  },
  {
    id: 'distribution', theme: 'ice', title: 'Textile sacks & bakery deliveries',
    intro: 'A clothing warehouse may dispatch garments by the sack. A bakery may send several closed totes on one delivery truck. Choose the seal around the unit your receiving team actually checks.',
    alt: 'Bakery dispatch worker checking the red security strap on a delivery tote',
    uses: [
      ['Apparel warehouses', 'For goods packed in sacks, check that the closed bag has a secure tie point. Record its seal number against the bale or order reference.', 'plastic-seal', 'Plastic Seal'],
      ['Bakery and food distribution', 'For packaged food in a lidded tote, check that the lid and base have matching eyelets before choosing an adjustable strap.', 'plastic-seal', 'Plastic Seal']
    ]
  },
  {
    id: 'utilities', theme: 'white', title: 'Electric meters, valves & cabinets',
    intro: 'For meter readers and maintenance teams, the sealing holes, available clearance and inspection procedure determine which wire closure to specify.',
    alt: 'Utility technician inspecting a red wire seal on an electricity meter enclosure',
    uses: [
      ['Electric meter covers', 'Measure the cover sealing point and check the meter operator’s specification before selecting a single-use closure.', 'meter-seal', 'Meter Seal'],
      ['Valves and access cabinets', 'For a numbered rotary closure, confirm the wire length and diameter against the paired sealing points.', 'roto-seal', 'Roto Seal'],
      ['Crimped inspection seals', 'Where the inspection procedure calls for a stamped impression, match the lead seal to the wire and crimping tool.', 'lead-seal', 'Lead Seal'],
      ['Replacement wire', 'Specify the seal model, wire diameter and length when ordering wire for a compatible lead or rotary seal.', 'sealing-wire', 'Sealing Wire']
    ]
  }
];

module.exports = ({quote}) => `<nav class="wrap use-nav" aria-label="Browse industry applications">${groups.map(group => `<a href="#${group.id}">${group.title}</a>`).join('')}</nav>` +
  groups.map(group => `<section class="use-case use-${group.theme}" id="${group.id}" aria-labelledby="${group.id}-title">
    <div class="wrap use-layout"><div class="use-heading"><h2 id="${group.id}-title">${group.title}</h2><p class="use-intro">${group.intro}</p>
    </div>
    <img class="use-banner" src="assets/applications/${group.id}.jpg" width="1280" height="720" loading="lazy" decoding="async" alt="${group.alt}">
    <div class="use-options">${group.uses.map(([title, detail, slug, product]) => `<article><h3>${title}</h3><p>${detail}</p>
    <div><a href="${slug}.html">View ${product.toLowerCase()}</a><a href="${quote(product)}">Get a quote</a></div></article>`).join('')}</div></div>
  </section>`).join('');
