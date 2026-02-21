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
            //this.showTokenAtSquare(player.id, 1);
        });
        console.log('Tokens initialized');
    }

    /**
     * Hide all instances of a player's token
     */
    hideAllTokensOfPlayer(playerId) {
        const tokenElements = document.querySelectorAll(`[id$="-${playerId}"][id^="game-board-"]`);
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

        // Show the token with unique ID for this square and player
        const tokenElement = document.getElementById(`game-board-${squareNumber}-${playerId}`);
        if (tokenElement) {
            tokenElement.style.display = 'flex';
            this.playerPositions[playerId] = squareNumber;
            console.log(`Token ${playerId} shown at square ${squareNumber}`);
        } else {
            console.warn(`Token element not found: game-board-${squareNumber}-${playerId}`);
        }
    }

    /**
     * Move player token from current square to target square with step-by-step animation
     */
    async moveToken(playerId, targetSquare, board, moveResult = null) {
        const currentSquare = this.playerPositions[playerId] || 1;
        
        // If moveResult is provided, use it to calculate the proper path
        let path;
        if (moveResult && moveResult.bouncedBack) {
            path = this.calculateBounceBackPath(currentSquare, moveResult, board.squares.length);
        } else {
            path = this.calculateSimplePath(currentSquare, targetSquare);
        }
        
        // Animate through each step in the path
        for (let i = 0; i < path.length; i++) {
            this.showTokenAtSquare(playerId, path[i]);
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between steps
        }
    }

    /**
     * Calculate bounce-back path showing forward then backward movement
     */
    calculateBounceBackPath(currentSquare, moveResult, maxSquares) {
        const path = [currentSquare];
        
        // Show forward movement to would-be position (through maxSquares)
        for (let i = currentSquare + 1; i <= moveResult.wouldBePosition && i <= maxSquares; i++) {
            path.push(i);
        }
        
        // If would-be position exceeds maxSquares, show bounce-back
        if (moveResult.wouldBePosition > maxSquares) {
            // Show backward movement from maxSquares-1 to final position
            for (let i = maxSquares - 1; i >= moveResult.finalPosition; i--) {
                path.push(i);
            }
        }
        
        return path;
    }

    /**
     * Calculate simple forward path
     */
    calculateSimplePath(fromSquare, toSquare) {
        const path = [fromSquare];
        
        if (fromSquare < toSquare) {
            // Forward movement
            for (let i = fromSquare + 1; i <= toSquare; i++) {
                path.push(i);
            }
        } else if (fromSquare > toSquare) {
            // Backward movement (snake)
            for (let i = fromSquare - 1; i >= toSquare; i--) {
                path.push(i);
            }
        }
        
        return path;
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

        // Add highlight to current player's token at their current square
        const currentSquare = this.playerPositions[playerId];
        if (currentSquare) {
            const token = document.getElementById(`game-board-${currentSquare}-${playerId}`);
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
