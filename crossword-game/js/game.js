// ===================================
// Main Game Controller
// ===================================

const Game = {
    currentLevel: null,
    currentPuzzle: null,
    isDailyChallenge: false,

    // Initialize game
    initialize() {
        console.log('Word Quest - Initializing...');
        
        // Initialize all systems
        Settings.initialize();
        Accessibility.initialize();
        Particles.initialize();
        UI.updateAllDisplays();
        Streaks.updateStreak();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show home screen
        UI.showScreen('home-screen');
        
        console.log('Word Quest - Ready!');
    },

    // Setup all event listeners
    setupEventListeners() {
        // Home screen buttons
        document.getElementById('btn-play')?.addEventListener('click', () => {
            const progress = Storage.get(Storage.KEYS.GAME_PROGRESS);
            this.startLevel(progress.currentLevel);
        });

        document.getElementById('btn-daily')?.addEventListener('click', () => {
            DailyChallenge.start();
        });

        document.getElementById('btn-levels')?.addEventListener('click', () => {
            Levels.renderLevelMap();
            UI.showScreen('levels-screen');
        });

        document.getElementById('btn-achievements')?.addEventListener('click', () => {
            Achievements.renderAchievements();
            UI.showScreen('achievements-screen');
        });

        document.getElementById('btn-leaderboard')?.addEventListener('click', () => {
            Leaderboard.renderLeaderboard();
            UI.showScreen('leaderboard-screen');
        });

        document.getElementById('btn-settings')?.addEventListener('click', () => {
            UI.showScreen('settings-screen');
        });

        // Quick play buttons
        document.querySelectorAll('.btn-quick-play').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.startQuickPlay(difficulty);
            });
        });

        // Game screen buttons
        document.getElementById('btn-back')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to quit this puzzle?')) {
                Timer.stop();
                UI.showScreen('home-screen');
            }
        });

        // Power-up buttons
        document.getElementById('btn-hint')?.addEventListener('click', () => {
            if (PowerUps.useHint()) {
                Analytics.trackHintUsed();
                Mascot.showMessage('hint');
            } else {
                UI.showToast('No hints available!', 'error');
            }
        });

        document.getElementById('btn-reveal')?.addEventListener('click', () => {
            if (!PowerUps.useRevealLetter()) {
                UI.showToast('No reveal letters available!', 'error');
            }
        });

        document.getElementById('btn-freeze')?.addEventListener('click', () => {
            if (!PowerUps.useFreezeTimer()) {
                UI.showToast('No freeze timers available!', 'error');
            }
        });

        // Level complete buttons
        document.getElementById('btn-next-level')?.addEventListener('click', () => {
            if (this.currentLevel) {
                this.startLevel(this.currentLevel + 1);
            }
        });

        document.getElementById('btn-replay')?.addEventListener('click', () => {
            if (this.currentLevel) {
                this.startLevel(this.currentLevel);
            }
        });

        document.getElementById('btn-home')?.addEventListener('click', () => {
            UI.showScreen('home-screen');
        });

        // Back buttons
        document.getElementById('btn-back-levels')?.addEventListener('click', () => {
            UI.showScreen('home-screen');
        });

        document.getElementById('btn-back-achievements')?.addEventListener('click', () => {
            UI.showScreen('home-screen');
        });

        document.getElementById('btn-back-leaderboard')?.addEventListener('click', () => {
            UI.showScreen('home-screen');
        });

        document.getElementById('btn-back-settings')?.addEventListener('click', () => {
            UI.showScreen('home-screen');
        });

        // Settings toggles
        document.getElementById('toggle-dyslexic')?.addEventListener('change', (e) => {
            Settings.toggleDyslexicFont(e.target.checked);
        });

        document.getElementById('toggle-colorblind')?.addEventListener('change', (e) => {
            Settings.toggleColorBlindMode(e.target.checked);
        });

        document.getElementById('toggle-sound')?.addEventListener('change', (e) => {
            Settings.toggleSoundEffects(e.target.checked);
        });

        document.getElementById('toggle-music')?.addEventListener('change', (e) => {
            Settings.toggleBackgroundMusic(e.target.checked);
        });

        document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
            Settings.resetProgress();
        });

        // Modal close
        document.querySelector('.modal-close')?.addEventListener('click', () => {
            UI.hideModal();
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (UI.currentScreen === 'game-screen') {
                if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                    Grid.inputLetter(e.key);
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    Grid.handleBackspace();
                }
            }
        });

        // On-screen keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                const letter = key.dataset.key;
                if (letter === 'BACKSPACE') {
                    Grid.handleBackspace();
                } else {
                    Grid.inputLetter(letter);
                }
            });
        });
    },

    // Start quick play with difficulty
    startQuickPlay(difficulty) {
        const puzzle = Puzzles.generatePuzzle(difficulty);
        this.currentLevel = null; // Quick play doesn't have a level number
        this.startPuzzle(puzzle, false);
    },

    // Start a level
    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.isDailyChallenge = false;
        
        const puzzle = Puzzles.getLevelPuzzle(levelNumber);
        this.startPuzzle(puzzle, false);
    },

    // Start a puzzle
    startPuzzle(puzzle, isDaily = false) {
        this.currentPuzzle = puzzle;
        this.isDailyChallenge = isDaily;
        
        // Update UI
        const levelText = isDaily ? 'Daily Challenge' : 
                         (this.currentLevel ? `Level ${this.currentLevel}` : 'Quick Play');
        document.getElementById('level-number').textContent = levelText;
        document.getElementById('level-category').textContent = puzzle.categoryIcon + ' ' + puzzle.categoryName;
        
        // Initialize game systems
        Grid.initialize(puzzle);
        Scoring.initialize();
        Timer.start();
        Mascot.welcome();
        
        // Track analytics
        Analytics.trackGameStart();
        
        // Show game screen
        UI.showScreen('game-screen');
    },

    // Complete puzzle
    completePuzzle() {
        Timer.stop();
        
        const timeInSeconds = Timer.getElapsedSeconds();
        const scoreData = Scoring.calculateFinalScore(timeInSeconds);
        const stars = Scoring.calculateStars(scoreData.finalScore, scoreData.hintsUsed, timeInSeconds);
        
        // Update progress
        if (!this.isDailyChallenge) {
            Levels.completeLevel(this.currentLevel, stars);
        } else {
            DailyChallenge.markCompleted();
        }
        
        // Calculate and award coins
        const coinsEarned = Currency.calculateLevelReward(stars, scoreData.finalScore);
        Currency.addCoins(coinsEarned);
        
        // Track analytics
        Analytics.trackPlayTime(timeInSeconds);
        Adaptive.trackPerformance(this.currentLevel, {
            completed: true,
            time: timeInSeconds,
            hintsUsed: scoreData.hintsUsed
        });
        
        // Check achievements
        Achievements.checkAchievements({
            time: timeInSeconds,
            hintsUsed: scoreData.hintsUsed,
            stars: stars,
            streak: Streaks.getCurrentStreak(),
            totalCompleted: Storage.get(Storage.KEYS.GAME_PROGRESS).completedLevels.length,
            totalCoins: Storage.get(Storage.KEYS.CURRENCY).totalEarned
        });
        
        // Add to leaderboard
        Leaderboard.addScore('Player', scoreData.finalScore);
        
        // Show completion screen
        this.showCompletionScreen(scoreData, stars, timeInSeconds, coinsEarned);
        
        // Celebrate!
        Animations.celebrateLevel();
        Mascot.celebrate();
    },

    // Show completion screen
    showCompletionScreen(scoreData, stars, timeInSeconds, coinsEarned) {
        // Update stars
        const starsContainer = document.getElementById('stars-container');
        const starElements = starsContainer.querySelectorAll('.star');
        starElements.forEach((star, index) => {
            if (index < stars) {
                setTimeout(() => {
                    star.classList.add('earned');
                }, (index + 1) * 300);
            }
        });
        
        // Update stats
        document.getElementById('final-score').textContent = scoreData.finalScore;
        document.getElementById('final-time').textContent = Timer.formatTime(timeInSeconds * 1000);
        document.getElementById('coins-earned').textContent = coinsEarned;
        
        // Show fun fact
        Educational.showLevelFact(this.currentPuzzle);
        
        // Show screen
        UI.showScreen('complete-screen');
    }
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Game.initialize();
});
