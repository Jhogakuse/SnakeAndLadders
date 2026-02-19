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
     * Generate board squares in correct order
     * Squares are numbered from bottom-left to top-right in a snake pattern
     */
    generateSquares() {
        this.squares = [];
        let squareNumber = 1;
        const { cols, rows } = this.config;

        for (let row = rows - 1; row >= 0; row--) {
            if ((rows - 1 - row) % 2 === 0) {
                // Even rows: left to right
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
                // Odd rows: right to left
                for (let col = cols - 1; col >= 0; col--) {
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

        // Add type class (snake or ladder)
        if (square.isSnake) {
            squareDiv.classList.add('snake');
            squareDiv.title = `Snake! From ${square.number} to ${square.destination}`;
        } else if (square.isLadder) {
            squareDiv.classList.add('ladder');
            squareDiv.title = `Ladder! From ${square.number} to ${square.destination}`;
        }

        // Add square number
        const numberSpan = document.createElement('span');
        numberSpan.className = 'square-number';
        numberSpan.textContent = square.number;
        squareDiv.appendChild(numberSpan);

        // Add click handler for testing
        squareDiv.addEventListener('click', () => {
            this.onSquareClick(square);
        });

        return squareDiv;
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
