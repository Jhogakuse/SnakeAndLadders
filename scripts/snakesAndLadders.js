/**
 * Snakes and Ladders Configuration
 * Defines snake and ladder positions for each difficulty level
 */

const BOARD_CONFIG = {
    easy: {
        maxSquares: 30,
        cols: 6,
        rows: 5,
        snakes: [
            { head: 17, tail: 4 },
            { head: 19, tail: 7 },
            { head: 28, tail: 8 }
        ],
        ladders: [
            { bottom: 2, top: 15 },
            { bottom: 10, top: 25 },
            { bottom: 20, top: 29 }
        ]
    },
    medium: {
        maxSquares: 50,
        cols: 10,
        rows: 5,
        snakes: [
            { head: 17, tail: 4 },
            { head: 25, tail: 12 },
            { head: 35, tail: 20 },
            { head: 48, tail: 38 },
            { head: 30, tail: 8 }
        ],
        ladders: [
            { bottom: 2, top: 15 },
            { bottom: 7, top: 24 },
            { bottom: 18, top: 31 },
            { bottom: 37, top: 45 },
            { bottom: 42, top: 49 }
        ]
    },
    hard: {
        maxSquares: 100,
        cols: 10,
        rows: 10,
        snakes: [
            { head: 17, tail: 4 },
            { head: 25, tail: 12 },
            { head: 35, tail: 20 },
            { head: 48, tail: 38 },
            { head: 30, tail: 8 },
            { head: 56, tail: 42 },
            { head: 68, tail: 45 },
            { head: 82, tail: 65 },
            { head: 95, tail: 75 }
        ],
        ladders: [
            { bottom: 2, top: 15 },
            { bottom: 7, top: 24 },
            { bottom: 18, top: 31 },
            { bottom: 37, top: 50 },
            { bottom: 42, top: 60 },
            { bottom: 52, top: 70 },
            { bottom: 71, tail: 80 },
            { bottom: 84, top: 92 },
            { bottom: 97, top: 99 }
        ]
    }
};

/**
 * Get snake or ladder destination if player lands on it
 * Returns null if square is neutral
 */
function getDestination(square, difficulty) {
    const config = BOARD_CONFIG[difficulty];

    // Check if square has a snake
    for (let snake of config.snakes) {
        if (snake.head === square) {
            return snake.tail;
        }
    }

    // Check if square has a ladder
    for (let ladder of config.ladders) {
        if (ladder.bottom === square) {
            return ladder.top;
        }
    }

    return null;
}

/**
 * Check if a square contains a snake
 */
function isSnakeSquare(square, difficulty) {
    const config = BOARD_CONFIG[difficulty];
    return config.snakes.some(snake => snake.head === square);
}

/**
 * Check if a square contains a ladder
 */
function isLadderSquare(square, difficulty) {
    const config = BOARD_CONFIG[difficulty];
    return config.ladders.some(ladder => ladder.bottom === square);
}

/**
 * Get all snake and ladder positions for rendering
 */
function getAllPieces(difficulty) {
    const config = BOARD_CONFIG[difficulty];
    return {
        snakes: config.snakes,
        ladders: config.ladders
    };
}

/**
 * Get the maximum square number for a difficulty
 */
function getMaxSquares(difficulty) {
    return BOARD_CONFIG[difficulty].maxSquares;
}

/**
 * Get board dimensions for a difficulty
 */
function getBoardDimensions(difficulty) {
    const config = BOARD_CONFIG[difficulty];
    return {
        cols: config.cols,
        rows: config.rows,
        total: config.maxSquares
    };
}
