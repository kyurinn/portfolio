/**
 * Mateo Cioppa — Portfolio Master Script
 * Cybernetic Geodesic Core (Three.js + Bloom) & Seamless Scroll Controller
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
    });

    // Close menu when clicking nav links
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Smooth Scroll on Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // 4. ScrollSpy: Highlight active navbar item
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".site-nav a");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle("active", href === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  // 5. Typewriter Effect
  const typeTarget = document.getElementById("type-line-text");
  const phrases = [
    "Computer Engineering @ UNLP · Systems & Security",
    "Former CTO @ OrbitUp · 1.5 years leading production systems",
    "From Linux low-level to resilient AI architectures",
    "Building verifiable software from the silicon up"
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
          setTimeout(tick, 1800);
        } else if (deleting && charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 450);
        } else {
          setTimeout(tick, deleting ? 22 : 48);
        }
      };
      tick();
    }
  }

  // 6. Interactive Preview Tabs for OrbitUp
  const orbitTabs = document.querySelectorAll("[data-orbit-tab]");
  const orbitImages = document.querySelectorAll("[data-orbit-img]");
  orbitTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-orbit-tab");
      orbitTabs.forEach((t) => t.classList.remove("active"));
      orbitImages.forEach((img) => img.classList.remove("active"));
      tab.classList.add("active");
      const activeImg = document.querySelector(`[data-orbit-img="${target}"]`);
      if (activeImg) activeImg.classList.add("active");
    });
  });

  // 7. THREE.JS: Cybernetic Polyhedral Geodesic Core
  const world = document.getElementById("world");
  if (!world || typeof window.THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 4.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  world.appendChild(renderer.domElement);

  // Bloom Post-processing
  let composer;
  if (window.THREE.EffectComposer && window.THREE.RenderPass && window.THREE.UnrealBloomPass) {
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.1,  // Strength
      0.45, // Radius
      0.2   // Threshold
    );
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
  }

  // Main Cyber Group
  const cyberGroup = new THREE.Group();
  scene.add(cyberGroup);

  // Lights
  const ambient = new THREE.AmbientLight(0x091b24, 1.2);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0x26d9ff, 1.5);
  dirLight.position.set(4, 5, 4);
  scene.add(dirLight);

  const blueLight = new THREE.PointLight(0x00f0ff, 2.0, 15);
  blueLight.position.set(-3, -2, 3);
  scene.add(blueLight);

  // --- MESH 1: Geodesic Outer Icosahedron Lattice ---
  const icoGeo = new THREE.IcosahedronGeometry(1.35, 2);
  const wireGeo = new THREE.WireframeGeometry(icoGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x26d9ff,
    transparent: true,
    opacity: 0.22
  });
  const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
  cyberGroup.add(wireMesh);

  // --- MESH 2: Glowing Node Vertices ---
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", icoGeo.attributes.position);
  const nodeMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.038,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  const nodes = new THREE.Points(nodeGeo, nodeMat);
  cyberGroup.add(nodes);

  // --- MESH 3: Inner Octahedron / Core ---
  const innerGeo = new THREE.OctahedronGeometry(0.72, 1);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x06151f,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  cyberGroup.add(innerMesh);

  // --- MESH 4: Kinetic Gyroscopic Orbital Rings ---
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x26d9ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.28
  });
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.18
  });

  const ring1 = new THREE.Mesh(new THREE.RingGeometry(1.85, 1.87, 72), ringMat1);
  ring1.rotation.x = Math.PI / 3.2;
  ring1.rotation.y = Math.PI / 6;
  cyberGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.RingGeometry(2.12, 2.14, 72), ringMat2);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.z = Math.PI / 5;
  cyberGroup.add(ring2);

  // --- MESH 5: Ambient Floating Data Dust Particles ---
  const particleCount = 180;
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 2.2 + Math.random() * 2.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    particlePos[i] = r * Math.sin(phi) * Math.cos(theta);
    particlePos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePos[i + 2] = r * Math.cos(phi);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x26d9ff,
    size: 0.024,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const dust = new THREE.Points(particleGeo, particleMat);
  scene.add(dust);

  // Mouse Parallax & Scroll Integration
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0.15;
  let targetRotY = 0;
  let scrollY = window.pageYOffset;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotY = mouseX * 0.45;
    targetRotX = -mouseY * 0.35 + 0.15;
  });

  window.addEventListener("scroll", () => {
    scrollY = window.pageYOffset;
  }, { passive: true });

  // Handle Resize & Responsive Positioning
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    if (composer) composer.setSize(width, height);

    // Responsive scaling and positioning
    if (width < 768) {
      cyberGroup.scale.setScalar(0.72);
      cyberGroup.position.set(0, 0.4, 0);
    } else {
      cyberGroup.scale.setScalar(1.0);
      cyberGroup.position.set(1.4, 0.1, 0); // Offset to the right on desktop hero
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  // Animation Loop
  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (reducedMotion) {
      cyberGroup.rotation.y = 0.3;
    } else {
      // Gentle auto-spin + mouse easing
      const scrollFactor = scrollY * 0.0012;
      targetRotY += 0.0018;

      cyberGroup.rotation.y += (targetRotY + scrollFactor - cyberGroup.rotation.y) * 0.06;
      cyberGroup.rotation.x += (targetRotX - cyberGroup.rotation.x) * 0.06;

      // Inner core counter-rotates
      innerMesh.rotation.y -= 0.005;
      innerMesh.rotation.z += 0.003;

      // Gyroscope rings rotate continuously
      ring1.rotation.z += 0.003;
      ring2.rotation.z -= 0.0025;

      // Dust rotates softly
      dust.rotation.y += 0.0004;
      dust.rotation.x += 0.0002;

      // Node vertex pulse
      const pulse = 1.0 + Math.sin(elapsedTime * 2.8) * 0.04;
      nodes.scale.setScalar(pulse);
    }

    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  };

  animate();
});
