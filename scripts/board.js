/**
 * Board Generation and Rendering
 * Handles creation and display of the game board
 */

class Board {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.config = BOARD_CONFIG[difficulty];
        this.squares = [];
    }

    /**
     * Generate board squares in correct snake pattern order
     * Odd rows go left-to-right, even rows go right-to-left
     */
    generateSquares() {
        this.squares = [];
        let squareNumber = 1;
        const { cols, rows } = this.config;

        for (let row = rows - 1; row >= 0; row--) {
            if ((rows - 1 - row) % 2 === 0) {
                // Even rows (from bottom): left to right (ascending numbers)
                for (let col = 0; col < cols; col++) {
                    this.squares.push({
                        number: squareNumber,
                        row: row,
                        col: col,
                        isSnake: isSnakeSquare(squareNumber, this.difficulty),
                        isLadder: isLadderSquare(squareNumber, this.difficulty),
                        destination: getDestination(squareNumber, this.difficulty)
                    });
                    squareNumber++;
                }
            } else {
                // Odd rows (from bottom): right to left, but numbers still increment left-to-right
                // So we add cols squares, but need to reverse their visual order
                const rowSquares = [];
                for (let col = 0; col < cols; col++) {
                    rowSquares.push({
                        number: squareNumber,
                        row: row,
                        col: col,
                        isSnake: isSnakeSquare(squareNumber, this.difficulty),
                        isLadder: isLadderSquare(squareNumber, this.difficulty),
                        destination: getDestination(squareNumber, this.difficulty)
                    });
                    squareNumber++;
                }
                // Add in reverse order for right-to-left display
                this.squares.push(...rowSquares.reverse());
            }
        }

        return this.squares;
    }

    /**
     * Render the board to the DOM
     */
    render(containerId = 'game-board') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id '${containerId}' not found`);
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Set grid difficulty class
        container.className = `game-board ${this.difficulty}`;

        // Create squares
        for (let square of this.squares) {
            const squareElement = this.createSquareElement(square);
            container.appendChild(squareElement);
        }
    }

    /**
     * Create a single square element
     */
    createSquareElement(square) {
        const squareDiv = document.createElement('div');
        squareDiv.className = 'square';
        squareDiv.id = `square-${square.number}`;
        squareDiv.dataset.number = square.number;

        // Add type class and pair identifier (snake or ladder)
        if (square.isSnake) {
            squareDiv.classList.add('snake');
            const snakePairId = this.getSnakePairId(square.number);
            squareDiv.dataset.snakePair = snakePairId;
            squareDiv.title = `Snake! From ${square.number} to ${square.destination}`;
        } else if (square.isLadder) {
            squareDiv.classList.add('ladder');
            const ladderPairId = this.getLadderPairId(square.number);
            squareDiv.dataset.ladderPair = ladderPairId;
            squareDiv.title = `Ladder! From ${square.number} to ${square.destination}`;
        }

        // Add square number
        const numberSpan = document.createElement('span');
        numberSpan.className = 'square-number';
        numberSpan.textContent = square.number;
        squareDiv.appendChild(numberSpan);

        // Add destination number if snake or ladder
        if (square.destination) {
            const destSpan = document.createElement('span');
            destSpan.className = 'destination-number';
            destSpan.textContent = square.destination;
            squareDiv.appendChild(destSpan);
        }

        // Add click handler for testing
        squareDiv.addEventListener('click', () => {
            this.onSquareClick(square);
        });

        return squareDiv;
    }

    /**
     * Get snake pair identifier
     */
    getSnakePairId(squareNumber) {
        const snakes = this.config.snakes;
        const snakeIndex = snakes.findIndex(s => s.head === squareNumber);
        return snakeIndex >= 0 ? `snake-${snakeIndex}` : '';
    }

    /**
     * Get ladder pair identifier
     */
    getLadderPairId(squareNumber) {
        const ladders = this.config.ladders;
        const ladderIndex = ladders.findIndex(l => l.bottom === squareNumber || l.top === squareNumber);
        return ladderIndex >= 0 ? `ladder-${ladderIndex}` : '';
    }

    /**
     * Handle square click (used for debugging/testing)
     */
    onSquareClick(square) {
        console.log(`Clicked square: ${square.number}`);
        if (square.destination) {
            console.log(`This square leads to: ${square.destination}`);
        }
    }

    /**
     * Get square information by number
     */
    getSquare(squareNumber) {
        return this.squares.find(s => s.number === squareNumber);
    }

    /**
     * Get board statistics
     */
    getStats() {
        return {
            difficulty: this.difficulty,
            maxSquares: this.config.maxSquares,
            totalSquares: this.squares.length,
            snakeCount: this.config.snakes.length,
            ladderCount: this.config.ladders.length,
            gridSize: `${this.config.cols}x${this.config.rows}`
        };
    }
}

/**
 * Create and render board
 */
function initializeBoard(difficulty = 'easy') {
    const board = new Board(difficulty);
    board.generateSquares();
    board.render();
    return board;
}
