/**
 * Mateo Cioppa — Portfolio Client Script
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

  // 7. Subtle, Tasteful Three.js Background Canvas
  const world = document.getElementById("world");
  if (!world || typeof window.THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  world.appendChild(renderer.domElement);

  const ambientGroup = new THREE.Group();
  scene.add(ambientGroup);

  // Minimal, elegant geometric core (low opacity, refined lines)
  const icoGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.12
  });
  const wireMesh = new THREE.LineSegments(new THREE.WireframeGeometry(icoGeo), wireMat);
  ambientGroup.add(wireMesh);

  // Subtle vertices
  const nodeMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.03,
    transparent: true,
    opacity: 0.4
  });
  const nodes = new THREE.Points(icoGeo, nodeMat);
  ambientGroup.add(nodes);

  // Thin, delicate orbital ring
  const ringGeo = new THREE.RingGeometry(2.2, 2.21, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.08
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  ambientGroup.add(ring);

  // Gentle Parallax & Scroll Integration
  let targetRotX = 0;
  let targetRotY = 0;
  let scrollY = window.pageYOffset;

  window.addEventListener("mousemove", (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotY = mouseX * 0.25;
    targetRotX = -mouseY * 0.2;
  });

  window.addEventListener("scroll", () => {
    scrollY = window.pageYOffset;
  }, { passive: true });

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    if (width < 768) {
      ambientGroup.scale.setScalar(0.7);
      ambientGroup.position.set(0, 0, 0);
    } else {
      ambientGroup.scale.setScalar(1.0);
      ambientGroup.position.set(1.2, 0.2, 0);
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  // Animation Loop (Quiet, smooth, high-frame-rate)
  const animate = () => {
    requestAnimationFrame(animate);

    if (!reducedMotion) {
      const scrollRotation = scrollY * 0.0008;
      targetRotY += 0.001;

      ambientGroup.rotation.y += (targetRotY + scrollRotation - ambientGroup.rotation.y) * 0.05;
      ambientGroup.rotation.x += (targetRotX - ambientGroup.rotation.x) * 0.05;

      ring.rotation.z += 0.0015;
    }

    renderer.render(scene, camera);
  };

  animate();
});
