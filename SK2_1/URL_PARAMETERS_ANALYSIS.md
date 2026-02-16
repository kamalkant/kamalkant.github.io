# URL Parameters Analysis - Old Game

## 🔍 **URL Parameter Effects**

Based on analysis of: `https://www.amarujala.com/games/shabd-khoj?cache_clear=1&in_app=app&fullscreen=1`

---

## 📋 **URL Parameters**

### **1. `in_app=app`**

**Purpose**: Indicates the game is being loaded inside a mobile app (webview)

**Effects**:

- ✅ Changes UI layout to "in-app" mode
- ✅ Removes website header/footer/navigation
- ✅ Shows specialized app header with back button
- ✅ Centers game container with blurred background
- ❌ Does NOT add custom tracking parameters to dataLayer
- ✅ Captured in GA4 via `document_location` (dl) parameter

### **2. `fullscreen=1`**

**Purpose**: Enables fullscreen mode for the game

**Effects**:

- ✅ Removes all site navigation elements
- ✅ Maximizes game area
- ✅ Works in conjunction with `in_app=app`
- ❌ Does NOT add custom tracking parameters to dataLayer
- ✅ Captured in GA4 via `document_location` (dl) parameter

### **3. `cache_clear=1`**

**Purpose**: Forces cache refresh

**Effects**:

- ✅ Ensures latest version of game loads
- ✅ Bypasses browser cache
- ❌ No tracking impact

---

## 🎨 **UI/UX Differences**

### **Standard Web Version**

```
https://www.amarujala.com/games/shabd-khoj
```

- Full website header with logo, menu, navigation
- Website footer with links
- Standard page layout
- Ads and promotional content
- Social sharing buttons

### **In-App Version**

```
https://www.amarujala.com/games/shabd-khoj?in_app=app&fullscreen=1
```

- **Removed**: Website header, footer, navigation, ads
- **Added**: Custom app header with:
  - Back button (← arrow) → links to www.amarujala.com
  - Refresh button (🔄) → restarts game
  - Timer and score in header
- **Layout**: Centered game container with blurred/greyed background
- **Appearance**: Standalone app-like experience

---

## 📊 **Tracking Behavior**

### **Key Finding:**

The URL parameters (`in_app`, `fullscreen`) are **NOT** explicitly added to dataLayer events as custom properties.

### **How They're Tracked:**

#### **1. Via GA4 Document Location**

```
https://analytics.google.com/g/collect?
  dl=https://www.amarujala.com/games/shabd-khoj?in_app=app&fullscreen=1
```

The full URL (including parameters) is sent as `dl` (document location) in GA4 hits.

#### **2. Via GTM Click Events**

```javascript
{
  "event": "gtm.click",
  "gtm.elementUrl": "https://www.amarujala.com/games/shabd-khoj?in_app=app&fullscreen=1"
}
```

GTM auto-tracking captures the full URL in click events.

#### **3. NOT in Custom DataLayer Events**

```javascript
// This is what fires (NO in_app parameter):
{
  "event": "shabdkhoj",
  "games": "game_start"
}

// NOT this:
{
  "event": "shabdkhoj",
  "games": "game_start",
  "in_app": "app"  // ❌ NOT included
}
```

---

## 🔧 **Implementation for Your Game**

### **Option 1: Match Old Game (Minimal)**

Don't add URL parameters to dataLayer - let GA4 capture them via document location.

```javascript
// No changes needed - current implementation is fine
```

### **Option 2: Enhanced Tracking (Recommended)**

Add URL parameters to your tracking for better segmentation:

```javascript
// Add to tracking.js
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    in_app: params.get("in_app") || "web",
    fullscreen: params.get("fullscreen") === "1",
    source: params.get("src") || "direct",
  };
}

// Update trackGameStart to include URL params
export function trackGameStart() {
  try {
    const urlParams = getUrlParams();

    window.dataLayer.push({
      event: "shabdkhoj",
      games: "game_start",
      in_app: urlParams.in_app, // NEW
      fullscreen: urlParams.fullscreen, // NEW
      source: urlParams.source, // NEW
    });

    window.dataLayer.push({
      event: "Shabdkhoj_Web",
      Sk_web: "Sk_web_game_started",
      Sk_in_app: urlParams.in_app, // NEW
      Sk_fullscreen: urlParams.fullscreen, // NEW
    });

    console.log("📊 Game start tracked with params:", urlParams);
  } catch (error) {
    console.error("Error tracking game start:", error);
  }
}
```

