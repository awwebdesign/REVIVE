'use strict';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)';
const rvNav = document.getElementById('rv-nav');
const rvToggle = document.querySelector('.rv-toggle');
const rvDrawer = document.getElementById('rv-drawer');
let lenis;
let scrollFrame;

function configureScroll() {
  cancelAnimationFrame(scrollFrame);
  lenis?.destroy();
  lenis = undefined;
  document.documentElement.style.scrollBehavior = '';
  if (!window.Lenis || motionPreference.matches) return;
  document.documentElement.style.scrollBehavior = 'auto';
  lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
  if (rvToggle?.getAttribute('aria-expanded') === 'true') lenis.stop();
  const tick = time => { lenis.raf(time); scrollFrame = requestAnimationFrame(tick); };
  scrollFrame = requestAnimationFrame(tick);
}
configureScroll();
motionPreference.addEventListener('change', configureScroll);

if (rvNav) {
  const onScroll = () => rvNav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (rvToggle && rvDrawer) {
  const background = [...document.querySelectorAll('main, body > footer, .rv-brand, .rv-links, .rv-pill')];
  let menuOpen = false;
  const setMenu = (open, restoreFocus = false) => {
    menuOpen = open;
    rvToggle.setAttribute('aria-expanded', String(open));
    rvToggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    rvDrawer.inert = !open;
    rvDrawer.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    background.forEach(element => { element.inert = open; });
    if (open) {
      lenis?.stop();
      rvDrawer.querySelector('a')?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      if (restoreFocus) rvToggle.focus({ preventScroll: true });
    }
  };
  rvDrawer.inert = true;
  rvToggle.addEventListener('click', () => setMenu(!menuOpen, menuOpen));
  rvDrawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false, true)));
  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
    if (event.key === 'Tab') {
      const focusable = [rvToggle, ...rvDrawer.querySelectorAll('a[href]')];
      const index = focusable.indexOf(document.activeElement);
      const next = (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      event.preventDefault();
      focusable[next].focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches && menuOpen) setMenu(false);
  });
}

// Preserve URLs, browser history and keyboard focus for in-page links.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const hash = link.getAttribute('href');
    const target = hash === '#' ? document.body : document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (hash === '#') rvNav?.querySelector('a')?.focus({ preventScroll: true });
    else {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    if (lenis) lenis.scrollTo(target, { offset: hash === '#' ? 0 : -100 });
    else target.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth' });
    history.pushState(null, '', hash === '#' ? location.pathname : hash);
  });
});

// Arm reveals before observing: content must be hidden BEFORE it enters view.
// Only opacity changes, so text and photos stay in their original positions.
const syncMotion = () => {
  document.documentElement.classList.toggle('restored-motion', !motionPreference.matches);
};
syncMotion();
motionPreference.addEventListener('change', syncMotion);

// One shared start preserves the mobile logo/button choreography at every width.
const heroMark = document.querySelector('.hero-mark');
const heroLayout = heroMark?.closest('.hero-layout');
if (heroLayout) {
  heroLayout.dataset.heroReveal = 'pending';
  const imageReady = heroMark.decode ? heroMark.decode() : new Promise(resolve => {
    if (heroMark.complete) resolve();
    else {
      heroMark.addEventListener('load', resolve, { once: true });
      heroMark.addEventListener('error', resolve, { once: true });
    }
  });
  Promise.allSettled([imageReady, document.fonts?.ready]).then(() => {
    heroLayout.dataset.heroReveal = 'ready';
  });
}

const revealTargets = [...document.querySelectorAll(
  'main:not(.legal-main) section h2, .footer-invitation h2, .section-heading > p, .practice-note > *, ' +
  '.about-copy > p, .about-signoff, .about-copy > .btn, .review-overview, .review-viewport, ' +
  '.footer-details > div, .footer-book, .first-visit, .t-card, .about-photo, .footer-wordmark, .faq-list > details'
)];
let revealObserver;
function revealImmediately(target) {
  target.dataset.revealInstant = '';
  target.dataset.revealed = 'true';
  revealObserver?.unobserve(target);
}
if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.dataset.revealed = 'true';
      revealObserver.unobserve(target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -64px 0px' });
  revealTargets.forEach(target => {
    target.dataset.scrollReveal = '';
    // Restored scroll positions and already-focused content stay readable.
    if (target.getBoundingClientRect().bottom < 0 || target.contains(document.activeElement)) {
      revealImmediately(target);
    }
  });
  requestAnimationFrame(() => {
    revealTargets.forEach(target => {
      if (!target.dataset.revealed) revealObserver.observe(target);
    });
  });
}

// Keyboard and anchor navigation must never wait for a decorative entrance.
document.addEventListener('focusin', event => {
  revealTargets.forEach(target => {
    if (target.contains(event.target) || event.target.contains(target)) revealImmediately(target);
  });
});

// Reviews slide automatically and remain natively scrollable.
const reviewViewport = document.querySelector('.review-viewport');
const reviewGroup = document.querySelector('.review-group');
const reviewTrack = document.querySelector('.review-track');
if (reviewViewport && reviewGroup && reviewTrack) {
  const clone = reviewGroup.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.inert = true;
  clone.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
  reviewTrack.append(clone);
  let hover = false, focused = false, interacting = false, visible = false;
  let frame, lastTime = 0, resumeTimer;
  let groupWidth = reviewGroup.getBoundingClientRect().width;
  let position = 0, speed = motionPreference.matches ? 20 : 44;
  const canMove = () => !focused && !interacting && visible && !document.hidden && groupWidth > 0;
  const tick = now => {
    if (!canMove()) return;
    const elapsed = lastTime ? Math.min(now - lastTime, 50) : 0;
    lastTime = now;
    const targetSpeed = hover ? 6 : (motionPreference.matches ? 20 : 44);
    speed += (targetSpeed - speed) * (1 - Math.exp(-elapsed / 180));
    position = (position + speed * elapsed / 1000) % groupWidth;
    reviewViewport.scrollLeft = position;
    frame = requestAnimationFrame(tick);
  };
  const update = () => {
    cancelAnimationFrame(frame);
    lastTime = 0;
    position = groupWidth ? reviewViewport.scrollLeft % groupWidth : 0;
    if (canMove()) frame = requestAnimationFrame(tick);
  };
  reviewViewport.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hover = true; update(); } });
  reviewViewport.addEventListener('pointerleave', () => { hover = false; update(); });
  reviewViewport.addEventListener('focusin', () => { focused = true; update(); });
  reviewViewport.addEventListener('focusout', event => { if (!reviewViewport.contains(event.relatedTarget)) { focused = false; update(); } });
  const resume = () => {
    if (!interacting) return;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { interacting = false; update(); }, 2500);
  };
  reviewViewport.addEventListener('pointerdown', () => { interacting = true; clearTimeout(resumeTimer); update(); }, { passive: true });
  window.addEventListener('pointerup', resume, { passive: true });
  window.addEventListener('pointercancel', resume, { passive: true });
  reviewViewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > 0 || event.shiftKey) { interacting = true; update(); resume(); }
  }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(reviewViewport);
  if ('ResizeObserver' in window) new ResizeObserver(() => { groupWidth = reviewGroup.getBoundingClientRect().width; update(); }).observe(reviewGroup);
  motionPreference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
}

document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
