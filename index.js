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

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Init theme from localStorage or system preference
(function () {
  const saved = localStorage.getItem('theme');
  applyTheme(saved || getSystemTheme());
})();

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// Follow system changes if no user preference stored yet
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'light' : 'dark');
  }
});

// ===== BURGER MENU =====
function toggleMenu() {
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  burger.classList.toggle('active');
  navMenu.classList.toggle('active');
}

function closeMenu() {
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  burger.classList.remove('active');
  navMenu.classList.remove('active');
}

// Close menu when clicking outside
document.addEventListener('click', e => {
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (
    navMenu.classList.contains('active') &&
    !navMenu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    closeMenu();
  }
});

// ===== SKILLS FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
let activeFilter = 'frontend';
let isAnimating = false;

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    if (filter === activeFilter || isAnimating) return;

    isAnimating = true;
    activeFilter = filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const allItems = document.querySelectorAll('.skill-item');
    const toHide = [];
    const toShow = [];

    allItems.forEach(item => {
      if (item.dataset.category === filter) {
        toShow.push(item);
      } else {
        toHide.push(item);
      }
    });

    // Fade out current items
    toHide.forEach(item => {
      if (!item.classList.contains('skill-hidden')) {
        item.classList.add('skill-fading');
      }
    });

    setTimeout(() => {
      // Hide faded items
      toHide.forEach(item => {
        item.classList.add('skill-hidden');
        item.classList.remove('skill-fading');
      });

      // Prepare incoming items (invisible but in layout)
      toShow.forEach(item => {
        item.classList.remove('skill-hidden');
        item.classList.add('skill-fading');
      });

      // Trigger reflow then fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toShow.forEach((item, i) => {
            setTimeout(() => {
              item.classList.remove('skill-fading');
            }, i * 40);
          });
          setTimeout(() => { isAnimating = false; }, toShow.length * 40 + 350);
        });
      });
    }, 280);
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 160) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== PROJECTS DATA =====
const projects = {
  project1: {
    title: 'E-Commerce Platform',
    description: 'A full-featured online marketplace with real-time inventory management, an admin dashboard, payment integration via Stripe, and advanced product search capabilities. Built with Next.js 13 App Router and MySQL via Prisma.',
    github: 'https://github.com/Gee0522/ecommerce-admin-nextjs',
    live: 'https://drive.google.com/file/d/1wiOblx9-6B4Ow1EyVsxT9RswD7-X5Fsy/view?usp=sharing',
  },
  project2: {
    title: '3D Customizer using AI',
    description: 'A full-stack web application that leverages OpenAI to enable dynamic 3D product customization. Users can apply AI-generated textures and colors to 3D models in real time, delivering an immersive and intuitive design experience powered by Three.js.',
    github: 'https://github.com/Gee0522/ThreeJs-3D-AI',
    live: 'https://drive.google.com/file/d/1oIL85XNB47vuFR_vmYMgG3nwX_CNNS75/view?usp=sharing',
  },
  project3: {
    title: 'React Music Player',
    description: 'A full-stack music player built with React and Vite. Uses Redux Toolkit for robust state management, integrates Rapid API for music streaming data, and includes Geo API for location-based music discovery. Delivers a dynamic, responsive listening experience.',
    github: 'https://github.com/Gee0522/React-music-player',
    live: 'https://drive.google.com/file/d/1oP5CGHOK3lLnFaQfaqTcqbsYH2O6PC8R/view?usp=sharing',
  },
  project4: {
    title: 'Plant Shopping App',
    description: 'A full-featured React e-commerce platform with shopping cart functionality, built using Vite, Redux Toolkit, and modern CSS. Demonstrates advanced state management, dynamic product filtering, and a fully responsive UI design.',
    github: null,
    live: 'https://gee0522.github.io/e-plantShopping/',
  },
};

// ===== MODAL =====
function openModal(projectId) {
  const project = projects[projectId];
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDescription').textContent = project.description;

  const githubBtn = document.getElementById('githubLink');
  if (project.github) {
    githubBtn.href = project.github;
    githubBtn.style.display = '';
  } else {
    githubBtn.style.display = 'none';
  }

  document.getElementById('liveLink').href = project.live;
  document.getElementById('projectModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('projectModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('projectModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.timeline-item, .project-card, .stat-item').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ===== STARFIELD =====
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let w, h, stars = [];

function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  initStars(120);
}

function initStars(count) {
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    r: Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -(0.08 + Math.random() * 0.5),
  }));
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const alpha = 0.4 + 0.5 * Math.sin(performance.now() * 0.0015 + s.z * 10);
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.arc(s.x, s.y, s.r * (0.5 + s.z * 0.6), 0, Math.PI * 2);
    ctx.fill();

    s.x += s.vx * (1 + s.z);
    s.y += s.vy * (1 + s.z);

    if (s.y < -10) s.y = h + 10;
    if (s.x < -10) s.x = w + 10;
    if (s.x > w + 10) s.x = -10;
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();
