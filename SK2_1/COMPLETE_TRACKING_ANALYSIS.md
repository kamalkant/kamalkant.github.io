# Complete Event Tracking Analysis - Old Shabd Khoj Game

## 📋 Summary of Findings

After analyzing the old game's code (`shabdkhoj.blade.php`), here's what I found:

---

## 🔍 **Analytics Setup Found**

### 1. **Google Tag Manager (GTM)**

- **Container ID**: `GTM-5M8X46V`
- **Location**: Lines 1020-1023 (head), 1031-1034 (body)
- **DataLayer**: Initialized on line 1026

### 2. **External JavaScript Files**

The old game loads these JS files (lines 1303-1311):

1. **crypto-js.min.js** - Encryption library
2. **shabdkhoj.min.js** - Main game logic (MINIFIED - contains all game events)
3. **jquery-3.6.0.min.js** - jQuery library
4. **jquery.scrolldepth.min.js** - Scroll depth tracking
5. **main.js** - Additional functionality

⚠️ **Note**: The main game logic is in `shabdkhoj.min.js` which is minified and hosted externally. We cannot see the exact tracking calls, but we can infer them from the UI elements.

---

## 🎯 **Tracking Events to Implement**

Based on the HTML structure and UI elements, here are ALL the events that should be tracked:

### **A. Page Load & Session Events**

| Event           | Trigger           | Data to Track                             |
| --------------- | ----------------- | ----------------------------------------- |
| `page_view`     | Page loads        | timestamp, user_agent, device_type        |
| `session_start` | First interaction | session_id, timestamp                     |
| `session_end`   | Page unload       | session_duration, total_games_played      |
| `scroll_depth`  | User scrolls      | percentage_scrolled (25%, 50%, 75%, 100%) |

---

### **B. Intro Screen Events**

| Event               | Element             | Trigger                   | Data to Track |
| ------------------- | ------------------- | ------------------------- | ------------- |
| `intro_screen_view` | `.pageIntro`        | Intro shown               | timestamp     |
| `intro_start_click` | `#darkLight` button | "खेलना शुरू करें" clicked | timestamp     |
| `intro_skip`        | Skip button         | User skips intro          | timestamp     |

**HTML Elements:**

- Intro container: `<div class="pageIntro" id="pageIntro">`
- Start button: `<a href="#0" id="darkLight">` with text "खेलना शुरू करें"
- Intro image: GIF at `https://spiderimg.amarujala.com/assets/images/2024/09/13/crossword-game-new_66e3d6e0e923e.gif`

---

### **C. Game Start Events**

| Event             | Element      | Trigger           | Data to Track                     |
| ----------------- | ------------ | ----------------- | --------------------------------- |
| `game_initialize` | Game board   | Grid generated    | grid_size, word_count, difficulty |
| `game_start`      | Timer starts | First interaction | timestamp, difficulty             |
| `timer_start`     | `#timer`     | Timer begins      | start_time                        |

**HTML Elements:**

- Timer: `<span id="timer" class="timer">00:00</span>`
- Grid container: `<div id="crossword-container">`
- Word container: `<div id="word-container">`

---

### **D. Gameplay Events**

| Event                 | Element            | Trigger                 | Data to Track                                             |
| --------------------- | ------------------ | ----------------------- | --------------------------------------------------------- |
| `cell_selected`       | Grid cells         | User clicks/drags cell  | cell_position, letter                                     |
| `word_attempt`        | Selection complete | User releases selection | selected_letters, word_length                             |
| `word_found_success`  | Correct word       | Word matches list       | word, points_earned, time_taken, word_number, total_words |
| `word_attempt_failed` | Wrong selection    | Word doesn't match      | attempted_letters, selection_length                       |
| `score_update`        | `#score`           | Score changes           | old_score, new_score, points_added                        |
| `best_score_update`   | `#best_score`      | New best score          | old_best, new_best                                        |
| `timer_tick`          | `#timer`           | Every second            | current_time, time_remaining                              |

**HTML Elements:**

- Score display: `<span id="score">0</span>`
- Best score: `<span id="best_score">0</span>`
- Score animation: `<span id="add_score">0</span>` (shows +points)
- Grid cells: `<button>` elements in table
- Word list: `.word` elements in `#word-container`

