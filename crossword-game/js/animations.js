// ===================================
// Animation Controller
// ===================================

const Animations = {
    // Celebrate letter
    celebrateLetter(cell) {
        cell.classList.add('word-complete-effect');
        setTimeout(() => {
            cell.classList.remove('word-complete-effect');
        }, 500);
    },

    // Shake letter (incorrect)
    shakeLetter(cell) {
        cell.classList.add('animate-shake');
        setTimeout(() => {
            cell.classList.remove('animate-shake');
        }, 400);
    },

    // Celebrate word completion
    celebrateWord() {
        // Get center of screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        Particles.createSparkles(centerX, centerY, 15);
    },

    // Celebrate level completion
    celebrateLevel() {
        Particles.createConfetti(100);
    },

    // Reveal letter effect
    revealLetterEffect() {
        UI.showToast('Letter revealed!', 'success');
    },

    // Collect coins animation
    collectCoins(amount) {
        // Simple toast for now
        UI.showToast(`+${amount} coins!`, 'success');
    },

    // Achievement unlock animation
    achievementUnlock(achievement) {
        // Could create a special modal or animation
        console.log('Achievement unlocked:', achievement.name);
    }
};
