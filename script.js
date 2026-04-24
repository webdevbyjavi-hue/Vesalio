/* =========================================================
   VESALIO CLINIC — Landing Page Script
   ========================================================= */

let globalLenis = null;


document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     Year in footer
  ----------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------
     Sticky header shadow on scroll
  ----------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const applyHeaderStyle = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  applyHeaderStyle();
  window.addEventListener('scroll', applyHeaderStyle, { passive: true });

  /* -----------------------------------------------------
     Mobile menu toggle
  ----------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  // Close mobile menu when navigating
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
    });
  });

  /* -----------------------------------------------------
     Active nav link based on section in view
  ----------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
  );
  sections.forEach(s => navObserver.observe(s));

  /* -----------------------------------------------------
     Reveal on scroll
  ----------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger slightly
          setTimeout(() => entry.target.classList.add('in-view'), i * 60);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* -----------------------------------------------------
     Count-up animation for the stat badge
  ----------------------------------------------------- */
  const counters = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* -----------------------------------------------------
     Parallax hero background
  ----------------------------------------------------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < 600) heroBg.style.transform = `translateY(${y * 0.25}px) scale(1.1)`;
    }, { passive: true });
  }

  /* -----------------------------------------------------
     Service card ripple on click
  ----------------------------------------------------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const rect = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(154,179,196, 0.25);
        transform: scale(0);
        pointer-events: none;
        animation: rippleEffect 600ms ease-out forwards;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Inject the ripple keyframes once
  const styleEl = document.createElement('style');
  styleEl.textContent = `@keyframes rippleEffect { to { transform: scale(2.5); opacity: 0; } }`;
  document.head.appendChild(styleEl);

  /* -----------------------------------------------------
     Booking form — send via WhatsApp
  ----------------------------------------------------- */
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');
  const WA_NUMBER = '525548423467';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value.trim();
    const message = form.message.value.trim();

    status.classList.remove('ok', 'err');

    if (!name || !phone || !service) {
      status.textContent = 'Por favor completa nombre, teléfono y servicio.';
      status.classList.add('err');
      return;
    }

    const text =
