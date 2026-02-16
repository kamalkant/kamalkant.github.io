# GA4 Events Implementation - Shabd Khoj

## Overview

This document outlines the three main GA4 events being tracked in the Shabd Khoj game, matching the exact format from the old game.

## Event Format

All GA4 events use the following structure:

```javascript
{
    'event': 'game_data',
    'Augame': '[event_value]'
}
```

**Important:** The parameter key is `Augame` with a capital 'A'.

## The Three Main Events

### 1. crossword_end

**Triggered when:** Game completes (all words found or time runs out)

**Location:** `trackGameComplete()` function in tracking.js (line 126-133)

**Event Structure:**

```javascript
window.dataLayer.push({
  event: "game_data",
  augame: "crossword_end",
  final_score: finalScore,
  words_found: wordsFound,
  total_words: totalWords,
  coins_earned: coinsEarned,
});
```

**When it fires:**

- User completes all words
- Timer runs out
- Game ends for any reason

**Expected Volume:** ~16,247 events (based on GA data)

---

### 2. crossword_exit

**Triggered when:** User exits/leaves the game

**Location:** `trackBackButton()` function in tracking.js (line 220-226)

**Event Structure:**

```javascript
window.dataLayer.push({
  event: "game_data",
  augame: "crossword_exit",
});
```

**When it fires:**

- User clicks back button
- User navigates away from the game
- Browser back button is used

**Expected Volume:** ~17,873 events (based on GA data)

---

### 3. crossword_close

**Triggered when:** User closes the game over modal

**Location:** `trackModalClose()` function in tracking.js (line 247-253)

**Event Structure:**

```javascript
window.dataLayer.push({
  event: "game_data",
  augame: "crossword_close",
});
```

**When it fires:**

- User clicks the X button on game over modal
- User clicks outside the modal to close it
- Modal is dismissed in any way

**Expected Volume:** ~2,101 events (based on GA data)

---

## Event Parameter Details

### Common Parameters

All events use:

- **Event Name:** `game_data`
- **Event Parameter Key:** `augame`
- **Platform:** `web`

### Event-Specific Parameters

#### crossword_end (includes additional data)

- `final_score`: Player's final score
- `words_found`: Number of words found
- `total_words`: Total words in the puzzle
- `coins_earned`: Coins awarded

#### crossword_exit (minimal data)

- No additional parameters

#### crossword_close (minimal data)

- No additional parameters

---

## Implementation Status

✅ **crossword_end** - Implemented and tracking
✅ **crossword_exit** - Implemented and tracking
✅ **crossword_close** - Implemented and tracking

---

## Testing in GA4

### How to Verify Events

1. **Open GA4 DebugView:**
   - Go to GA4 property
   - Navigate to Configure > DebugView
   - Open the game with `?debug_mode=true` parameter

2. **Test Each Event:**

   **Test crossword_end:**
   - Play the game until completion
   - Check DebugView for `game_data` event with `augame: crossword_end`

   **Test crossword_exit:**
   - Click the back button
   - Check DebugView for `game_data` event with `augame: crossword_exit`

   **Test crossword_close:**
   - Complete a game and close the modal
   - Check DebugView for `game_data` event with `augame: crossword_close`

3. **Verify in GTM Preview:**
   - Enable GTM Preview mode
   - Perform actions that trigger each event
   - Verify events appear in the dataLayer

---

## Event Flow Example

### Typical User Journey:

```
1. User starts game
   ↓
2. User plays and completes game
   → crossword_end fires
   ↓
3. Game over modal appears
   ↓
4. User closes modal
   → crossword_close fires
   ↓
5. User clicks back button
   → crossword_exit fires
```

### Alternative Journey:

```
1. User starts game
   ↓
2. User decides to leave mid-game
   ↓
3. User clicks back button
   → crossword_exit fires
   (No crossword_end or crossword_close)
```

---

## Event Ratios (Based on GA Data)

From the provided GA screenshot:

- **crossword_exit:** 17,873 events (highest)
- **crossword_end:** 16,247 events
- **crossword_close:** 2,101 events

### Analysis:

- More exits than completions suggests some users leave mid-game
- Low close count compared to end suggests users may navigate away without closing modal
- Ratio makes sense: Not everyone who completes closes the modal, and some exit without completing

---

## Code Integration Points

### In script.js:

1. **Game Complete:**

```javascript
function endGame() {
  // ... game end logic ...
  if (window.gameTracking) {
    window.gameTracking.trackGameComplete(
      game.score,
      game.bestScore,
      game.foundWords.length,
      game.currentWordSet.words.length,
      game.timeRemaining,
      coinsEarned,
    );
  }
}
```

2. **Back Button:**

```javascript
document.querySelector(".back-btn").addEventListener("click", () => {
  if (window.gameTracking) {
    window.gameTracking.trackBackButton("header");
  }
});
```

3. **Modal Close:**

```javascript
elements.closeGameOverBtn.addEventListener("click", () => {
  if (window.gameTracking) {
    window.gameTracking.trackModalClose("game_over");
  }
});
```

---

## GTM Configuration

### Recommended GTM Setup:

1. **Create Custom Event Trigger:**
   - Trigger Type: Custom Event
   - Event Name: `game_data`

2. **Create GA4 Event Tag:**
   - Tag Type: GA4 Event
   - Event Name: `{{augame}}`
   - Event Parameters: Map additional parameters as needed

3. **Add Data Layer Variables:**
   - Variable Name: `augame`
   - Data Layer Variable Name: `augame`

---

## Troubleshooting

### Events Not Firing?

1. **Check Console:**
   - Look for tracking confirmation messages
   - Example: `📊 Back button tracked (crossword_exit)`

2. **Verify GTM:**
   - Ensure GTM container is loaded
   - Check GTM Preview mode

3. **Check DataLayer:**
   - Open browser console
   - Type: `window.dataLayer`
   - Verify events are being pushed

### Event Firing Multiple Times?

- Check for duplicate event listeners
- Ensure tracking functions are called only once per action

---

## Next Steps

1. ✅ Verify all three events are firing correctly
2. ✅ Test in GA4 DebugView
3. ✅ Monitor event counts in GA4 Reports
4. ✅ Set up custom reports for these events
5. ✅ Create conversion events if needed

---

## Contact & Support

For questions about this implementation:

- Review tracking.js for event definitions
- Check script.js for event trigger points
- Consult GA4 DebugView for real-time verification
