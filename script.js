/* =========================================================
   VESALIO CLINIC — Landing Page Script
   ========================================================= */

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
    { threshold: 0.15, rootMargin: '-80px 0px -20% 0px' }
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
     Hero scroll effects: bg parallax + content fade-exit
  ----------------------------------------------------- */
  const heroBg       = document.querySelector('.hero-bg');
  const heroContent  = document.querySelector('.hero-content');
  const heroSect     = document.getElementById('inicio');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let heroScrollPending = false;

  function updateHeroOnScroll() {
    heroScrollPending = false;
    const y     = window.scrollY;
    const heroH = heroSect ? heroSect.offsetHeight : window.innerHeight;

    if (heroBg && window.innerWidth > 720 && !prefersReduced.matches) {
      if (y < 600) heroBg.style.transform = `translateY(${y * 0.25}px) scale(1.1)`;
    }

    if (heroContent && !prefersReduced.matches) {
      const fadeStart = heroH * 0.20;
      const fadeEnd   = heroH * 0.60;
      if (y <= fadeStart) {
        heroContent.style.opacity   = '1';
        heroContent.style.transform = '';
      } else if (y >= fadeEnd) {
        heroContent.style.opacity   = '0';
        heroContent.style.transform = 'translateY(-20px)';
      } else {
        const p     = (y - fadeStart) / (fadeEnd - fadeStart);
        const eased = p * p;
        heroContent.style.opacity   = String(1 - eased);
        heroContent.style.transform = `translateY(${-20 * eased}px)`;
      }
    }
  }

  window.addEventListener('scroll', () => {
    if (heroScrollPending) return;
    heroScrollPending = true;
    requestAnimationFrame(updateHeroOnScroll);
  }, { passive: true });

  /* -----------------------------------------------------
     Hero mouse-move parallax — desktop only
  ----------------------------------------------------- */
  if (window.innerWidth > 768) {
    const heroEl = document.getElementById('inicio');
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let mouseRafId = null, isMouseOver = false;

    function lerpMouseParallax() {
      const speed = 0.08;
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      const settled = !isMouseOver && Math.abs(currentX) < 0.05 && Math.abs(currentY) < 0.05;
      if (settled) { mouseRafId = null; return; }

      const y     = window.scrollY;
      const heroH = heroSect ? heroSect.offsetHeight : window.innerHeight;
      if (heroContent && y < heroH * 0.20) {
        heroContent.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      mouseRafId = requestAnimationFrame(lerpMouseParallax);
    }

    heroEl.addEventListener('mousemove', (e) => {
      if (prefersReduced.matches) return;
      isMouseOver = true;
      const rect  = heroEl.getBoundingClientRect();
      const normX = (e.clientX - rect.left)  / rect.width  - 0.5;
      const normY = (e.clientY - rect.top)   / rect.height - 0.5;
      targetX = -normX * 24;
      targetY = -normY * 16;
      if (!mouseRafId) mouseRafId = requestAnimationFrame(lerpMouseParallax);
    });

    heroEl.addEventListener('mouseleave', () => {
      isMouseOver = false;
      targetX = 0; targetY = 0;
      if (!mouseRafId) mouseRafId = requestAnimationFrame(lerpMouseParallax);
    });
  }

  /* -----------------------------------------------------
     Booking form — send via WhatsApp
  ----------------------------------------------------- */
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');
  const WA_NUMBER = '525548423467';
  const SUBMIT_COOLDOWN = 30_000;
  const SUBMIT_KEY = 'vesalio_last_submit';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot: real users leave this blank; bots fill it
    if (form.website && form.website.value !== '') return;

    // Rate limiting: one submission per 30 seconds
    const lastSubmit = parseInt(localStorage.getItem(SUBMIT_KEY) || '0', 10);
    const now = Date.now();
    if (now - lastSubmit < SUBMIT_COOLDOWN) {
      const wait = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmit)) / 1000);
      status.textContent = `Espera ${wait} segundo${wait !== 1 ? 's' : ''} antes de enviar otro mensaje.`;
      status.classList.remove('ok');
      status.classList.add('err');
      return;
    }

    const name    = form.name.value.trim().slice(0, 100);
    const phone   = form.phone.value.trim().slice(0, 20);
    const service = form.service.value.trim();
    const message = form.message.value.trim().slice(0, 500);

    status.classList.remove('ok', 'err');

    if (!name || !phone || !service) {
      status.textContent = 'Por favor completa nombre, teléfono y servicio.';
      status.classList.add('err');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      status.textContent = 'Por favor ingresa un número de teléfono válido.';
      status.classList.add('err');
      return;
    }

    const text =