`¡Hola Vesalio Clinic! Quiero agendar una cita.

• Nombre: ${name}
• Teléfono: ${phone}
• Servicio: ${service}${message ? `\n• Motivo: ${message}` : ''}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

    status.textContent = 'Abriendo WhatsApp con tu mensaje…';
    status.classList.add('ok');

    window.open(url, '_blank', 'noopener');

    // Reset after a moment
    setTimeout(() => {
      form.reset();
      status.textContent = '';
      status.classList.remove('ok', 'err');
    }, 4000);
  });

  /* -----------------------------------------------------
     Scroll stack sections + Lenis smooth scroll
  ----------------------------------------------------- */
  initScrollStack();

  /* -----------------------------------------------------
     Smooth anchor scroll with header offset
  ----------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 2;
      if (globalLenis) {
        globalLenis.scrollTo(top, { duration: 1.2 });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* -----------------------------------------------------
     Team card 3D tilt on hover
  ----------------------------------------------------- */
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-10px) perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

});

/* =========================================================
   Scroll Stack — stacking section effect (ported from ReactBits)
   ========================================================= */
function initScrollStack() {
  // Disable scroll stack on mobile - causes overlapping issues
  // Also check on resize to handle browser resizing
  if (window.innerWidth <= 720) {
    // Clear any existing transforms when disabling
    document.querySelectorAll('.scroll-stack-card').forEach(card => {
      card.style.transform = '';
    });
    return;
  }
  
  const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
  if (!cards.length) return;

  const endElement = document.querySelector('.scroll-stack-end');

  const ITEM_SCALE         = 0.03;
  const ITEM_STACK_DIST    = 50;
  const STACK_POSITION     = '15%';
  const SCALE_END_POSITION = '10%';
  const BASE_SCALE         = 0.9;

  cards.forEach((card, i) => {
    card.style.zIndex             = String(i + 1);
    card.style.transformOrigin    = 'top center';
    card.style.backfaceVisibility = 'hidden';
    card.style.willChange         = 'transform';
  });

  // Cache true layout positions (transforms cleared so BoundingClientRect isn't
  // contaminated by any previously applied translateY).
  // Deferred to window.load so image heights are finalised before measuring.
  let cardTops    = [];
  let cardHeights = [];
  let endTop      = 0;
  let ready       = false;

  const measureOffsets = () => {
    cards.forEach(c => { c.style.transform = 'none'; });
    void cards[0].getBoundingClientRect(); // flush style changes before reading
    cardTops    = cards.map(c => c.getBoundingClientRect().top + window.scrollY);
    cardHeights = cards.map(c => c.offsetHeight);
    endTop      = endElement
      ? endElement.getBoundingClientRect().top + window.scrollY
      : document.body.scrollHeight;
    ready = true;
  };

  const parsePercent = (val, h) =>
    typeof val === 'string' && val.includes('%')
      ? (parseFloat(val) / 100) * h
      : parseFloat(val);

  const clamp01 = (t, a, b) =>
    b <= a ? 0 : Math.max(0, Math.min(1, (t - a) / (b - a)));

  const cache = new Map();

  const update = () => {
    if (!ready) return;

    const scrollTop = window.scrollY;
    const vh        = window.innerHeight;
    const stackPx   = parsePercent(STACK_POSITION, vh);

    cards.forEach((card, i) => {
      const cardTop    = cardTops[i];
      const cardHeight = cardHeights[i];

      // Pin triggers when the section's BOTTOM reaches stackPx from viewport top.
      // This lets the user scroll through the entire section before it docks.
      const pinStart = cardTop + cardHeight - stackPx - ITEM_STACK_DIST * i;
      const pinEnd   = endTop  - vh / 2;

      // Scale animates over a short window right as the section docks.
      const scaleEnd = pinStart + vh * 0.08;

      const scaleP = clamp01(scrollTop, pinStart, scaleEnd);
      const scale  = 1 - scaleP * (1 - (BASE_SCALE + i * ITEM_SCALE));

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPx + ITEM_STACK_DIST * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd   - cardTop + stackPx + ITEM_STACK_DIST * i;
      }

      const tY = Math.round(translateY * 100) / 100;
      const s  = Math.round(scale * 1000) / 1000;

      const prev = cache.get(i);
      if (!prev || Math.abs(prev.tY - tY) > 0.1 || Math.abs(prev.s - s) > 0.001) {
        card.style.transform = `translate3d(0,${tY}px,0) scale(${s})`;
        cache.set(i, { tY, s });
      }
    });
  };

  // RAF-throttled scroll — at most one update per animation frame
  let rafId = null;
  window.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => { update(); rafId = null; });
  }, { passive: true });

  // Resize: re-measure after layout settles
  // Also re-enable scroll stack if resizing from mobile to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      // Re-enable scroll stack when going to desktop
      cache.clear();
      measureOffsets();
      update();
    } else {
      // Clear transforms when going to mobile
      cards.forEach(card => {
        card.style.transform = '';
        card.style.zIndex = '';
        card.style.willChange = '';
      });
    }
  });

  // Defer first measurement until all images/fonts are loaded so section
  // heights (which contain photos) are accurate before we cache positions.
  if (document.readyState === 'complete') {
    measureOffsets();
    update();
  } else {
    window.addEventListener('load', () => { measureOffsets(); update(); }, { once: true });
  }
}

// ── Flying Logo ──────────────────────────────────────────────────────────────
(function () {
  const heroImg = document.getElementById('heroLogoImg');
  const navImg  = document.getElementById('navLogoImg');
  if (!heroImg || !navImg) return;

  const NAV_SIZE = 36; // must match .nav-logo-img width/height

  // Fixed-position proxy that flies between the two positions
  const proxy = document.createElement('img');
  proxy.src = heroImg.src;
  proxy.alt = '';
  proxy.setAttribute('aria-hidden', 'true');
  Object.assign(proxy.style, {
    position: 'fixed', borderRadius: '50%', objectFit: 'cover',
    pointerEvents: 'none', zIndex: '999', display: 'block', opacity: '0',
  });
  document.body.appendChild(proxy);

  let heroRect = null;
  let heroSize = 0;

  function measureHero() {
    heroRect = heroImg.getBoundingClientRect();
    heroSize = heroRect.width;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  let ticking = false;
  function update() {
    ticking = false;
    const scrollY = window.scrollY;

    // Re-capture hero position when back at top (handles resize too)
    if (scrollY < 2) measureHero();
    if (!heroRect) return;

    const heroSection = document.getElementById('inicio');
    const heroH = heroSection ? heroSection.offsetHeight : window.innerHeight;
    const progress = clamp01(scrollY / (heroH * 0.45));
    const eased = ease(progress);

    if (progress === 0) {
      heroImg.style.opacity = '1';
      navImg.style.opacity  = '0';
      proxy.style.opacity   = '0';
      return;
    }
    if (progress >= 1) {
      heroImg.style.opacity = '0';
      navImg.style.opacity  = '1';
      proxy.style.opacity   = '0';
      return;
    }

    // In transition: hide both originals, show flying proxy
    heroImg.style.opacity = '0';
    navImg.style.opacity  = '0';

    const navRect = navImg.getBoundingClientRect();
    const size = lerp(heroSize, NAV_SIZE, eased);
    const cx   = lerp(heroRect.left + heroSize / 2, navRect.left + NAV_SIZE / 2, eased);
    const cy   = lerp(heroRect.top  + heroSize / 2, navRect.top  + NAV_SIZE / 2, eased);

    proxy.style.width     = size + 'px';
    proxy.style.height    = size + 'px';
    proxy.style.left      = (cx - size / 2) + 'px';
    proxy.style.top       = (cy - size / 2) + 'px';
    proxy.style.opacity   = '1';
    proxy.style.border    = `3px solid rgba(255,255,255,${lerp(0.45, 0, eased)})`;
    proxy.style.boxShadow = `0 ${lerp(10, 0, eased)}px ${lerp(40, 0, eased)}px rgba(0,0,0,${lerp(0.35, 0, eased)})`;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  window.addEventListener('resize', () => { if (window.scrollY < 2) measureHero(); update(); });

  if (document.readyState === 'complete') {
    measureHero(); update();
  } else {
    window.addEventListener('load', () => { measureHero(); update(); }, { once: true });
  }
}());
