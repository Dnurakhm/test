/* script.js
 - offcanvas menu
 - countdown (48h session)
 - reveal animation
 - counters
 - toggle service details
 - floating contacts display
 - smooth anchors
*/

(function () {
  // OFFCANVAS
  const off = document.getElementById('offcanvas');
  const btn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('offClose');
  if (btn && off) {
    btn.addEventListener('click', () => {
      off.classList.add('open');
      off.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
    function closeOff() {
      off.classList.remove('open');
      off.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    if (closeBtn) closeBtn.addEventListener('click', closeOff);
    off.addEventListener('click', (e) => { if (e.target === off) closeOff(); });
    off.querySelectorAll('.off-link').forEach(a => a.addEventListener('click', closeOff));
  }

  // COUNTDOWN (48 hours per session)
  (function countdown() {
    const KEY = 'promo_end_v9';
    const D = 48 * 3600;
    let end = sessionStorage.getItem(KEY);
    if (!end) { end = Math.floor(Date.now() / 1000) + D; sessionStorage.setItem(KEY, end); } else end = Number(end);
    const el = document.getElementById('countdown');
    if (!el) return;
    function tick() {
      const now = Math.floor(Date.now() / 1000);
      let diff = Math.max(0, end - now);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (diff > 0) setTimeout(tick, 1000);
    }
    document.addEventListener('DOMContentLoaded', tick);
  })();

  // ANIMATE NUMBERS
  function animateNumber(el, to, opts = {}) {
    if (!el) return;
    const dur = opts.duration || 1200;
    const startTs = performance.now();
    const start = 0;
    function frame(now) {
      const t = Math.min((now - startTs) / dur, 1);
      const val = Math.floor(start + (to - start) * t);
      if (opts.currency) el.textContent = val.toLocaleString('ru-RU') + ' ₸';
      else el.textContent = val.toLocaleString('ru-RU') + (opts.suffix || '');
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = [
      { id: 'stat-clients', to: 120, opts: { suffix: '+' } },
      { id: 'stat-saved', to: 10000000, opts: { currency: true } },
      { id: 'stat-years', to: 7, opts: {} }
    ];
    counters.forEach((c, i) => {
      const el = document.getElementById(c.id);
      if (!el) return;
      const run = () => setTimeout(() => animateNumber(el, c.to, c.opts), i * 200);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) run();
      else {
        const io = new IntersectionObserver((entries, ob) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) { run(); ob.unobserve(entry.target); }
          });
        }, { threshold: 0.2 });
        io.observe(el);
      }
    });
  }

  // REVEAL ANIMATION
  function initReveal() {
    const items = document.querySelectorAll('[data-anim], .card');
    const io = new IntersectionObserver((entries, ob) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          const inner = entry.target.querySelectorAll('.card');
          inner.forEach(c => c.classList.add('in-view'));
          ob.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(i => io.observe(i));
    // reveal already visible
    document.querySelectorAll('.card').forEach(c => { if (c.getBoundingClientRect().top < window.innerHeight) c.classList.add('in-view'); });
  }

  // TOGGLE SERVICE DETAILS
  function initServiceToggles() {
    const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('aria-controls');
        const target = document.getElementById(targetId);
        if (!target) return;
        const isOpen = !target.hasAttribute('hidden');
        if (isOpen) {
          target.setAttribute('hidden', '');
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = 'Подробнее ▾';
        } else {
          target.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
          btn.textContent = 'Свернуть ▴';
          // smooth scroll into view for the card body on small screens
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 80);
        }
      });
    });
  }

  // FIXED CONTACTS TOGGLE
  (function initFixed() {
    const fc = document.querySelector('.fixed-contacts');
    if (!fc) return;
    function toggle() { fc.style.display = window.innerWidth <= 720 ? 'flex' : 'none'; }
    window.addEventListener('resize', toggle);
    toggle();
  })();

  // SMOOTH ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // INIT
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initCounters();
    initServiceToggles();
  });
})();

