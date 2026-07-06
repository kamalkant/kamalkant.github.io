/* ============================================================
   VEDIC COSMIC CLOCK — SVG Astronomical Clock
   Outer ring: 27 Nakshatras · Middle ring: 12 Rashis
   Inner ring: panchang dials · Center: rotating yantra mandala
   with live sun & moon hands (sidereal longitudes).
   ============================================================ */

const VedicClock = (() => {

  const NS = 'http://www.w3.org/2000/svg';
  const CX = 500, CY = 500;
  const RAD = Math.PI / 180;

  // Angle convention: 0° at 12 o'clock, increasing clockwise.
  function pt(r, deg) {
    return [CX + r * Math.sin(deg * RAD), CY - r * Math.cos(deg * RAD)];
  }

  function el(name, attrs = {}, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function ringSegmentPath(r1, r2, a1, a2) {
    const [x1, y1] = pt(r2, a1), [x2, y2] = pt(r2, a2);
    const [x3, y3] = pt(r1, a2), [x4, y4] = pt(r1, a1);
    const large = (a2 - a1) > 180 ? 1 : 0;
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r2},${r2} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)} ` +
           `L${x3.toFixed(2)},${y3.toFixed(2)} A${r1},${r1} 0 ${large} 0 ${x4.toFixed(2)},${y4.toFixed(2)} Z`;
  }

  function arcTextPath(id, r, a1, a2, parent) {
    const [x1, y1] = pt(r, a1), [x2, y2] = pt(r, a2);
    return el('path', {
      id, d: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)}`,
      fill: 'none',
    }, parent);
  }

  let svg, refs = {};

  /* ================= BUILD ================= */

  function build(container) {
    svg = el('svg', {
      viewBox: '0 0 1000 1000',
      class: 'vedic-clock-svg',
      role: 'img',
      'aria-label': 'Vedic astronomical clock',
    });
    container.appendChild(svg);

    buildDefs();
    buildBaseCircles();
    buildNakshatraRing();
    buildRashiRing();
    buildInnerRing();
    buildDishShade();
    buildMandala();
    buildHands();
    buildGlass();
    return svg;
  }

  function buildDefs() {
    const defs = el('defs', {}, svg);

    const glow = el('filter', { id: 'glow', x: '-60%', y: '-60%', width: '220%', height: '220%' }, defs);
    el('feGaussianBlur', { stdDeviation: 5, result: 'b' }, glow);
    const m1 = el('feMerge', {}, glow);
    el('feMergeNode', { in: 'b' }, m1);
    el('feMergeNode', { in: 'SourceGraphic' }, m1);

    const strong = el('filter', { id: 'glowStrong', x: '-100%', y: '-100%', width: '300%', height: '300%' }, defs);
    el('feGaussianBlur', { stdDeviation: 10, result: 'b' }, strong);
    const m2 = el('feMerge', {}, strong);
    el('feMergeNode', { in: 'b' }, m2);
    el('feMergeNode', { in: 'SourceGraphic' }, m2);

    const goldGrad = el('radialGradient', { id: 'goldGrad' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#fff3c0' }, goldGrad);
    el('stop', { offset: '60%', 'stop-color': '#FFD700' }, goldGrad);
    el('stop', { offset: '100%', 'stop-color': '#8a6d00' }, goldGrad);

    const sunGrad = el('radialGradient', { id: 'sunGrad' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#fff8e1' }, sunGrad);
    el('stop', { offset: '45%', 'stop-color': '#FF9800' }, sunGrad);
    el('stop', { offset: '100%', 'stop-color': 'rgba(255,110,0,0)' }, sunGrad);

    const moonGrad = el('radialGradient', { id: 'moonGrad' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#ffffff' }, moonGrad);
    el('stop', { offset: '55%', 'stop-color': '#C0C0C0' }, moonGrad);
    el('stop', { offset: '100%', 'stop-color': 'rgba(140,150,180,0)' }, moonGrad);

    const earthGrad = el('radialGradient', { id: 'earthGrad' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#7fc4ff' }, earthGrad);
    el('stop', { offset: '60%', 'stop-color': '#1565c0' }, earthGrad);
    el('stop', { offset: '100%', 'stop-color': '#0a2a55' }, earthGrad);

    // big center moon — lit surface gradient (offset toward upper-left for depth)
    const moonSurf = el('radialGradient', { id: 'moonSurface', cx: '38%', cy: '35%', r: '75%' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#ffffff' }, moonSurf);
    el('stop', { offset: '55%', 'stop-color': '#dfe3ee' }, moonSurf);
    el('stop', { offset: '100%', 'stop-color': '#9aa2ba' }, moonSurf);

    // clip everything moon-related to the lunar disc
    const moonClip = el('clipPath', { id: 'moonClip' }, defs);
    el('circle', { cx: CX, cy: CY, r: 68 }, moonClip);

    /* ----- 3D depth gradients ----- */

    // brushed gold bezel — light falls from upper-left
    const bezel = el('linearGradient', { id: 'bezelGrad', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#fff0b0' }, bezel);
    el('stop', { offset: '30%', 'stop-color': '#d4af37' }, bezel);
    el('stop', { offset: '65%', 'stop-color': '#7a5c10' }, bezel);
    el('stop', { offset: '100%', 'stop-color': '#3a2c05' }, bezel);

    const bezelIn = el('linearGradient', { id: 'bezelGradIn', x1: '1', y1: '1', x2: '0', y2: '0' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#ffe98a' }, bezelIn);
    el('stop', { offset: '50%', 'stop-color': '#8a6d1d' }, bezelIn);
    el('stop', { offset: '100%', 'stop-color': '#2e2304' }, bezelIn);

    // dished dial face — brighter center falling to dark edge
    const dish = el('radialGradient', { id: 'dialDish' }, defs);
    el('stop', { offset: '0%', 'stop-color': 'rgba(30, 42, 88, 0.78)' }, dish);
    el('stop', { offset: '55%', 'stop-color': 'rgba(12, 18, 44, 0.72)' }, dish);
    el('stop', { offset: '100%', 'stop-color': 'rgba(3, 5, 14, 0.88)' }, dish);

    // concave shading overlay pressed over the rings
    const shade = el('radialGradient', { id: 'dishShade' }, defs);
    el('stop', { offset: '0%', 'stop-color': 'rgba(0,0,0,0)' }, shade);
    el('stop', { offset: '70%', 'stop-color': 'rgba(0,0,0,0)' }, shade);
    el('stop', { offset: '92%', 'stop-color': 'rgba(0,0,0,0.30)' }, shade);
    el('stop', { offset: '100%', 'stop-color': 'rgba(0,0,0,0.5)' }, shade);

    // curved-glass reflection, upper-left
    const spec = el('radialGradient', {
      id: 'glassSpec', cx: '32%', cy: '24%', r: '60%',
    }, defs);
    el('stop', { offset: '0%', 'stop-color': 'rgba(255,255,255,0.14)' }, spec);
    el('stop', { offset: '45%', 'stop-color': 'rgba(255,255,255,0.04)' }, spec);
    el('stop', { offset: '100%', 'stop-color': 'rgba(255,255,255,0)' }, spec);
  }

  // light/dark circle pair that makes a ring edge look bevelled
  function bevelEdge(g, r) {
    el('circle', {
      cx: CX - 1.2, cy: CY - 1.2, r, fill: 'none',
      stroke: 'rgba(255,244,200,0.16)', 'stroke-width': 1.4,
    }, g);
    el('circle', {
      cx: CX + 1.2, cy: CY + 1.2, r, fill: 'none',
      stroke: 'rgba(0,0,0,0.45)', 'stroke-width': 1.4,
    }, g);
  }

  function buildBaseCircles() {
    const g = el('g', { class: 'clock-base' }, svg);

    // dished dial face (radial gradient = concave depth)
    el('circle', { cx: CX, cy: CY, r: 492, fill: 'url(#dialDish)' }, g);

    // machined gold bezel: outer band + inner lip catching light from opposite sides
    el('circle', { cx: CX, cy: CY, r: 494, fill: 'none', stroke: 'url(#bezelGrad)', 'stroke-width': 9 }, g);
    el('circle', { cx: CX, cy: CY, r: 488, fill: 'none', stroke: 'url(#bezelGradIn)', 'stroke-width': 2.5 }, g);
    el('circle', { cx: CX, cy: CY, r: 498.5, fill: 'none', stroke: 'rgba(0,0,0,0.6)', 'stroke-width': 1.5 }, g);

    [410, 404, 318, 312, 232].forEach((r, i) => {
      el('circle', {
        cx: CX, cy: CY, r, fill: 'none',
        stroke: i % 2 ? 'rgba(120,140,220,0.25)' : 'rgba(255,215,0,0.28)',
        'stroke-width': i % 2 ? 0.8 : 1.4,
      }, g);
    });

    // bevelled edges where each ring steps down
    [486, 411, 403.5, 319, 311.5, 232].forEach(r => bevelEdge(g, r));

    // fine minute-like ticks on outermost edge (108 sacred count)
    for (let i = 0; i < 108; i++) {
      const a = i * (360 / 108);
      const [x1, y1] = pt(490, a), [x2, y2] = pt(482, a);
      el('line', { x1, y1, x2, y2, stroke: 'rgba(255,215,0,0.35)', 'stroke-width': 1 }, g);
    }
  }

  // concave shading pressed over the rings (adds curvature depth)
  function buildDishShade() {
    el('circle', {
      cx: CX, cy: CY, r: 492, fill: 'url(#dishShade)',
      'pointer-events': 'none',
    }, svg);
  }

  // curved glass with a soft specular reflection — topmost layer
  function buildGlass() {
    const g = el('g', { class: 'clock-glass', 'pointer-events': 'none' }, svg);
    el('circle', { cx: CX, cy: CY, r: 492, fill: 'url(#glassSpec)' }, g);
    // thin arc highlight on the upper-left bezel
    const [ax, ay] = pt(491, 300), [bx, by] = pt(491, 20);
    el('path', {
      d: `M${ax},${ay} A491,491 0 0 1 ${bx},${by}`,
      fill: 'none', stroke: 'rgba(255,250,220,0.35)', 'stroke-width': 2,
      'stroke-linecap': 'round', filter: 'url(#glow)',
    }, g);
  }

  function buildNakshatraRing() {
    const g = el('g', { class: 'ring-nakshatra' }, svg);
    refs.nakSegs = [];
    const span = 360 / 27;
    Astro.NAKSHATRAS.forEach((nk, i) => {
      const a1 = i * span, a2 = (i + 1) * span;
      const seg = el('path', {
        d: ringSegmentPath(412, 486, a1 + 0.35, a2 - 0.35),
        class: 'nak-seg',
      }, g);
      refs.nakSegs.push(seg);

      // Sanskrit on outer arc, English inside it
      const idSa = `nakSa${i}`;
      arcTextPath(idSa, 462, a1 + 1.5, a2 - 1.5, g);
      const tSa = el('text', { class: 'nak-label-sa' }, g);
      const tpSa = el('textPath', { startOffset: '50%' }, tSa);
      tpSa.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${idSa}`);
      tpSa.setAttribute('href', `#${idSa}`);
      tpSa.setAttribute('text-anchor', 'middle');
      tpSa.textContent = nk[1];

      const idEn = `nakEn${i}`;
      arcTextPath(idEn, 428, a1 + 1.5, a2 - 1.5, g);
      const tEn = el('text', { class: 'nak-label-en' }, g);
      const tpEn = el('textPath', { startOffset: '50%' }, tEn);
      tpEn.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${idEn}`);
      tpEn.setAttribute('href', `#${idEn}`);
      tpEn.setAttribute('text-anchor', 'middle');
      tpEn.textContent = nk[0];
    });
  }

  function buildRashiRing() {
    const g = el('g', { class: 'ring-rashi' }, svg);
    refs.rashiSegs = [];
    const span = 30;
    Astro.RASHIS.forEach((rs, i) => {
      const a1 = i * span, a2 = (i + 1) * span;
      const seg = el('path', {
        d: ringSegmentPath(320, 402, a1 + 0.3, a2 - 0.3),
        class: 'rashi-seg',
      }, g);
      refs.rashiSegs.push(seg);

      const mid = a1 + span / 2;
      const [sx, sy] = pt(376, mid);
      const sym = el('text', {
        x: sx, y: sy, class: 'rashi-symbol',
        'text-anchor': 'middle', 'dominant-baseline': 'central',
        transform: `rotate(${mid} ${sx} ${sy})`,
      }, g);
      sym.textContent = rs[2];

      const idR = `rashi${i}`;
      arcTextPath(idR, 340, a1 + 2, a2 - 2, g);
      const t = el('text', { class: 'rashi-label' }, g);
      const tp = el('textPath', { startOffset: '50%' }, t);
      tp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${idR}`);
      tp.setAttribute('href', `#${idR}`);
      tp.setAttribute('text-anchor', 'middle');
      tp.textContent = `${rs[0]} · ${rs[1]}`;
    });
  }

  function buildInnerRing() {
    const g = el('g', { class: 'ring-inner' }, svg);
    refs.innerG = g;
    refs.innerCells = {};
    refs.innerLabels = {};
    const items = ['TITHI', 'PAKSHA', 'YOGA', 'KARANA', 'VARA', 'MUHURTA'];
    const span = 60;
    items.forEach((label, i) => {
      const a1 = i * span, a2 = (i + 1) * span;
      el('path', {
        d: ringSegmentPath(234, 316, a1 + 0.4, a2 - 0.4),
        class: 'inner-seg',
      }, g);

      const idL = `inner${i}`;
      arcTextPath(idL, 296, a1 + 4, a2 - 4, g);
      const t = el('text', { class: 'inner-label' }, g);
      const tp = el('textPath', { startOffset: '50%' }, t);
      tp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${idL}`);
      tp.setAttribute('href', `#${idL}`);
      tp.setAttribute('text-anchor', 'middle');
      tp.textContent = label;
      refs.innerLabels[label] = tp;

      const idV = `innerV${i}`;
      arcTextPath(idV, 262, a1 + 3, a2 - 3, g);
      const tv = el('text', { class: 'inner-value' }, g);
      const tpv = el('textPath', { startOffset: '50%' }, tv);
      tpv.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${idV}`);
      tpv.setAttribute('href', `#${idV}`);
      tpv.setAttribute('text-anchor', 'middle');
      tpv.textContent = '—';
      refs.innerCells[label] = tpv;
    });
  }

  function buildMandala() {
    const g = el('g', { class: 'mandala' }, svg);

    // rotating lotus petals (12) — slow CSS rotation
    const petals = el('g', { class: 'mandala-petals' }, g);
    for (let i = 0; i < 12; i++) {
      const a = i * 30;
      const [tipX, tipY] = pt(222, a);
      const [b1X, b1Y] = pt(150, a - 11);
      const [b2X, b2Y] = pt(150, a + 11);
      el('path', {
        d: `M${b1X},${b1Y} Q${tipX},${tipY} ${b2X},${b2Y} Q${CX},${CY} ${b1X},${b1Y}`,
        class: 'petal',
      }, petals);
    }

    // counter-rotating yantra (two overlapping triangles + hexagram circles)
    const yantra = el('g', { class: 'mandala-yantra' }, g);
    const tri = r => [0, 120, 240].map(a => pt(r, a).join(',')).join(' ');
    const triDown = r => [60, 180, 300].map(a => pt(r, a).join(',')).join(' ');
    el('polygon', { points: tri(150), class: 'yantra-tri' }, yantra);
    el('polygon', { points: triDown(150), class: 'yantra-tri' }, yantra);
    el('polygon', { points: tri(105), class: 'yantra-tri dim' }, yantra);
    el('polygon', { points: triDown(105), class: 'yantra-tri dim' }, yantra);
    el('circle', { cx: CX, cy: CY, r: 150, class: 'yantra-circle' }, yantra);
    el('circle', { cx: CX, cy: CY, r: 105, class: 'yantra-circle' }, yantra);

    // orbits for sun & moon markers
    el('circle', { cx: CX, cy: CY, r: 190, class: 'orbit-line' }, g);
    el('circle', { cx: CX, cy: CY, r: 130, class: 'orbit-line' }, g);

    // ===== CENTER MOON — live lunar phase =====
    const MR = 68; // moon radius
    const moonG = el('g', { class: 'center-moon' }, g);

    // silver halo behind the disc
    el('circle', {
      cx: CX, cy: CY, r: MR + 8, fill: 'none',
      stroke: 'rgba(200,210,235,0.35)', 'stroke-width': 2,
      filter: 'url(#glowStrong)', class: 'moon-halo',
    }, moonG);

    // dark (night) side of the disc
    el('circle', { cx: CX, cy: CY, r: MR, fill: '#1c2338', stroke: 'rgba(160,175,255,0.3)', 'stroke-width': 1 }, moonG);

    // lit portion — path recomputed every update to match the real phase
    refs.moonLit = el('path', {
      d: '', fill: 'url(#moonSurface)', filter: 'url(#glow)',
      'clip-path': 'url(#moonClip)',
    }, moonG);

    // craters / maria (clipped to disc, visible mostly on the lit side)
    const craters = el('g', { 'clip-path': 'url(#moonClip)', opacity: 0.35 }, moonG);
    [
      [-22, -18, 11], [16, -30, 7], [28, 12, 9], [-8, 26, 12],
      [-34, 14, 6], [8, -6, 5], [34, -12, 4], [-14, -38, 5],
    ].forEach(([dx, dy, r]) => {
      el('circle', { cx: CX + dx, cy: CY + dy, r, fill: '#6d7590' }, craters);
      el('circle', { cx: CX + dx - r * 0.3, cy: CY + dy - r * 0.3, r: r * 0.5, fill: '#cdd3e6', opacity: 0.5 }, craters);
    });

    // thin rotating ring around the moon
    el('circle', {
      cx: CX, cy: CY, r: MR + 16, fill: 'none',
      stroke: 'rgba(255,215,0,0.3)', 'stroke-width': 1,
      'stroke-dasharray': '2 9', class: 'earth-ring',
    }, moonG);

    // center digital time (below the moon)
    refs.centerTime = el('text', {
      x: CX, y: CY + 122, class: 'center-time',
      'text-anchor': 'middle',
    }, g);
    refs.centerTime.textContent = '';
    refs.centerSub = el('text', {
      x: CX, y: CY + 150, class: 'center-sub',
      'text-anchor': 'middle',
    }, g);
    refs.centerSub.textContent = '';
  }

  /**
   * Build the SVG path of the moon's lit region for a given elongation.
   * 0° = new (all dark), 180° = full (all lit). Waxing lights the right limb.
   */
  function moonLitPathD(elongation, R) {
    const phi = elongation * Math.PI / 180;
    const k = Math.cos(phi);            // +1 new → -1 full
    const waxing = elongation <= 180;
    const rx = Math.max(0.001, Math.abs(k)) * R;

    const top = `${CX},${CY - R}`;
    const bottom = `${CX},${CY + R}`;
    const limbSweep = waxing ? 1 : 0;   // right limb when waxing, left when waning
    const termSweep = waxing ? (k > 0 ? 0 : 1) : (k > 0 ? 1 : 0);

    return `M${top} A${R},${R} 0 0 ${limbSweep} ${bottom} ` +
           `A${rx.toFixed(2)},${R} 0 0 ${termSweep} ${top} Z`;
  }

  function buildHands() {
    const g = el('g', { class: 'hands' }, svg);

    // SUN hand + marker (outer orbit r=190)
    refs.sunHand = el('g', { class: 'hand-sun' }, g);
    el('line', {
      x1: CX, y1: CY, x2: CX, y2: CY - 190,
      stroke: 'rgba(255,152,0,0.7)', 'stroke-width': 2.4, 'stroke-linecap': 'round',
    }, refs.sunHand);
    el('circle', { cx: CX, cy: CY - 190, r: 17, fill: 'url(#sunGrad)', filter: 'url(#glowStrong)' }, refs.sunHand);
    el('circle', { cx: CX, cy: CY - 190, r: 7, fill: '#FFB300' }, refs.sunHand);

    // MOON hand + marker (inner orbit r=130)
    refs.moonHand = el('g', { class: 'hand-moon' }, g);
    el('line', {
      x1: CX, y1: CY, x2: CX, y2: CY - 130,
      stroke: 'rgba(192,192,192,0.7)', 'stroke-width': 2, 'stroke-linecap': 'round',
    }, refs.moonHand);
    el('circle', { cx: CX, cy: CY - 130, r: 12, fill: 'url(#moonGrad)', filter: 'url(#glow)' }, refs.moonHand);

    // seconds sparkle — a tiny golden comet on the outer edge
    refs.secondHand = el('g', { class: 'hand-second' }, g);
    el('circle', { cx: CX, cy: CY - 478, r: 4, fill: 'url(#goldGrad)', filter: 'url(#glow)' }, refs.secondHand);
  }

  /* ================= UPDATE ================= */

  function rotate(node, deg) {
    node.setAttribute('transform', `rotate(${deg.toFixed(3)} ${CX} ${CY})`);
  }

  function update(p, now) {
    if (!svg) return;

    // hands follow SIDEREAL longitudes (matches nakshatra/rashi rings)
    rotate(refs.sunHand, p.sunSidereal);
    rotate(refs.moonHand, p.moonSidereal);

    // smooth seconds sweep
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    rotate(refs.secondHand, sec * 6);

    // active segments
    refs.nakSegs.forEach((s, i) =>
      s.classList.toggle('active', i === p.nakshatra.index));
    const sunRashi = Math.floor(p.sunSidereal / 30);
    const moonRashi = Math.floor(p.moonSidereal / 30);
    refs.rashiSegs.forEach((s, i) => {
      s.classList.toggle('active', i === moonRashi);
      s.classList.toggle('active-sun', i === sunRashi);
    });

    // inner dial labels + values (language-aware)
    const hi = typeof I18N !== 'undefined' && I18N.lang === 'hi';
    const tr = (cat, v) => (typeof I18N !== 'undefined' ? I18N.name(cat, v) : v);
    ['TITHI', 'PAKSHA', 'YOGA', 'KARANA', 'VARA', 'MUHURTA'].forEach(k => {
      const want = typeof I18N !== 'undefined' ? I18N.t(`svg.${k.toLowerCase()}`) : k;
      if (refs.innerLabels[k].textContent !== want) refs.innerLabels[k].textContent = want;
    });
    refs.innerCells['TITHI'].textContent = tr('tithi', p.tithi.name);
    refs.innerCells['PAKSHA'].textContent = tr('paksha', p.tithi.paksha);
    refs.innerCells['YOGA'].textContent = tr('yoga', p.yoga.name);
    refs.innerCells['KARANA'].textContent = tr('karana', p.karana.name);
    refs.innerCells['VARA'].textContent = hi ? p.vara[1] : p.vara[0];
    refs.innerCells['MUHURTA'].textContent = p.muhurta
      ? `${p.muhurta.index} / 30 ${p.muhurta.isDay ? '☀' : '☾'}`
      : '—';

    // center moon phase — matches tonight's real moon
    if (refs.moonLit && p.moon) {
      refs.moonLit.setAttribute('d', moonLitPathD(p.moon.elongation, 68));
    }

    // center time
    refs.centerTime.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
    refs.centerSub.textContent = hi
      ? `${tr('paksha', p.tithi.paksha)} ${tr('tithi', p.tithi.name)} · ${p.nakshatra.name[1]}`
      : `${p.tithi.paksha} ${p.tithi.name} · ${p.nakshatra.name[0]}`;
  }

  return { build, update };
})();
