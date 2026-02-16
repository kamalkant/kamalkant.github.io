# Complete Analytics Setup Guide

Based on network analysis of the old game, here's the complete setup:

## 🔧 **Required Analytics Services**

### **1. Google Tag Manager (GTM)**

- **Container ID**: `GTM-5M8X46V`
- Handles all event tracking

### **2. Google Analytics 4 (GA4)**

- **Measurement ID**: `G-G1MXH173BM`
- Connected through GTM

### **3. Facebook Pixel (Optional)**

- **Pixel ID**: `536475799826686`
- Tracks button clicks

### **4. Microsoft Clarity (Optional)**

- Session recording and heatmaps

---

## 📋 **Step-by-Step Implementation**

### **Step 1: Add GTM to HTML**

Add this to your `index.html` **before closing `</head>`**:

```html
<!-- Google Tag Manager -->
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-5M8X46V");
</script>
<!-- End Google Tag Manager -->

<script>
  window.dataLayer = window.dataLayer || [];
</script>
```

Add this **immediately after opening `<body>`**:

```html
<!-- Google Tag Manager (noscript) -->
<noscript
  ><iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-5M8X46V"
    height="0"
    width="0"
    style="display:none;visibility:hidden"
  ></iframe
></noscript>
<!-- End Google Tag Manager (noscript) -->
```

---

### **Step 2: Include tracking.js**

Add this **before closing `</body>`**:

```html
<script src="tracking.js"></script>
```

---

### **Step 3: Add Tracking Calls to script.js**

#### **A. Game Start (Intro Button)**

```javascript
// In your intro start button click handler
elements.introStartBtn.addEventListener("click", () => {
  // Unlock audio for iOS
  if (window.unlockAudio) {
    window.unlockAudio();
  }

  // Track game start
  if (window.gameTracking) {
    window.gameTracking.trackGameStart();
  }

  // Hide intro and start game
  elements.introScreen.classList.add("hidden");
  startGame();
});
```

#### **B. Word Found**

```javascript
// In your checkWord() function, after word is found
function checkWord() {
  // ... existing code ...

  if (
    game.currentWordSet.words.includes(word) &&
    !foundWordsList.includes(word)
  ) {
    // Calculate time and points
    const timeTaken = Math.floor(
      (Date.now() - game.currentWordStartTime) / 1000,
    );
    const pointsEarned = Math.max(
      0,
      CONFIG.POINTS_PER_WORD - timeTaken * CONFIG.TIME_PENALTY,
    );

    // Track word found
    if (window.gameTracking) {
      window.gameTracking.trackWordFound(
        word,
        pointsEarned,
        timeTaken,
        game.foundWords.length + 1,
        game.currentWordSet.words.length,
      );
    }

    // ... rest of your code ...
  } else {
    // Track failed attempt
    if (window.gameTracking) {
      window.gameTracking.trackWordAttemptFailed(game.selectedCells);
    }
  }
}
```

#### **C. Game Complete**

```javascript
// In your endGame() function
function endGame(allWordsFound) {
  const timeTaken = Math.floor((Date.now() - game.gameStartTime) / 1000);
  const coinsEarned = Math.floor(game.score / 10); // Adjust based on your logic

  // Track game complete
  if (window.gameTracking) {
    window.gameTracking.trackGameComplete(
      game.score,
      game.bestScore,
      game.foundWords.length,
      game.currentWordSet.words.length,
      timeTaken,
      coinsEarned,
    );
  }

  // ... rest of your code ...
}
```

#### **D. Hint Used**

```javascript
// In your giveHint() function
function giveHint() {
  // Track hint
  if (window.gameTracking) {
    window.gameTracking.trackHintUsed(
      game.foundWords.length + 1,
      CONFIG.HINT_PENALTY,
    );
  }

  // ... rest of your code ...
}
```

#### **E. Refresh Game**

```javascript
// Refresh button in header
elements.refreshMenuItem.addEventListener("click", () => {
  if (window.gameTracking) {
    window.gameTracking.trackRefreshGame("menu");
  }
  startGame();
});

// Play again button in modal
elements.playAgainBtn.addEventListener("click", () => {
  if (window.gameTracking) {
    window.gameTracking.trackRefreshGame("modal");
  }
  elements.gameOverModal.classList.remove("show");
  startGame();
});
```

