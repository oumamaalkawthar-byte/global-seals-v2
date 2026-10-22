/* Shared navigation, six-product catalogue and mailto enquiry. Scene logic is separate. */
const $ = (selector) => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = $('.menu-toggle');
const navigation = $('#navigation');
function setMenuOpen(open) {
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open ? 'Close navigation menu' : 'Open navigation menu');
  menuButton.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
  navigation.hidden = !open;
  navigation.classList.toggle('is-open',open);
}
function closeMenu() { setMenuOpen(false); }
menuButton.addEventListener('click',() => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', (event) => { if (!event.target.closest('.header')) closeMenu(); });
$('#year').textContent = new Date().getFullYear();
$('#quote-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const selectedProduct = data.get('product') || 'Security seal';
  const subject = selectedProduct + ' enquiry' + (data.get('company') ? ` — ${data.get('company')}` : '');
  const body = `Hello Global Seals,\n\nI would like to enquire about ${selectedProduct}.\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company') || 'Not specified'}\nApproximate quantity: ${data.get('quantity') || 'Not specified'}\n\nRequirements:\n${data.get('requirements')}\n\nThank you.`;
  window.location.href = `mailto:info@globalseals.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#form-status').textContent = 'Your email draft is ready to open. Send it from your email app; if no app opens, email info@globalseals.pk directly.';
});


// Quote links work for every static product panel and the comparison table.
document.querySelectorAll('[data-quote-product]').forEach(link => link.addEventListener('click', () => {
 $('#enquiry-product').value = link.dataset.quoteProduct;
}));

// Scroll reveal. Only elements still below the fold are hidden, so nothing on screen at load flashes or waits.
// Siblings in a group are staggered slightly. Skipped entirely for reduced motion or without IntersectionObserver.
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const groups = ['.range-heading', '.sectors-head', '.sector', '.about-mark', '.about-copy', '.blog-header', '.blog-featured', '.blog-card', '.perspectives-heading', '.perspectives-track', '.contact-intro', '.quote-form'];
  const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    // Hand the element back to its own styles (e.g. card hover lift) once it has arrived.
    entry.target.addEventListener('transitionend', (event) => { if (event.target === entry.target && event.propertyName === 'opacity') entry.target.classList.remove('reveal', 'is-in'); });
    reveal.unobserve(entry.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  groups.forEach((selector) => document.querySelectorAll(selector).forEach((element, index) => {
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.style.setProperty('--reveal-delay', (index % 3) * 0.09 + 's');
    element.classList.add('reveal');
    reveal.observe(element);
  }));
}

// About logo: arm the build-up, then play it once the panel is in view. Reduced motion keeps the finished, still mark.
const logoPanel = $('.about-mark');
const logo = logoPanel && logoPanel.querySelector('.about-logo');
if (logo) {
  if (reducedMotion.matches) logo.pauseAnimations?.();
  else if ('IntersectionObserver' in window) {
    logoPanel.classList.add('logo-armed');
    const logoView = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { logoPanel.classList.add('logo-play'); logoView.disconnect(); } }, { threshold: 0.35 });
    logoView.observe(logoPanel);
  }
}

// Links to the comparison from outside the product section should land on it open, not collapsed.
document.querySelectorAll('a[href="#range-comparison"]').forEach(link => link.addEventListener('click', () => {
 $('#range-comparison').open = true;
}));
