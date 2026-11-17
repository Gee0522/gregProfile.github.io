// ===== CIRCULAR FAVICON =====
(function () {
  const img = new Image();
  img.src = 'img/IMG_1454 5r (2).jpg';
  img.onload = () => {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    let link = document.querySelector("link[rel='icon']");
    if (!link) { link = document.createElement('link'); document.head.appendChild(link); }
    link.rel = 'icon';
    link.href = c.toDataURL('image/png');
  };
})();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
}

function applyTheme(theme, persist) {
  html.setAttribute('data-theme', theme);
  if (persist) storageSet('theme', theme);
  starRGB = readStarColor();
}

function readStarColor() {
  return getComputedStyle(html).getPropertyValue('--star').trim() || '255, 255, 255';
}

let starRGB = readStarColor();

themeBtn.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
});

// Follow system changes if no user preference stored yet
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
  if (!storageGet('theme')) applyTheme(e.matches ? 'light' : 'dark', false);
});

// ===== HEADER STATE + BACK TO TOP =====
const header = document.getElementById('siteHeader');
const backToTop = document.getElementById('backToTop');

function onScrollChrome() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  backToTop.classList.toggle('show', y > 600);
}

window.addEventListener('scroll', onScrollChrome, { passive: true });
onScrollChrome();

// ===== MOBILE DRAWER =====
const burger = document.getElementById('burgerBtn');
const drawer = document.getElementById('mobileMenu');
const drawerBackdrop = document.getElementById('drawerBackdrop');

function setDrawer(open) {
  drawer.classList.toggle('open', open);
  drawerBackdrop.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
  if (open) drawer.querySelector('a').focus();
}

burger.addEventListener('click', () => setDrawer(true));
document.getElementById('drawerClose').addEventListener('click', () => setDrawer(false));
drawerBackdrop.addEventListener('click', () => setDrawer(false));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setDrawer(false)));

// ===== ACTIVE NAV + SLIDING INDICATOR =====
const navList = document.getElementById('navLinks');
const indicator = navList.querySelector('.nav-indicator');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

function moveIndicator() {
  const active = navList.querySelector('.nav-link.active');
  if (!active || navList.offsetParent === null) return;
  const inset = 14;
  indicator.style.width = (active.offsetWidth - inset * 2) + 'px';
  indicator.style.transform = `translateX(${active.offsetLeft + inset}px)`;
}

function setActive(id) {
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
  });
  moveIndicator();
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));
window.addEventListener('resize', moveIndicator);
document.fonts && document.fonts.ready.then(moveIndicator);
moveIndicator();

// ===== SECTION REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

function observeReveal(el) { revealObserver.observe(el); }
document.querySelectorAll('.reveal').forEach(observeReveal);

// ===== TAB FILTER (shared by skills + projects) =====
function setupFilter(tabs, getItems, matches) {
  let busy = false;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active') || busy) return;
      busy = true;

      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
      });

      const filter = tab.dataset.filter;
      const items = getItems();
      const show = items.filter(el => matches(el, filter));
      const hide = items.filter(el => !matches(el, filter));

      hide.forEach(el => { if (!el.classList.contains('is-hidden')) el.classList.add('is-fading'); });

      setTimeout(() => {
        hide.forEach(el => { el.classList.add('is-hidden'); el.classList.remove('is-fading'); });
        show.forEach(el => { el.classList.remove('is-hidden'); el.classList.add('is-fading'); });

        requestAnimationFrame(() => requestAnimationFrame(() => {
          show.forEach((el, i) => setTimeout(() => el.classList.remove('is-fading'), i * 40));
          setTimeout(() => { busy = false; }, show.length * 40 + 250);
        }));
      }, 200);
    });
  });
}

setupFilter(
  [...document.querySelectorAll('#skills .tab')],
  () => [...document.querySelectorAll('#skillsGrid .skill')],
  (el, f) => el.dataset.category === f
);

// ===== EXPERIENCE EXPANSION =====
document.querySelectorAll('.tl-head').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.tl-item');
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
});

