// ===================================
// Leaderboard System
// ===================================

const Leaderboard = {
    // Add score to leaderboard
    addScore(playerName, score) {
        const data = Storage.get(Storage.KEYS.LEADERBOARD);
        
        // Check if week has passed
        const weekStart = new Date(data.weekStart);
        const now = new Date();
        const daysDiff = (now - weekStart) / (1000 * 60 * 60 * 24);
        
        if (daysDiff >= 7) {
            // Reset weekly leaderboard
            data.entries = [];
            data.weekStart = now.toISOString();
        }
        
        // Add entry
        data.entries.push({
            name: playerName || 'Player',
            score,
            date: now.toISOString()
        });
        
        // Sort by score
        data.entries.sort((a, b) => b.score - a.score);
        
        // Keep top 10
        data.entries = data.entries.slice(0, 10);
        
        Storage.set(Storage.KEYS.LEADERBOARD, data);
    },

    // Render leaderboard
    renderLeaderboard() {
        const container = document.getElementById('leaderboard-container');
        const data = Storage.get(Storage.KEYS.LEADERBOARD);
        
        container.innerHTML = '<h3>Top 10 This Week</h3>';

        if (data.entries.length === 0) {
            container.innerHTML += '<p>No entries yet. Be the first!</p>';
            return;
        }

        const list = document.createElement('div');
        list.className = 'leaderboard-list';

        data.entries.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-entry';
            
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            
            item.innerHTML = `
                <span class="rank">${medal}</span>
                <span class="player-name">${entry.name}</span>
                <span class="player-score">${entry.score}</span>
            `;
            
            list.appendChild(item);
        });

        container.appendChild(list);
    }
};
