// Confetti Animation System using Web Animations API
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.id = 'confetti-container';
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
    document.body.appendChild(confettiContainer);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52C77C'];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            createParticle(confettiContainer, colors);
        }, i * 30);
    }

    // Remove container after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const startX = Math.random() * window.innerWidth;
    const endX = startX + (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 720;
    const duration = (Math.random() * 2 + 2) * 1000;

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        top: -20px;
        left: ${startX}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        opacity: 0.9;
    `;

    container.appendChild(particle);

    // Use Web Animations API
    particle.animate([
        {
            transform: 'translateY(0) translateX(0) rotate(0deg)',
            opacity: 1
        },
        {
            transform: `translateY(${window.innerHeight + 50}px) translateX(${endX - startX}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'ease-in',
        fill: 'forwards'
    });

    setTimeout(() => {
        particle.remove();
    }, duration);
}

// Bubble blast animation
function createBubbleBlast() {
    const bubbleContainer = document.createElement('div');
    bubbleContainer.id = 'bubble-container';
    bubbleContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(bubbleContainer);

    const bubbleCount = 30;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

    for (let i = 0; i < bubbleCount; i++) {
        setTimeout(() => {
            createBubble(bubbleContainer, colors);
        }, i * 50);
    }

    setTimeout(() => {
        bubbleContainer.remove();
    }, 4000);
}

function createBubble(container, colors) {
    const bubble = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 40 + 20;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 300 + 100;
    const duration = (Math.random() * 1.5 + 1) * 1000;

    bubble.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, ${color}dd, ${color}44);
        border-radius: 50%;
        border: 2px solid ${color}aa;
        top: 0;
        left: 0;
        opacity: 0;
        box-shadow: inset -5px -5px 10px rgba(255,255,255,0.5),
                    0 0 20px ${color}66;
    `;

    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    container.appendChild(bubble);

    // Use Web Animations API
    bubble.animate([
        {
            transform: 'translate(0, 0) scale(0)',
            opacity: 1
        },
        {
            transform: `translate(${endX}px, ${endY}px) scale(0.5)`,
            opacity: 1,
            offset: 0.5
        },
        {
            transform: `translate(${endX}px, ${endY}px) scale(1)`,
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'ease-out',
        fill: 'forwards'
    });

    setTimeout(() => {
        bubble.remove();
    }, duration);
}

// Star burst animation
function createStarBurst() {
    const starContainer = document.createElement('div');
    starContainer.id = 'star-container';
    starContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        pointer-events: none;
        z-index: 9997;
    `;
    document.body.appendChild(starContainer);

    const starCount = 20;

    for (let i = 0; i < starCount; i++) {
        setTimeout(() => {
            createStar(starContainer);
        }, i * 40);
    }

    setTimeout(() => {
        starContainer.remove();
    }, 3000);
}

function createStar(container) {
    const star = document.createElement('div');
    const size = Math.random() * 20 + 10;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 250 + 150;
    const duration = (Math.random() * 1.2 + 0.8) * 1000;

    star.innerHTML = '⭐';
    star.style.cssText = `
        position: absolute;
        font-size: ${size}px;
        top: 0;
        left: 0;
        opacity: 0;
        filter: drop-shadow(0 0 5px #FFD700);
    `;

    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    container.appendChild(star);

    // Use Web Animations API
    star.animate([
        {
            transform: 'translate(0, 0) scale(0) rotate(0deg)',
            opacity: 1
        },
        {
            transform: `translate(${endX}px, ${endY}px) scale(1) rotate(360deg)`,
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'ease-out',
        fill: 'forwards'
    });

    setTimeout(() => {
        star.remove();
    }, duration);
}

// Combined celebration effect
function triggerCelebration() {
    createConfetti();
    setTimeout(() => createBubbleBlast(), 200);
    setTimeout(() => createStarBurst(), 400);
}
