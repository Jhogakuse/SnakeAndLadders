/**
 * Game Logic and State Management
 * Main game controller
 */

class SnakeAndLaddersGame {
    constructor() {
        this.state = 'setup'; // setup, playing, finished
        this.difficulty = 'easy';
        this.board = null;
        this.playerManager = null;
        this.maxSquares = 30;
        this.gameLog = [];
    }

    /**
     * Initialize the game with settings
     */
    initializeGame(difficulty, playerNames) {
        // Validate inputs
        if (!playerNames || playerNames.length === 0) {
            throw new Error('At least one player is required');
        }

        if (!BOARD_CONFIG[difficulty]) {
            throw new Error(`Invalid difficulty level: ${difficulty}`);
        }

        // Set game parameters
        this.difficulty = difficulty;
        this.maxSquares = getMaxSquares(difficulty);

        // Initialize board and players
        this.board = new Board(difficulty);
        this.board.generateSquares();

        this.playerManager = new PlayerManager();
        this.playerManager.addPlayers(playerNames);

        this.state = 'playing';
        this.gameLog = [];

        this.logGameEvent(`Game started on ${difficulty} difficulty with ${playerNames.length} players`);

        return {
            board: this.board,
            playerManager: this.playerManager,
            maxSquares: this.maxSquares
        };
    }

    /**
     * Move a player and handle snake/ladder logic
     */
    movePlayer(diceValue) {
        const player = this.playerManager.getCurrentPlayer();
        if (!player) {
            throw new Error('No current player');
        }

        let newPosition = player.currentPosition + diceValue;

        // Don't move beyond max squares
        if (newPosition > this.maxSquares) {
            this.logGameEvent(
                `${player.name} rolled ${diceValue} but cannot move beyond ${this.maxSquares}. Stay at ${player.currentPosition}`
            );
            return {
                player: player,
                diceValue: diceValue,
                newPosition: player.currentPosition,
                hasMoved: false,
                hasLanded: false,
                destination: null
            };
        }

        // Check for snake or ladder
        const destination = getDestination(newPosition, this.difficulty);
        let finalPosition = newPosition;
        let movedBy = 'dice';

        if (destination) {
            finalPosition = destination;
            if (isSnakeSquare(newPosition, this.difficulty)) {
                movedBy = 'snake';
                this.logGameEvent(`${player.name} rolled ${diceValue}, landed on snake at ${newPosition}, moved to ${finalPosition}`);
            } else {
                movedBy = 'ladder';
                this.logGameEvent(`${player.name} rolled ${diceValue}, landed on ladder at ${newPosition}, climbed to ${finalPosition}`);
            }
        } else {
            this.logGameEvent(`${player.name} rolled ${diceValue} and moved to ${finalPosition}`);
        }

        // Update player position
        this.playerManager.movePlayer(player.id, finalPosition, diceValue);

        return {
            player: player,
            diceValue: diceValue,
            previousPosition: player.currentPosition - diceValue,
            newPosition: newPosition,
            finalPosition: finalPosition,
            hasMoved: true,
            hasLanded: destination !== null,
            movedBy: movedBy,
            destination: destination,
            isWinner: finalPosition === this.maxSquares
        };
    }

    /**
     * Check if current player has won
     */
    checkWinner() {
        const player = this.playerManager.getCurrentPlayer();
        if (player && player.currentPosition === this.maxSquares) {
            this.state = 'finished';
            this.logGameEvent(`🎉 ${player.name} has won the game!`);
            return player;
        }
        return null;
    }

    /**
     * Get current game state
     */
    getGameState() {
        return {
            state: this.state,
            difficulty: this.difficulty,
            maxSquares: this.maxSquares,
            currentPlayer: this.playerManager.getCurrentPlayer().toJSON(),
            players: this.playerManager.getStatistics(),
            leaderboard: this.playerManager.getPlayersByPosition().map(p => ({
                name: p.name,
                position: p.currentPosition,
                color: p.color
            }))
        };
    }

    /**
     * Get board information
     */
    getBoardInfo() {
        return {
            difficulty: this.difficulty,
            dimensions: getBoardDimensions(this.difficulty),
            snakeCount: BOARD_CONFIG[this.difficulty].snakes.length,
            ladderCount: BOARD_CONFIG[this.difficulty].ladders.length,
            squares: this.board.squares.length
        };
    }

    /**
     * Log a game event
     */
    logGameEvent(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        this.gameLog.push(logEntry);
        console.log(logEntry);
    }

    /**
     * Get game log
     */
    getGameLog() {
        return this.gameLog;
    }

    /**
     * Reset game
     */
    resetGame() {
        this.state = 'setup';
        this.board = null;
        this.playerManager.resetAllPlayers();
        this.gameLog = [];
    }

    /**
     * Export game state
     */
    toJSON() {
        return {
            state: this.state,
            difficulty: this.difficulty,
            maxSquares: this.maxSquares,
            playerData: this.playerManager.toJSON(),
            gameLog: this.gameLog
        };
    }
}

/**
 * Global game instance
 */
const game = new SnakeAndLaddersGame();
