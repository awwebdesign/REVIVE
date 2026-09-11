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
document.querySelectorAll('.practice-note p, .section-heading h2, .section-heading p, .about-copy > p, .about-copy h2, .footer-invitation h2, .footer-invitation p, .footer-details > div').forEach((el, i) => {
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
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
menu.addEventListener('click', () => header.classList.remove('is-hidden'));

// Desktop tabs become individual disclosures beneath each card on mobile.
const serviceTabs = [...document.querySelectorAll('.service-tab')];
const servicePanels = [...document.querySelectorAll('.service-panel')];
const serviceTabList = document.querySelector('.service-tabs');
const servicePanelList = document.querySelector('.service-panels');
const mobileTreatments = window.matchMedia('(max-width: 700px)');
let selectedService = 0;
function selectService(index, animate = true) {
  selectedService = index;
  serviceTabs.forEach((tab, i) => {
    if (mobileTreatments.matches) {
      tab.removeAttribute('aria-selected');
      tab.setAttribute('aria-expanded', String(i === index));
      tab.tabIndex = 0;
    } else {
      tab.removeAttribute('aria-expanded');
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    }
    servicePanels[i].hidden = i !== index;
  });
  if (index >= 0 && animate && !motionPreference.matches) {
    servicePanels[index].animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}], {duration:240,easing:easeOut});
  }
}
function layoutTreatments() {
  const mobile = mobileTreatments.matches;
  serviceTabList.setAttribute('role', mobile ? 'group' : 'tablist');
  serviceTabs.forEach((tab, i) => {
    tab.setAttribute('role', mobile ? 'button' : 'tab');
    servicePanels[i].setAttribute('role', mobile ? 'region' : 'tabpanel');
    if (mobile) tab.after(servicePanels[i]);
    else servicePanelList.append(servicePanels[i]);
  });
  servicePanelList.hidden = mobile;
  selectService(!mobile && selectedService < 0 ? 0 : selectedService, false);
}
serviceTabs.forEach((tab, i) => {
  tab.addEventListener('click', event => {
    const previousTop = tab.getBoundingClientRect().top;
    selectService(mobileTreatments.matches && selectedService === i ? -1 : i, event.detail !== 0);
    if (mobileTreatments.matches) {
      // Closing an earlier panel must not pull the chosen card away from the finger.
      const offset = tab.getBoundingClientRect().top - previousTop;
      if (Math.abs(offset) > 1) window.scrollBy({top:offset,behavior:'instant'});
    }
  });
  tab.addEventListener('keydown', event => {
    if (mobileTreatments.matches) return;
    let index;
    if (event.key === 'ArrowRight') index = (i + 1) % serviceTabs.length;
    if (event.key === 'ArrowLeft') index = (i + serviceTabs.length - 1) % serviceTabs.length;
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = serviceTabs.length - 1;
    if (index !== undefined) { event.preventDefault(); selectService(index, false); serviceTabs[index].focus(); }
  });
});
mobileTreatments.addEventListener('change', layoutTreatments);
layoutTreatments();

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
