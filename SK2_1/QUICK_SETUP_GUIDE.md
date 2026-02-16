# 🚀 Analytics Setup - Quick Reference

## ✅ **What's Already Done**

### **1. Files Created:**

- ✅ `tracking.js` - All event tracking functions
- ✅ `config.js` - Game configuration variables
- ✅ GTM scripts added to `index.html`

### **2. HTML Updates:**

- ✅ GTM script in `<head>`
- ✅ GTM noscript in `<body>`
- ✅ `config.js` included
- ✅ `tracking.js` included

---

## 📝 **Next Steps: Add Tracking Calls**

### **Step 1: Track Game Start**

Find this code in `script.js` (around line 1101):

```javascript
elements.introStartBtn.addEventListener("click", () => {
  // Unlock audio for iOS Safari (requires user interaction)
  if (window.unlockAudio) {
    window.unlockAudio();
  }

  elements.introScreen.classList.add("hidden");
  startGame();
});
```

**Update to:**

```javascript
elements.introStartBtn.addEventListener("click", () => {
  // Unlock audio for iOS Safari (requires user interaction)
  if (window.unlockAudio) {
    window.unlockAudio();
  }

  // Track game start
  if (window.gameTracking) {
    window.gameTracking.trackGameStart();
  }

  elements.introScreen.classList.add("hidden");
  startGame();
});
```

---

### **Step 2: Track Word Found**

Find the `checkWord()` function in `script.js` (around line 600-700).

Look for the section where a word is successfully found:

```javascript
if (
  game.currentWordSet.words.includes(word) &&
  !foundWordsList.includes(word)
) {
  // Word found logic
  foundWordsList.push(word);
  game.foundWords.push(word);

  // Calculate points
  const timeTaken = Math.floor((Date.now() - game.currentWordStartTime) / 1000);
  const pointsEarned = Math.max(
    0,
    CONFIG.POINTS_PER_WORD - timeTaken * CONFIG.TIME_PENALTY,
  );

  game.score += pointsEarned;

  // ... rest of code
}
```

**Add tracking after calculating points:**

```javascript
if (
  game.currentWordSet.words.includes(word) &&
  !foundWordsList.includes(word)
) {
  // Word found logic
  foundWordsList.push(word);
  game.foundWords.push(word);

  // Calculate points
  const timeTaken = Math.floor((Date.now() - game.currentWordStartTime) / 1000);
  const pointsEarned = Math.max(
    0,
    CONFIG.POINTS_PER_WORD - timeTaken * CONFIG.TIME_PENALTY,
  );

  game.score += pointsEarned;

  // Track word found
  if (window.gameTracking) {
    window.gameTracking.trackWordFound(
      word,
      pointsEarned,
      timeTaken,
      game.foundWords.length,
      game.currentWordSet.words.length,
    );
  }

  // ... rest of code
}
```

---

### **Step 3: Track Game Complete**

Find the `endGame()` function in `script.js`.

Look for where the game over modal is shown:

```javascript
function endGame(allWordsFound = false) {
  game.isActive = false;
  clearInterval(game.timerInterval);

  // Calculate final stats
  const finalScore = game.score;
  const wordsFound = game.foundWords.length;
  const totalWords = game.currentWordSet.words.length;
  const timeTaken = Math.floor((Date.now() - game.gameStartTime) / 1000);

  // Show modal
  elements.gameOverModal.classList.add("show");

  // ... rest of code
}
```

**Add tracking:**

```javascript
function endGame(allWordsFound = false) {
  game.isActive = false;
  clearInterval(game.timerInterval);

  // Calculate final stats
  const finalScore = game.score;
  const wordsFound = game.foundWords.length;
  const totalWords = game.currentWordSet.words.length;
  const timeTaken = Math.floor((Date.now() - game.gameStartTime) / 1000);
  const coinsEarned = Math.floor(finalScore / 10); // Adjust formula as needed

  // Track game complete
  if (window.gameTracking) {
    window.gameTracking.trackGameComplete(
      finalScore,
      game.bestScore,
      wordsFound,
      totalWords,
      timeTaken,
      coinsEarned,
    );
  }

  // Show modal
  elements.gameOverModal.classList.add("show");

  // ... rest of code
}
```