---

### **E. Game End Events**

| Event           | Element                  | Trigger         | Data to Track                                                      |
| --------------- | ------------------------ | --------------- | ------------------------------------------------------------------ |
| `game_complete` | All words found          | Last word found | final_score, words_found, total_words, time_taken, completion_rate |
| `game_timeout`  | Timer ends               | Time = 0        | final_score, words_found, total_words, completion_rate             |
| `popup_show`    | `#congratulations-popup` | Game ends       | popup_type (success/timeout)                                       |
| `coins_earned`  | Coin display             | Coins awarded   | coins_amount, final_score                                          |

**HTML Elements:**

- Popup container: `<div id="congratulations-popup" class="js-container containerHwp hidden">`
- Coin message: `<h1 id="msg_with_coin">` - Shows coins earned
- No coin message: `<h1 id="msg_without_coin">अच्छा प्रयास!</h1>`
- Congratulations message: `<p id="congratulations-msg">`
- Coin image: `<img src="...aucoin_691c11e38ab1e.png">`

---

### **F. User Actions**

| Event                 | Element            | Trigger                  | Data to Track                               |
| --------------------- | ------------------ | ------------------------ | ------------------------------------------- |
| `back_button_click`   | `#backBtn`         | Header back button       | source (header/popup)                       |
| `refresh_click`       | `#refresh`         | Refresh button in header | source (header), current_score, words_found |
| `refresh_popup_click` | `#refresh_popup`   | Refresh in popup         | source (popup), final_score                 |
| `claim_button_click`  | `#claim`           | Claim coins button       | coins_claimed, final_score                  |
| `popup_close`         | `#shab_khoj_close` | Close (X) button         | final_score, words_found                    |
| `exit_click`          | `#backBtn_popup`   | Exit button in popup     | final_score, session_duration               |

**HTML Elements:**

- Back button (header): `<div class="score scr1" id="backBtn">`
- Refresh button (header): `<div id="refresh" class="refesh">`
- Refresh button (popup): `<div class="refesh" id="refresh_popup">`
- Close button (popup): `<a href="..." class="close" id="shab_khoj_close">×</a>`
- Exit button (popup): `<div class="score scr1" id="backBtn_popup">`
- Claim button: `<button id="claim">क्लेम करें</button>`

---

### **G. Web-to-App Conversion Events**

| Event                       | Element               | Trigger                 | Data to Track                              |
| --------------------------- | --------------------- | ----------------------- | ------------------------------------------ |
| `web_to_app_banner_view`    | `#shabdkhoj_webtoapp` | Banner shown            | timestamp, device_type                     |
| `web_to_app_download_click` | `.btndownload`        | Download button clicked | source (button/qr), platform (android/ios) |
| `web_to_app_qr_view`        | `.qrWrapper`          | QR code shown (desktop) | timestamp                                  |
| `web_to_app_close`          | `#bs_close`           | Banner closed           | time_visible                               |
| `app_store_click`           | App Store link        | iOS download link       | platform (ios)                             |
| `play_store_click`          | Play Store link       | Android download link   | platform (android)                         |

**HTML Elements:**

- Banner container: `<div id="shabdkhoj_webtoapp">`
- Close button: `<button class="close" id="bs_close">`
- Download button: `<a href="..." class="btndownload">ऐप डाउनलोड करें</a>`
- QR wrapper: `<div class="qrWrapper">` (desktop only)
- Banner text: `<p id="bs_text">`
- Backdrop: `<div class="shabdkhoj_webtoapp_back">`

---

### **H. Performance Events**

| Event              | Trigger               | Data to Track                |
| ------------------ | --------------------- | ---------------------------- |
| `page_load_time`   | Page fully loaded     | load_time_ms, dom_ready_time |
| `game_load_time`   | Game initialized      | initialization_time_ms       |
| `ajax_loader_show` | `#ajax-loader` shown  | timestamp                    |
| `ajax_loader_hide` | `#ajax-loader` hidden | duration_shown               |

**HTML Elements:**

- Loading indicator: `<div id="ajax-loader" class="fullpage_loader">`

---

### **I. Error Events**

