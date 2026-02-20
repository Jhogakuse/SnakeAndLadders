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
            { head: 17, tail: 15 },  // 2 squares down
            { head: 19, tail: 14 },  // 5 squares down
            { head: 28, tail: 20 }   // 8 squares down
        ],
        ladders: [
            { bottom: 2, top: 4 },    // 2 squares up
            { bottom: 12, top: 17 },  // 5 squares up
            { bottom: 22, top: 30 }   // 8 squares up
        ]
    },
    medium: {
        maxSquares: 50,
        cols: 10,
        rows: 5,
        snakes: [
            { head: 17, tail: 15 },  // 2 squares down
            { head: 25, tail: 22 },  // 3 squares down
            { head: 35, tail: 30 },  // 5 squares down
            { head: 48, tail: 41 },  // 7 squares down
            { head: 30, tail: 22 }   // 8 squares down
        ],
        ladders: [
            { bottom: 2, top: 4 },    // 2 squares up
            { bottom: 7, top: 10 },   // 3 squares up
            { bottom: 18, top: 23 },  // 5 squares up
            { bottom: 37, top: 44 },  // 7 squares up
            { bottom: 42, top: 50 }   // 8 squares up
        ]
    },
    hard: {
        maxSquares: 100,
        cols: 10,
        rows: 10,
        snakes: [
            { head: 17, tail: 15 },  // 2 squares down
            { head: 25, tail: 22 },  // 3 squares down
            { head: 35, tail: 30 },  // 5 squares down
            { head: 48, tail: 41 },  // 7 squares down
            { head: 30, tail: 22 },  // 8 squares down
            { head: 56, tail: 54 },  // 2 squares down
            { head: 68, tail: 65 },  // 3 squares down
            { head: 82, tail: 77 },  // 5 squares down
            { head: 95, tail: 88 }   // 7 squares down
        ],
        ladders: [
            { bottom: 2, top: 4 },    // 2 squares up
            { bottom: 7, top: 10 },   // 3 squares up
            { bottom: 18, top: 23 },  // 5 squares up
            { bottom: 37, top: 44 },  // 7 squares up
            { bottom: 42, top: 50 },  // 8 squares up
            { bottom: 52, top: 54 },  // 2 squares up
            { bottom: 71, top: 74 },  // 3 squares up
            { bottom: 84, top: 89 },  // 5 squares up
            { bottom: 92, top: 99 }   // 7 squares up
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
