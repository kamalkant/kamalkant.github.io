// ===================================
// Particle Effects System
// ===================================

const Particles = {
    container: null,

    // Initialize particle container
    initialize() {
        this.container = document.getElementById('particles-container');
    },

    // Create confetti
    createConfetti(count = 50) {
        if (!this.container) this.initialize();

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'particle confetti';
                
                // Random position
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                
                // Random color
                const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#FBBF24', '#F97316'];
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Random rotation
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                this.container.appendChild(confetti);
                
                // Remove after animation
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 30);
        }
    },

    // Create sparkles
    createSparkles(x, y, count = 10) {
        if (!this.container) this.initialize();

        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'particle sparkle-particle';
            sparkle.textContent = '✨';
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Random offset
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            sparkle.style.setProperty('--offset-x', offsetX + 'px');
            sparkle.style.setProperty('--offset-y', offsetY + 'px');
            
            this.container.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }
    }
};
