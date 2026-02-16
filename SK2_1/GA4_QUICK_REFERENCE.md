# GA4 Events Quick Reference

## All Three Events at a Glance

| Event Name | Event Parameter | Augame Value    | When It Fires   | Function            | Line #  |
| ---------- | --------------- | --------------- | --------------- | ------------------- | ------- |
| game_data  | augame          | crossword_end   | Game completes  | trackGameComplete() | 126-133 |
| game_data  | augame          | crossword_exit  | User exits game | trackBackButton()   | 220-226 |
| game_data  | augame          | crossword_close | Modal closed    | trackModalClose()   | 247-253 |

## Event Volumes (from GA)

| Augame Value    | Event Count | Active Users | Events per User |
| --------------- | ----------- | ------------ | --------------- |
| crossword_exit  | 17,873      | 5,290        | 3.38            |
| crossword_end   | 16,247      | 777          | 20.91           |
| crossword_close | 2,101       | 418          | 5.03            |

## Event Format

All events use this exact structure:

```javascript
window.dataLayer.push({
  event: "game_data",
  Augame: "[crossword_end|crossword_exit|crossword_close]",
});
```

**Note:** Parameter key is `Augame` with capital 'A'

## Testing Checklist

- [ ] crossword_end fires when game completes
- [ ] crossword_exit fires when back button clicked
- [ ] crossword_close fires when modal is closed
- [ ] Events visible in GTM Preview
- [ ] Events visible in GA4 DebugView
- [ ] Event counts match expected behavior

## Quick Test Commands

Open browser console and test:

```javascript
// Test crossword_end
window.gameTracking.trackGameComplete(100, 100, 5, 5, 120, 10);

// Test crossword_exit
window.gameTracking.trackBackButton("header");

// Test crossword_close
window.gameTracking.trackModalClose("game_over");
```

Then check:

```javascript
// View all events in dataLayer
console.table(window.dataLayer.filter((e) => e.event === "game_data"));
```
