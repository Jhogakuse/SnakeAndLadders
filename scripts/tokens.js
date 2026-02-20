/**
 * Player Tokens System
 * Manages token visibility using embedded DOM elements inside squares
 * Tokens are placed inside each square div and toggled visible/hidden
 */

class TokenManager {
    constructor() {
        this.playerPositions = {}; // { playerId: currentSquareNumber }
    }

    /**
     * Initialize tokens - called after tokens are embedded in squares by app.js
     * This just tracks current positions
     */
    initializeTokens(players) {
        players.forEach(player => {
            this.playerPositions[player.id] = 1; // All start at square 1
            // Hide all token instances of this player initially
            this.hideAllTokensOfPlayer(player.id);
            // Show only token at square 1
            this.showTokenAtSquare(player.id, 1);
        });
        console.log('Tokens initialized');
    }

    /**
     * Hide all instances of a player's token
     */
    hideAllTokensOfPlayer(playerId) {
        const tokenElements = document.querySelectorAll(`#token-player-${playerId}`);
        tokenElements.forEach(token => {
            token.style.display = 'none';
        });
    }

    /**
     * Show only the token at a specific square
     */
    showTokenAtSquare(playerId, squareNumber) {
        // Hide all instances of this player's token
        this.hideAllTokensOfPlayer(playerId);

        // Show the token inside the target square
        const squareElement = document.getElementById(`square-${squareNumber}`);
        if (squareElement) {
            const tokenElement = squareElement.querySelector(`#token-player-${playerId}`);
            if (tokenElement) {
                tokenElement.style.display = 'flex';
                this.playerPositions[playerId] = squareNumber;
                console.log(`Token ${playerId} shown at square ${squareNumber}`);
            } else {
                console.warn(`Token element not found in square ${squareNumber} for player ${playerId}`);
            }
        } else {
            console.warn(`Square ${squareNumber} not found for showing token`);
        }
    }

    /**
     * Move player token from current square to target square
     */
    moveToken(playerId, targetSquare, board) {
        return new Promise((resolve) => {
            // Simply show token at target square
            this.showTokenAtSquare(playerId, targetSquare);
            
            // Resolve immediately (instant movement, no animation)
            resolve();
        });
    }

    /**
     * Move token with delay for snake/ladder effect
     */
    animateSnakeLadderEffect(playerId, fromSquare, toSquare, isSnake = false) {
        return new Promise((resolve) => {
            const delayMs = 300; // Brief delay for visual feedback
            
            setTimeout(() => {
                this.showTokenAtSquare(playerId, toSquare);
                resolve();
            }, delayMs);
        });
    }

    /**
     * Highlight current player token
     */
    highlightPlayerToken(playerId) {
        // Remove highlight from all tokens
        document.querySelectorAll('.player-token.active-token').forEach(token => {
            token.classList.remove('active-token');
        });

        // Add highlight to current player's token
        const currentSquare = this.playerPositions[playerId];
        if (currentSquare) {
            const token = document.querySelector(
                `#square-${currentSquare} #token-player-${playerId}`
            );
            if (token) {
                token.classList.add('active-token');
            }
        }
    }

    /**
     * Clear all highlights
     */
    clearHighlight() {
        document.querySelectorAll('.player-token.active-token').forEach(token => {
            token.classList.remove('active-token');
        });
    }

    /**
     * Get player current position
     */
    getPlayerPosition(playerId) {
        return this.playerPositions[playerId] || 1;
    }

    /**
     * Get all player positions
     */
    getAllPositions() {
        return { ...this.playerPositions };
    }

    /**
     * Update all player positions
     */
    updateAllPositions(players) {
        players.forEach(player => {
            const currentPos = player.currentPosition || 1;
            this.showTokenAtSquare(player.id, currentPos);
        });
    }

    /**
     * Reset all tokens (hide them and reset positions)
     */
    reset() {
        // Hide all tokens
        document.querySelectorAll('.player-token').forEach(token => {
            token.style.display = 'none';
        });
        
        // Reset tracking
        this.playerPositions = {};
    }
}

/**
 * Global token manager instance
 */
const tokenManager = new TokenManager();
