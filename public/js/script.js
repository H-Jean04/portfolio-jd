/* =============================================
   PORTFOLIO - Jean Houédougbé
   script.js
   ============================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');

const mobileNav = document.createElement('div');
mobileNav.className = 'mobile-nav';
mobileNav.innerHTML = `
  <button class="mobile-nav-close" id="mobile-close">✕</button>
  <a href="#home">Accueil</a>
  <a href="#about">À propos</a>
  <a href="#projects">Projets</a>
  <a href="#skills">Compétences</a>
  <a href="#blog">Blog</a>
  <a href="#contact">Contact</a>
`;
document.body.appendChild(mobileNav);

function openMenu() {
  mobileNav.classList.add('open');
  hamburger.style.display = 'none'; // cache le hamburger quand menu ouvert
}

function closeMenu() {
  mobileNav.classList.remove('open');
  hamburger.style.display = 'flex'; // réaffiche le hamburger
}

hamburger.addEventListener('click', openMenu);
document.getElementById('mobile-close').addEventListener('click', closeMenu);
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Fermer avec Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ---- CIRCUIT CANVAS ANIMATION ----
const canvas = document.getElementById('circuit-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const NODES = [];
const NODE_COUNT = 24;
const MAX_DIST = 200;
const CYAN = '#00e5ff';

class Node {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 2 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < NODE_COUNT; i++) NODES.push(new Node());

function animateCircuit() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < NODES.length; i++) {
    NODES[i].update();
    NODES[i].draw();
    for (let j = i + 1; j < NODES.length; j++) {
      const dx = NODES[i].x - NODES[j].x;
      const dy = NODES[i].y - NODES[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.3;
        ctx.beginPath();
        ctx.moveTo(NODES[i].x, NODES[i].y);
        // Draw circuit-style L-shaped lines
        const midX = NODES[i].x + (NODES[j].x - NODES[i].x) * 0.5;
        ctx.lineTo(midX, NODES[i].y);
        ctx.lineTo(midX, NODES[j].y);
        ctx.lineTo(NODES[j].x, NODES[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateCircuit);
}
animateCircuit();

// ---- INTERSECTION OBSERVER: REVEAL ----
const reveals = document.querySelectorAll('section, .project-card, .blog-card, .skill-item, .skill-icon-card');
reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// ---- SKILL BAR ANIMATION ----
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('animated'), 300);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(bar => skillObserver.observe(bar));

// ---- SMOOTH ACTIVE NAV ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- CONTACT FORM ----
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"] span');
  btn.textContent = 'Envoi en cours...';

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(res => {
    if (res.ok) {
      form.reset();
      btn.textContent = 'Envoyer le message';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    } else {
      btn.textContent = 'Erreur — réessaie';
    }
  }).catch(() => {
    btn.textContent = 'Erreur réseau';
  });
});

// ---- PARALLAX HERO ----
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    heroContent.style.opacity = 1 - (window.scrollY / window.innerHeight) * 1.4;
  }
});

// ---- BLOG CAROUSEL ----
const carousel = document.getElementById('blog-carousel');
const prevBtn = document.getElementById('blog-prev');
const nextBtn = document.getElementById('blog-next');
const dotsContainer = document.getElementById('carousel-dots');

if (carousel) {
  const cards = carousel.querySelectorAll('.blog-card');
  let currentIndex = 0;

  // Build dots
  const visibleCount = () => window.innerWidth <= 600 ? 1 : 2;
  const totalSlides = () => Math.ceil(cards.length / visibleCount());

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(idx) {
    const cardWidth = cards[0].offsetWidth + 24; // gap
    currentIndex = Math.max(0, Math.min(idx, totalSlides() - 1));
    carousel.scrollTo({ left: currentIndex * (cardWidth * visibleCount()), behavior: 'smooth' });
    updateDots();
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= totalSlides() - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Touch/swipe support
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
  });

  buildDots();
  goTo(0);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });
}

if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: top 0.15s ease, left 0.15s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ---- TYPED EFFECT HERO TAG ----
const tagEl = document.querySelector('.hero-tag');
if (tagEl) {
  const texts = [
    'Disponible pour stage / alternance',
    'Open to embedded systems roles',
    'Systèmes embarqués & IoT'
  ];
  let textIdx = 0;
  setInterval(() => {
    textIdx = (textIdx + 1) % texts.length;
    tagEl.innerHTML = `<span class="dot pulse"></span> ${texts[textIdx]}`;
  }, 3500);
}

// ---- MODALE MOTIVATIONS ----
document.addEventListener('DOMContentLoaded', () => {
  const motivOverlay = document.getElementById('motiv-overlay');
  const motivBtn = document.getElementById('btn-motiv');
  const motivClose = document.getElementById('motiv-close');
  const motivCta = document.getElementById('motiv-cta');

  if (motivBtn) {
    motivBtn.addEventListener('click', () => motivOverlay.classList.add('open'));
  }
  if (motivClose) {
    motivClose.addEventListener('click', () => motivOverlay.classList.remove('open'));
  }
  if (motivOverlay) {
    motivOverlay.addEventListener('click', (e) => {
      if (e.target === motivOverlay) motivOverlay.classList.remove('open');
    });
  }
  if (motivCta) {
    motivCta.addEventListener('click', () => motivOverlay.classList.remove('open'));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') motivOverlay?.classList.remove('open');
  });
});


// ---- PROJECTS CAROUSEL ----
function initProjectCarousel(carouselId, prevId, nextId, dotsId) {
  const carousel = document.getElementById(carouselId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.project-card');
  let current = 0;
  const visible = () => window.innerWidth <= 600 ? 1 : 2;
  const total = () => Math.ceil(cards.length / visible());

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total(); i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total() - 1));
    const cardWidth = cards[0].offsetWidth + 24;
    carousel.scrollTo({ left: current * cardWidth * visible(), behavior: 'smooth' });
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= total() - 1;
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Swipe tactile
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });

  buildDots();
  goTo(0);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });
}

initProjectCarousel('proj-carousel-1', 'proj1-prev', 'proj1-next', 'proj-dots-1');
initProjectCarousel('proj-carousel-2', 'proj2-prev', 'proj2-next', 'proj-dots-2');