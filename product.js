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
  // Related products: every 3s the next embossed card lifts; on narrow screens the row scrolls to centre it.
  // Runs only while the row is on screen; keyboard focus pauses it; Pause/Play gives explicit control; off for reduced motion.
  const row = document.querySelector('.pd-related-grid');
  if (row && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = [...row.children];
    let active = -1, timer = 0, inView = false, focused = false, playing = true;
    const head = document.querySelector('.pd-related .pd-section-head');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'pd-related-toggle';
    // Keep eyebrow + heading as one block so the row holds just the title and the control.
    const title = document.createElement('div');
    title.append(...head.childNodes);
    head.classList.add('pd-related-head');
    head.append(title, toggle);
    const render = () => {
      toggle.innerHTML = playing
        ? '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 0h3v10H1zM6 0h3v10H6z"/></svg>Pause'
        : '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 0l9 5-9 5z"/></svg>Play';
      toggle.setAttribute('aria-label', playing ? 'Pause product highlight' : 'Play product highlight');
    };
    const show = (n) => {
      active = n;
      items.forEach((li, k) => li.classList.toggle('is-active', k === n));
      if (row.scrollWidth > row.clientWidth + 2) {
        const li = items[n];
        row.scrollTo({ left: li.offsetLeft - (row.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    const schedule = () => {
      clearTimeout(timer);
      if (playing && inView && !focused && !document.hidden) timer = setTimeout(() => { show((active + 1) % items.length); schedule(); }, 3000);
    };
    toggle.addEventListener('click', () => { playing = !playing; render(); schedule(); });
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && active < 0) show(0);
      schedule();
    }, { threshold: 0.4 }).observe(row);
    row.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) { focused = true; schedule(); } });
    row.addEventListener('focusout', () => { focused = false; schedule(); });
    document.addEventListener('visibilitychange', schedule);
    render();
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
