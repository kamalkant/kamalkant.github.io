// ===================================
// Streaks System
// ===================================

const Streaks = {
    // Update streak
    updateStreak() {
        const data = Storage.get(Storage.KEYS.STREAKS);
        const today = new Date().toDateString();
        const lastPlay = data.lastPlayDate ? new Date(data.lastPlayDate).toDateString() : null;
        
        if (lastPlay === today) {
            // Already played today
            return data.currentStreak;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastPlay === yesterdayStr) {
            // Consecutive day
            data.currentStreak++;
        } else if (lastPlay === null) {
            // First time playing
            data.currentStreak = 1;
        } else {
            // Streak broken
            data.currentStreak = 1;
        }
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak;
        }
        
        data.lastPlayDate = new Date().toISOString();
        Storage.set(Storage.KEYS.STREAKS, data);
        
        this.updateDisplay();
        
        // Show streak milestone
        if (data.currentStreak % 7 === 0) {
            UI.showToast(`🔥 ${data.currentStreak} day streak! Amazing!`, 'success');
            Currency.addCoins(50); // Bonus for weekly streak
        }
        
        return data.currentStreak;
    },

    // Get current streak
    getCurrentStreak() {
        const data = Storage.get(Storage.KEYS.STREAKS);
        return data.currentStreak;
    },

    // Update display
    updateDisplay() {
        const streak = this.getCurrentStreak();
        const streakDisplay = document.getElementById('streak-display');
        if (streakDisplay) {
            streakDisplay.textContent = streak;
            
            if (streak > 0) {
                streakDisplay.parentElement.classList.add('streak-fire');
            }
        }
    }
};
