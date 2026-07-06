/* ============================================================
   VEDIC COSMIC CLOCK — Main wiring
   ============================================================ */

(() => {

  // Default observer: Ujjain — India's ancient prime meridian
  let LAT = 23.1765, LON = 75.7885;
  // location state: type 'default' | 'gps' | 'ip'
  const LOC = { type: 'default', city: null };

  const $ = id => document.getElementById(id);

  /* ---------- boot ---------- */

  const webglOk = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch { return false; }
  })();

  let spaceReady = false;
  if (webglOk && typeof THREE !== 'undefined') {
    spaceReady = Space.init($('space'));
  }
  if (!spaceReady) document.body.classList.add('no-webgl');

  VedicClock.build($('clockContainer'));

  /* ---------- location detection ----------
     Order: browser GPS → IP-based lookup → Ujjain default.
     Runs automatically on load; the chip re-triggers it. */

  function fmtCoords(lat, lon) {
    return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ` +
           `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
  }

  function renderLocationChip() {
    let place;
    if (LOC.type === 'default') place = I18N.t('u.ujjain');
    else if (LOC.city) place = LOC.type === 'ip' ? `${LOC.city} (IP)` : LOC.city;
    else place = I18N.t('u.yourloc');
    $('locationText').textContent = `${place} · ${fmtCoords(LAT, LON)}`;
  }

  function applyLocation(lat, lon, type, city) {
    LAT = lat;
    LON = lon;
    LOC.type = type;
    LOC.city = city || null;
    renderLocationChip();
    lastCompute = 0; // force panchang refresh
  }

  async function reverseGeocode(lat, lon) {
    // free, keyless reverse geocoder
    try {
      const r = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: AbortSignal.timeout(6000) }
      );
      const j = await r.json();
      return j.city || j.locality || j.principalSubdivision || null;
    } catch { return null; }
  }

  async function locateByIP() {
    try {
      const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(6000) });
      const j = await r.json();
      if (j && typeof j.latitude === 'number') {
        applyLocation(j.latitude, j.longitude, 'ip', j.city || null);
        return true;
      }
    } catch { /* offline or blocked */ }
    return false;
  }

  function detectLocation() {
    $('locationText').textContent = I18N.t('u.locating');
    const fallback = async () => {
      if (!(await locateByIP())) renderLocationChip();
    };
    if (!navigator.geolocation) { fallback(); return; }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        applyLocation(latitude, longitude, 'gps');
        const city = await reverseGeocode(latitude, longitude);
        if (city) applyLocation(latitude, longitude, 'gps', city);
      },
      fallback, // denied / unavailable / timed out → IP lookup
      { timeout: 8000, maximumAge: 300000 }
    );
  }

  $('locationChip').addEventListener('click', detectLocation);
  detectLocation();

  // re-render everything when the language changes
  I18N.onChange(() => {
    renderLocationChip();
    lastCompute = 0;
  });

  /* ---------- fullscreen toggle ---------- */

  $('fsBtn').addEventListener('click', () => {
    const doc = document;
    const rootEl = doc.documentElement;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      (rootEl.requestFullscreen || rootEl.webkitRequestFullscreen).call(rootEl);
    } else {
      (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
    }
  });
  document.addEventListener('fullscreenchange', () => {
    $('fsBtn').textContent = document.fullscreenElement ? '⤡' : '⛶';
  });

  /* ---------- formatting helpers ---------- */

  const fmtTime = d => d
    ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '—';
  const fmtRange = r => r ? `${fmtTime(r.start)} – ${fmtTime(r.end)}` : '—';
  const fmtDeg = d => {
    const deg = Math.floor(d);
    const min = Math.floor((d - deg) * 60);
    return `${deg}°${String(min).padStart(2, '0')}′`;
  };

  /* ---------- moon phase mini-canvas (right panel) ---------- */

  function drawMoonPhase(elongation) {
    const cv = $('moonPhaseCanvas');
    const ctx = cv.getContext('2d');
    const S = cv.width, R = S / 2 - 3, cx = S / 2, cy = S / 2;
    ctx.clearRect(0, 0, S, S);

    // dark disc
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = '#1a2036';
    ctx.fill();

    // lit part: terminator ellipse trick
    const phi = elongation * Math.PI / 180; // 0 new, π full
    const lit = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
    lit.addColorStop(0, '#f4f6ff');
    lit.addColorStop(1, '#aeb6cf');
    ctx.fillStyle = lit;

    const waxing = elongation <= 180;
    const k = Math.cos(phi); // +1 new → -1 full

    ctx.beginPath();
    // outer limb (lit side): right when waxing, left when waning
    ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, !waxing);
    // terminator
    ctx.ellipse(cx, cy, Math.abs(k) * R, R, 0, Math.PI / 2, -Math.PI / 2, (k > 0) === waxing);
    ctx.closePath();
    ctx.fill();

    // subtle craters on lit region
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#8890a8';
    [[0.3, -0.2, 4], [-0.15, 0.3, 3], [0.1, 0.05, 5]].forEach(([dx, dy, r]) => {
      ctx.beginPath();
      ctx.arc(cx + dx * R, cy + dy * R, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /* ---------- panels ---------- */

  function renderPanels(p, now) {
    const hi = I18N.lang === 'hi';
    const tr = (cat, v) => I18N.name(cat, v);

    // left — panchang
    $('pTithi').textContent = `${tr('tithi', p.tithi.name)} (${p.tithi.num})`;
    $('pNakshatra').textContent =
      `${hi ? p.nakshatra.name[1] : p.nakshatra.name[0]} · ${I18N.t('u.pada')} ${p.nakshatra.pada}`;
    $('pYoga').textContent = tr('yoga', p.yoga.name);
    $('pKarana').textContent = tr('karana', p.karana.name);
    $('pPaksha').textContent = `${tr('paksha', p.tithi.paksha)} ${I18N.t('u.paksha')}`;
    $('pVara').textContent = hi ? p.vara[1] : `${p.vara[0]} · ${p.vara[1]}`;
    $('pSunrise').textContent = fmtTime(p.sunrise);
    $('pSunset').textContent = fmtTime(p.sunset);
    $('tithiBar').style.width = `${(p.tithi.progress * 100).toFixed(1)}%`;

    // right — navagraha
    const list = $('grahaList');
    list.innerHTML = '';
    p.grahas.forEach(g => {
      const li = document.createElement('li');
      const gName = hi ? tr('graha', g.name) : g.name;
      const gSub = hi ? g.name : g.en;
      const gRashi = hi ? g.rashi[1] : g.rashi[0];
      li.innerHTML =
        `<span class="g-sym">${g.symbol}</span>` +
        `<span class="g-name"><b>${gName}</b><small>${gSub}</small></span>` +
        `<span class="g-pos"><b>${gRashi}</b> ${fmtDeg(g.degInRashi)}</span>`;
      list.appendChild(li);
    });

    // moon
    drawMoonPhase(p.moon.elongation);
    $('pMoonPhase').textContent = tr('moonphase', p.moon.name);
    $('pMoonIllum').textContent =
      `${(p.moon.illumination * 100).toFixed(1)}% ${I18N.t('u.illuminated')} · ` +
      (p.moon.waxing ? I18N.t('u.waxing') : I18N.t('u.waning'));

    // kaal windows
    $('pRahu').textContent = fmtRange(p.rahuKaal);
    $('pAbhijit').textContent = fmtRange(p.abhijit);
    $('pBrahma').textContent = fmtRange(p.brahmaMuhurta);
    if (p.choghadiya) {
      $('pChoghadiya').textContent =
        `${tr('choghadiya', p.choghadiya.name)} ${p.choghadiya.isDay ? '☀' : '☾'} (${fmtTime(p.choghadiya.end)})`;
      const row = $('choghadiyaRow');
      row.className = `kaal ${p.choghadiya.nature}`;
    }

    // bottom bar
    $('bDate').textContent = now.toLocaleDateString(I18N.dateLocale(), {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    $('bVikram').textContent = p.vikramSamvat;
    $('bShaka').textContent = p.shakaSamvat;
    $('bMuhurta').textContent = p.muhurta
      ? `${p.muhurta.index} / 30 · ${p.muhurta.isDay ? I18N.t('u.day') : I18N.t('u.night')}`
      : '—';

    // 3D moon phase lighting
    if (spaceReady) Space.setMoonPhase(p.moon.elongation);
  }

  /* ---------- 3D dial tilt ---------- */

  const clockEl = $('clockContainer');
  let tiltX = 0, tiltY = 0;        // current
  let tiltTX = 0, tiltTY = 0;      // target (from pointer)
  let lastPointerMove = -Infinity;

  window.addEventListener('pointermove', e => {
    const nx = e.clientX / window.innerWidth - 0.5;   // -0.5 .. 0.5
    const ny = e.clientY / window.innerHeight - 0.5;
    tiltTY = nx * 16;    // rotateY follows horizontal movement
    tiltTX = -ny * 12;   // rotateX follows vertical movement
    lastPointerMove = performance.now();
  }, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyTilt(t) {
    if (reducedMotion) return;
    // idle (no pointer for 4s): slow cosmic sway so the dial always feels dimensional
    if (t - lastPointerMove > 4000) {
      tiltTY = Math.sin(t * 0.00025) * 7;
      tiltTX = Math.cos(t * 0.0002) * 5 - 3;
    }
    tiltX += (tiltTX - tiltX) * 0.05;
    tiltY += (tiltTY - tiltY) * 0.05;
    clockEl.style.transform =
      `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(0)`;
  }

  /* ---------- animation loop ---------- */

  let lastCompute = 0;
  let panchang = null;

  function frame(t) {
    const now = new Date();
    applyTilt(t || 0);

    if (now.getTime() - lastCompute > 1000 || !panchang) {
      panchang = Astro.computePanchang(now, LAT, LON);
      renderPanels(panchang, now);
      lastCompute = now.getTime();
    }

    VedicClock.update(panchang, now);

    // ticking clocks every frame (cheap)
    $('bLocal').textContent = now.toLocaleTimeString('en-IN', { hour12: false });
    $('bUTC').textContent = now.toISOString().substring(11, 19);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
