// ===================================
// Timer System
// ===================================

const Timer = {
    startTime: null,
    elapsedTime: 0,
    timerInterval: null,
    isPaused: false,
    isFrozen: false,

    // Start timer
    start() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.isPaused = false;
        this.isFrozen = false;
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused && !this.isFrozen) {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay();
            }
        }, 100);
    },

    // Pause timer
    pause() {
        this.isPaused = true;
    },

    // Resume timer
    resume() {
        if (this.isPaused) {
            this.startTime = Date.now() - this.elapsedTime;
            this.isPaused = false;
        }
    },

    // Stop timer
    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    // Freeze timer (power-up)
    freeze(duration = 30000) {
        this.isFrozen = true;
        setTimeout(() => {
            this.isFrozen = false;
        }, duration);
    },

    // Get elapsed time in seconds
    getElapsedSeconds() {
        return Math.floor(this.elapsedTime / 1000);
    },

    // Format time as MM:SS
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    // Update display
    updateDisplay() {
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = this.formatTime(this.elapsedTime);
            
            // Add warning animation if time is high
            if (this.getElapsedSeconds() > 300) {
                timerDisplay.classList.add('timer-warning');
            }
        }
    }
};
