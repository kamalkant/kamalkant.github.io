// ===================================
// Adaptive Difficulty System
// ===================================

const Adaptive = {
    // Track player performance
    trackPerformance(levelNumber, stats) {
        const analytics = Storage.get(Storage.KEYS.ANALYTICS);
        
        if (!analytics.levelCompletionRates[levelNumber]) {
            analytics.levelCompletionRates[levelNumber] = {
                attempts: 0,
                completions: 0,
                avgTime: 0,
                avgHints: 0
            };
        }
        
        const levelData = analytics.levelCompletionRates[levelNumber];
        levelData.attempts++;
        
        if (stats.completed) {
            levelData.completions++;
            levelData.avgTime = (levelData.avgTime * (levelData.completions - 1) + stats.time) / levelData.completions;
            levelData.avgHints = (levelData.avgHints * (levelData.completions - 1) + stats.hintsUsed) / levelData.completions;
        }
        
        Storage.set(Storage.KEYS.ANALYTICS, analytics);
    },

    // Get difficulty recommendation
    getDifficultyRecommendation() {
        const analytics = Storage.get(Storage.KEYS.ANALYTICS);
        const recentLevels = Object.values(analytics.levelCompletionRates).slice(-5);
        
        if (recentLevels.length === 0) return 'easy';
        
        const avgCompletionRate = recentLevels.reduce((sum, level) => {
            return sum + (level.completions / level.attempts);
        }, 0) / recentLevels.length;
        
        if (avgCompletionRate > 0.8) return 'hard';
        if (avgCompletionRate > 0.5) return 'medium';
        return 'easy';
    }
};