`¡Hola Vesalio Clinic! Quiero agendar una cita.

• Nombre: ${name}
• Teléfono: ${phone}
• Servicio: ${service}${message ? `\n• Motivo: ${message}` : ''}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

    localStorage.setItem(SUBMIT_KEY, String(now));
    status.textContent = 'Abriendo WhatsApp con tu mensaje…';
    status.classList.add('ok');

    window.open(url, '_blank', 'noopener');

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

  // WhatsApp conversion tracking — GA4
  [
    { id: 'waBooking', label: 'booking_section' },
    { id: 'waFooter',  label: 'footer' },
    { id: 'waFloat',   label: 'floating_button' },
  ].forEach(({ id, label }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { event_category: 'CTA', event_label: label });
      }
    });
  });

});

/* =========================================================
   TEAM PROFILE CAROUSEL — fade-based single-member view
   Large photo block (left) + overlapping card (right).
   On mobile: stacked vertically. Prev/next + dots nav.
   ========================================================= */
(function initTeamProfileCarousel() {
  const members = [
    {
      name: "Íñigo Salazar",
      role: "Fisioterapeuta deportivo",
      description: "Especializado en deporte y evaluación de movimiento funcional. Triatleta de medias y largas distancias, apasionado del rendimiento humano.",
      photo: "./assets/inigo.png",
    },
    {
      name: "Ana Cristina Suárez",
      role: "Ortopedia & Oncología",
      description: "Especialista en ortopedia y secuelas oncológicas, vasculares y linfáticas. Triatleta de cortas distancias, comprometida con cada paciente.",
      photo: "./assets/ana.png",
    },
    {
      name: "Irina Segura",
      role: "Biomecánica de carrera",
      description: "Especialista en ortopedia, deporte y biomecánica de carrera. Triatleta de cortas y medianas distancias, nadadora de aguas abiertas.",
      photo: "./assets/irina.png",
    },
    {
      name: "Gabriela Mejía",
      role: "Punción seca",
      description: "Especialista en punción seca y liberación de puntos gatillo. Apasionada de la filigrana y el salto de cuerda.",
      photo: "./assets/gaby.png",
    },
    {
      name: "Florencia Rosso",
      role: "Psicoterapia",
      description: "Psicoterapeuta psicoanalítica especialista en niños, adolescentes, TCA's, obesidad y College Counseling. Foodie y fanática de viajar.",
      photo: "./assets/florencia.png",
    },
  ];

  const photoBlock = document.querySelector('.tpc-photo-block');
  const cardBlock  = document.querySelector('.tpc-card-block');
  const imgEl      = document.getElementById('tpcImg');
  const nameEl     = document.getElementById('tpcName');
  const roleEl     = document.getElementById('tpcRole');
  const descEl     = document.getElementById('tpcDesc');
  const dotsWrap   = document.getElementById('tpcDots');
  const prevBtn    = document.getElementById('tpcPrev');
  const nextBtn    = document.getElementById('tpcNext');
  if (!photoBlock || !imgEl) return;

  let current = 0;
  let busy    = false;

  const dots = members.map((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'tpc-dot';
    btn.setAttribute('aria-label', `Ver perfil de ${m.name}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
    return btn;
  });

  function render(m) {
    imgEl.src          = m.photo;
    imgEl.alt          = m.name;
    nameEl.textContent = m.name;
    roleEl.textContent = m.role;
    descEl.textContent = m.description;
  }

  function syncDots() {
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  function goTo(index) {
    const next = ((index % members.length) + members.length) % members.length;
    if (next === current || busy) return;
    busy = true;

    gsap.to([photoBlock, cardBlock], {
      opacity: 0,
      duration: 0.14,
      ease: 'power1.out',
      onComplete() {
        current = next;
        render(members[current]);
        syncDots();
        gsap.to(photoBlock, { opacity: 1, duration: 0.22, ease: 'power2.out' });
        gsap.fromTo(cardBlock,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out',
            onComplete() { busy = false; } }
        );
      }
    });
  }

  // Touch swipe
  let touchStartX = 0;
  const wrap = document.querySelector('.tpc-wrap');
  if (wrap) {
    wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) goTo(current + (dx > 0 ? 1 : -1));
    }, { passive: true });
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // GSAP entrance animation
  if (window.gsap && wrap) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        gsap.from('.tpc-photo-block', { opacity: 0, x: -30, duration: 0.7, ease: 'power2.out' });
        gsap.from('.tpc-card-block',  { opacity: 0, x: 30,  duration: 0.7, ease: 'power2.out', delay: 0.15 });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(wrap);
  }

  render(members[0]);
  syncDots();
})();


/* =========================================================
   CIRCULAR GALLERY — vanilla JS port of CircularGallery component
   Images spin in a 3D carousel driven by scroll progress within
   the section. Auto-rotates at low speed when not scrolling.
   ========================================================= */
