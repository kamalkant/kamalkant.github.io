// ===================================
// Currency System
// ===================================

const Currency = {
    // Get current coins
    getCoins() {
        const data = Storage.get(Storage.KEYS.CURRENCY);
        return data.coins;
    },

    // Add coins
    addCoins(amount) {
        const data = Storage.get(Storage.KEYS.CURRENCY);
        data.coins += amount;
        data.totalEarned += amount;
        Storage.set(Storage.KEYS.CURRENCY, data);
        this.updateDisplay();
        
        // Animate coin collection
        Animations.collectCoins(amount);
    },

    // Spend coins
    spendCoins(amount) {
        const data = Storage.get(Storage.KEYS.CURRENCY);
        if (data.coins >= amount) {
            data.coins -= amount;
            Storage.set(Storage.KEYS.CURRENCY, data);
            this.updateDisplay();
            return true;
        }
        return false;
    },

    // Calculate coins earned for level
    calculateLevelReward(stars, score) {
        let coins = 10; // Base reward
        coins += stars * 10; // Star bonus
        coins += Math.floor(score / 100); // Score bonus
        return coins;
    },

    // Update display
    updateDisplay() {
        const coins = this.getCoins();
        const displays = [
            document.getElementById('coins-display'),
            document.getElementById('coins-game-display')
        ];
        
        displays.forEach(display => {
            if (display) {
                display.textContent = coins;
            }
        });
    }
};
