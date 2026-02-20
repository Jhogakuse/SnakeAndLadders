/**
 * Player Management
 * Handles player creation, validation, and management
 */

class Player {
    constructor(id, name, color = null) {
        this.id = id;
        this.name = name || `Player ${id}`;
        this.color = color || this.generateColor();
        this.currentPosition = 0;
        this.moveHistory = [];
        this.isActive = false;
    }

    /**
     * Generate random color for player
     */
    generateColor() {
        const colors = [
            '#ef4444', // Red
            '#3b82f6', // Blue
            '#10b981', // Green
            '#f59e0b', // Amber
            '#8b5cf6', // Purple
            '#ec4899', // Pink
            '#14b8a6', // Teal
            '#f97316'  // Orange
        ];
        return colors[this.id % colors.length];
    }

    /**
     * Move player to a new position
     */
    move(newPosition, diceValue) {
        this.moveHistory.push({
            from: this.currentPosition,
            to: newPosition,
            diceValue: diceValue,
            timestamp: new Date()
        });
        this.currentPosition = newPosition;
    }

    /**
     * Reset player to starting position
     */
    reset() {
        this.currentPosition = 0;
        this.moveHistory = [];
        this.isActive = false;
    }

    /**
     * Get player data
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            currentPosition: this.currentPosition,
            moveCount: this.moveHistory.length
        };
    }
}

class PlayerManager {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
    }

    /**
     * Add a player
     */
    addPlayer(name) {
        const id = this.players.length + 1;
        const player = new Player(id, name);
        this.players.push(player);
        return player;
    }

    /**
     * Add multiple players at once
     */
    addPlayers(names) {
        this.players = [];
        for (let i = 0; i < names.length; i++) {
            this.addPlayer(names[i]);
        }
        return this.players;
    }

    /**
     * Get player by ID
     */
    getPlayer(id) {
        return this.players.find(p => p.id === id);
    }

    /**
     * Get current player
     */
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    /**
     * Move to next player
     */
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        return this.getCurrentPlayer();
    }

    /**
     * Move player to previous turn
     */
    previousPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex - 1 + this.players.length) % this.players.length;
        return this.getCurrentPlayer();
    }

    /**
     * Move specific player
     */
    movePlayer(playerId, newPosition, diceValue) {
        const player = this.getPlayer(playerId);
        if (player) {
            player.move(newPosition, diceValue);
        }
        return player;
    }

    /**
     * Get all players
     */
    getAllPlayers() {
        return this.players;
    }

    /**
     * Get players sorted by position (highest first)
     */
    getPlayersByPosition() {
        return [...this.players].sort((a, b) => b.currentPosition - a.currentPosition);
    }

    /**
     * Reset all players
     */
    resetAllPlayers() {
        this.players.forEach(p => p.reset());
        this.currentPlayerIndex = 0;
    }

    /**
     * Get total number of players
     */
    getPlayerCount() {
        return this.players.length;
    }

    /**
     * Get player statistics
     */
    getStatistics() {
        return this.players.map(p => ({
            name: p.name,
            position: p.currentPosition,
            moveCount: p.moveHistory.length,
            color: p.color
        }));
    }

    /**
     * Export all players data
     */
    toJSON() {
        return {
            totalPlayers: this.players.length,
            currentPlayerIndex: this.currentPlayerIndex,
            players: this.players.map(p => p.toJSON())
        };
    }
}

/**
 * Initialize player manager and add players
 */
function initializePlayers(playerNames) {
    const manager = new PlayerManager();
    manager.addPlayers(playerNames);
    return manager;
}
