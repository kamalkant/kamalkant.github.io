// ===================================
// Daily Challenge System
// ===================================

const DailyChallenge = {
    // Check if completed today
    isCompletedToday() {
        const data = Storage.get(Storage.KEYS.DAILY_CHALLENGE);
        const today = new Date().toDateString();
        return data.lastCompletedDate === today;
    },

    // Mark as completed
    markCompleted() {
        const data = Storage.get(Storage.KEYS.DAILY_CHALLENGE);
        const today = new Date().toDateString();
        
        if (!data.completedDates.includes(today)) {
            data.completedDates.push(today);
        }
        
        data.lastCompletedDate = today;
        Storage.set(Storage.KEYS.DAILY_CHALLENGE, data);
        
        // Bonus reward
        Currency.addCoins(100);
        UI.showToast('Daily Challenge Complete! +100 coins', 'success');
    },

    // Start daily challenge
    start() {
        const puzzle = Puzzles.getDailyPuzzle();
        Game.startPuzzle(puzzle, true);
    }
};
