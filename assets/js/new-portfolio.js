document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const openButtons = Array.from(document.querySelectorAll("[data-open]"));
  const closeButtons = Array.from(document.querySelectorAll("[data-close]"));
  const navButtons = Array.from(document.querySelectorAll(".site-nav [data-open]"));
  const panels = ["about", "work", "stack", "contact"];
  let activePanel = null;

  const setNavActive = (panel) => {
    navButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-open") === panel);
    });
  };

  const closePanel = () => {
    if (!activePanel) return;
    const panelEl = document.getElementById(`panel-${activePanel}`);
    if (panelEl) {
      panelEl.classList.remove("open");
      panelEl.setAttribute("aria-hidden", "true");
    }
    activePanel = null;
    setNavActive(null);
  };

  const openPanel = (panel) => {
    if (!panels.includes(panel)) return;
    if (activePanel === panel) {
      closePanel();
      return;
    }
    closePanel();
    const panelEl = document.getElementById(`panel-${panel}`);
    if (!panelEl) return;
    panelEl.classList.add("open");
    panelEl.setAttribute("aria-hidden", "false");
    activePanel = panel;
    setNavActive(panel);
    if (nav) nav.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  };

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => openPanel(btn.getAttribute("data-open")));
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closePanel);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePanel();
  });

  const typeTarget = document.getElementById("type-line-text");
  const phrases = [
    "shipping AI-first products",
    "turning concepts into production systems",
    "building tools people actually use"
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
          setTimeout(tick, 1100);
          return;
        }

        if (deleting && charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        setTimeout(tick, deleting ? 40 : 58);
      };

      tick();
    }
  }

  const world = document.getElementById("world");
  if (!world || typeof window.THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4.4;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  world.appendChild(renderer.domElement);

  const atlas = new THREE.Group();
  scene.add(atlas);

  const sphereGeom = new THREE.IcosahedronGeometry(1.34, 8);
  const pointsMat = new THREE.PointsMaterial({
    color: 0x5ce5ff,
    size: 0.012,
    transparent: true,
    opacity: 0.85
  });
  atlas.add(new THREE.Points(sphereGeom, pointsMat));

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.34, 2),
    new THREE.MeshBasicMaterial({
      color: 0x289cbf,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })
  );
  atlas.add(wire);

  const haloCount = 800;
  const halo = new Float32Array(haloCount * 3);
  for (let i = 0; i < haloCount; i += 1) {
    const r = 2.1 + Math.random() * 1.7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    halo[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    halo[i * 3 + 1] = r * Math.cos(phi);
    halo[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const haloGeom = new THREE.BufferGeometry();
  haloGeom.setAttribute("position", new THREE.BufferAttribute(halo, 3));
  const haloMat = new THREE.PointsMaterial({
    color: 0xf4f2f8,
    size: 0.008,
    transparent: true,
    opacity: 0.45
  });
  const haloPoints = new THREE.Points(haloGeom, haloMat);
  atlas.add(haloPoints);

  const light = new THREE.PointLight(0x26d9ff, 1.1, 12);
  light.position.set(2.2, 1.8, 2.6);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const hotspots = Array.from(document.querySelectorAll(".hotspot"));
  const anchorVectors = {
    about: new THREE.Vector3(1.3, 0.45, 0.3),
    work: new THREE.Vector3(-1.2, 0.28, 0.95),
    stack: new THREE.Vector3(0.2, -1.2, 0.85),
    contact: new THREE.Vector3(-0.45, -0.75, -1.2)
  };

  let drag = false;
  let prevX = 0;
  let prevY = 0;
  let targetRotX = 0.2;
  let targetRotY = 0.25;

  if (!reducedMotion) {
    world.addEventListener("pointerdown", (event) => {
      drag = true;
      prevX = event.clientX;
      prevY = event.clientY;
      world.classList.add("dragging");
    });

    window.addEventListener("pointerup", () => {
      drag = false;
      world.classList.remove("dragging");
    });

    window.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const dx = event.clientX - prevX;
      const dy = event.clientY - prevY;
      targetRotY += dx * 0.005;
      targetRotX += dy * 0.003;
      targetRotX = Math.max(-0.9, Math.min(0.9, targetRotX));
      prevX = event.clientX;
      prevY = event.clientY;
    });
  }

  const tmp = new THREE.Vector3();
  const camSpace = new THREE.Vector3();
  const updateHotspots = () => {
    hotspots.forEach((el) => {
      const key = el.getAttribute("data-open");
      if (!key || !anchorVectors[key]) return;

      tmp.copy(anchorVectors[key]).applyMatrix4(atlas.matrixWorld);
      camSpace.copy(tmp).applyMatrix4(camera.matrixWorldInverse);
      if (camSpace.z > 0) {
        el.classList.add("away");
        return;
      }

      const projected = tmp.clone().project(camera);
      const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.classList.remove("away");
    });
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateHotspots();
  };

  window.addEventListener("resize", onResize);
  onResize();

  const animate = () => {
    requestAnimationFrame(animate);

    if (reducedMotion) {
      atlas.rotation.x = 0.18;
      atlas.rotation.y = 0.2;
    } else {
      atlas.rotation.y += 0.0016;
      atlas.rotation.x += 0.00025;
      atlas.rotation.x += (targetRotX - atlas.rotation.x) * 0.03;
      atlas.rotation.y += (targetRotY - atlas.rotation.y) * 0.03;
      haloPoints.rotation.y -= 0.0006;
    }

    updateHotspots();
    renderer.render(scene, camera);
  };

  animate();
});