#### **F. Settings Changes**

```javascript
// Theme change
elements.themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const themeName = option.dataset.theme;
    if (window.gameTracking) {
      window.gameTracking.trackThemeChange(themeName);
    }
    // ... rest of your code ...
  });
});

// Sound toggle
elements.soundToggle.addEventListener("change", (e) => {
  if (window.gameTracking) {
    window.gameTracking.trackSoundToggle(e.target.checked);
  }
  // ... rest of your code ...
});

// Vibration toggle
elements.vibrationToggle.addEventListener("change", (e) => {
  if (window.gameTracking) {
    window.gameTracking.trackVibrationToggle(e.target.checked);
  }
  // ... rest of your code ...
});
```

---

### **Step 4: Page Load Tracking**

Add this at the end of your `script.js`:

```javascript
// Track page load
window.addEventListener("load", () => {
  const loadTime = performance.now();
  if (window.gameTracking) {
    window.gameTracking.trackPageLoad(Math.round(loadTime));
    window.gameTracking.trackSessionStart();
  }
});

// Track session end
window.addEventListener("beforeunload", () => {
  if (game.gameStartTime && window.gameTracking) {
    const sessionDuration = Math.floor(
      (Date.now() - game.gameStartTime) / 1000,
    );
    window.gameTracking.trackSessionEnd(sessionDuration);
  }
});
```

---

## 🔍 **Testing Your Implementation**

### **1. Check dataLayer in Console**

Open browser console and type:

```javascript
console.log(window.dataLayer);
```

You should see events like:

```javascript
[
  {event: "gtm.js", gtm.start: 1234567890},
  {event: "shabdkhoj", games: "game_start"},
  {event: "Shabdkhoj_Web", Sk_web: "Sk_web_game_started"},
  // ... more events
]
```

### **2. Use GTM Preview Mode**

1. Go to GTM dashboard
2. Click "Preview"
3. Enter your game URL
4. Play the game
5. Verify events fire in the preview panel

### **3. Check Network Tab**

Look for requests to:

- `googletagmanager.com/gtm.js`
- `googletagmanager.com/a?id=GTM-5M8X46V`
- `analytics.google.com/g/collect` (if GA4 is configured)

---

## 📊 **GTM Configuration**

In your GTM dashboard, you need to:

### **1. Create Variables**

- `games` (Data Layer Variable)
- `Sk_web` (Data Layer Variable)
- `Sk_score` (Data Layer Variable)
- `Sk_coins` (Data Layer Variable)
- etc.

### **2. Create Triggers**

- `shabdkhoj - game_start` (Custom Event)
- `shabdkhoj - word_found` (Custom Event)
- `shabdkhoj - game_complete` (Custom Event)
- etc.

### **3. Create Tags**

- **GA4 Event Tag** for each custom event
- **Facebook Pixel Tag** (optional)
- **Clarity Tag** (optional)

---

## 🎯 **Summary**

### **What fires when:**

| Action                  | Events                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Page loads              | `gtm.js`, `gtm.dom`, `gtm.load`                                                     |
| Click "खेलना शुरू करें" | `shabdkhoj` (game_start), `Shabdkhoj_Web` (Sk_web_game_started), `gtm.click`        |
| Find a word             | `shabdkhoj` (word_found), `Shabdkhoj_Web` (Sk_web_word_found), `gtm.click`          |
| Game complete           | `shabdkhoj` (game_complete), `Shabdkhoj_Web` (Sk_web_game_complete_success/partial) |
| Settings change         | `shabdkhoj` (setting_change), `Shabdkhoj_Web` (Sk_web_setting_change)               |

---

## ⚠️ **Important Notes**

1. **GTM Container ID**: Use `GTM-5M8X46V` (from old game) OR get your own from your team
2. **GA4 Measurement ID**: Use `G-G1MXH173BM` (from old game) OR get your own
3. **Facebook Pixel**: Optional - only if you want social tracking
4. **Clarity**: Optional - only if you want session recordings

---

**Ready to implement!** 🚀
