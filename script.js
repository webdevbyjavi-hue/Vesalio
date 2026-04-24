/* =========================================================
   VESALIO CLINIC — Landing Page Script
   ========================================================= */

let isMobile = window.innerWidth < 768;

window.addEventListener("resize", () => {
  isMobile = window.innerWidth < 768;
});

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
  const progressBar = document.getElementById('scrollProgressBar');
  let rafPending = false;
  const applyHeaderStyle = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? window.scrollY / docHeight : 0;
      progressBar.style.transform = `scaleX(${pct})`;
    }
  };
  const onScroll = () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => { applyHeaderStyle(); rafPending = false; });
    }
  };
  applyHeaderStyle();
  window.addEventListener('scroll', onScroll, { passive: true });

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
     Scale-from-center effect for grid cards on mobile
     Uses IntersectionObserver so no getBoundingClientRect
     on every scroll frame — zero forced layout cost.
  ----------------------------------------------------- */
  if (window.innerWidth <= 720 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const scaleCards = document.querySelectorAll('.services-grid .service-card, .team-grid .team-card');
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const scaleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.style.transform = `scale(${(0.80 + 0.25 * entry.intersectionRatio).toFixed(3)})`;
      });
    }, { threshold: thresholds });
    scaleCards.forEach(card => scaleObserver.observe(card));
  }

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
  if (heroBg && window.innerWidth > 720) {
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
      window.scrollTo({ top, behavior: 'smooth' });
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
    left: '0', top: '0', willChange: 'transform, opacity',
    border: '3px solid rgba(255,255,255,0.45)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
  });
  document.body.appendChild(proxy);

  let heroRect = null;
  let heroSize = 0;

  function measureHero() {
    heroRect = heroImg.getBoundingClientRect();
    heroSize = heroRect.width;
    proxy.style.width  = heroSize + 'px';
    proxy.style.height = heroSize + 'px';
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

    const s = heroSize > 0 ? size / heroSize : 1;
    proxy.style.transform = `translate(${cx - heroSize / 2}px, ${cy - heroSize / 2}px) scale(${s})`;
    proxy.style.opacity   = '1';
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


(function () {

  if (!window.gsap) {
    console.warn("GSAP not loaded");
    return;
  }

  const services = [
    { name: "Ejercicio terapéutico personalizado", description: "Programas específicos que se adaptan a tu condición, objetivos y nivel de actividad.", icon: "fas fa-dumbbell" },
    { name: "Evaluación de movimiento funcional", description: "Analizamos patrones de movimiento para detectar deficiencias y prevenir lesiones.", icon: "fas fa-person-running" },
    { name: "Evaluación de técnica de carrera", description: "Biomecánica aplicada para corredores: cadencia y eficiencia.", icon: "fas fa-shoe-prints" },
    { name: "Descarga muscular manual", description: "Terapia manual para liberar tensión y mejorar recuperación.", icon: "fas fa-hand-holding-medical" },
    { name: "Presoterapia", description: "Activa la circulación y reduce fatiga muscular.", icon: "fas fa-wind" },
    { name: "Electroterapia", description: "Corrientes para analgesia y desinflamación.", icon: "fas fa-wave-square" },
    { name: "Electroestimulación", description: "Activación muscular para rehabilitación.", icon: "fas fa-bolt-lightning" },
    { name: "Punción seca", description: "Liberación de puntos gatillo.", icon: "fas fa-syringe" },
    { name: "Ventosas", description: "Estimula circulación y relaja tejidos.", icon: "fas fa-circle-notch" },
    { name: "Vendaje multicapa", description: "Soporte funcional y estabilidad.", icon: "fas fa-bandage" }
  ];

  const carousel = document.getElementById("servicesCarousel");
  if (!carousel) return;

  let angle = 0;
  const total = services.length;
  const step = 360 / total;
  const radius = 250;

  const cards = services.map(service => {
    const div = document.createElement("div");
    div.className = "services-carousel-card";
    div.innerHTML = `
      <div class="card-inner">
        <i class="${service.icon}"></i>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
      </div>`;
    carousel.appendChild(div);
    return div;
  });

  function position() {
    const mobile = window.innerWidth < 768;
    const activeIndex = Math.round((-angle / step) % total + total) % total;

    if (mobile) {
      cards.forEach((card, i) => {
        let offset = (i - activeIndex + total) % total;
        if (offset > total / 2) offset -= total;
        const absOffset = Math.abs(offset);
        const isActive = offset === 0;

        gsap.to(card, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: offset * 120,
          z: 0,
          rotationY: 0,
          scale: isActive ? 1.05 : Math.max(0.72, 0.88 - absOffset * 0.05),
          opacity: absOffset > 2 ? 0 : isActive ? 1 : Math.max(0, 0.6 - (absOffset - 1) * 0.25),
          zIndex: isActive ? 10 : Math.max(1, 5 - absOffset),
          duration: 0.5,
          ease: "power2.out"
        });
      });
    } else {
      cards.forEach((card, i) => {
        const theta = (i * step + angle) * Math.PI / 90;
        const isActive = activeIndex === i;

        gsap.to(card, {
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          x: Math.sin(theta) * radius,
          y: 0,
          z: Math.cos(theta) * radius,
          rotationY: (i * step + angle),
          scale: isActive ? 1.15 : 0.9,
          filter: isActive ? "brightness(1)" : "brightness(0.7)",
          opacity: 1,
          zIndex: isActive ? 10 : 1,
          duration: 0.6,
          ease: "power3.out"
        });
      });
    }
  }

  function next() { angle -= step; position(); }
  function prev() { angle += step; position(); }

  document.getElementById("serviceNext")?.addEventListener("click", next);
  document.getElementById("servicePrev")?.addEventListener("click", prev);

  setInterval(next, 3000);

  let touchStartX = 0, touchStartY = 0;
  carousel.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  carousel.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
      dy < 0 ? next() : prev();
    } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  window.addEventListener("resize", position, { passive: true });

  position();

})();