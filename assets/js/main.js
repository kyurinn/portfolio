/**
 * Mateo Cioppa :: Portfolio Client Script
 * Subtle Ambient Canvas & Interaction Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Dynamic Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // 2. Mobile Menu Navigation
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.textContent = isOpen ? "Close" : "Menu";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
      });
    });
  }

  // 3. Smooth Anchor Scrolling with Offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // 4. ScrollSpy: Highlight active navbar link
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
  );

  sections.forEach((sec) => observer.observe(sec));

  // 5. Natural Human Typewriter Line
  const typeTarget = document.getElementById("type-line-text");
  const phrases = [
    "Computer Engineering student @ UNLP",
    "18 months building & shipping OrbitUp",
    "Exploring Linux internals & low-level security",
    "Designing constrained, robust AI pipelines"
  ];

  if (typeTarget) {
    if (reducedMotion) {
      typeTarget.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = phrases[phraseIndex];
        typeTarget.textContent = deleting
          ? current.slice(0, Math.max(0, charIndex - 1))
          : current.slice(0, Math.min(current.length, charIndex + 1));

        charIndex += deleting ? -1 : 1;

        if (!deleting && charIndex >= current.length) {
          deleting = true;
          setTimeout(tick, 2000);
        } else if (deleting && charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 500);
        } else {
          setTimeout(tick, deleting ? 24 : 50);
        }
      };
      tick();
    }
  }

  // 6. Interactive Tabs for Showcase
  const tabs = document.querySelectorAll("[data-orbit-tab]");
  const images = document.querySelectorAll("[data-orbit-img]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-orbit-tab");
      tabs.forEach((t) => t.classList.remove("active"));
      images.forEach((img) => img.classList.remove("active"));

      tab.classList.add("active");
      const activeImg = document.querySelector(`[data-orbit-img="${target}"]`);
      if (activeImg) activeImg.classList.add("active");
    });
  });

  // 7. Particle Field Background (subtle, non-geometric, ambient)
  const world = document.getElementById("world");
  if (!world || typeof window.THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  world.appendChild(renderer.domElement);

  // Sparse particle field — no recognizable shape
  const PARTICLE_COUNT = 180;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const speeds = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 24;  // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;  // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;   // z
    speeds[i] = 0.0004 + Math.random() * 0.0006;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x10b981,
    size: 0.045,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Very slow drift — no mouse tracking, no spinning shape
  let elapsed = 0;

  const handleResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  const animate = () => {
    requestAnimationFrame(animate);
    if (!reducedMotion) {
      elapsed += 0.001;
      // Each particle drifts upward slowly and wraps around
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -7;
      }
      particleGeo.attributes.position.needsUpdate = true;
      // Very subtle global sway
      particles.rotation.y = Math.sin(elapsed * 0.4) * 0.04;
    }
    renderer.render(scene, camera);
  };
  animate();
});
