// ===================================
// Grid Management and Rendering
// ===================================

const Grid = {
    currentPuzzle: null,
    gridData: null,
    userAnswers: null,
    selectedCell: null,
    selectedWord: null,

    // Initialize grid with puzzle
    initialize(puzzle) {
        this.currentPuzzle = puzzle;
        const { grid, words } = Puzzles.placeWordsOnGrid(puzzle);
        this.gridData = grid;
        this.userAnswers = Array(puzzle.size).fill(null).map(() => Array(puzzle.size).fill(''));
        this.words = words;
        this.render();
    },

    // Render grid to DOM
    render() {
        const gridContainer = document.getElementById('crossword-grid');
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${this.currentPuzzle.size}, 1fr)`;

        // Create cells
        for (let row = 0; row < this.currentPuzzle.size; row++) {
            for (let col = 0; col < this.currentPuzzle.size; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (this.gridData[row][col] === null) {
                    cell.classList.add('cell-blocked');
                } else {
                    // Add number if word starts here
                    const wordNumber = this.getWordNumberAt(row, col);
                    if (wordNumber) {
                        const numberSpan = document.createElement('span');
                        numberSpan.className = 'cell-number';
                        numberSpan.textContent = wordNumber;
                        cell.appendChild(numberSpan);
                    }

                    // Add click handler
                    cell.addEventListener('click', () => this.selectCell(row, col));
                    
                    // Add reveal animation
                    cell.classList.add('cell-reveal');
                }

                gridContainer.appendChild(cell);
            }
        }

        // Render clues
        this.renderClues();
    },

    // Get word number at position
    getWordNumberAt(row, col) {
        const word = this.words.find(w => w.row === row && w.col === col);
        return word ? word.number : null;
    },

    // Select a cell
    selectCell(row, col) {
        if (this.gridData[row][col] === null) return;

        this.selectedCell = { row, col };
        
        // Find word containing this cell
        const word = this.findWordAtCell(row, col);
        if (word) {
            this.selectedWord = word;
            this.highlightWord(word);
            this.updateCurrentClue(word);
        }

        this.updateDisplay();
    },

    // Find word at cell position
    findWordAtCell(row, col) {
        return this.words.find(word => {
            if (word.direction === 'across') {
                return word.row === row && col >= word.col && col < word.col + word.length;
            } else {
                return word.col === col && row >= word.row && row < word.row + word.length;
            }
        });
    },

    // Highlight word cells
    highlightWord(word) {
        // Clear previous highlights
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('cell-highlighted', 'cell-active');
        });

        // Highlight word cells
        if (word.direction === 'across') {
            for (let i = 0; i < word.length; i++) {
                const cell = this.getCellElement(word.row, word.col + i);
                if (cell) cell.classList.add('cell-highlighted');
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                const cell = this.getCellElement(word.row + i, word.col);
                if (cell) cell.classList.add('cell-highlighted');
            }
        }

        // Highlight active cell
        if (this.selectedCell) {
            const activeCell = this.getCellElement(this.selectedCell.row, this.selectedCell.col);
            if (activeCell) activeCell.classList.add('cell-active');
        }
    },

    // Get cell element
    getCellElement(row, col) {
        return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    },

    // Update current clue display
    updateCurrentClue(word) {
        const clueElement = document.getElementById('current-clue');
        clueElement.textContent = `${word.number}. ${word.direction === 'across' ? 'Across' : 'Down'}: ${word.clue}`;
    },

    // Render clues lists
    renderClues() {
        const acrossClues = document.getElementById('clues-across');
        const downClues = document.getElementById('clues-down');
        
        acrossClues.innerHTML = '';
        downClues.innerHTML = '';

        this.words.forEach(word => {
            const clueItem = document.createElement('div');
            clueItem.className = 'clue-item';
            clueItem.textContent = `${word.number}. ${word.clue}`;
            clueItem.addEventListener('click', () => {
                this.selectCell(word.row, word.col);
            });

            if (word.direction === 'across') {
                acrossClues.appendChild(clueItem);
            } else {
                downClues.appendChild(clueItem);
            }
        });
    },

    // Handle letter input
    inputLetter(letter) {
        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        this.userAnswers[row][col] = letter.toUpperCase();
        
        this.updateDisplay();
        this.checkLetter(row, col);
        
        // Move to next cell
        this.moveToNextCell();
    },

    // Handle backspace
    handleBackspace() {
        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        this.userAnswers[row][col] = '';
        this.updateDisplay();
        this.moveToPreviousCell();
    },

    // Move to next cell in word
    moveToNextCell() {
        if (!this.selectedWord || !this.selectedCell) return;

        const { row, col } = this.selectedCell;
        const word = this.selectedWord;

        if (word.direction === 'across') {
            if (col < word.col + word.length - 1) {
                this.selectCell(row, col + 1);
            }
        } else {
            if (row < word.row + word.length - 1) {
                this.selectCell(row + 1, col);
            }
        }
    },

    // Move to previous cell in word
    moveToPreviousCell() {
        if (!this.selectedWord || !this.selectedCell) return;

        const { row, col } = this.selectedCell;
        const word = this.selectedWord;

        if (word.direction === 'across') {
            if (col > word.col) {
                this.selectCell(row, col - 1);
            }
        } else {
            if (row > word.row) {
                this.selectCell(row - 1, col);
            }
        }
    },

    // Check if letter is correct
    checkLetter(row, col) {
        const correct = this.gridData[row][col];
        const answer = this.userAnswers[row][col];
        const cell = this.getCellElement(row, col);

        if (answer === correct) {
            cell.classList.add('cell-correct');
            cell.classList.remove('cell-incorrect');
            Animations.celebrateLetter(cell);
            
            // Check if word is complete
            this.checkWordComplete();
        } else if (answer !== '') {
            cell.classList.add('cell-incorrect');
            cell.classList.remove('cell-correct');
            Animations.shakeLetter(cell);
        }
    },

    // Check if current word is complete
    checkWordComplete() {
        if (!this.selectedWord) return;

        const word = this.selectedWord;
        let complete = true;
        let correct = true;

        if (word.direction === 'across') {
            for (let i = 0; i < word.length; i++) {
                const answer = this.userAnswers[word.row][word.col + i];
                const correctLetter = this.gridData[word.row][word.col + i];
                if (answer === '') complete = false;
                if (answer !== correctLetter) correct = false;
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                const answer = this.userAnswers[word.row + i][word.col];
                const correctLetter = this.gridData[word.row + i][word.col];
                if (answer === '') complete = false;
                if (answer !== correctLetter) correct = false;
            }
        }

        if (complete && correct) {
            Scoring.addWordComplete();
            Animations.celebrateWord();
            Mascot.celebrate();
            
            // Check if puzzle is complete
            this.checkPuzzleComplete();
        }
    },

    // Check if entire puzzle is complete
    checkPuzzleComplete() {
        let allCorrect = true;

        for (let row = 0; row < this.currentPuzzle.size; row++) {
            for (let col = 0; col < this.currentPuzzle.size; col++) {
                if (this.gridData[row][col] !== null) {
                    if (this.userAnswers[row][col] !== this.gridData[row][col]) {
                        allCorrect = false;
                        break;
                    }
                }
            }
            if (!allCorrect) break;
        }

        if (allCorrect) {
            setTimeout(() => {
                Game.completePuzzle();
            }, 500);
        }
    },

    // Update display
    updateDisplay() {
        for (let row = 0; row < this.currentPuzzle.size; row++) {
            for (let col = 0; col < this.currentPuzzle.size; col++) {
                const cell = this.getCellElement(row, col);
                if (cell && !cell.classList.contains('cell-blocked')) {
                    const letterSpan = cell.querySelector('.cell-letter') || document.createElement('span');
                    letterSpan.className = 'cell-letter';
                    letterSpan.textContent = this.userAnswers[row][col];
                    
                    if (!cell.querySelector('.cell-letter')) {
                        cell.appendChild(letterSpan);
                    }
                }
            }
        }
    },

    // Reveal a letter (power-up)
    revealLetter() {
        if (!this.selectedCell) return false;

        const { row, col } = this.selectedCell;
        const correct = this.gridData[row][col];
        
        this.userAnswers[row][col] = correct;
        this.updateDisplay();
        this.checkLetter(row, col);
        
        return true;
    }
};