---

## 📱 **Detecting In-App Mode**

### **JavaScript Detection:**

```javascript
// Check if running in app
function isInApp() {
  const params = new URLSearchParams(window.location.search);
  return params.get("in_app") === "app";
}

// Check if fullscreen
function isFullscreen() {
  const params = new URLSearchParams(window.location.search);
  return params.get("fullscreen") === "1";
}

// Use in your code
if (isInApp()) {
  console.log("Running in app mode");
  // Hide certain UI elements
  // Adjust layout
}
```

### **CSS Detection:**

```css
/* Show/hide elements based on body class */
body.in-app .website-header,
body.in-app .website-footer {
  display: none;
}

body.in-app .game-container {
  max-width: 100%;
  margin: 0 auto;
}
```

### **Add to HTML:**

```javascript
// Add class to body based on URL params
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("in_app") === "app") {
    document.body.classList.add("in-app");
  }
  if (params.get("fullscreen") === "1") {
    document.body.classList.add("fullscreen");
  }
});
```

---

## 🎯 **Common URL Parameter Patterns**

### **From Amar Ujala App:**

```
?in_app=app&fullscreen=1
```

### **From Main Menu:**

```
?src=mainmenu
```

### **From Social Share:**

```
?utm_source=facebook&utm_medium=social
```

### **With Cache Clear:**

```
?cache_clear=1&in_app=app&fullscreen=1
```

---

## 📊 **Tracking Event Comparison**

| Event             | Standard Web                       | In-App Mode            | Difference       |
| ----------------- | ---------------------------------- | ---------------------- | ---------------- |
| **Page Load**     | `gtm.js`, `gtm.dom`, `gtm.load`    | Same                   | ✅ No difference |
| **Game Start**    | `shabdkhoj` (game_start)           | Same                   | ✅ No difference |
| **Word Found**    | GTM click auto-tracking            | Same                   | ✅ No difference |
| **Game Complete** | `game_data` (augame=crossword_end) | Same                   | ✅ No difference |
| **URL Capture**   | Via GA4 `dl` parameter             | Via GA4 `dl` parameter | ✅ No difference |

**Conclusion**: The tracking events are **identical** regardless of URL parameters. The parameters only affect UI/UX, not tracking logic.

---

## 🚀 **Recommendations**

### **For Your Game:**

1. **✅ Keep Current Implementation**
   - Your tracking is already better than the old game
   - No need to change based on URL parameters

2. **✅ Optional: Add URL Parameter Detection**
   - Useful for segmentation in analytics
   - Helps identify app vs web users
   - See "Option 2: Enhanced Tracking" above

3. **✅ Optional: Add In-App UI Mode**
   - Detect `in_app=app` parameter
   - Hide header/footer when in app
   - Show simplified UI

4. **✅ Test with Different URLs**

   ```
   # Standard web
   http://localhost:8000/index.html

   # In-app mode
   http://localhost:8000/index.html?in_app=app&fullscreen=1

   # From source
   http://localhost:8000/index.html?src=mainmenu
   ```

---

## 📝 **Summary**

### **What We Learned:**

- ✅ URL parameters affect UI/UX, not tracking
- ✅ `in_app=app` enables app-like layout
- ✅ `fullscreen=1` removes site navigation
- ✅ Parameters captured via GA4 document location
- ✅ NOT added to custom dataLayer events
- ✅ Your current tracking is already complete

### **What You Should Do:**

1. ✅ Keep your current tracking.js (it's perfect!)
2. ✅ Optionally add URL parameter detection for enhanced tracking
3. ✅ Optionally add in-app UI mode for better app experience
4. ✅ Test with different URL parameters

---

**Analysis Date**: 2026-02-13  
**URL Analyzed**: `https://www.amarujala.com/games/shabd-khoj?cache_clear=1&in_app=app&fullscreen=1`  
**Status**: ✅ Complete
