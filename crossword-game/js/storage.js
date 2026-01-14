// ===================================
// LocalStorage Management System
// ===================================

const Storage = {
  // Keys for different data types
  KEYS: {
    GAME_PROGRESS: "wordquest_progress",
    SCORES: "wordquest_scores",
    SETTINGS: "wordquest_settings",
    STREAKS: "wordquest_streaks",
    ACHIEVEMENTS: "wordquest_achievements",
    CURRENCY: "wordquest_currency",
    POWERUPS: "wordquest_powerups",
    LEADERBOARD: "wordquest_leaderboard",
    ANALYTICS: "wordquest_analytics",
    DAILY_CHALLENGE: "wordquest_daily",
  },

  // Get data from localStorage
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  // Set data to localStorage
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  },

  // Remove data from localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  },

  // Clear all game data
  clearAll() {
    try {
      Object.values(this.KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  },

  // Initialize default data structure
  initialize() {
    // Game Progress
    if (!this.get(this.KEYS.GAME_PROGRESS)) {
      this.set(this.KEYS.GAME_PROGRESS, {
        currentLevel: 1,
        unlockedLevels: [1],
        completedLevels: [],
        levelStars: {},
      });
    }

    // Scores
    if (!this.get(this.KEYS.SCORES)) {
      this.set(this.KEYS.SCORES, {
        allTimeBest: 0,
        dailyBest: 0,
        lastScoreDate: null,
      });
    }

    // Settings
    if (!this.get(this.KEYS.SETTINGS)) {
      this.set(this.KEYS.SETTINGS, {
        dyslexicFont: false,
        colorBlindMode: false,
        soundEffects: true,
        backgroundMusic: true,
      });
    }

    // Streaks
    if (!this.get(this.KEYS.STREAKS)) {
      this.set(this.KEYS.STREAKS, {
        currentStreak: 0,
        longestStreak: 0,
        lastPlayDate: null,
      });
    }

    // Achievements
    if (!this.get(this.KEYS.ACHIEVEMENTS)) {
      this.set(this.KEYS.ACHIEVEMENTS, {
        unlocked: [],
        progress: {},
      });
    }

    // Currency
    if (!this.get(this.KEYS.CURRENCY)) {
      this.set(this.KEYS.CURRENCY, {
        coins: 100, // Start with 100 coins
        totalEarned: 100,
      });
    }

    // Power-ups
    if (!this.get(this.KEYS.POWERUPS)) {
      this.set(this.KEYS.POWERUPS, {
        hints: 3,
        revealLetter: 2,
        freezeTimer: 1,
      });
    }

    // Leaderboard
    if (!this.get(this.KEYS.LEADERBOARD)) {
      this.set(this.KEYS.LEADERBOARD, {
        entries: [],
        weekStart: new Date().toISOString(),
      });
    }

    // Analytics
    if (!this.get(this.KEYS.ANALYTICS)) {
      this.set(this.KEYS.ANALYTICS, {
        totalGamesPlayed: 0,
        totalHintsUsed: 0,
        totalPlayTime: 0,
        levelCompletionRates: {},
        firstPlayDate: new Date().toISOString(),
      });
    }

    // Daily Challenge
    if (!this.get(this.KEYS.DAILY_CHALLENGE)) {
      this.set(this.KEYS.DAILY_CHALLENGE, {
        lastCompletedDate: null,
        completedDates: [],
      });
    }

  }, // Added comma here

  // Update game progress
  updateProgress(data) {
    const current = this.get(this.KEYS.GAME_PROGRESS);
    this.set(this.KEYS.GAME_PROGRESS, { ...current, ...data });
  },

  // Update scores
  updateScores(score) {
    const scores = this.get(this.KEYS.SCORES);
    const today = new Date().toDateString();

    // Reset daily best if new day
    if (scores.lastScoreDate !== today) {
      scores.dailyBest = 0;
      scores.lastScoreDate = today;
    }

    // Update bests
    if (score > scores.dailyBest) {
      scores.dailyBest = score;
    }
    if (score > scores.allTimeBest) {
      scores.allTimeBest = score;
    }

    this.set(this.KEYS.SCORES, scores);
  },

  // Get current settings
  getSettings() {
    return this.get(this.KEYS.SETTINGS);
  },

  // Update settings
  updateSettings(settings) {
    const current = this.get(this.KEYS.SETTINGS);
    this.set(this.KEYS.SETTINGS, { ...current, ...settings });
  },
};

// Initialize storage on load
Storage.initialize();
