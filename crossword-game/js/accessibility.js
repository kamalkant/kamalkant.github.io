// ===================================
// Accessibility Features
// ===================================

const Accessibility = {
    // Initialize accessibility features
    initialize() {
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
    },

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Arrow key navigation in grid
            if (UI.currentScreen === 'game-screen' && Grid.selectedCell) {
                const { row, col } = Grid.selectedCell;
                
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        if (row > 0) Grid.selectCell(row - 1, col);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        if (row < Grid.currentPuzzle.size - 1) Grid.selectCell(row + 1, col);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        if (col > 0) Grid.selectCell(row, col - 1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        if (col < Grid.currentPuzzle.size - 1) Grid.selectCell(row, col + 1);
                        break;
                }
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                UI.hideModal();
            }
        });
    },

    // Setup focus management
    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('button, input, .cell')) {
                e.target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }
};