// ===== PROJECTS DATA =====
const PROJECTS = [
  {
    id: 'press-fittings',
    title: 'Press-Fittings Online',
    category: 'Shopify Store',
    filters: ['shopify', 'ecommerce'],
    image: 'img/pressfitting.png',
    summary: 'Custom Shopify store for an industrial fittings supplier, built with the Keystone Theme and Storefront API.',
    overview: 'A custom Shopify e-commerce store for an industrial fittings supplier, built from scratch on the Keystone Theme with custom Liquid and the Shopify Storefront API to deliver a fast, scalable, and user-friendly shopping experience.',
    challenge: 'A large catalog of industrial fittings — many sizes, materials, and connection types — made it hard for buyers to quickly find the exact part they needed.',
    solution: 'Built custom Liquid sections and product templates with advanced filtering, using AJAX and the Storefront API for fast, no-reload interactions. Optimized for performance, maintainability, and efficient product discovery.',
    tech: ['Shopify', 'Liquid', 'Tailwind CSS', 'Alpine.js', 'JavaScript', 'AJAX', 'Storefront API', 'SEO'],
    features: ['Advanced product filtering', 'Custom product pages', 'Responsive design', 'Seamless Shopify checkout integration', 'Performance and SEO optimization'],
    live: 'https://pressfittingsonline.com/',
    liveLabel: 'View Live',
    github: 'https://github.com/Gee0522/press-fitting',
  },
  {
    id: 'control-valves',
    title: 'Control Valves Online',
    category: 'Shopify Store',
    filters: ['shopify', 'ecommerce'],
    image: 'img/bonomi.png',
    summary: 'Shopify store for Italian-made actuated control valves and industrial flow control solutions.',
    overview: 'A Shopify storefront for a supplier of Italian-made actuated control valves and industrial flow control solutions.',
    challenge: 'Selecting and purchasing the right actuated valve is a technical process, and industrial buyers needed a simpler way to do it online.',
    solution: 'Built a responsive Shopify store with custom Liquid templates and Tailwind CSS, giving buyers an efficient way to browse, configure, and order high-quality products.',
    tech: ['Shopify', 'Liquid', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    features: ['Streamlined valve browsing and selection', 'Product configuration and ordering', 'Fully responsive design'],
    live: 'https://bonomivalves.com/',
    liveLabel: 'View Live',
    github: 'https://github.com/Gee0522/cvo',
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    category: 'Web App · E-Commerce',
    filters: ['webapp', 'ecommerce'],
    image: 'img/Admin-nextjs.png',
    summary: 'Full-featured marketplace with admin dashboard, real-time inventory management, and Stripe payments.',
    overview: 'A full-featured online marketplace with real-time inventory management, an admin dashboard, Stripe payment integration, and advanced product search.',
    challenge: 'Store owners need a single place to manage products, inventory, and orders while customers expect a fast storefront and secure checkout.',
    solution: 'Built with the Next.js 13 App Router and MySQL via Prisma, with an admin dashboard for catalog and inventory management and Stripe for payments.',
    tech: ['Next.js 13', 'TypeScript', 'Prisma', 'MySQL', 'Stripe', 'Tailwind CSS'],
    features: ['Admin dashboard', 'Real-time inventory management', 'Stripe payment integration', 'Advanced product search'],
    live: 'https://drive.google.com/file/d/1wiOblx9-6B4Ow1EyVsxT9RswD7-X5Fsy/view?usp=sharing',
    liveLabel: 'View Demo',
    github: 'https://github.com/Gee0522/ecommerce-admin-nextjs',
  },
  {
    id: '3d-customizer',
    title: '3D Customizer using AI',
    category: 'Web App · Personal',
    filters: ['webapp'],
    personal: true,
    image: 'img/3D-AI-threeJs.png',
    summary: 'Real-time 3D product customization powered by OpenAI-generated textures and Three.js rendering.',
    overview: 'A full-stack web application that uses OpenAI to enable dynamic 3D product customization, powered by Three.js.',
    challenge: 'Letting users visualize custom product designs in 3D, in real time, without design tools.',
    solution: 'Users apply AI-generated textures and colors to 3D models that render live in the browser with Three.js, for an immersive and intuitive design experience.',
    tech: ['React', 'Three.js', 'OpenAI', 'Vite'],
    features: ['AI-generated textures', 'Real-time 3D rendering', 'Color customization'],
    live: 'https://drive.google.com/file/d/1oIL85XNB47vuFR_vmYMgG3nwX_CNNS75/view?usp=sharing',
    liveLabel: 'View Demo',
    github: 'https://github.com/Gee0522/ThreeJs-3D-AI',
  },
  {
    id: 'music-player',
    title: 'React Music Player',
    category: 'Web App · Personal',
    filters: ['webapp'],
    personal: true,
    image: 'img/React-music-player.png',
    summary: 'Music streaming app with Redux state management, Rapid API integration, and geo-based discovery.',
    overview: 'A music player built with React and Vite, delivering a dynamic, responsive listening experience.',
    challenge: 'Managing complex playback and browsing state across many views while pulling live data from external APIs.',
    solution: 'Redux Toolkit handles application state, Rapid API supplies music data, and a Geo API powers location-based music discovery.',
    tech: ['React', 'Redux Toolkit', 'Rapid API', 'Vite'],
    features: ['Music streaming data', 'Location-based discovery', 'Responsive player UI'],
    live: 'https://drive.google.com/file/d/1oP5CGHOK3lLnFaQfaqTcqbsYH2O6PC8R/view?usp=sharing',
    liveLabel: 'View Demo',
    github: 'https://github.com/Gee0522/React-music-player',
  },
  {
    id: 'plant-shop',
    title: 'Plant Shopping App',
    category: 'Web App · Personal',
    filters: ['webapp', 'ecommerce'],
    personal: true,
    image: 'img/eplantShopping.png',
    summary: 'React e-commerce app with a full shopping cart, product filtering, and Redux Toolkit.',
    overview: 'A React e-commerce app with shopping cart functionality, built with Vite, Redux Toolkit, and modern CSS.',
    challenge: 'Keeping cart contents, quantities, and totals consistent across the whole app.',
    solution: 'Centralized cart state in Redux Toolkit with dynamic product filtering and a fully responsive UI.',
    tech: ['React', 'Redux', 'CSS Modules', 'Vite'],
    features: ['Shopping cart', 'Dynamic product filtering', 'Responsive UI'],
    live: 'https://gee0522.github.io/e-plantShopping/',
    liveLabel: 'View Live',
    github: null,
  },
];

const ICONS = {
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
};

function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ===== PROJECT CARDS =====
const projectsGrid = document.getElementById('projectsGrid');

projectsGrid.innerHTML = PROJECTS.map((p, i) => `
  <article class="project-card reveal" data-index="${i}" data-filters="${p.filters.join(' ')}" tabindex="0" role="button" aria-label="Open details for ${esc(p.title)}">
    <div class="pc-media">
      <img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy">
      ${p.personal ? '<span class="pc-badge">Personal</span>' : ''}
      <span class="pc-open" aria-hidden="true">${ICONS.expand}</span>
    </div>
    <div class="pc-body">
      <span class="pc-cat">${esc(p.category)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <div class="pc-links">
        <a href="${esc(p.live)}" target="_blank" rel="noopener">${esc(p.liveLabel)} ${ICONS.external}</a>
        ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener">View Code ${ICONS.code}</a>` : ''}
      </div>
    </div>
  </article>
`).join('');

projectsGrid.querySelectorAll('.project-card').forEach(card => {
  observeReveal(card);
  const open = () => openModal(Number(card.dataset.index));
  card.addEventListener('click', e => { if (!e.target.closest('a')) open(); });
  card.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === card) { e.preventDefault(); open(); }
  });
});

setupFilter(
  [...document.querySelectorAll('#projectTabs .tab')],
  () => [...projectsGrid.querySelectorAll('.project-card')],
  (el, f) => f === 'all' || el.dataset.filters.split(' ').includes(f)
);

// ===== PROJECT MODAL =====
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalScroll = modal.querySelector('.modal-scroll');
const modalCount = document.getElementById('modalCount');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
let modalIndex = 0;
let modalOrder = [];
let lastFocused = null;
let sliding = false;

function visibleProjectOrder() {
  return [...projectsGrid.querySelectorAll('.project-card:not(.is-hidden)')].map(c => Number(c.dataset.index));
}

function renderModal(index) {
  const p = PROJECTS[index];
  let n = 0;
  const s = () => `class="stagger" style="--i:${n++}"`;

  modalBody.innerHTML = `
    <div class="md-hero">
      <div class="md-shot"><img src="${esc(p.image)}" alt="${esc(p.title)} screenshot"></div>
      <div>
        <span class="pc-cat" ${s()}>${esc(p.category)}</span>
        <h3 class="md-title" id="modalTitle" ${s()}>${esc(p.title)}</h3>
        <p class="md-overview" ${s()}>${esc(p.overview)}</p>
        <div class="tags" ${s()}>${p.tech.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="md-actions" ${s()}>
          <a class="btn btn-primary" href="${esc(p.live)}" target="_blank" rel="noopener">${esc(p.liveLabel)} ${ICONS.external}</a>
          ${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}" target="_blank" rel="noopener">${ICONS.github} View Source</a>` : ''}
        </div>
      </div>
    </div>
    <div class="md-grid">
      <div class="md-block" ${s()}><h4>Business Challenge</h4><p>${esc(p.challenge)}</p></div>
      <div class="md-block" ${s()}><h4>Solution &amp; Implementation</h4><p>${esc(p.solution)}</p></div>
      <div class="md-block wide" ${s()}><h4>Key Features</h4><ul>${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
    </div>
  `;

  const shot = modalBody.querySelector('.md-shot img');
  if (shot.complete) shot.classList.add('loaded');
  else shot.addEventListener('load', () => shot.classList.add('loaded'), { once: true });

  const pos = modalOrder.indexOf(index);
  modalCount.textContent = `${pos + 1} / ${modalOrder.length}`;
  modalPrev.disabled = modalOrder.length < 2;
  modalNext.disabled = modalOrder.length < 2;
  modalScroll.scrollTop = 0;
}

function openModal(index) {
  lastFocused = document.activeElement;
  modalOrder = visibleProjectOrder();
  if (!modalOrder.includes(index)) modalOrder = PROJECTS.map((_, i) => i);
  modalIndex = index;
  renderModal(index);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  setTimeout(() => modal.querySelector('[data-close].icon-btn').focus(), 50);
}

function closeModal() {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (lastFocused) lastFocused.focus();
}

function stepModal(dir) {
  if (sliding || modalOrder.length < 2) return;
  const pos = modalOrder.indexOf(modalIndex);
  const next = modalOrder[(pos + dir + modalOrder.length) % modalOrder.length];

  if (prefersReducedMotion) {
    modalIndex = next;
    renderModal(next);
    return;
  }

  sliding = true;
  modalBody.className = 'modal-body ' + (dir > 0 ? 'slide-out-left' : 'slide-out-right');
  setTimeout(() => {
    modalIndex = next;
    renderModal(next);
    modalBody.className = 'modal-body ' + (dir > 0 ? 'slide-in-left' : 'slide-in-right');
    setTimeout(() => { modalBody.className = 'modal-body'; sliding = false; }, 260);
  }, 180);
}

modalPrev.addEventListener('click', () => stepModal(-1));
modalNext.addEventListener('click', () => stepModal(1));
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));

// Swipe between projects on touch devices
let touchX = null;
modal.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
modal.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 60) stepModal(dx < 0 ? 1 : -1);
  touchX = null;
});

document.addEventListener('keydown', e => {
  if (modal.classList.contains('open')) {
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowRight') stepModal(1);
    else if (e.key === 'ArrowLeft') stepModal(-1);
    else if (e.key === 'Tab') {
      // Keep focus inside the dialog
      const f = [...modal.querySelectorAll('a[href], button:not([disabled])')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  } else if (e.key === 'Escape' && drawer.classList.contains('open')) {
    setDrawer(false);
  }
});

// ===== TOAST =====
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(title, msg, isError) {
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.toggle('error', !!isError);
  toast.querySelector('.toast-icon').innerHTML = isError
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 7v6M12 17h.01"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}

document.getElementById('toastClose').addEventListener('click', () => toast.classList.remove('show'));

// ===== CONTACT FORM (AJAX via FormSubmit) =====
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const sendLabel = sendBtn.querySelector('.btn-label');

form.addEventListener('submit', async e => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    const ok = input.checkValidity();
    input.closest('.field').classList.toggle('invalid', !ok);
    if (!ok && valid) { input.focus(); valid = false; }
  });
  if (!valid) {
    showToast('Check the form', 'Please fill in your name, a valid email, and a message.', true);
    return;
  }

  sendBtn.disabled = true;
  sendLabel.textContent = 'Sending…';

  try {
    const res = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    if (!res.ok) throw new Error('Request failed');
    form.reset();
    showToast('Message Sent!', 'Thank you for reaching out. I\'ll get back to you soon.');
  } catch (err) {
    showToast('Something went wrong', 'Please try again or email gregespellogo@gmail.com directly.', true);
  } finally {
    sendBtn.disabled = false;
    sendLabel.textContent = 'Send Message';
  }
});

form.querySelectorAll('[required]').forEach(input => {
  input.addEventListener('input', () => input.closest('.field').classList.remove('invalid'));
});

// ===== STARFIELD (slow ambient particles) =====
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let w, h, dpr, stars = [];

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = innerWidth;
  h = innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.round(Math.min(110, (w * h) / 14000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    r: Math.random() * 1.3 + 0.3,
    vx: (Math.random() - 0.5) * 0.05,
    vy: -(0.02 + Math.random() * 0.08),
  }));
}

function draw(t) {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const alpha = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.001 + s.z * 10));
    ctx.beginPath();
    ctx.fillStyle = `rgba(${starRGB},${alpha})`;
    ctx.arc(s.x, s.y, s.r * (0.5 + s.z * 0.6), 0, Math.PI * 2);
    ctx.fill();

    s.x += s.vx * (1 + s.z);
    s.y += s.vy * (1 + s.z);
    if (s.y < -10) s.y = h + 10;
    if (s.x < -10) s.x = w + 10;
    if (s.x > w + 10) s.x = -10;
  }
  if (!prefersReducedMotion) requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(draw);
