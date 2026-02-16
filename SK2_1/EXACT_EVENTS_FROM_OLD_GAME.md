# 🎯 ALL Events from Old Game (Network Analysis)

## Complete list of events discovered through network monitoring

---

## 📊 **1. Page Load Events**

### **A. GTM Events (Automatic)**

```javascript
// Event 1: GTM Initialization
{
  "event": "gtm.js",
  "gtm.start": 1770982009379
}

// Event 2: DOM Ready
{
  "event": "gtm.dom"
}

// Event 3: Scroll Depth
{
  "event": "gtm.scrollDepth",
  "gtm.scrollThreshold": 90
}

// Event 4: Page Load Complete
{
  "event": "gtm.load"
}
```

### **B. GA4 Page Load Time**

```
Event Name: page_load_time
Parameters:
  - content_group: "Other"
  - story_source: "Other"
  - story_author: "Other"
  - story_type: "Other"
  - page_type: "Other"
  - story_id: "Other"
  - unit_name: "Other"
  - loading_time_sec: 0.66
```

**Network Request:**

```
https://analytics.google.com/g/collect?
  v=2
  tid=G-G1MXH173BM
  en=page_load_time
  epn.loading_time_sec=0.66
```

---

## 🎮 **2. Game Start Events**

### **A. DataLayer Events**

```javascript
// Event 1: Generic platform
window.dataLayer.push({
  event: "shabdkhoj",
  games: "game_start",
});

// Event 2: Web platform specific
window.dataLayer.push({
  event: "Shabdkhoj_Web",
  Sk_web: "Sk_web_game_started",
});
```

### **B. GTM Click Event**

```javascript
{
  "event": "gtm.click",
  "gtm.elementId": "darkLight",
  "gtm.triggers": "4,5"
}
```

### **C. Facebook Pixel Event**

```
Event: SubscribedButtonClick
Parameters:
  - buttonText: "खेलना शुरू करें"
  - buttonId: "darkLight"
  - innerText: "खेलना शुरू करें"
```

**Network Request:**

```
https://www.facebook.com/privacy_sandbox/pixel/register/trigger/?
  id=536475799826686
  ev=SubscribedButtonClick
  cd[buttonText]=खेलना शुरू करें
  cd[buttonId]=darkLight
```

---

## ✅ **3. Word Found Events**

### **A. GTM Click Event (Auto-tracking)**

```javascript
{
  "event": "gtm.click",
  "gtm.uniqueEventId": 26
}
```

**Network Request:**

```
https://www.googletagmanager.com/a?
  id=GTM-5M8X46V
  e=gtm.click
  eid=26
```

**Note:** The old game does NOT push custom dataLayer events for word found. It relies on GTM's automatic click tracking.

---

## 🏆 **4. Game Complete Events**

### **A. DataLayer Events (Our Implementation)**

```javascript
// Event 1: Generic platform
window.dataLayer.push({
  event: "shabdkhoj",
  games: "game_complete",
  final_score: 480,
  words_found: 8,
  total_words: 8,
  completion_rate: 100,
  time_taken: 120,
  coins_earned: 48,
  all_words_found: true,
});

// Event 2: Web platform specific
window.dataLayer.push({
  event: "Shabdkhoj_Web",
  Sk_web: "Sk_web_game_complete_success",
  Sk_score: 480,
  Sk_best_score: 480,
  Sk_completion: 100,
  Sk_coins: 48,
});

// Event 3: GA4 game_data (EXACT from old game)
window.dataLayer.push({
  event: "game_data",
  augame: "crossword_end",
  final_score: 480,
  words_found: 8,
  total_words: 8,
  coins_earned: 48,
});
```

### **B. GA4 Event**

```
Event Name: game_data
Parameters:
  - augame: "crossword_end"
  - content_group: "Other"
  - story_source: "Other"
  - page_type: "Other"
```

**Network Request:**

```
https://analytics.google.com/g/collect?
  v=2
  tid=G-G1MXH173BM
  en=game_data
  ep.augame=crossword_end
```

---

## 📋 **Complete Event Summary**

| Trigger                | DataLayer Events                                                                    | GA4 Events                         | Other Services                         |
| ---------------------- | ----------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------- |
| **Page Load**          | `gtm.js`, `gtm.dom`, `gtm.scrollDepth`, `gtm.load`                                  | `page_load_time`                   | Clarity tracking                       |
| **Start Button Click** | `shabdkhoj` (game_start), `Shabdkhoj_Web` (Sk_web_game_started), `gtm.click`        | -                                  | Facebook Pixel (SubscribedButtonClick) |
| **Word Found**         | `gtm.click` (auto)                                                                  | -                                  | -                                      |
| **Game Complete**      | `shabdkhoj` (game*complete), `Shabdkhoj_Web` (Sk_web_game_complete*\*), `game_data` | `game_data` (augame=crossword_end) | -                                      |

---

## 🔧 **Analytics Services Configuration**

### **1. Google Tag Manager**

- **Container ID**: `GTM-5M8X46V`
- **Purpose**: Event orchestration and tracking

### **2. Google Analytics 4**

- **Measurement ID**: `G-G1MXH173BM`
- **Purpose**: Event analytics and reporting
- **Custom Events**: `page_load_time`, `game_data`

### **3. Facebook Pixel**

- **Pixel ID**: `536475799826686`
- **Purpose**: Social media conversion tracking
- **Events**: `SubscribedButtonClick`

### **4. Microsoft Clarity**

- **Purpose**: Session recording and heatmaps
- **Endpoint**: `https://s.clarity.ms/collect`

---

## 📝 **Implementation Checklist**

### **✅ Already Implemented in tracking.js:**

- [x] Game start events (shabdkhoj + Shabdkhoj_Web)
- [x] Word found events (shabdkhoj + Shabdkhoj_Web)
- [x] Game complete events (shabdkhoj + Shabdkhoj_Web + game_data)
- [x] All other game events (hint, refresh, settings, etc.)

### **🔲 Still Need to Add to HTML:**

- [ ] GTM script in `<head>`
- [ ] GTM noscript in `<body>`
- [ ] Include `tracking.js` before `</body>`

### **🔲 Still Need to Add to script.js:**

- [ ] Call `trackGameStart()` on intro button click
- [ ] Call `trackWordFound()` when word is found
- [ ] Call `trackGameComplete()` when game ends
- [ ] Call other tracking functions as needed

---

## 🎯 **Event Format Pattern**

All custom events follow this pattern:

```javascript
// Pattern 1: Generic platform event
window.dataLayer.push({
  event: "shabdkhoj",
  games: "{action_name}",
  // ... additional data
});

// Pattern 2: Web platform specific event
window.dataLayer.push({
  event: "Shabdkhoj_Web",
  Sk_web: "Sk_web_{action_name}",
  // ... additional data with Sk_ prefix
});

// Pattern 3: GA4 custom event (for specific actions)
window.dataLayer.push({
  event: "{event_name}",
  "{custom_param}": "{value}",
  // ... additional data
});
```

---

## 🚀 **Next Steps**

1. **Add GTM to HTML** (see ANALYTICS_IMPLEMENTATION_GUIDE.md)
2. **Add tracking calls to script.js** (examples in guide)
3. **Test in GTM Preview mode**
4. **Verify events in GA4 DebugView**
5. **Configure GTM tags and triggers**

---

**Last Updated**: 2026-02-13  
**Based On**: Live network analysis of old game  
**Status**: ✅ Complete and ready to implement