| Event              | Trigger            | Data to Track                           |
| ------------------ | ------------------ | --------------------------------------- |
| `javascript_error` | JS error occurs    | error_message, stack_trace, line_number |
| `network_error`    | API/resource fails | url, status_code, error_message         |
| `game_error`       | Game logic error   | error_type, game_state                  |

---

## 📊 **Additional Tracking from External JS**

### **jquery.scrolldepth.min.js**

Automatically tracks:

- 25% scroll depth
- 50% scroll depth
- 75% scroll depth
- 100% scroll depth (bottom of page)

### **main.js**

Likely contains:

- Custom event handlers
- Additional analytics calls
- User interaction tracking

---

## 🎨 **Visual Effects to Track**

| Effect                | Element               | When to Track                |
| --------------------- | --------------------- | ---------------------------- |
| `confetti_animation`  | `.confetti-container` | Game complete with all words |
| `crackers_animation`  | `.crackers`           | Victory popup shown          |
| `score_animation`     | `#add_score`          | Points added (+X animation)  |
| `highlight_animation` | `.highlight` cells    | Word being selected          |
| `found_animation`     | `.highlight-found`    | Word found successfully      |

---

## 🔐 **Security & Data**

### **Encryption**

- Uses `crypto-js.min.js` for data encryption
- Likely encrypts: scores, coins, user data before sending to server

### **Configuration Variables** (from PHP)

```javascript
var _request_client = '{{$request_client}}'; // 'web' or 'app'
var min_score = '{{config("env.SHABDKHOJ_SCORE_LIMIT")}}'; // Minimum score for coins
const k = '{{config("env.SHABDKHOJ_KEY")}}'; // Encryption key
const hindiWordsFromDB = {!! json_encode($hindi_words) !!}; // Word list
```

---

## 📱 **Device Detection**

Track these user properties:

- `device_type`: mobile, tablet, desktop
- `platform`: iOS, Android, Windows, Mac
- `browser`: Chrome, Safari, Firefox, etc.
- `in_app`: true/false (if opened in app webview)
- `fullscreen`: true/false

---

## 🎯 **Priority Events to Implement First**

### **High Priority** (Must have):

1. ✅ `game_start` - Track when game begins
2. ✅ `word_found_success` - Track successful word finds
3. ✅ `game_complete` - Track game completion
4. ✅ `coins_earned` - Track coin rewards
5. ✅ `refresh_click` - Track game restarts

### **Medium Priority** (Should have):

6. ✅ `intro_start_click` - Track intro engagement
7. ✅ `word_attempt_failed` - Track failed attempts
8. ✅ `score_update` - Track score changes
9. ✅ `web_to_app_download_click` - Track app downloads
10. ✅ `popup_close` - Track modal interactions

### **Low Priority** (Nice to have):

11. ✅ `scroll_depth` - Track engagement
12. ✅ `timer_tick` - Track time spent
13. ✅ `cell_selected` - Track user interactions
14. ✅ `error_occurred` - Track errors

---

## 📝 **Implementation Checklist**

- [ ] Add GTM script to `<head>`
- [ ] Add GTM noscript to `<body>`
- [ ] Include `tracking.js` file
- [ ] Add tracking calls to all button clicks
- [ ] Add tracking to game state changes
- [ ] Add tracking to score updates
- [ ] Add tracking to modal interactions
- [ ] Add tracking to web-to-app banner
- [ ] Test all events in GTM Preview mode
- [ ] Set up GTM tags and triggers
- [ ] Configure conversion tracking
- [ ] Add error tracking
- [ ] Add performance monitoring

---

## 🚀 **Next Steps**

1. **Get GTM Container ID** from your team
2. **Implement tracking.js** (already created)
3. **Add tracking calls** to your `script.js` (see ANALYTICS_IMPLEMENTATION_GUIDE.md)
4. **Test in GTM Preview** mode
5. **Configure GTM tags** for all events
6. **Monitor and optimize** based on data

---

## 📞 **Questions to Ask Your Team**

1. What is the GTM Container ID for production?
2. What is the minimum score required for coin rewards?
3. Should we track individual letter selections or just complete words?
4. Do we need to encrypt any data before sending to analytics?
5. Are there any PII (Personally Identifiable Information) restrictions?
6. Should we track different events for web vs. app users?

---

**Created by**: Antigravity AI
**Date**: 2026-02-13
**Version**: 1.0
