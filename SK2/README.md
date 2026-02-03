# शब्दयोग - Hindi Word Search Game

A modern, beautifully designed Hindi word search game with leaderboards, scoring system, and engaging animations.

## 🎮 Game Features

### 1. **Leaderboard System**

- **Left Side**: Shows rank #10 (lower scorer) with avatar
- **Center**: Current user with dynamic score badge and coin animation
- **Right Side**: Shows rank #12 (top scorer) with avatar
- Real-time score updates with smooth animations

### 2. **Game Board Header**

- **Timer** (Left): Countdown timer showing remaining time (1:00 default)
- **Current Rank** (Center): Shows current score with animated +points popup
- **Best Score** (Right): Displays your all-time best score (persisted in localStorage)

### 3. **Interactive Word Grid**

- 5x5 grid of circular buttons with Hindi letters
- **Drag to Select**: Click and drag across letters to form words
- **Visual Feedback**:
  - Orange highlight for selected letters
  - Green highlight for found words
  - Smooth animations and hover effects
- **Touch Support**: Full mobile/tablet touch support
- **Smart Puzzle Generation**: Words are automatically placed in the grid in various directions:
  - Horizontal (left to right)
  - Vertical (top to bottom)
  - Diagonal (both directions)

### 4. **Word List Display**

- Shows pattern being formed at the top
- Grid layout of target words:
  - **Green background**: Words you've found
  - **Beige background**: Words yet to find
- Real-time updates as you find words

### 5. **Game Mechanics**

- **Scoring**: 100 points per word found
- **Timer**: 60 seconds to find all words
- **Hint System**: Get hints (costs 50 points) - highlights the first letter of an unfound word
- **Best Score Tracking**: Automatically saves your best score
- **Auto-complete**: Game ends when all words are found or time runs out

## 🎨 Design Highlights

- **Modern UI/UX**: Vibrant gradients, glassmorphism effects
- **Smooth Animations**:
  - Floating icons
  - Score popups
  - Cell selection animations
  - Word found celebrations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Premium Typography**: Uses Poppins font family
- **Color Palette**: Cyan, orange, green, and blue theme

## 🚀 How to Play

1. **Start the Game**: The game starts automatically when you open the page
2. **Find Words**:
   - Look at the word list at the bottom to see which words you need to find
   - Click and drag across letters in the grid to form words
   - You can drag horizontally, vertically, or diagonally
   - Release the mouse to check if the word is valid
3. **Match Words**: Find all the words shown in the word list
4. **Score Points**: Each word found adds 100 points
5. **Use Hints**: Click "संकेत" (Hint) if you're stuck (costs 50 points)
6. **Beat the Timer**: Find all words before time runs out!
7. **New Game**: Click "नया खेल शुरू करें" to start a fresh game

## 📱 Controls

### Desktop

- **Mouse**: Click and drag to select letters
- **Buttons**: Click to start new game or get hints

### Mobile/Tablet

- **Touch**: Tap and drag to select letters
- **Buttons**: Tap to start new game or get hints

## 🎯 Word Sets

The game includes multiple word sets with simple 3-4 letter Hindi words that fit perfectly in the 5x5 grid:

**Set 1 - Nature & Objects**:

- कमल (Lotus)
- नमक (Salt)
- सरल (Simple)
- जल (Water)

**Set 2 - Names & Places**:

- राम (Ram)
- नाम (Name)
- काम (Work)
- धाम (Abode)

**Set 3 - Qualities**:

- गीत (Song)
- मीत (Friend)
- रीत (Custom)
- नीत (Policy)

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with animations
- **Vanilla JavaScript**: No frameworks, pure JS
- **LocalStorage**: Best score persistence

### Key Features

- **Smart Puzzle Generator**: Automatically places words in the grid
- **Collision Detection**: Ensures words don't overlap incorrectly
- **Multiple Directions**: Words can be placed horizontally, vertically, or diagonally
- **Random Fill**: Empty cells are filled with random letters from the word set

### Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### File Structure

```
SK2/
├── index.html      # Main HTML structure
├── style.css       # All styles and animations
├── script.js       # Game logic and puzzle generator
└── README.md       # This file
```

## 🎨 Customization

### Modify Timer Duration

In `script.js`, change:

```javascript
const CONFIG = {
    TIMER_DURATION: 60, // Change to desired seconds
    ...
};
```

### Modify Scoring

```javascript
const CONFIG = {
    POINTS_PER_WORD: 100,  // Points per word
    HINT_PENALTY: 50,      // Points deducted for hints
    ...
};
```

### Add New Word Sets

In `script.js`, add to `WORD_SETS` array:

```javascript
const WORD_SETS = [
    {
        words: ['word1', 'word2', 'word3', 'word4'], // 3-4 letter words work best
        letters: ['अ', 'ब', 'स', ...] // Letters used to fill empty cells
    },
    // Add your new set here
];
```

**Important**: Use 3-4 letter words for best results in a 5x5 grid. Longer words may not fit well.

## 📊 How the Puzzle Generator Works

1. **Initialize Empty Grid**: Creates a 5x5 empty grid
2. **Place Words**: For each word in the word set:
   - Randomly selects a starting position
   - Randomly selects a direction (horizontal, vertical, or diagonal)
   - Checks if the word fits without conflicts
   - Places the word if valid
   - Retries with different positions/directions if needed
3. **Fill Empty Cells**: Fills remaining empty cells with random letters from the word set
4. **Track Positions**: Stores the position of each word for the hint system

## 🎮 Gameplay Tips

- **Look for Patterns**: Check the word list first to know what you're looking for
- **Try All Directions**: Words can be horizontal, vertical, or diagonal
- **Use Hints Wisely**: Hints cost 50 points, so use them strategically
- **Work Quickly**: You have 60 seconds to find all words
- **Practice**: Each game generates a new random puzzle!

## 🐛 Troubleshooting

**Q: I can't find a word in the grid**

- A: Make sure you're dragging in the correct direction. Words can be placed horizontally, vertically, or diagonally in any direction.

**Q: The game is too hard**

- A: Use the hint button to highlight the first letter of an unfound word. You can also add easier word sets with shorter words.

**Q: The game is too easy**

- A: Reduce the timer duration or add longer words to the word sets.

## 📝 License

Free to use and modify for personal and commercial projects.

## 👨‍💻 Credits

Designed and developed with modern web technologies and best practices.

---

**Enjoy playing शब्दयोग! 🎮✨**
