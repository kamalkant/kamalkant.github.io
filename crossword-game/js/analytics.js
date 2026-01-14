// ===================================
// Analytics System
// ===================================

const Analytics = {
    // Track game start
    trackGameStart() {
        const data = Storage.get(Storage.KEYS.ANALYTICS);
        data.totalGamesPlayed++;
        Storage.set(Storage.KEYS.ANALYTICS, data);
    },

    // Track hint usage
    trackHintUsed() {
        const data = Storage.get(Storage.KEYS.ANALYTICS);
        data.totalHintsUsed++;
        Storage.set(Storage.KEYS.ANALYTICS, data);
    },

    // Track play time
    trackPlayTime(seconds) {
        const data = Storage.get(Storage.KEYS.ANALYTICS);
        data.totalPlayTime += seconds;
        Storage.set(Storage.KEYS.ANALYTICS, data);
    },

    // Get analytics summary
    getSummary() {
        const data = Storage.get(Storage.KEYS.ANALYTICS);
        const daysSinceFirst = Math.floor((new Date() - new Date(data.firstPlayDate)) / (1000 * 60 * 60 * 24));
        
        return {
            totalGamesPlayed: data.totalGamesPlayed,
            totalHintsUsed: data.totalHintsUsed,
            totalPlayTime: data.totalPlayTime,
            avgPlayTime: data.totalGamesPlayed > 0 ? data.totalPlayTime / data.totalGamesPlayed : 0,
            daysSinceFirst,
            retention: {
                d1: daysSinceFirst >= 1,
                d7: daysSinceFirst >= 7
            }
        };
    }
};
