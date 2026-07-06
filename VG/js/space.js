/* ============================================================
   VEDIC COSMIC CLOCK — Three.js Deep-Space Background
   Starfield parallax, nebula clouds, shooting stars, and a
   3D moon lit at its REAL current phase angle.
   ============================================================ */

const Space = (() => {

  let scene, camera, renderer;
  let starLayers = [];
  let nebulaSprites = [];
  let moonMesh, moonLight, moonGlow;
  let shootingStars = [];
  let planets = [];
  let mouseX = 0, mouseY = 0;
  let running = false;

  /* ---------- texture helpers (all procedural, no assets) ---------- */

  function makeCircleTexture(size, inner, outer) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.4, outer);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }

  function makeNebulaTexture(size, hue) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    // layered soft blobs
    for (let i = 0; i < 24; i++) {
      const x = size / 2 + (Math.random() - 0.5) * size * 0.55;
      const y = size / 2 + (Math.random() - 0.5) * size * 0.55;
      const r = size * (0.08 + Math.random() * 0.22);
      const h = hue + (Math.random() - 0.5) * 40;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `hsla(${h}, 80%, ${30 + Math.random() * 25}%, ${0.10 + Math.random() * 0.10})`);
      g.addColorStop(1, 'hsla(0,0%,0%,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(c);
  }

  function makeMoonTexture(size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b8b8b8';
    ctx.fillRect(0, 0, size, size);
    // maria — big dark patches
    for (let i = 0; i < 14; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const r = size * (0.05 + Math.random() * 0.13);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(110,110,118,0.55)');
      g.addColorStop(1, 'rgba(110,110,118,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    // craters
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const r = 1 + Math.random() * size * 0.012;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${90 + Math.random() * 60 | 0},${90 + Math.random() * 60 | 0},${95 + Math.random() * 60 | 0},0.5)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(210,210,215,0.35)';
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  /* ---------- scene builders ---------- */

  function buildStars() {
    const layerSpecs = [
      { count: 1600, spread: 900, size: 1.3, depth: -400, speed: 0.006 },
      { count: 900,  spread: 700, size: 2.0, depth: -250, speed: 0.012 },
      { count: 350,  spread: 550, size: 3.0, depth: -150, speed: 0.02 },
    ];
    const starTex = makeCircleTexture(64, 'rgba(255,255,255,1)', 'rgba(200,215,255,0.5)');
    layerSpecs.forEach(spec => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(spec.count * 3);
      const col = new Float32Array(spec.count * 3);
      for (let i = 0; i < spec.count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spec.spread * 2;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spec.spread * 1.4;
        pos[i * 3 + 2] = spec.depth + (Math.random() - 0.5) * 80;
        // slight color variety: white / blue / warm
        const t = Math.random();
        if (t < 0.7) { col.set([1, 1, 1], i * 3); }
        else if (t < 0.85) { col.set([0.7, 0.8, 1], i * 3); }
        else { col.set([1, 0.85, 0.6], i * 3); }
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size: spec.size, map: starTex, transparent: true,
        vertexColors: true, depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.userData.speed = spec.speed;
      scene.add(points);
      starLayers.push(points);
    });
  }

  function buildNebulae() {
    const specs = [
      { hue: 228, x: -260, y: 120, z: -380, scale: 700 },  // deep blue
      { hue: 215, x: 280, y: -100, z: -420, scale: 800 },  // cosmic blue
      { hue: 245, x: 60, y: -190, z: -350, scale: 500 },   // subtle indigo
      { hue: 200, x: -120, y: -40, z: -300, scale: 420 },  // cyan hint
    ];
    specs.forEach(s => {
      const tex = makeNebulaTexture(512, s.hue);
      const mat = new THREE.SpriteMaterial({
        map: tex, transparent: true, opacity: 0.55,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(s.x, s.y, s.z);
      sprite.scale.set(s.scale, s.scale, 1);
      sprite.userData.baseOpacity = mat.opacity;
      sprite.userData.phase = Math.random() * Math.PI * 2;
      scene.add(sprite);
      nebulaSprites.push(sprite);
    });
  }

  function buildMoon() {
    const tex = makeMoonTexture(512);
    const geo = new THREE.SphereGeometry(26, 48, 48);
    const mat = new THREE.MeshStandardMaterial({
      map: tex, bumpMap: tex, bumpScale: 0.6,
      roughness: 0.95, metalness: 0,
    });
    moonMesh = new THREE.Mesh(geo, mat);
    positionMoonForViewport();
    scene.add(moonMesh);

    // sun-side light — its direction encodes the real lunar phase
    moonLight = new THREE.DirectionalLight(0xfff6e0, 2.2);
    moonLight.target = moonMesh;
    scene.add(moonLight);
    scene.add(new THREE.AmbientLight(0x223, 1.1)); // faint earthshine

    const glowTex = makeCircleTexture(256, 'rgba(192,200,220,0.35)', 'rgba(150,160,200,0.12)');
    moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    moonGlow.scale.set(110, 110, 1);
    moonGlow.position.copy(moonMesh.position);
    scene.add(moonGlow);
  }

  function positionMoonForViewport() {
    if (!moonMesh) return;
    const portrait = window.innerHeight > window.innerWidth;
    if (portrait) moonMesh.position.set(0, 190, -160);
    else moonMesh.position.set(-230, 115, -160);
    if (moonGlow) moonGlow.position.copy(moonMesh.position);
    planets.forEach(p => { p.userData.center = moonMesh.position; });
  }

  function buildPlanets() {
    // small glowing wanderers orbiting slowly in the far field
    const colors = [0xffb36b, 0x9bd1ff, 0xff8a80, 0xffe082];
    for (let i = 0; i < 4; i++) {
      const tex = makeCircleTexture(64, '#ffffff', '#888');
      const mat = new THREE.SpriteMaterial({
        map: tex, color: colors[i], transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const p = new THREE.Sprite(mat);
      const radius = 150 + i * 60;
      p.scale.set(6 + i * 2, 6 + i * 2, 1);
      p.userData = {
        radius,
        angle: Math.random() * Math.PI * 2,
        speed: 0.00022 / (i * 0.6 + 1),
        yWobble: 30 + i * 12,
        center: moonMesh ? moonMesh.position : new THREE.Vector3(0, 0, -200),
      };
      scene.add(p);
      planets.push(p);
    }
  }

  function spawnShootingStar() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(2 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geo, mat);
    const startX = (Math.random() - 0.3) * 700;
    const startY = 150 + Math.random() * 250;
    const dir = new THREE.Vector3(-(2 + Math.random() * 3), -(1 + Math.random() * 2), 0).multiplyScalar(1.8);
    line.userData = { pos: new THREE.Vector3(startX, startY, -200), dir, life: 1 };
    scene.add(line);
    shootingStars.push(line);
  }

  /* ---------- public API ---------- */

  function init(canvas) {
    if (typeof THREE === 'undefined') return false;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.0009);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 120;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050505, 1);

    buildStars();
    buildNebulae();
    buildMoon();
    buildPlanets();

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    running = true;
    requestAnimationFrame(loop);
    return true;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    positionMoonForViewport();
  }

  /**
   * Aim the moon's key light so the rendered phase matches reality.
   * elongationDeg: moon minus sun ecliptic longitude (0 = new, 180 = full).
   */
  function setMoonPhase(elongationDeg) {
    if (!moonLight || !moonMesh) return;
    const a = (180 - elongationDeg) * Math.PI / 180;
    // light swings around the moon: behind it at new moon, in front at full
    const d = 300;
    moonLight.position.set(
      moonMesh.position.x + Math.sin(a) * d,
      moonMesh.position.y + 40,
      moonMesh.position.z + Math.cos(a) * d
    );
  }

  let lastShoot = 0;
  function loop(t) {
    if (!running) return;
    requestAnimationFrame(loop);

    // starfield drift + parallax
    starLayers.forEach((layer, i) => {
      layer.rotation.z += layer.userData.speed * 0.001;
      layer.position.x = -mouseX * (i + 1) * 6;
      layer.position.y = mouseY * (i + 1) * 4;
    });

    // nebulae breathe
    nebulaSprites.forEach(s => {
      s.material.opacity = s.userData.baseOpacity * (0.8 + 0.2 * Math.sin(t * 0.0002 + s.userData.phase));
      s.position.x += Math.sin(t * 0.00005 + s.userData.phase) * 0.02;
    });

    // moon slow rotation
    if (moonMesh) {
      moonMesh.rotation.y += 0.0004;
      const pulse = 1 + 0.03 * Math.sin(t * 0.001);
      moonGlow.scale.set(110 * pulse, 110 * pulse, 1);
    }

    // wandering planets
    planets.forEach(p => {
      p.userData.angle += p.userData.speed * 16;
      const c = p.userData.center;
      p.position.set(
        c.x + Math.cos(p.userData.angle) * p.userData.radius,
        c.y + Math.sin(p.userData.angle * 0.7) * p.userData.yWobble - 40,
        c.z - 120
      );
    });

    // shooting stars
    if (t - lastShoot > 4000 + Math.random() * 6000) {
      spawnShootingStar();
      lastShoot = t;
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const u = s.userData;
      u.pos.add(u.dir);
      u.life -= 0.016;
      const tail = u.pos.clone().sub(u.dir.clone().multiplyScalar(14));
      const arr = s.geometry.attributes.position.array;
      arr[0] = u.pos.x; arr[1] = u.pos.y; arr[2] = u.pos.z;
      arr[3] = tail.x; arr[4] = tail.y; arr[5] = tail.z;
      s.geometry.attributes.position.needsUpdate = true;
      s.material.opacity = Math.max(0, u.life);
      if (u.life <= 0) {
        scene.remove(s);
        s.geometry.dispose();
        s.material.dispose();
        shootingStars.splice(i, 1);
      }
    }

    // gentle camera parallax
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 6 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -200);

    renderer.render(scene, camera);
  }

  return { init, setMoonPhase };
})();
