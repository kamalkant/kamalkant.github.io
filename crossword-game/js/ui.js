// ===================================
// UI Management
// ===================================

const UI = {
    currentScreen: 'home-screen',

    // Show screen
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type} toast-enter`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },

    // Show modal
    showModal(content) {
        const overlay = document.getElementById('modal-overlay');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = content;
        overlay.classList.add('active');
    },

    // Hide modal
    hideModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('active');
    },

    // Update all displays
    updateAllDisplays() {
        Currency.updateDisplay();
        PowerUps.updateDisplay();
        Streaks.updateDisplay();
    }
};

