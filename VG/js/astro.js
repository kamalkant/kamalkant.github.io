/* ============================================================
   VEDIC COSMIC CLOCK — Astronomy & Panchang Engine
   Low-precision astronomical algorithms (Meeus-style),
   good to ~0.1–1° — plenty for a live panchang display.
   ============================================================ */

const Astro = (() => {

  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;

  const mod360 = x => ((x % 360) + 360) % 360;

  /* ---------- Julian day ---------- */
  function julianDay(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }
  function centuriesJ2000(jd) {
    return (jd - 2451545.0) / 36525.0;
  }

  /* ---------- Sun (tropical ecliptic longitude, deg) ---------- */
  function sunLongitude(jd) {
    const T = centuriesJ2000(jd);
    const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const M = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const C =
      (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * RAD) +
      (0.019993 - 0.000101 * T) * Math.sin(2 * M * RAD) +
      0.000289 * Math.sin(3 * M * RAD);
    return mod360(L0 + C);
  }

  /* ---------- Moon (tropical ecliptic longitude, deg) ---------- */
  function moonLongitude(jd) {
    const T = centuriesJ2000(jd);
    const Lp = mod360(218.3164477 + 481267.88123421 * T);   // mean longitude
    const D  = mod360(297.8501921 + 445267.1114034 * T);    // mean elongation
    const M  = mod360(357.5291092 + 35999.0502909 * T);     // sun anomaly
    const Mp = mod360(134.9633964 + 477198.8675055 * T);    // moon anomaly
    const F  = mod360(93.2720950 + 483202.0175233 * T);     // arg. of latitude

    let lon = Lp
      + 6.288774 * Math.sin(Mp * RAD)
      + 1.274027 * Math.sin((2 * D - Mp) * RAD)
      + 0.658314 * Math.sin(2 * D * RAD)
      + 0.213618 * Math.sin(2 * Mp * RAD)
      - 0.185116 * Math.sin(M * RAD)
      - 0.114332 * Math.sin(2 * F * RAD)
      + 0.058793 * Math.sin((2 * D - 2 * Mp) * RAD)
      + 0.057066 * Math.sin((2 * D - M - Mp) * RAD)
      + 0.053322 * Math.sin((2 * D + Mp) * RAD)
      + 0.045758 * Math.sin((2 * D - M) * RAD);
    return mod360(lon);
  }

  /* ---------- Lahiri ayanamsa (approx) ---------- */
  function ayanamsa(jd) {
    const T = centuriesJ2000(jd);
    // Lahiri ≈ 23.85° at J2000, precession ~50.29"/yr
    return 23.853 + 1.39697 * T;
  }

  /* ---------- Moon phase ---------- */
  function moonPhase(jd) {
    const elong = mod360(moonLongitude(jd) - sunLongitude(jd)); // 0..360
    const illum = (1 - Math.cos(elong * RAD)) / 2;              // 0..1
    const waxing = elong <= 180;
    let name;
    if (elong < 10 || elong > 350) name = 'New Moon · Amavasya';
    else if (elong < 85)  name = 'Waxing Crescent';
    else if (elong < 95)  name = 'First Quarter';
    else if (elong < 170) name = 'Waxing Gibbous';
    else if (elong < 190) name = 'Full Moon · Purnima';
    else if (elong < 265) name = 'Waning Gibbous';
    else if (elong < 275) name = 'Last Quarter';
    else name = 'Waning Crescent';
    return { elongation: elong, illumination: illum, waxing, name };
  }

  /* ---------- Sunrise / Sunset (NOAA simplified) ---------- */
  function sunEvents(date, lat, lon) {
    // returns { sunrise: Date|null, sunset: Date|null, solarNoon: Date }
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const jd = julianDay(dayStart) + 0.5 - dayStart.getTimezoneOffset() / 1440;
    const T = centuriesJ2000(jd);

    const L0 = mod360(280.46646 + 36000.76983 * T);
    const M = mod360(357.52911 + 35999.05029 * T);
    const e = 0.016708634 - 0.000042037 * T;
    const C =
      (1.914602 - 0.004817 * T) * Math.sin(M * RAD) +
      0.019993 * Math.sin(2 * M * RAD) +
      0.000289 * Math.sin(3 * M * RAD);
    const trueLong = L0 + C;
    const obliq = 23.439291 - 0.0130042 * T;
    const decl = Math.asin(Math.sin(obliq * RAD) * Math.sin(trueLong * RAD)) * DEG;

    // Equation of time (minutes)
    const y = Math.tan((obliq / 2) * RAD) ** 2;
    const eot = 4 * DEG * (
      y * Math.sin(2 * L0 * RAD) -
      2 * e * Math.sin(M * RAD) +
      4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) -
      0.5 * y * y * Math.sin(4 * L0 * RAD) -
      1.25 * e * e * Math.sin(2 * M * RAD)
    );

    const cosH =
      (Math.cos(90.833 * RAD) / (Math.cos(lat * RAD) * Math.cos(decl * RAD))) -
      Math.tan(lat * RAD) * Math.tan(decl * RAD);
    if (cosH < -1 || cosH > 1) {
      return { sunrise: null, sunset: null, solarNoon: null }; // polar day/night
    }
    const H = Math.acos(cosH) * DEG; // hour angle, deg

    const tzOffMin = -date.getTimezoneOffset();
    const solarNoonMin = 720 - 4 * lon - eot + tzOffMin;
    const riseMin = solarNoonMin - 4 * H;
    const setMin  = solarNoonMin + 4 * H;

    const mk = mins => new Date(dayStart.getTime() + mins * 60000);
    return { sunrise: mk(riseMin), sunset: mk(setMin), solarNoon: mk(solarNoonMin) };
  }

  /* ---------- Name tables ---------- */
  const NAKSHATRAS = [
    ['Ashwini', 'अश्विनी'], ['Bharani', 'भरणी'], ['Krittika', 'कृत्तिका'],
    ['Rohini', 'रोहिणी'], ['Mrigashira', 'मृगशिरा'], ['Ardra', 'आर्द्रा'],
    ['Punarvasu', 'पुनर्वसु'], ['Pushya', 'पुष्य'], ['Ashlesha', 'आश्लेषा'],
    ['Magha', 'मघा'], ['P. Phalguni', 'पू. फाल्गुनी'], ['U. Phalguni', 'उ. फाल्गुनी'],
    ['Hasta', 'हस्त'], ['Chitra', 'चित्रा'], ['Swati', 'स्वाति'],
    ['Vishakha', 'विशाखा'], ['Anuradha', 'अनुराधा'], ['Jyeshtha', 'ज्येष्ठा'],
    ['Mula', 'मूल'], ['P. Ashadha', 'पूर्वाषाढ़ा'], ['U. Ashadha', 'उत्तराषाढ़ा'],
    ['Shravana', 'श्रवण'], ['Dhanishta', 'धनिष्ठा'], ['Shatabhisha', 'शतभिषा'],
    ['P. Bhadrapada', 'पू. भाद्रपद'], ['U. Bhadrapada', 'उ. भाद्रपद'], ['Revati', 'रेवती'],
  ];

  const RASHIS = [
    ['Mesha', 'मेष', '♈'], ['Vrishabha', 'वृषभ', '♉'], ['Mithuna', 'मिथुन', '♊'],
    ['Karka', 'कर्क', '♋'], ['Simha', 'सिंह', '♌'], ['Kanya', 'कन्या', '♍'],
    ['Tula', 'तुला', '♎'], ['Vrishchika', 'वृश्चिक', '♏'], ['Dhanu', 'धनु', '♐'],
    ['Makara', 'मकर', '♑'], ['Kumbha', 'कुंभ', '♒'], ['Meena', 'मीन', '♓'],
  ];

  const TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
  ];

  const YOGAS = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarman', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
  ];

  const KARANAS_MOVABLE = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];

  const VARAS = [
    ['Ravivara', 'रविवार', 'Sun'], ['Somavara', 'सोमवार', 'Moon'],
    ['Mangalavara', 'मंगलवार', 'Mars'], ['Budhavara', 'बुधवार', 'Mercury'],
    ['Guruvara', 'गुरुवार', 'Jupiter'], ['Shukravara', 'शुक्रवार', 'Venus'],
    ['Shanivara', 'शनिवार', 'Saturn'],
  ];

  const CHOGHADIYA_ORDER = ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'];
  const CHOGHADIYA_DAY_START   = [0, 3, 6, 2, 5, 1, 4]; // index into order, Sun..Sat
  const CHOGHADIYA_NIGHT_START = [5, 1, 4, 0, 3, 6, 2];
  const CHOGHADIYA_NATURE = {
    Udveg: 'bad', Chal: 'neutral', Labh: 'good', Amrit: 'good',
    Kaal: 'bad', Shubh: 'good', Rog: 'bad',
  };

  // Rahu Kaal octant of daytime (1-based), Sun..Sat
  const RAHU_OCTANT = [8, 2, 7, 5, 6, 4, 3];

  /* ---------- Planetary positions (Navagraha) ---------- */
  // JPL approximate Keplerian elements (J2000 + rates per century)
  // [a, e, I, L, wbar, Omega] + rates
  const PLANET_ELEMENTS = {
    Mercury: {
      el: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593],
      rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
    },
    Venus: {
      el: [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
      rate: [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
    },
    Earth: {
      el: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
      rate: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
    },
    Mars: {
      el: [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
      rate: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
    },
    Jupiter: {
      el: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
      rate: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    },
    Saturn: {
      el: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
      rate: [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
    },
  };

  function keplerSolve(M, e) {
    // M in radians
    let E = M + e * Math.sin(M);
    for (let i = 0; i < 8; i++) {
      const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-8) break;
    }
    return E;
  }

  function heliocentric(planet, T) {
    const p = PLANET_ELEMENTS[planet];
    const a = p.el[0] + p.rate[0] * T;
    const e = p.el[1] + p.rate[1] * T;
    const I = (p.el[2] + p.rate[2] * T) * RAD;
    const L = mod360(p.el[3] + p.rate[3] * T);
    const wbar = p.el[4] + p.rate[4] * T;
    const Om = p.el[5] + p.rate[5] * T;

    const w = (wbar - Om) * RAD;
    const OmR = Om * RAD;
    const M = mod360(L - wbar) * RAD;
    const E = keplerSolve(M, e);

    const xv = a * (Math.cos(E) - e);
    const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const v = Math.atan2(yv, xv);
    const r = Math.sqrt(xv * xv + yv * yv);

    // ecliptic heliocentric coords
    const x = r * (Math.cos(OmR) * Math.cos(v + w) - Math.sin(OmR) * Math.sin(v + w) * Math.cos(I));
    const y = r * (Math.sin(OmR) * Math.cos(v + w) + Math.cos(OmR) * Math.sin(v + w) * Math.cos(I));
    const z = r * Math.sin(v + w) * Math.sin(I);
    return { x, y, z, r };
  }

  function geocentricLongitude(planet, jd) {
    const T = centuriesJ2000(jd);
    const pl = heliocentric(planet, T);
    const ea = heliocentric('Earth', T);
    const gx = pl.x - ea.x;
    const gy = pl.y - ea.y;
    return mod360(Math.atan2(gy, gx) * DEG);
  }

  function meanLunarNode(jd) {
    const T = centuriesJ2000(jd);
    return mod360(125.04452 - 1934.136261 * T);
  }

  /* ---------- Full panchang computation ---------- */
  function computePanchang(date, lat, lon) {
    const jd = julianDay(date);
    const ayan = ayanamsa(jd);

    const sunTrop = sunLongitude(jd);
    const moonTrop = moonLongitude(jd);
    const sunSid = mod360(sunTrop - ayan);
    const moonSid = mod360(moonTrop - ayan);

    // Tithi
    const phaseAngle = mod360(moonTrop - sunTrop);
    const tithiNum = Math.floor(phaseAngle / 12); // 0..29
    const paksha = tithiNum < 15 ? 'Shukla' : 'Krishna';
    const tithiInPaksha = tithiNum % 15; // 0..14
    let tithiName;
    if (tithiNum === 14) tithiName = 'Purnima';
    else if (tithiNum === 29) tithiName = 'Amavasya';
    else tithiName = TITHIS[tithiInPaksha];
    const tithiProgress = (phaseAngle % 12) / 12;

    // Nakshatra (from sidereal moon)
    const nakSpan = 360 / 27;
    const nakIndex = Math.floor(moonSid / nakSpan);
    const nakPada = Math.floor((moonSid % nakSpan) / (nakSpan / 4)) + 1;
    const nakProgress = (moonSid % nakSpan) / nakSpan;

    // Yoga
    const yogaAngle = mod360(sunSid + moonSid);
    const yogaIndex = Math.floor(yogaAngle / nakSpan);
    const yogaProgress = (yogaAngle % nakSpan) / nakSpan;

    // Karana
    const kIndex = Math.floor(phaseAngle / 6); // 0..59
    let karanaName;
    if (kIndex === 0) karanaName = 'Kimstughna';
    else if (kIndex === 57) karanaName = 'Shakuni';
    else if (kIndex === 58) karanaName = 'Chatushpada';
    else if (kIndex === 59) karanaName = 'Naga';
    else karanaName = KARANAS_MOVABLE[(kIndex - 1) % 7];

    // Vara & sun events
    const weekday = date.getDay();
    const vara = VARAS[weekday];
    const ev = sunEvents(date, lat, lon);

    // Muhurta (30 from sunrise to next sunrise)
    let muhurta = null;
    if (ev.sunrise) {
      let sr = ev.sunrise;
      if (date < sr) {
        const prev = new Date(date.getTime() - 86400000);
        sr = sunEvents(prev, lat, lon).sunrise || sr;
      }
      const nextDay = new Date(sr.getTime() + 86400000);
      const nextSr = sunEvents(nextDay, lat, lon).sunrise ||
        new Date(sr.getTime() + 86400000);
      const frac = (date - sr) / (nextSr - sr);
      const idx = Math.min(29, Math.max(0, Math.floor(frac * 30)));
      muhurta = { index: idx + 1, isDay: idx < 15, progress: frac * 30 - idx };
    }

    // Rahu Kaal, Abhijit, Brahma Muhurta, Choghadiya
    let rahuKaal = null, abhijit = null, brahmaMuhurta = null, choghadiya = null;
    if (ev.sunrise && ev.sunset) {
      const dayLen = ev.sunset - ev.sunrise;
      const oct = RAHU_OCTANT[weekday];
      rahuKaal = {
        start: new Date(ev.sunrise.getTime() + (oct - 1) * dayLen / 8),
        end: new Date(ev.sunrise.getTime() + oct * dayLen / 8),
      };
      const noon = new Date((ev.sunrise.getTime() + ev.sunset.getTime()) / 2);
      abhijit = {
        start: new Date(noon.getTime() - dayLen / 30),
        end: new Date(noon.getTime() + dayLen / 30),
      };
      brahmaMuhurta = {
        start: new Date(ev.sunrise.getTime() - 96 * 60000),
        end: new Date(ev.sunrise.getTime() - 48 * 60000),
      };

      // Choghadiya — current slot (day: sunrise→sunset /8, night: sunset→next sunrise /8)
      const isDay = date >= ev.sunrise && date < ev.sunset;
      if (isDay) {
        const slot = Math.min(7, Math.floor((date - ev.sunrise) / (dayLen / 8)));
        const name = CHOGHADIYA_ORDER[(CHOGHADIYA_DAY_START[weekday] + slot) % 7];
        choghadiya = {
          name, nature: CHOGHADIYA_NATURE[name], isDay: true,
          start: new Date(ev.sunrise.getTime() + slot * dayLen / 8),
          end: new Date(ev.sunrise.getTime() + (slot + 1) * dayLen / 8),
        };
      } else {
        // night — from today's sunset or yesterday's sunset
        let sunset = ev.sunset, wd = weekday;
        if (date < ev.sunrise) {
          const prev = new Date(date.getTime() - 86400000);
          sunset = sunEvents(prev, lat, lon).sunset || sunset;
          wd = prev.getDay();
        }
        const nextDay = new Date(sunset.getTime() + 86400000);
        const nextRise = sunEvents(nextDay, lat, lon).sunrise ||
          new Date(sunset.getTime() + 43200000);
        const nightLen = nextRise - sunset;
        const slot = Math.min(7, Math.max(0, Math.floor((date - sunset) / (nightLen / 8))));
        const name = CHOGHADIYA_ORDER[(CHOGHADIYA_NIGHT_START[wd] + slot) % 7];
        choghadiya = {
          name, nature: CHOGHADIYA_NATURE[name], isDay: false,
          start: new Date(sunset.getTime() + slot * nightLen / 8),
          end: new Date(sunset.getTime() + (slot + 1) * nightLen / 8),
        };
      }
    }

    // Navagraha sidereal positions
    const grahas = [
      { name: 'Surya', en: 'Sun', symbol: '☉', lon: sunSid },
      { name: 'Chandra', en: 'Moon', symbol: '☾', lon: moonSid },
      { name: 'Mangala', en: 'Mars', symbol: '♂', lon: mod360(geocentricLongitude('Mars', jd) - ayan) },
      { name: 'Budha', en: 'Mercury', symbol: '☿', lon: mod360(geocentricLongitude('Mercury', jd) - ayan) },
      { name: 'Guru', en: 'Jupiter', symbol: '♃', lon: mod360(geocentricLongitude('Jupiter', jd) - ayan) },
      { name: 'Shukra', en: 'Venus', symbol: '♀', lon: mod360(geocentricLongitude('Venus', jd) - ayan) },
      { name: 'Shani', en: 'Saturn', symbol: '♄', lon: mod360(geocentricLongitude('Saturn', jd) - ayan) },
      { name: 'Rahu', en: 'N. Node', symbol: '☊', lon: mod360(meanLunarNode(jd) - ayan) },
      { name: 'Ketu', en: 'S. Node', symbol: '☋', lon: mod360(meanLunarNode(jd) + 180 - ayan) },
    ].map(g => ({
      ...g,
      rashi: RASHIS[Math.floor(g.lon / 30)],
      degInRashi: g.lon % 30,
    }));

    // Samvats (approximate — new year boundaries in Chaitra/Vaishakha not modelled exactly)
    const y = date.getFullYear();
    const pastNewYearApprox = (date.getMonth() > 2) ||
      (date.getMonth() === 2 && date.getDate() >= 22);
    const vikram = pastNewYearApprox ? y + 57 : y + 56;
    const shaka = pastNewYearApprox ? y - 78 : y - 79;

    return {
      jd, ayanamsa: ayan,
      sunTropical: sunTrop, moonTropical: moonTrop,
      sunSidereal: sunSid, moonSidereal: moonSid,
      tithi: { num: tithiNum + 1, name: tithiName, paksha, progress: tithiProgress },
      nakshatra: { index: nakIndex, name: NAKSHATRAS[nakIndex], pada: nakPada, progress: nakProgress },
      yoga: { index: yogaIndex, name: YOGAS[yogaIndex], progress: yogaProgress },
      karana: { index: kIndex, name: karanaName },
      vara, sunrise: ev.sunrise, sunset: ev.sunset, solarNoon: ev.solarNoon,
      muhurta, rahuKaal, abhijit, brahmaMuhurta, choghadiya,
      moon: moonPhase(jd),
      grahas,
      vikramSamvat: vikram, shakaSamvat: shaka,
    };
  }

  return {
    computePanchang, julianDay, moonPhase,
    NAKSHATRAS, RASHIS, VARAS,
  };
})();
