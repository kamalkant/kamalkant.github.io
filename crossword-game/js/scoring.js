// ===================================
// Scoring System
// ===================================

const Scoring = {
    currentScore: 0,
    wordsCompleted: 0,
    consecutiveCorrect: 0,
    hintsUsed: 0,
    basePointsPerWord: 100,
    comboMultiplier: 1,

    // Initialize scoring for new game
    initialize() {
        this.currentScore = 0;
        this.wordsCompleted = 0;
        this.consecutiveCorrect = 0;
        this.hintsUsed = 0;
        this.comboMultiplier = 1;
        this.updateDisplay();
    },

    // Add points for completing a word
    addWordComplete() {
        this.wordsCompleted++;
        this.consecutiveCorrect++;
        
        // Calculate combo multiplier
        this.comboMultiplier = 1 + (Math.min(this.consecutiveCorrect, 5) * 0.2);
        
        // Calculate points
        const basePoints = this.basePointsPerWord;
        const comboBonus = basePoints * (this.comboMultiplier - 1);
        const totalPoints = Math.floor(basePoints + comboBonus);
        
        this.currentScore += totalPoints;
        this.updateDisplay();
        
        // Show combo if applicable
        if (this.consecutiveCorrect > 1) {
            UI.showToast(`${this.consecutiveCorrect}x Combo! +${totalPoints} points`, 'success');
        }
    },

    // Reset combo on incorrect
    resetCombo() {
        this.consecutiveCorrect = 0;
        this.comboMultiplier = 1;
    },

    // Apply hint penalty
    applyHintPenalty() {
        this.hintsUsed++;
        const penalty = 20;
        this.currentScore = Math.max(0, this.currentScore - penalty);
        this.updateDisplay();
    },

    // Calculate speed bonus
    calculateSpeedBonus(timeInSeconds) {
        // Bonus for completing quickly
        const maxBonus = 500;
        const targetTime = 300; // 5 minutes
        
        if (timeInSeconds < targetTime) {
            const bonus = Math.floor(maxBonus * (1 - timeInSeconds / targetTime));
            return bonus;
        }
        return 0;
    },

    // Calculate final score
    calculateFinalScore(timeInSeconds) {
        const speedBonus = this.calculateSpeedBonus(timeInSeconds);
        const finalScore = this.currentScore + speedBonus;
        
        // Update best scores
        Storage.updateScores(finalScore);
        
        return {
            baseScore: this.currentScore,
            speedBonus,
            finalScore,
            wordsCompleted: this.wordsCompleted,
            hintsUsed: this.hintsUsed
        };
    },

    // Calculate star rating (1-3 stars)
    calculateStars(finalScore, hintsUsed, timeInSeconds) {
        let stars = 1;
        
        // 2 stars: good score and reasonable time
        if (finalScore > 500 && timeInSeconds < 600) {
            stars = 2;
        }
        
        // 3 stars: great score, fast time, no hints
        if (finalScore > 800 && timeInSeconds < 300 && hintsUsed === 0) {
            stars = 3;
        }
        
        return stars;
    },

    // Update display
    updateDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.textContent = this.currentScore;
        }
    },

    // Get current score
    getScore() {
        return this.currentScore;
    }
};
