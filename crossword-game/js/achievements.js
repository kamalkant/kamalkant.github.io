// ===================================
// Achievements System
// ===================================

const Achievements = {
    definitions: [
        {
            id: 'speed_solver',
            name: 'Speed Solver',
            description: 'Complete a puzzle in under 2 minutes',
            icon: '⚡',
            check: (stats) => stats.time < 120
        },
        {
            id: 'no_hint_champion',
            name: 'No-Hint Champion',
            description: 'Complete a puzzle without using hints',
            icon: '🧠',
            check: (stats) => stats.hintsUsed === 0
        },
        {
            id: 'perfect_grid',
            name: 'Perfect Grid',
            description: 'Complete a puzzle with 3 stars',
            icon: '⭐',
            check: (stats) => stats.stars === 3
        },
        {
            id: 'streak_master',
            name: 'Streak Master',
            description: 'Achieve a 7-day streak',
            icon: '🔥',
            check: (stats) => stats.streak >= 7
        },
        {
            id: 'word_wizard',
            name: 'Word Wizard',
            description: 'Complete 50 puzzles',
            icon: '🧙',
            check: (stats) => stats.totalCompleted >= 50
        },
        {
            id: 'coin_collector',
            name: 'Coin Collector',
            description: 'Earn 1000 total coins',
            icon: '💰',
            check: (stats) => stats.totalCoins >= 1000
        }
    ],

    // Check and unlock achievements
    checkAchievements(stats) {
        const data = Storage.get(Storage.KEYS.ACHIEVEMENTS);
        const newUnlocks = [];

        this.definitions.forEach(achievement => {
            if (!data.unlocked.includes(achievement.id)) {
                if (achievement.check(stats)) {
                    data.unlocked.push(achievement.id);
                    newUnlocks.push(achievement);
                }
            }
        });

        if (newUnlocks.length > 0) {
            Storage.set(Storage.KEYS.ACHIEVEMENTS, data);
            newUnlocks.forEach(achievement => {
                this.showUnlockNotification(achievement);
                Currency.addCoins(50); // Reward for achievement
            });
        }
    },

    // Show unlock notification
    showUnlockNotification(achievement) {
        UI.showToast(`🏆 Achievement Unlocked: ${achievement.name}!`, 'success');
        Animations.achievementUnlock(achievement);
    },

    // Render achievements screen
    renderAchievements() {
        const container = document.getElementById('achievements-container');
        const data = Storage.get(Storage.KEYS.ACHIEVEMENTS);
        
        container.innerHTML = '';

        this.definitions.forEach(achievement => {
            const card = document.createElement('div');
            card.className = 'achievement-card';
            
            if (data.unlocked.includes(achievement.id)) {
                card.classList.add('unlocked');
            }

            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;

            container.appendChild(card);
        });
    }
};
