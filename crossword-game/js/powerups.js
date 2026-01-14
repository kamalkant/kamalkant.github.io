// ===================================
// Power-Ups System
// ===================================

const PowerUps = {
    // Get power-up counts
    getCounts() {
        return Storage.get(Storage.KEYS.POWERUPS);
    },

    // Use hint power-up
    useHint() {
        const counts = this.getCounts();
        if (counts.hints > 0) {
            counts.hints--;
            Storage.set(Storage.KEYS.POWERUPS, counts);
            this.updateDisplay();
            Scoring.applyHintPenalty();
            return true;
        }
        return false;
    },

    // Use reveal letter power-up
    useRevealLetter() {
        const counts = this.getCounts();
        if (counts.revealLetter > 0) {
            counts.revealLetter--;
            Storage.set(Storage.KEYS.POWERUPS, counts);
            this.updateDisplay();
            
            // Reveal letter in grid
            const revealed = Grid.revealLetter();
            if (revealed) {
                Animations.revealLetterEffect();
                return true;
            }
        }
        return false;
    },

    // Use freeze timer power-up
    useFreezeTimer() {
        const counts = this.getCounts();
        if (counts.freezeTimer > 0) {
            counts.freezeTimer--;
            Storage.set(Storage.KEYS.POWERUPS, counts);
            this.updateDisplay();
            
            Timer.freeze(30000); // Freeze for 30 seconds
            UI.showToast('Timer frozen for 30 seconds!', 'success');
            return true;
        }
        return false;
    },

    // Purchase power-up with coins
    purchase(type, cost) {
        if (Currency.spendCoins(cost)) {
            const counts = this.getCounts();
            counts[type]++;
            Storage.set(Storage.KEYS.POWERUPS, counts);
            this.updateDisplay();
            return true;
        }
        return false;
    },

    // Update display
    updateDisplay() {
        const counts = this.getCounts();
        
        const hintCount = document.getElementById('hint-count');
        const revealCount = document.getElementById('reveal-count');
        const freezeCount = document.getElementById('freeze-count');
        
        if (hintCount) hintCount.textContent = counts.hints;
        if (revealCount) revealCount.textContent = counts.revealLetter;
        if (freezeCount) freezeCount.textContent = counts.freezeTimer;
    }
};
