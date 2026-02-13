// ===== Game Configuration Variables =====
// This file contains configuration that would normally come from a backend

// Client type detection (web or app)
const urlParams = new URLSearchParams(window.location.search);
const _request_client = urlParams.get('in_app') === 'app' ? 'app' : 'web';

// Minimum score required for coin rewards
// In the old game, this comes from server config
// You can adjust this value based on your requirements
const min_score = 100; // Minimum score to earn coins

// Encryption key (if needed for API calls)
// In production, this should come from your backend
const k = ''; // Leave empty if not using encryption

// Hindi words database
// In the old game, this comes from the server
// For now, this is handled by your existing word sets in script.js
const hindiWordsFromDB = []; // Not needed - using local word sets

// Export for use in other files
window.gameConfig = {
    requestClient: _request_client,
    minScore: min_score,
    encryptionKey: k,
    hindiWords: hindiWordsFromDB
};

console.log('🔧 Game config loaded:', {
    client: _request_client,
    minScore: min_score
});
