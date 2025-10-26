// Burger menu toggle
function toggleMenu() {
  const burger = document.querySelector(".burger");
  const navMenu = document.getElementById("navMenu");
  burger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

function closeMenu() {
  const burger = document.querySelector(".burger");
  const navMenu = document.getElementById("navMenu");
  burger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Active navigation link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Smooth scrolling
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     e.preventDefault();
//     const target = document.querySelector(this.getAttribute("href"));
//     target.scrollIntoView({ behavior: "smooth" });
//   });
// });

// Smooth scrolling only for internal page links (starting with "#")
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Ignore empty or invalid href values
    if (!href || href === "#") return;

    // Only handle internal links (anchors)
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Form submission
function handleSubmit(e) {
  e.preventDefault();
  alert("Thank you for your message! I will get back to you soon.");
  e.target.reset();
}

// Add scroll animation to skill cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease forwards";
    }
  });
}, observerOptions);

document.querySelectorAll(".skill-card, .project-card").forEach((card) => {
  observer.observe(card);
});

const projects = {
  project1: {
    title: "E-Commerce Platform",
    description:
      "A full-featured online marketplace with real-time inventory management and admin page, payment integration, and advanced search capabilities.",
    github: "https://github.com/Gee0522/ecommerce-admin-nextjs",
    live: "https://drive.google.com/file/d/1wiOblx9-6B4Ow1EyVsxT9RswD7-X5Fsy/view?usp=sharing",
  },
  project2: {
    title: "3D Cuztomizer using AI",
    description:
      "A full-stack web application that leverages AI to enable dynamic 3D product customization providing users with an intuitive and immersive design experience.",
    github: "https://github.com/Gee0522/ThreeJs-3D-AI",
    live: "https://drive.google.com/file/d/1oIL85XNB47vuFR_vmYMgG3nwX_CNNS75/view?usp=sharing",
  },
  project3: {
    title: "React music player",
    description:
      "Developed a full-stack music player application with a modern React/Vite front-end. The app leverages Redux Toolkit for robust state management and integrates with Rapid API for music streaming and Geo API for location-based features, delivering a dynamic and responsive user experience.",
    github: "https://github.com/Gee0522/React-music-player",
    live: "https://drive.google.com/file/d/1oP5CGHOK3lLnFaQfaqTcqbsYH2O6PC8R/view?usp=sharing",
  },
  project4: {
    title: "Plant Shopping App",
    description:
      "Full-featured React e-commerce platform with shopping cart, built using Vite, Redux Toolkit, and modern CSS. Demonstrates advanced state management and responsive UI design.",
    live: "https://gee0522.github.io/e-plantShopping/",
  },
};

// Open modal
function openModal(projectId) {
  const project = projects[projectId];
  document.getElementById("modalTitle").textContent = project.title;
  document.getElementById("modalDescription").textContent = project.description;
  document.getElementById("githubLink").href = project.github;
  document.getElementById("liveLink").href = project.live;
  document.getElementById("projectModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close modal
function closeModal() {
  document.getElementById("projectModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
document.getElementById("projectModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Starfield background
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w,
  h,
  stars = [];

function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  initStars(100); // change number for density
}

function initStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1, // depth [0..1]
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.2, // horizontal drift
      vy: -(0.1 + Math.random() * 0.6), // upward speed
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // optional subtle background gradient

  // const g = ctx.createLinearGradient(0, 0, 0, h);
  // g.addColorStop(0, "#020111");
  // g.addColorStop(1, "#001");
  // ctx.fillStyle = g;
  // ctx.fillRect(0, 0, w, h);

  for (const s of stars) {
    // twinkle by altering alpha with sine using time and z
    const alpha = 0.5 + 0.5 * Math.sin(performance.now() * 0.002 + s.z * 10);
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2);
    ctx.fill();

    // update pos
    s.x += s.vx * (1 + s.z * 2);
    s.y += s.vy * (1 + s.z * 2);

    // wrap around
    if (s.y < -10) s.y = h + 10;
    if (s.x < -10) s.x = w + 10;
    if (s.x > w + 10) s.x = -10;
  }
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();
