// ===================================
// Settings Management
// ===================================

const Settings = {
    // Initialize settings
    initialize() {
        const settings = Storage.getSettings();
        
        // Apply settings
        this.applyDyslexicFont(settings.dyslexicFont);
        this.applyColorBlindMode(settings.colorBlindMode);
        
        // Set toggle states
        document.getElementById('toggle-dyslexic').checked = settings.dyslexicFont;
        document.getElementById('toggle-colorblind').checked = settings.colorBlindMode;
        document.getElementById('toggle-sound').checked = settings.soundEffects;
        document.getElementById('toggle-music').checked = settings.backgroundMusic;
    },

    // Apply dyslexic font
    applyDyslexicFont(enabled) {
        if (enabled) {
            document.body.classList.add('dyslexic-font');
        } else {
            document.body.classList.remove('dyslexic-font');
        }
    },

    // Apply color-blind mode
    applyColorBlindMode(enabled) {
        if (enabled) {
            document.body.classList.add('colorblind-mode');
        } else {
            document.body.classList.remove('colorblind-mode');
        }
    },

    // Toggle dyslexic font
    toggleDyslexicFont(enabled) {
        this.applyDyslexicFont(enabled);
        Storage.updateSettings({ dyslexicFont: enabled });
    },

    // Toggle color-blind mode
    toggleColorBlindMode(enabled) {
        this.applyColorBlindMode(enabled);
        Storage.updateSettings({ colorBlindMode: enabled });
    },

    // Toggle sound effects
    toggleSoundEffects(enabled) {
        Storage.updateSettings({ soundEffects: enabled });
    },

    // Toggle background music
    toggleBackgroundMusic(enabled) {
        Storage.updateSettings({ backgroundMusic: enabled });
    },

    // Reset all progress
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            Storage.clearAll();
            Storage.initialize();
            location.reload();
        }
    }
};
