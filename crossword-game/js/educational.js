// ===================================
// Educational Features
// ===================================

const Educational = {
    // Show fun fact after word completion
    showFunFact(word) {
        if (word.fact) {
            const factElement = document.getElementById('fun-fact');
            if (factElement) {
                factElement.innerHTML = `
                    <strong>Did you know?</strong><br>
                    ${word.fact}
                `;
                factElement.style.display = 'block';
            }
        }
    },

    // Show random fun fact on level complete
    showLevelFact(puzzle) {
        const randomWord = puzzle.words[Math.floor(Math.random() * puzzle.words.length)];
        this.showFunFact(randomWord);
    }
};
