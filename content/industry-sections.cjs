const groups = [
  {
    id: 'transport', theme: 'navy', title: 'Loading trucks & freight containers',
    intro: 'Match the seal to the door or curtain hardware, then record its number for the receiving team.',
    alt: 'Loading bay worker checking a yellow bolt seal on a truck door',
    uses: [
      ['Rigid cargo doors', 'For doors with a compatible bolt hasp.', 'container-seal', 'Container Seal'],
      ['Curtain-sided trucks', 'For curtain closures with a suitable eyelet.', 'plastic-seal', 'Plastic Seal']
    ]
  },
  {
    id: 'distribution', quoteProduct: 'Plastic Seal', theme: 'ice', title: 'Textile sacks & bakery deliveries',
    intro: 'Use numbered pull-tight seals on tied garment sacks and closed bakery delivery totes with compatible eyelets.',
    alt: 'Bakery dispatch worker checking the red security strap on a delivery tote',
    uses: [
      ['Apparel warehouses', 'Record the seal number against the sack or order reference.', 'plastic-seal', 'Plastic Seal'],
      ['Bakery and food distribution', 'Check that the tote lid and base have matching eyelets.', 'plastic-seal', 'Plastic Seal']
    ]
  },
  {
    id: 'utilities', theme: 'white', title: 'Electric meters, valves & cabinets',
    intro: 'Choose a wire closure based on the sealing holes, available clearance and your inspection procedure.',
    alt: 'Utility technician inspecting a red wire seal on an electricity meter enclosure',
    uses: [
      ['Electric meter covers', 'Measure the cover sealing point and check the meter operator’s specification before selecting a single-use closure.', 'meter-seal', 'Meter Seal'],
      ['Valves and access cabinets', 'For paired sealing points that accept a rotary closure.', 'roto-seal', 'Roto Seal'],
      ['Crimped inspection seals', 'For procedures that call for a stamped impression.', 'lead-seal', 'Lead Seal'],
      ['Replacement wire', 'Match the diameter and length to your lead or roto seal.', 'sealing-wire', 'Sealing Wire']
    ]
  }
];

module.exports = ({quote, button}) => `<nav class="wrap use-nav" aria-label="Browse industry applications">${groups.map(group => `<a href="#${group.id}">${group.title}</a>`).join('')}</nav>` +
  groups.map(group => `<section class="use-case use-${group.theme}" id="${group.id}" aria-labelledby="${group.id}-title">
    <div class="wrap use-layout">
      <div class="use-heading">
        <h2 id="${group.id}-title">${group.title}</h2>
        <p class="use-intro">${group.intro}</p>
        <ul class="use-options">${group.uses.map(([title, detail, slug, product]) => `<li>
          <h3>${title}</h3><p>${detail} <a href="${slug}.html">${product}</a></p>
        </li>`).join('')}</ul>
        ${button('Get a Quote',quote(group.quoteProduct || 'Help me choose'))}
      </div>
      <img class="use-banner" src="assets/applications/${group.id}.jpg" width="1280" height="720" loading="lazy" decoding="async" alt="${group.alt}">
    </div>
  </section>`).join('');
