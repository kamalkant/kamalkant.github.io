# Debugging GA4 Events - Step by Step Guide

## Issue: console.table returns undefined

This happens when:

1. No `game_data` events have been fired yet
2. The game hasn't been completed
3. DataLayer is empty or doesn't contain the events

## Step-by-Step Debugging

### Step 1: Check if dataLayer exists

```javascript
// Should return an array
console.log(window.dataLayer);
```

### Step 2: Check all events in dataLayer

```javascript
// View all events
console.log(window.dataLayer);

// Or view as table
console.table(window.dataLayer);
```

### Step 3: Check if tracking functions are loaded

```javascript
// Should return an object with tracking functions
console.log(window.gameTracking);
```

### Step 4: Manually trigger a test event

```javascript
// Test crossword_end event
window.dataLayer.push({
  event: "game_data",
  Augame: "crossword_end",
  final_score: 100,
  words_found: 5,
  total_words: 5,
  coins_earned: 10,
});

// Now check dataLayer again
console.log(window.dataLayer[window.dataLayer.length - 1]);
```

### Step 5: Filter and view game_data events

```javascript
// This will show all game_data events
const gameDataEvents = window.dataLayer.filter((e) => e.event === "game_data");
console.log("Found", gameDataEvents.length, "game_data events");
console.table(gameDataEvents);
```

### Step 6: Trigger events through game actions

**Option A: Use tracking functions directly**

```javascript
// Test crossword_end
if (window.gameTracking) {
  window.gameTracking.trackGameComplete(100, 100, 5, 5, 120, 10);
}

// Test crossword_exit
if (window.gameTracking) {
  window.gameTracking.trackBackButton("header");
}

// Test crossword_close
if (window.gameTracking) {
  window.gameTracking.trackModalClose("game_over");
}

// Now check dataLayer
console.table(window.dataLayer.filter((e) => e.event === "game_data"));
```

**Option B: Play the game**

1. Start the game
2. Find all words (or let timer run out)
3. Game over modal appears → `crossword_end` fires
4. Close the modal → `crossword_close` fires
5. Click back button → `crossword_exit` fires

### Step 7: Real-time monitoring

```javascript
// Set up a listener to see events as they fire
const originalPush = window.dataLayer.push;
window.dataLayer.push = function () {
  console.log("🔔 New dataLayer event:", arguments[0]);
  return originalPush.apply(this, arguments);
};
```

## Common Issues & Solutions

### Issue 1: dataLayer is empty

**Solution:** Refresh the page and check again. GTM should initialize dataLayer.

### Issue 2: gameTracking is undefined

**Solution:** Make sure tracking.js is loaded:

```javascript
// Check if script is loaded
const scripts = Array.from(document.scripts).map((s) => s.src);
console.log(scripts.filter((s) => s.includes("tracking")));
```

### Issue 3: Events fire but don't appear in GTM

**Solution:**

1. Open GTM Preview mode
2. Refresh the page
3. Trigger events
4. Check the "Data Layer" tab in GTM Preview

### Issue 4: console.table returns undefined

**Solution:** The filter might return an empty array. Try:

```javascript
const events = window.dataLayer.filter((e) => e.event === "game_data");
if (events.length === 0) {
  console.log("No game_data events found yet");
} else {
  console.table(events);
}
```

## Quick Test Script

Copy and paste this entire block into console:

```javascript
console.log("=== GA4 Events Debug ===");

// 1. Check dataLayer
console.log("1. DataLayer exists:", !!window.dataLayer);
console.log("   Total events:", window.dataLayer ? window.dataLayer.length : 0);

// 2. Check tracking
console.log("2. Tracking loaded:", !!window.gameTracking);

// 3. Check for game_data events
const gameDataEvents = window.dataLayer
  ? window.dataLayer.filter((e) => e.event === "game_data")
  : [];
console.log("3. game_data events found:", gameDataEvents.length);

if (gameDataEvents.length > 0) {
  console.log("   Events:");
  console.table(gameDataEvents);
} else {
  console.log("   No game_data events yet. Triggering test event...");

  // Trigger a test event
  window.dataLayer.push({
    event: "game_data",
    Augame: "crossword_end",
    final_score: 999,
    words_found: 5,
    total_words: 5,
    coins_earned: 50,
  });

  console.log("   Test event pushed. Check dataLayer:");
  console.table(window.dataLayer.filter((e) => e.event === "game_data"));
}

// 4. Show last 5 events
console.log("4. Last 5 dataLayer events:");
console.table(window.dataLayer.slice(-5));
```

## Expected Output

When events are working correctly, you should see:

```
┌─────────┬──────────────┬──────────────────┬─────────────┬──────────────┬──────────────┬───────────────┐
│ (index) │    event     │      Augame      │ final_score │ words_found  │ total_words  │ coins_earned  │
├─────────┼──────────────┼──────────────────┼─────────────┼──────────────┼──────────────┼───────────────┤
│    0    │ 'game_data'  │ 'crossword_end'  │     100     │      5       │      5       │      10       │
│    1    │ 'game_data'  │ 'crossword_exit' │             │              │              │               │
│    2    │ 'game_data'  │ 'crossword_close'│             │              │              │               │
└─────────┴──────────────┴──────────────────┴─────────────┴──────────────┴──────────────┴───────────────┘
```

## GTM Preview Mode

1. Go to your GTM container
2. Click "Preview"
3. Enter your game URL
4. Click "Connect"
5. In the GTM Preview window:
   - Click "Data Layer" tab
   - Look for `game_data` events
   - Verify `Augame` parameter exists

## GA4 DebugView

1. Add `?debug_mode=true` to URL
2. Open GA4 → Configure → DebugView
3. Trigger events in the game
4. Events should appear in real-time

## Still Not Working?

Check these files are loaded in correct order:

1. GTM script (in `<head>`)
2. config.js
3. tracking.js
4. script.js

View in browser console:

```javascript
document.querySelectorAll("script").forEach((s) => {
  console.log(s.src || s.textContent.substring(0, 50));
});
```
