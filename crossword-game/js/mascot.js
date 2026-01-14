// ===================================
// Mascot System
// ===================================

const Mascot = {
    messages: {
        welcome: [
            "Let's solve this puzzle!",
            "Ready for a word adventure?",
            "Time to show your word skills!"
        ],
        encourage: [
            "You're doing great!",
            "Keep going!",
            "Almost there!",
            "You've got this!"
        ],
        celebrate: [
            "Amazing work!",
            "Fantastic!",
            "You're a word star!",
            "Brilliant!"
        ],
        hint: [
            "Need a little help?",
            "Let me give you a hint!",
            "Here's a clue!"
        ]
    },

    // Show message
    showMessage(type) {
        const messageElement = document.getElementById('mascot-message');
        const mascotElement = document.getElementById('mascot-game');
        
        if (!messageElement || !mascotElement) return;

        const messages = this.messages[type] || this.messages.welcome;
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        messageElement.textContent = message;
        
        // Add animation
        mascotElement.classList.remove('mascot-happy', 'mascot-encouraging', 'mascot-celebrating');
        
        if (type === 'celebrate') {
            mascotElement.classList.add('mascot-celebrating');
        } else if (type === 'encourage') {
            mascotElement.classList.add('mascot-encouraging');
        } else {
            mascotElement.classList.add('mascot-happy');
        }
    },

    // Celebrate
    celebrate() {
        this.showMessage('celebrate');
    },

    // Encourage
    encourage() {
        this.showMessage('encourage');
    },

    // Welcome
    welcome() {
        this.showMessage('welcome');
    }
};
