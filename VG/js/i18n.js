/* ============================================================
   VEDIC COSMIC CLOCK — i18n (Hindi default / English)
   ============================================================ */

const I18N = (() => {

  // [hindi, english]
  const UI = {
    'title.h1':        ['वैदिक घड़ी', 'Vedic Cosmic Clock'],
    'title.sub':       ['वैदिक कॉस्मिक घड़ी · खगोलीय वेधशाला', 'VEDIC COSMIC CLOCK · CELESTIAL OBSERVATORY'],
    'panel.panchang':  ['पंचांग', 'Panchang'],
    'panel.navagraha': ['नवग्रह', 'Navagraha'],
    'k.tithi':         ['तिथि', 'Tithi'],
    'k.nakshatra':     ['नक्षत्र', 'Nakshatra'],
    'k.yoga':          ['योग', 'Yoga'],
    'k.karana':        ['करण', 'Karana'],
    'k.paksha':        ['पक्ष', 'Paksha'],
    'k.vara':          ['वार', 'Vara'],
    'k.sunrise':       ['सूर्योदय', 'Sunrise'],
    'k.sunset':        ['सूर्यास्त', 'Sunset'],
    'k.tithiProgress': ['तिथि प्रगति', 'Tithi progress'],
    'k.moonphase':     ['चंद्र कला', 'Moon Phase'],
    'k.rahu':          ['राहु काल', 'Rahu Kaal'],
    'k.abhijit':       ['अभिजीत मुहूर्त', 'Abhijit Muhurta'],
    'k.brahma':        ['ब्रह्म मुहूर्त', 'Brahma Muhurta'],
    'k.choghadiya':    ['चौघड़िया', 'Choghadiya'],
    'k.date':          ['दिनांक', 'Date'],
    'k.vikram':        ['विक्रम संवत', 'Vikram Samvat'],
    'k.shaka':         ['शक संवत', 'Shaka Samvat'],
    'k.local':         ['स्थानीय समय', 'Local Time'],
    'k.utc':           ['यूटीसी', 'UTC'],
    'k.muhurta':       ['मुहूर्त', 'Muhurta'],
    'svg.tithi':       ['तिथि', 'TITHI'],
    'svg.paksha':      ['पक्ष', 'PAKSHA'],
    'svg.yoga':        ['योग', 'YOGA'],
    'svg.karana':      ['करण', 'KARANA'],
    'svg.vara':        ['वार', 'VARA'],
    'svg.muhurta':     ['मुहूर्त', 'MUHURTA'],
    'u.pada':          ['चरण', 'Pada'],
    'u.paksha':        ['पक्ष', 'Paksha'],
    'u.day':           ['दिन', 'Day'],
    'u.night':         ['रात्रि', 'Night'],
    'u.illuminated':   ['प्रकाशित', 'illuminated'],
    'u.waxing':        ['बढ़ता (शुक्ल)', 'Waxing'],
    'u.waning':        ['घटता (कृष्ण)', 'Waning'],
    'u.ujjain':        ['उज्जैन', 'Ujjain'],
    'u.yourloc':       ['आपका स्थान', 'Your location'],
    'u.locating':      ['स्थान खोजा जा रहा है…', 'Locating…'],
    'note': [
      'अनुमानित खगोलीय गणना · लाहिड़ी अयनांश · उज्जैन की वैदिक घड़ी से प्रेरित',
      'Approximate astronomical computation · Lahiri ayanamsa · inspired by the Vedic Ghadi of Ujjain',
    ],
  };

  // English value → Hindi value
  const NAMES = {
    tithi: {
      Pratipada: 'प्रतिपदा', Dwitiya: 'द्वितीया', Tritiya: 'तृतीया', Chaturthi: 'चतुर्थी',
      Panchami: 'पंचमी', Shashthi: 'षष्ठी', Saptami: 'सप्तमी', Ashtami: 'अष्टमी',
      Navami: 'नवमी', Dashami: 'दशमी', Ekadashi: 'एकादशी', Dwadashi: 'द्वादशी',
      Trayodashi: 'त्रयोदशी', Chaturdashi: 'चतुर्दशी', Purnima: 'पूर्णिमा', Amavasya: 'अमावस्या',
    },
    paksha: { Shukla: 'शुक्ल', Krishna: 'कृष्ण' },
    yoga: {
      Vishkambha: 'विष्कम्भ', Priti: 'प्रीति', Ayushman: 'आयुष्मान', Saubhagya: 'सौभाग्य',
      Shobhana: 'शोभन', Atiganda: 'अतिगण्ड', Sukarman: 'सुकर्मा', Dhriti: 'धृति',
      Shula: 'शूल', Ganda: 'गण्ड', Vriddhi: 'वृद्धि', Dhruva: 'ध्रुव',
      Vyaghata: 'व्याघात', Harshana: 'हर्षण', Vajra: 'वज्र', Siddhi: 'सिद्धि',
      Vyatipata: 'व्यतीपात', Variyana: 'वरीयान', Parigha: 'परिघ', Shiva: 'शिव',
      Siddha: 'सिद्ध', Sadhya: 'साध्य', Shubha: 'शुभ', Shukla: 'शुक्ल',
      Brahma: 'ब्रह्म', Indra: 'इन्द्र', Vaidhriti: 'वैधृति',
    },
    karana: {
      Bava: 'बव', Balava: 'बालव', Kaulava: 'कौलव', Taitila: 'तैतिल',
      Gara: 'गर', Vanija: 'वणिज', Vishti: 'विष्टि (भद्रा)',
      Shakuni: 'शकुनि', Chatushpada: 'चतुष्पद', Naga: 'नाग', Kimstughna: 'किंस्तुघ्न',
    },
    choghadiya: {
      Udveg: 'उद्वेग', Chal: 'चल', Labh: 'लाभ', Amrit: 'अमृत',
      Kaal: 'काल', Shubh: 'शुभ', Rog: 'रोग',
    },
    moonphase: {
      'New Moon · Amavasya': 'अमावस्या (नया चाँद)',
      'Waxing Crescent': 'शुक्ल पक्ष का बढ़ता चाँद',
      'First Quarter': 'प्रथम चतुर्थांश',
      'Waxing Gibbous': 'पूर्णिमा की ओर बढ़ता चाँद',
      'Full Moon · Purnima': 'पूर्णिमा (पूर्ण चंद्र)',
      'Waning Gibbous': 'कृष्ण पक्ष का घटता चाँद',
      'Last Quarter': 'अंतिम चतुर्थांश',
      'Waning Crescent': 'अमावस्या की ओर घटता चाँद',
    },
    graha: {
      Surya: 'सूर्य', Chandra: 'चंद्र', Mangala: 'मंगल', Budha: 'बुध',
      Guru: 'गुरु', Shukra: 'शुक्र', Shani: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
    },
  };

  let lang = localStorage.getItem('vg-lang') || 'hi';
  const listeners = [];

  function t(key) {
    const e = UI[key];
    return e ? e[lang === 'hi' ? 0 : 1] : key;
  }

  function name(category, englishName) {
    if (lang !== 'hi') return englishName;
    const m = NAMES[category];
    return (m && m[englishName]) || englishName;
  }

  function dateLocale() { return lang === 'hi' ? 'hi-IN' : 'en-IN'; }

  function applyStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(node => {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    const hiBtn = document.getElementById('langHi');
    const enBtn = document.getElementById('langEn');
    if (hiBtn && enBtn) {
      hiBtn.classList.toggle('active', lang === 'hi');
      enBtn.classList.toggle('active', lang === 'en');
    }
  }

  function setLang(l) {
    lang = l === 'en' ? 'en' : 'hi';
    localStorage.setItem('vg-lang', lang);
    applyStatic();
    listeners.forEach(fn => fn(lang));
  }

  function onChange(fn) { listeners.push(fn); }

  // wire toggle buttons + apply initial language once DOM is ready
  function init() {
    const hiBtn = document.getElementById('langHi');
    const enBtn = document.getElementById('langEn');
    if (hiBtn) hiBtn.addEventListener('click', () => setLang('hi'));
    if (enBtn) enBtn.addEventListener('click', () => setLang('en'));
    applyStatic();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { t, name, setLang, onChange, dateLocale, get lang() { return lang; } };
})();