(function initCircularGallery() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const RADIUS = 555;
  const AUTO_SPEED = 0.018; // degrees per frame when idle

  const images = [
    { src: './assets/athletes/IMG_2400.jpg',  label: 'Atleta #1' },
    { src: './assets/athletes/IMG_9218.JPG',  label: 'Atleta #2' },
    { src: './assets/athletes/IMG_1668.JPG',  label: 'Atleta #3' },
    { src: './assets/athletes/IMG_1643.JPG',  label: 'Atleta #4' },
    { src: './assets/athletes/IMG_1642.JPG',  label: 'Atleta #5' },
    { src: './assets/athletes/IMG_1751.JPG',  label: 'Atleta #6' },
    { src: './assets/athletes/IMG_1831.JPG',  label: 'Atleta #7' },
    { src: './assets/athletes/IMG_2445.JPG',  label: 'Atleta #8' },
    { src: './assets/athletes/IMG_2409.jpg',  label: 'Atleta #9' },
    { src: './assets/athletes/IMG_1855.JPG',  label: 'Atleta #10' },
    { src: './assets/athletes/IMG_9205.JPG',  label: 'Atleta #11' },
    { src: './assets/athletes/IMG_7833.JPG',  label: 'Atleta #12' },
    { src: './assets/athletes/IMG_1845.JPG',  label: 'Atleta #13' },
  ];

  const anglePerItem = 360 / images.length;

  // Build gallery cards
  images.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('aria-label', item.label);
    card.style.transform = `rotateY(${i * anglePerItem}deg) translateZ(${RADIUS}px)`;

    const img = document.createElement('img');
    img.src     = item.src;
    img.alt     = item.label;
    img.loading = 'lazy';

    const label = document.createElement('div');
    label.className   = 'gallery-card-label';
    label.textContent = item.label;

    card.appendChild(img);
    card.appendChild(label);
    track.appendChild(card);
  });

  const section = document.getElementById('galeria');
  let rotation   = 0;
  let isScrolling = false;
  let scrollTimer = null;
  let rafId       = null;

  function applyRotation(deg) {
    track.style.transform = `rotateY(${deg}deg)`;

    // Update per-card opacity: cards facing away are dimmer
    const cards = track.querySelectorAll('.gallery-card');
    cards.forEach((card, i) => {
      const itemAngle     = i * anglePerItem;
      const totalRot      = deg % 360;
      const relative      = ((itemAngle + totalRot) % 360 + 360) % 360;
      const normalized    = relative > 180 ? 360 - relative : relative;
      card.style.opacity  = Math.max(0.25, 1 - normalized / 180);
    });
  }

  // Scroll-driven rotation: maps scroll progress within section → 0–360°
  function onScroll() {
    if (!section) return;
    const rect          = section.getBoundingClientRect();
    const sectionH      = section.offsetHeight - window.innerHeight;
    const scrolled      = -rect.top;
    if (scrolled < 0 || scrolled > sectionH) return;

    rotation = (scrolled / sectionH) * 360;
    applyRotation(rotation);

    isScrolling = true;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Auto-rotate when user isn't scrolling
  function tick() {
    if (!isScrolling) {
      rotation += AUTO_SPEED;
      applyRotation(rotation);
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
})();

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
  if (!window.gsap) return;

  const ITEM_HEIGHT   = 65;
  const AUTO_INTERVAL = 3000;

  const services = [
    { name: "Lesiones deportivas",    description: "Recuperación integral de lesiones en atletas y deportistas de todos los niveles.", icon: "fas fa-person-running",       image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200" },
    { name: "Rehab. ortopédica",      description: "Tratamiento de afecciones musculoesqueléticas con enfoque funcional.",            icon: "fas fa-bone",                  image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200" },
    { name: "Ejercicio terapéutico",  description: "Programas de movimiento personalizados según tu condición y objetivos.",          icon: "fas fa-dumbbell",              image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200" },
    { name: "Fortalecimiento",        description: "Desarrollo de fuerza y estabilidad para un rendimiento óptimo y seguro.",         icon: "fas fa-hand-fist",             image: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=1200" },
    { name: "Terapia manual",         description: "Técnicas manuales especializadas para aliviar el dolor y recuperar movilidad.",   icon: "fas fa-hands",                 image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200" },
    { name: "Agentes físicos",        description: "Ultrasonido, electroterapia y otros agentes para acelerar la recuperación.",      icon: "fas fa-wave-square",           image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200" },
    { name: "Punción seca",           description: "Liberación de puntos gatillo mediante agujas de acupuntura.",                     icon: "fas fa-syringe",               image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=1200" },
    { name: "Análisis biomecánico",   description: "Evaluación detallada de tu técnica y eficiencia al correr.",                     icon: "fas fa-shoe-prints",           image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" },
    { name: "Retorno al deporte",     description: "Protocolo progresivo para volver al deporte de forma segura y efectiva.",        icon: "fas fa-trophy",                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200" },
    { name: "Descargas musculares",   description: "Liberación de la tensión muscular acumulada por el entrenamiento.",              icon: "fas fa-hand-holding-medical",  image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200" }
  ];

  const container      = document.getElementById('featureCarousel');
  if (!container) return;

  const labelsCenter   = document.getElementById('fcLabelsCenter');
  const cardsContainer = document.getElementById('fcCardsContainer');
  const total          = services.length;

  let currentIndex = 0;
  let isPaused     = false;
  let autoTimer;

  // ── Build label buttons ──────────────────────────────────────
  const labelBtns = services.map((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'fc-label-btn';
    btn.innerHTML = `<i class="${s.icon}" aria-hidden="true"></i><span>${s.name}</span>`;
    btn.setAttribute('aria-label', s.name);
    btn.addEventListener('click', () => goTo(i));
    labelsCenter.appendChild(btn);
    return btn;
  });

  gsap.set(labelBtns, { xPercent: -50, yPercent: -50 });

  // ── Build image cards ────────────────────────────────────────
  const cardEls = services.map((s, i) => {
    const card = document.createElement('div');
    card.className = 'fc-card';
    card.innerHTML = `
      <img src="${s.image}" alt="${s.name}" loading="${i === 0 ? 'eager' : 'lazy'}" />
      <div class="fc-card-overlay">
        <div class="fc-card-badge">${i + 1} · ${s.name}</div>
        <p class="fc-card-desc">${s.description}</p>
      </div>`;
    cardsContainer.appendChild(card);
    return card;
  });

  // ── Helpers ──────────────────────────────────────────────────
  function wrapIdx(v) { return ((v % total) + total) % total; }

  function goTo(index) {
    currentIndex = wrapIdx(index);
    render();
  }

  // ── Render ───────────────────────────────────────────────────
  function render() {
    labelBtns.forEach((btn, i) => {
      const dist = i - currentIndex;
      let wd = dist;
      if (dist >  total / 2) wd -= total;
      if (dist < -total / 2) wd += total;

      gsap.to(btn, {
        xPercent: -50, yPercent: -50,
        y:        wd * ITEM_HEIGHT,
        opacity:  Math.max(0, 1 - Math.abs(wd) * 0.25),
        duration: 0.7,
        ease:     'expo.out'
      });
      btn.classList.toggle('active', i === currentIndex);
    });

    cardEls.forEach((card, i) => {
      const diff = i - currentIndex;
      let nd = diff;
      if (nd >  total / 2) nd -= total;
      if (nd < -total / 2) nd += total;

      const isActive = nd === 0;
      const isPrev   = nd === -1;
      const isNext   = nd ===  1;

      gsap.to(card, {
        x:        isActive ? 0 : isPrev ? -110 : isNext ? 110 : 0,
        scale:    isActive ? 1 : (isPrev || isNext) ? 0.85 : 0.7,
        opacity:  isActive ? 1 : (isPrev || isNext) ? 0.4  : 0,
        rotation: isPrev ? -3 : isNext ? 3 : 0,
        zIndex:   isActive ? 20 : (isPrev || isNext) ? 10 : 0,
        duration: 0.7,
        ease:     'expo.out'
      });

      const img = card.querySelector('img');
      if (img) gsap.to(img, {
        filter:   isActive
          ? 'grayscale(0%) blur(0px) brightness(100%)'
          : 'grayscale(100%) blur(2px) brightness(70%)',
        duration: 0.55,
        ease:     'power2.out'
      });

      const overlay = card.querySelector('.fc-card-overlay');
      if (overlay) gsap.to(overlay, {
        opacity:  isActive ? 1 : 0,
        y:        isActive ? 0 : 16,
        duration: 0.4,
        ease:     'power2.out'
      });
    });
  }

  // ── Auto-play ────────────────────────────────────────────────
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => { if (!isPaused) goTo(currentIndex + 1); }, AUTO_INTERVAL);
  }

  container.addEventListener('mouseenter', () => { isPaused = true;  });
  container.addEventListener('mouseleave', () => { isPaused = false; });

  // ── Wheel scroll on left panel ───────────────────────────────
  const fcLeft = container.querySelector('.fc-left');
  if (fcLeft) {
    let wheelDelta = 0;
    let wheelTimer = null;
    fcLeft.addEventListener('wheel', e => {
      e.preventDefault();
      wheelDelta += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelDelta = 0; }, 150);
      if (Math.abs(wheelDelta) >= 60) {
        goTo(currentIndex + (wheelDelta > 0 ? 1 : -1));
        wheelDelta = 0;
      }
    }, { passive: false });
  }

  // ── Touch swipe ──────────────────────────────────────────────
  let touchStartX = 0;
  container.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(currentIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  render();
  startAuto();
}());