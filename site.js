window.initSite = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.querySelector('.topnav');
  const menuToggle = document.querySelector('.menu-toggle');
  const portraitTrigger = document.querySelector('.know-me-trigger');
  const toggleLabel = menuToggle?.querySelector('.menu-toggle-text');
  const navLinks = [...document.querySelectorAll('.topnav-links a[href^="#"]')];
  const targets = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(({ section }) => section);
  let lastFocused = null;

  const setMenu = (open, { moveFocus = false, restoreFocus = true } = {}) => {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close site navigation' : 'Open site navigation');
    portraitTrigger?.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? 'Close' : 'Index';

    if (open && moveFocus) navLinks[0]?.focus();
    if (!open && restoreFocus && lastFocused) lastFocused.focus();
    if (!open) lastFocused = null;
  };

  const openMenuFrom = (trigger) => {
    lastFocused = trigger;
    setMenu(true, { moveFocus: true, restoreFocus: false });
  };

  menuToggle?.addEventListener('click', () => {
    if (nav?.classList.contains('is-open')) setMenu(false);
    else openMenuFrom(menuToggle);
  });
  portraitTrigger?.addEventListener('click', () => openMenuFrom(portraitTrigger));

  navLinks.forEach((link) => link.addEventListener('click', () => {
    setMenu(false, { restoreFocus: false });
  }));

  document.addEventListener('keydown', (event) => {
    if (!nav?.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [
      document.querySelector('.nav-brand'),
      menuToggle,
      ...navLinks,
    ].filter(Boolean);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const setCurrentLink = () => {
    const offset = window.scrollY + window.innerHeight * 0.34;
    let active = null;
    targets.forEach((item) => {
      if (item.section.offsetTop <= offset) active = item;
    });
    navLinks.forEach((link) => link.removeAttribute('aria-current'));
    if (active) active.link.setAttribute('aria-current', 'true');
    nav?.classList.toggle('is-scrolled', window.scrollY > 56);
  };

  if (!reduceMotion) {
    document.documentElement.classList.add('motion-ready');
    const revealTargets = document.querySelectorAll(
      '.hero-inner > *, .section > .container > *, .section > .container .strand-card, .section > .container .exp-card, .section > .container .why-cell, .section > .container .idea'
    );
    revealTargets.forEach((element) => element.classList.add('reveal'));
    const revealObserver = new IntersectionObserver(
      (entries, observer) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 }
    );
    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  window.addEventListener('scroll', setCurrentLink, { passive: true });
  window.addEventListener('resize', setCurrentLink);
  setCurrentLink();
};


window.initScenes = function(){
  document.querySelectorAll('.scene-trigger').forEach(function(btn){
    var scene=document.getElementById(btn.getAttribute('aria-controls'));
    if(!scene) return;
    btn.addEventListener('click',function(){
      var open=btn.getAttribute('aria-expanded')==='true';
      if(open){ scene.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
      else { scene.classList.remove('is-open'); void scene.offsetWidth; scene.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
    });
  });
};

(function(){ const base = window.initSite; window.initSite = function(){ base(); if (window.initScenes) window.initScenes(); }; })();
