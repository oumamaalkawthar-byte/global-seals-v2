/* Product pages: bottom CTA bar (phones/tablets) and the active link in the desktop section nav. */
(() => {
  const bar = document.querySelector('#pd-sticky-cta');
  const heroActions = document.querySelector('#pd-hero-actions');
  const quote = document.querySelector('#quote');
  if (bar && heroActions && quote && 'IntersectionObserver' in window) {
    // Shown only after the hero buttons leave the screen, hidden again while the quote form is visible.
    let heroVisible = true, quoteVisible = false;
    const render = () => bar.classList.toggle('is-away', heroVisible || quoteVisible);
    bar.classList.add('is-away');
    bar.hidden = false;
    document.body.classList.add('has-sticky-cta');
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; render(); }).observe(heroActions);
    new IntersectionObserver(([e]) => { quoteVisible = e.isIntersecting; render(); }, { threshold: 0.15 }).observe(quote);
  }
  // Highlight the section-nav link for the section currently in view.
  const links = [...document.querySelectorAll('.pd-subnav > div a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
    }), { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }
})();
