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
    document.body.classList.remove('focused');

    // Reset project views
    const projectsList = document.getElementById('projects-list');
    const projectDetails = document.getElementById('project-details');
    if (projectsList) projectsList.style.display = 'grid';
    if (projectDetails) projectDetails.style.display = 'none';
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

  // Project Master-Detail Interaction
  const projectBtns = document.querySelectorAll('.project-card-btn');
  const projectsList = document.getElementById('projects-list');
  const projectDetails = document.getElementById('project-details');
  const backBtn = document.getElementById('back-to-projects');
  const detailViews = document.querySelectorAll('.project-detail-view');

  projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-project');
      if (projectsList) projectsList.style.display = 'none';
      if (projectDetails) projectDetails.style.display = 'block';
      detailViews.forEach(v => {
        v.style.display = v.id === `detail-${target}` ? 'block' : 'none';
      });
      document.getElementById('panel-work').scrollTop = 0;
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (projectDetails) projectDetails.style.display = 'none';
      if (projectsList) projectsList.style.display = 'grid';
      document.getElementById('panel-work').scrollTop = 0;
    });
  }

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
  camera.position.x = 0;

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background so CSS shows through
  world.appendChild(renderer.domElement);

  // --- POST-PROCESSING: BLOOM ---
  let composer;
  if (window.THREE.EffectComposer) {
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    // Make the bloom cyan/blue tinted and very glowy
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
  }

  const atlas = new THREE.Group();
  scene.add(atlas);

  // Lights
  const hemi = new THREE.HemisphereLight(0x879ea6, 0x0a0f10, 0.9);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xc9dee0, 0.6);
  key.position.set(2.4, 3.2, 3.6);
  scene.add(key);
  const cyanLight = new THREE.PointLight(0x26d9ff, 1.5, 14);
  cyanLight.position.set(-2.8, 1.6, 2.4);
  scene.add(cyanLight);
  const cyanLight2 = new THREE.PointLight(0x00f0ff, 1.0, 10);
  cyanLight2.position.set(2.0, -1.0, -2.0);
  scene.add(cyanLight2);

  // Math for procedural brain
  function hash3(x, y, z) {
    let n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }
  function vnoise(x, y, z) {
    let xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    let xf = x - xi, yf = y - yi, zf = z - zi;
    let u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    function h(a, b, c) { return hash3(xi + a, yi + b, zi + c); }
    let x00 = h(0, 0, 0) + (h(1, 0, 0) - h(0, 0, 0)) * u;
    let x10 = h(0, 1, 0) + (h(1, 1, 0) - h(0, 1, 0)) * u;
    let x01 = h(0, 0, 1) + (h(1, 0, 1) - h(0, 0, 1)) * u;
    let x11 = h(0, 1, 1) + (h(1, 1, 1) - h(0, 1, 1)) * u;
    let y0 = x00 + (x10 - x00) * v, y1 = x01 + (x11 - x01) * v;
    return y0 + (y1 - y0) * w;
  }
  function fbm(x, y, z) {
    return vnoise(x, y, z) * 0.6 + vnoise(x * 2.3, y * 2.3, z * 2.3) * 0.28 + vnoise(x * 5.1, y * 5.1, z * 5.1) * 0.12;
  }
  const sstep = THREE.MathUtils.smoothstep;

  // The Brain Mesh
  const cortexMat = new THREE.MeshStandardMaterial({
    color: 0x0c131a, flatShading: true, roughness: 0.7, metalness: 0.3
  });

  function buildCortex() {
    const geo = new THREE.IcosahedronGeometry(1.2, 4); // Increased detail for smoother brain and more neurons
    const pos = geo.attributes.position;
    const p = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).normalize();
      let n = fbm(p.x * 2.1 + 5.2, p.y * 2.1 + 1.7, p.z * 2.1);
      let top = sstep(p.y, -0.25, 0.45);
      let folds = Math.sin(p.z * 7.0 + p.x * 4.0 + n * 6.0);
      let r = 1 + (n - 0.5) * 0.34 + folds * 0.055 * top;
      r -= 0.15 * (1 - sstep(Math.abs(p.x), 0.03, 0.24)) * top;
      r -= 0.08 * sstep(-p.y, 0.15, 0.85);
      pos.setXYZ(i, p.x * 1.02 * r, p.y * 0.85 * r, p.z * 1.28 * r);
    }
    geo.computeVertexNormals();
    return geo;
  }
  
  const cortexGeo = buildCortex();
  const cortex = new THREE.Mesh(cortexGeo, cortexMat);
  atlas.add(cortex);

  // The Wireframe
  const wireMat = new THREE.LineBasicMaterial({ color: 0x26d9ff, transparent: true, opacity: 0.08 });
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(cortexGeo), wireMat);
  wire.scale.setScalar(1.01);
  atlas.add(wire);

  // NEW: Neural Synapses (Glowing Particles on the brain surface)
  const neuronMat = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.015,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const neurons = new THREE.Points(cortexGeo, neuronMat);
  neurons.scale.setScalar(1.015);
  atlas.add(neurons);

  // Cerebellum (Lower brain)
  const cerebellumGeo = new THREE.IcosahedronGeometry(0.5, 3);
  const cPos = cerebellumGeo.attributes.position;
  const cp = new THREE.Vector3();
  for (let i = 0; i < cPos.count; i++) {
    cp.fromBufferAttribute(cPos, i).normalize();
    let r = 1 + (vnoise(cp.x * 3, cp.y * 3 + 7, cp.z * 3) - 0.5) * 0.2 + Math.sin(cp.y * 14) * 0.05;
    cPos.setXYZ(i, cp.x * 1.12 * r * 0.5, cp.y * 0.72 * r * 0.5, cp.z * 0.95 * r * 0.5);
  }
  cerebellumGeo.computeVertexNormals();
  const cerebellum = new THREE.Mesh(cerebellumGeo, cortexMat);
  cerebellum.position.set(0, -0.62, -1.1);
  atlas.add(cerebellum);

  const cWire = new THREE.LineSegments(new THREE.WireframeGeometry(cerebellumGeo), wireMat);
  cWire.scale.setScalar(1.02);
  cWire.position.copy(cerebellum.position);
  atlas.add(cWire);
  
  const cNeurons = new THREE.Points(cerebellumGeo, neuronMat);
  cNeurons.scale.setScalar(1.03);
  cNeurons.position.copy(cerebellum.position);
  atlas.add(cNeurons);

  // Brain stem
  const stemGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.6, 8, 3);
  const stem = new THREE.Mesh(stemGeo, cortexMat);
  stem.position.set(0, -0.85, -0.5);
  stem.rotation.x = 0.5;
  atlas.add(stem);

  // Orbital Halo (Data cloud)
  const haloCount = 600;
  const halo = new Float32Array(haloCount * 3);
  for (let i = 0; i < haloCount; i += 1) {
    const r = 2.0 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    halo[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    halo[i * 3 + 1] = r * Math.cos(phi);
    halo[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const haloGeom = new THREE.BufferGeometry();
  haloGeom.setAttribute("position", new THREE.BufferAttribute(halo, 3));
  const haloMat = new THREE.PointsMaterial({
    color: 0x26d9ff,
    size: 0.01,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  const haloPoints = new THREE.Points(haloGeom, haloMat);
  atlas.add(haloPoints);

  // Hotspots Mapping
  const hotspots = Array.from(document.querySelectorAll(".hotspot"));
  const anchorVectors = {
    about: new THREE.Vector3(1.1, 0.5, 0.4),
    work: new THREE.Vector3(-1.1, 0.3, 0.7),
    stack: new THREE.Vector3(0.5, -0.9, 0.5),
    contact: new THREE.Vector3(-0.4, -0.5, -1.1)
  };

  let drag = false;
  let prevX = 0;
  let prevY = 0;
  let targetRotX = 0.1;
  let targetRotY = 0.2;
  
  // Right click to rotate
  document.addEventListener('contextmenu', e => e.preventDefault());

  if (!reducedMotion) {
    world.addEventListener("mousedown", (event) => {
      if (event.button === 2) {
        drag = true;
        prevX = event.clientX;
        prevY = event.clientY;
        world.classList.add("dragging");
      }
    });

    window.addEventListener("mouseup", (event) => {
      if (event.button === 2) {
        drag = false;
        world.classList.remove("dragging");
      }
    });

    window.addEventListener("mousemove", (event) => {
      if (!drag) return;
      const dx = event.clientX - prevX;
      const dy = event.clientY - prevY;
      targetRotY += dx * 0.005;
      targetRotX += dy * 0.005;
      targetRotX = Math.max(-1.0, Math.min(1.0, targetRotX));
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
    if(composer) composer.setSize(window.innerWidth, window.innerHeight);
    updateHotspots();
  };

  window.addEventListener("resize", onResize);
  onResize();

  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    if (reducedMotion) {
      atlas.rotation.x = 0.18;
      atlas.rotation.y = 0.2;
    } else {
      targetRotY += 0.0005; // auto slow spin
      atlas.rotation.x += (targetRotX - atlas.rotation.x) * 0.1;
      atlas.rotation.y += (targetRotY - atlas.rotation.y) * 0.1;
      haloPoints.rotation.y -= 0.0008;
      haloPoints.rotation.x += 0.0004;
    }
    
    // Pulse the neurons
    const pulse = 1.0 + Math.sin(time * 3.0) * 0.03;
    neurons.scale.setScalar(1.015 * pulse);
    cNeurons.scale.setScalar(1.03 * pulse);

    updateHotspots();
    
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  };

  animate();
});