---

### **Step 4: Track Hint Used**

Find the hint button click handler:

```javascript
elements.hintBtn.addEventListener("click", () => {
  if (game.hintsRemaining > 0) {
    giveHint();
  }
});
```

**Update to:**

```javascript
elements.hintBtn.addEventListener("click", () => {
  if (game.hintsRemaining > 0) {
    // Track hint used
    if (window.gameTracking) {
      window.gameTracking.trackHintUsed(
        game.foundWords.length + 1,
        CONFIG.HINT_PENALTY,
      );
    }

    giveHint();
  }
});
```

---

### **Step 5: Track Refresh/Restart**

Find the refresh button handler:

```javascript
elements.refreshMenuItem.addEventListener("click", () => {
  startGame();
});
```

**Update to:**

```javascript
elements.refreshMenuItem.addEventListener("click", () => {
  if (window.gameTracking) {
    window.gameTracking.trackRefreshGame("menu");
  }
  startGame();
});
```

And for the play again button:

```javascript
elements.playAgainBtn.addEventListener("click", () => {
  if (window.gameTracking) {
    window.gameTracking.trackRefreshGame("modal");
  }
  elements.gameOverModal.classList.remove("show");
  startGame();
});
```

---

## 🧪 **Testing Your Implementation**

### **1. Open Browser Console**

```javascript
// Check if dataLayer exists
console.log(window.dataLayer);

// Check if tracking is loaded
console.log(window.gameTracking);
```

### **2. Play the Game**

1. Click "खेलना शुरू करें" → Should see game_start events
2. Find a word → Should see word_found events
3. Complete game → Should see game_complete events

### **3. Monitor Network Tab**

Look for requests to:

- `googletagmanager.com/gtm.js` ✅
- `googletagmanager.com/a?id=GTM-5M8X46V` ✅
- `analytics.google.com/g/collect` ✅ (if GA4 configured)

### **4. Check dataLayer**

```javascript
// In console, after playing
window.dataLayer.forEach((event, index) => {
  console.log(`Event ${index}:`, event);
});
```

You should see:

```javascript
{event: "gtm.js", gtm.start: ...}
{event: "shabdkhoj", games: "game_start"}
{event: "Shabdkhoj_Web", Sk_web: "Sk_web_game_started"}
{event: "shabdkhoj", games: "word_found", ...}
{event: "Shabdkhoj_Web", Sk_web: "Sk_web_word_found", ...}
// ... more events
```

---

## 📊 **GTM Configuration (In GTM Dashboard)**

### **1. Create Variables**

- `games` → Data Layer Variable → Variable Name: `games`
- `Sk_web` → Data Layer Variable → Variable Name: `Sk_web`
- `final_score` → Data Layer Variable → Variable Name: `final_score`
- `coins_earned` → Data Layer Variable → Variable Name: `coins_earned`

### **2. Create Triggers**

- **Game Start**: Custom Event → Event name equals `shabdkhoj` AND `games` equals `game_start`
- **Word Found**: Custom Event → Event name equals `shabdkhoj` AND `games` equals `word_found`
- **Game Complete**: Custom Event → Event name equals `shabdkhoj` AND `games` equals `game_complete`

### **3. Create Tags**

- **GA4 Event - Game Start**: GA4 Event → Event Name: `game_start`
- **GA4 Event - Word Found**: GA4 Event → Event Name: `word_found`
- **GA4 Event - Game Complete**: GA4 Event → Event Name: `game_complete`

---

## ✅ **Checklist**

- [x] GTM script in `<head>`
- [x] GTM noscript in `<body>`
- [x] `config.js` created and included
- [x] `tracking.js` created and included
- [ ] Add `trackGameStart()` call
- [ ] Add `trackWordFound()` call
- [ ] Add `trackGameComplete()` call
- [ ] Add `trackHintUsed()` call
- [ ] Add `trackRefreshGame()` calls
- [ ] Test in browser console
- [ ] Verify events in Network tab
- [ ] Configure GTM dashboard

---

## 🎯 **Summary**

You're 80% done! Just need to:

1. Add the 5 tracking function calls to `script.js`
2. Test in browser
3. Configure GTM dashboard

All the hard work is done! 🎉
