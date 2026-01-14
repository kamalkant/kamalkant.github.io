// ===================================
// Levels System
// ===================================

const Levels = {
    totalLevels: 30,

    // Get level data
    getLevelData(levelNumber) {
        const progress = Storage.get(Storage.KEYS.GAME_PROGRESS);
        return {
            number: levelNumber,
            unlocked: progress.unlockedLevels.includes(levelNumber),
            completed: progress.completedLevels.includes(levelNumber),
            stars: progress.levelStars[levelNumber] || 0
        };
    },

    // Unlock next level
    unlockNextLevel(currentLevel) {
        const progress = Storage.get(Storage.KEYS.GAME_PROGRESS);
        const nextLevel = currentLevel + 1;
        
        if (nextLevel <= this.totalLevels && !progress.unlockedLevels.includes(nextLevel)) {
            progress.unlockedLevels.push(nextLevel);
            Storage.set(Storage.KEYS.GAME_PROGRESS, progress);
            UI.showToast(`Level ${nextLevel} unlocked!`, 'success');
        }
    },

    // Complete level
    completeLevel(levelNumber, stars) {
        const progress = Storage.get(Storage.KEYS.GAME_PROGRESS);
        
        if (!progress.completedLevels.includes(levelNumber)) {
            progress.completedLevels.push(levelNumber);
        }
        
        // Update stars if better
        if (!progress.levelStars[levelNumber] || stars > progress.levelStars[levelNumber]) {
            progress.levelStars[levelNumber] = stars;
        }
        
        progress.currentLevel = levelNumber;
        Storage.set(Storage.KEYS.GAME_PROGRESS, progress);
        
        // Unlock next level
        this.unlockNextLevel(levelNumber);
    },

    // Render level map
    renderLevelMap() {
        const container = document.getElementById('levels-container');
        container.innerHTML = '';

        for (let i = 1; i <= this.totalLevels; i++) {
            const levelData = this.getLevelData(i);
            const card = document.createElement('div');
            card.className = 'level-card';
            
            if (!levelData.unlocked) {
                card.classList.add('locked');
            }

            const starsHTML = '⭐'.repeat(levelData.stars) + '☆'.repeat(3 - levelData.stars);

            card.innerHTML = `
                <div class="level-number-display">${i}</div>
                <div class="level-stars">${starsHTML}</div>
            `;

            if (levelData.unlocked) {
                card.addEventListener('click', () => {
                    Game.startLevel(i);
                });
            }

            container.appendChild(card);
        }
    }
};
