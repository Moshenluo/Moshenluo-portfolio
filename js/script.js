/* ============================================================
   Tang Yijie | Portfolio — Apple Minimal
   Scroll reveal · Mobile nav · Project filters · Back to top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initMobileNav();
  initProjectFilters();
  initBackToTop();
  initNavShadow();
});

/* ── Scroll Reveal (Intersection Observer) ── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.about-card, .skill-card, .project-card, .resume-card, .contact-card, .section-head, .resume-actions'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ── Mobile Navigation ── */
function initMobileNav() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── Project Filters ── */
function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('filter-hide');
        } else {
          card.classList.add('filter-hide');
        }
      });
    });
  });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Nav Shadow on Scroll ── */
function initNavShadow() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 1px 3px rgba(0,0,0,0.04)'
      : 'none';
  }, { passive: true });
}
