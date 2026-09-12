const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)';
function closeMenu(instant = false) {
  nav.classList.toggle('instant', instant);
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Menu openen');
  nav.classList.remove('is-open');
}
menu.addEventListener('click', event => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('instant', event.detail === 0);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu(true); menu.focus();
  }
});
// Reveal copy automatically as it enters the viewport, once per visit.
document.querySelectorAll('.section-heading, .about-copy, .footer-invitation').forEach(el => el.classList.remove('reveal'));
document.querySelectorAll('.practice-note p, .section-heading p, .about-copy > p, .footer-invitation p, .footer-details > div').forEach((el, i) => {
  el.classList.add('text-reveal');
  el.style.setProperty('--reveal-delay', (i % 3) * 65 + 'ms');
});
const revealElements = document.querySelectorAll('.reveal, .text-reveal');
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-enabled');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    });
  }, {threshold:0.12});
  revealElements.forEach(el => {
    el.classList.add('pending'); observer.observe(el);
  });
}

// Direction changes accumulate past a small threshold to prevent scroll jitter.
const header = document.querySelector('.header');
let lastScrollY = window.scrollY, travel = 0, previousDirection = 0;
function updateHeader() {
  const y = Math.max(0, window.scrollY), delta = y - lastScrollY;
  lastScrollY = y;
  const direction = Math.sign(delta);
  if (direction !== previousDirection) travel = 0;
  travel += delta; previousDirection = direction;
  if (y < 130 || menu.getAttribute('aria-expanded') === 'true') {
    header.classList.remove('is-hidden'); return;
  }
  if (Math.abs(travel) < 10) return;
  header.classList.toggle('is-hidden', direction > 0);
}
window.addEventListener('scroll', updateHeader, {passive:true});
updateHeader();
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
menu.addEventListener('click', () => header.classList.remove('is-hidden'));

// (treatments tab-stage removed in v8: replaced by static card deck)

// Real reviews remain native horizontally scrollable content, even without JS.
// The repeated group is only for seamless wrapping, never counted as extra reviews.
const reviewViewport = document.querySelector('.review-viewport');
const reviewGroup = document.querySelector('.review-group');
const reviewClone = reviewGroup.cloneNode(true);
reviewClone.setAttribute('aria-hidden','true');
reviewClone.querySelectorAll('a').forEach(link => link.tabIndex = -1);
document.querySelector('.review-track').append(reviewClone);

let touchActive = false, reviewHover = false, reviewFocus = false, reviewsVisible = false;

let reviewFrame = 0, lastReviewTime = 0, reviewSpeed = 44, position = 0;
let groupWidth = reviewGroup.getBoundingClientRect().width;
function reviewTick(now) {
  reviewFrame = 0;
  if (!reviewsVisible || document.hidden || touchActive || reviewFocus) return;
  const elapsed = lastReviewTime ? Math.min(now - lastReviewTime, 50) : 0;
  lastReviewTime = now;
  const desiredSpeed = reviewHover ? 6 : (motionPreference.matches ? 20 : 44);
  reviewSpeed += (desiredSpeed - reviewSpeed) * (1 - Math.exp(-elapsed / 180));
  position = (position + reviewSpeed * elapsed / 1000) % groupWidth;
  reviewViewport.scrollLeft = position;
  reviewFrame = requestAnimationFrame(reviewTick);
}
function updateReviews() {
  cancelAnimationFrame(reviewFrame); reviewFrame = 0; lastReviewTime = 0;
  position = reviewViewport.scrollLeft % groupWidth;
  if (!touchActive && !reviewFocus && reviewsVisible && !document.hidden) reviewFrame = requestAnimationFrame(reviewTick);
}
reviewViewport.addEventListener('pointerover', event => {
  if (event.pointerType === 'mouse' && event.target.closest('.review-card')) reviewHover = true;
});
reviewViewport.addEventListener('pointerleave', () => { reviewHover = false; });
reviewViewport.addEventListener('focusin', () => { reviewFocus = true; updateReviews(); });
reviewViewport.addEventListener('focusout', event => {
  if (!reviewViewport.contains(event.relatedTarget)) { reviewFocus = false; updateReviews(); }
});
reviewViewport.addEventListener('pointerdown', () => { touchActive = true; updateReviews(); }, {passive:true});
let resumeTimer;
function resumeAfterInteraction() {
  clearTimeout(resumeTimer);
  resumeTimer = setTimeout(() => { touchActive = false; updateReviews(); }, 1800);
}
window.addEventListener('pointerup', resumeAfterInteraction, {passive:true});
window.addEventListener('pointercancel', resumeAfterInteraction, {passive:true});
reviewViewport.addEventListener('wheel', event => {
  if (Math.abs(event.deltaX) > 0 || event.shiftKey) { touchActive = true; updateReviews(); resumeAfterInteraction(); }
}, {passive:true});
new IntersectionObserver(entries => { reviewsVisible = entries[0].isIntersecting; updateReviews(); }).observe(reviewViewport);
new ResizeObserver(() => { groupWidth = reviewGroup.getBoundingClientRect().width; updateReviews(); }).observe(reviewGroup);
motionPreference.addEventListener('change', updateReviews);
document.addEventListener('visibilitychange', updateReviews);
updateReviews();


// Navbar C: nav labels scramble briefly on hover (desktop pointers, motion allowed).
if (!motionPreference.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#*/';
  document.querySelectorAll('.nav a').forEach(link => {
    const real = link.textContent;
    let busy = false;
    link.addEventListener('mouseenter', () => {
      if (busy) return;
      busy = true;
      let frame = 0;
      const id = setInterval(() => {
        link.textContent = real.split('').map((c, i) =>
          c === ' ' ? ' ' : (i < frame / 2 ? real[i] : scrambleChars[Math.floor(Math.random() * scrambleChars.length)])
        ).join('');
        if (frame++ / 2 >= real.length) { clearInterval(id); link.textContent = real; busy = false; }
      }, 26);
    });
  });
}


// ===== v9: motion in Axel's house style (Lenis smooth scroll + word/image reveals) =====
// Smooth scroll, matching awwebdesign.be / crombruggen.be.
if (window.Lenis && !motionPreference.matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') { e.preventDefault(); lenis.scrollTo(0); return; }
      if (id.length > 1) { const t = document.querySelector(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -90 }); } }
    });
  });
}

// Word-by-word heading reveal (the "over-word" move from crombruggen.be).
(function () {
  if (!('IntersectionObserver' in window)) return;
  const heads = document.querySelectorAll('.section-heading h2, .about-copy h2, .footer-invitation h2');
  const wrap = el => {
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(tok => {
            if (tok === '') return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            const w = document.createElement('i');
            w.className = 'rw';
            w.textContent = tok;
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    el.querySelectorAll('.rw').forEach((w, i) => { w.style.transitionDelay = (i * 60) + 'ms'; });
    el.classList.add('heading-rw');
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.3 });
  heads.forEach(h => { wrap(h); io.observe(h); });
})();

// Picture reveal: treatment photos wipe up as the deck enters (mask feel).
(function () {
  if (!('IntersectionObserver' in window)) return;
  const deck = document.querySelector('.treatment-deck');
  if (!deck) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { deck.classList.add('in'); io.disconnect(); } });
  }, { threshold: 0.2 });
  io.observe(deck);
})();
