/**
 * Main Application Logic and UI Controller
 * Coordinates between game logic and UI
 */

class SnakeAndLaddersApp {
    constructor() {
        this.settingsScreen = document.getElementById('settings-screen');
        this.boardScreen = document.getElementById('board-screen');
        this.settingsForm = document.getElementById('settings-form');
        this.numPlayersInput = document.getElementById('num-players');
        this.playerNamesContainer = document.getElementById('player-names-container');
        this.gameBoardContainer = document.getElementById('game-board');
        this.difficultyDisplay = document.getElementById('difficulty-display');
        this.boardSizeDisplay = document.getElementById('board-size-display');
        this.backBtn = document.getElementById('back-btn');
        this.startGameBtn = document.getElementById('start-game-btn');

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.loadSavedSettings();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Settings form
        this.settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));

        // Player number input
        this.numPlayersInput.addEventListener('change', (e) => this.handlePlayerCountChange(e));

        // Back button
        this.backBtn.addEventListener('click', () => this.goBackToSettings());

        // Start game button
        this.startGameBtn.addEventListener('click', () => this.startGame());

        // Difficulty change
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateBoardDisplay());
        });
    }

    /**
     * Handle player count change
     */
    handlePlayerCountChange(event) {
        const count = parseInt(event.target.value) || 2;
        this.updatePlayerNameInputs(count);
    }

    /**
     * Update player name input fields
     */
    updatePlayerNameInputs(count) {
        this.playerNamesContainer.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            const div = document.createElement('div');
            div.className = 'player-name-input';

            const label = document.createElement('span');
            label.className = 'player-label';
            label.textContent = `Player ${i}:`;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Enter player ${i} name`;
            input.value = `Player ${i}`;
            input.id = `player-${i}`;

            div.appendChild(label);
            div.appendChild(input);
            this.playerNamesContainer.appendChild(div);
        }

        this.saveSettings();
    }

    /**
     * Handle settings form submission
     */
    handleSettingsSubmit(event) {
        event.preventDefault();

        try {
            // Get form values
            const numPlayers = parseInt(this.numPlayersInput.value);
            const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

            // Get player names
            const playerNames = [];
            for (let i = 1; i <= numPlayers; i++) {
                const input = document.getElementById(`player-${i}`);
                const name = input.value.trim() || `Player ${i}`;
                playerNames.push(name);
            }

            // Validate
            if (playerNames.length === 0) {
                this.showError('Please enter at least one player');
                return;
            }

            // Initialize game
            game.initializeGame(difficulty, playerNames);

            // Display the board
            this.displayBoard();

            // Save settings
            this.saveSettings();
        } catch (error) {
            this.showError(error.message);
            console.error('Error during game initialization:', error);
        }
    }

    /**
     * Display board screen
     */
    displayBoard() {
        // Render the board
        game.board.render('game-board');

        // Update board info
        const boardInfo = game.getBoardInfo();
        const difficultyText = game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1);
        this.difficultyDisplay.textContent = `📊 Difficulty: ${difficultyText}`;
        this.boardSizeDisplay.textContent = `📏 Size: ${boardInfo.dimensions.gridSize} (${game.maxSquares} squares)`;

        // Switch screens
        this.settingsScreen.classList.remove('active');
        this.boardScreen.classList.add('active');

        // Log game state
        console.log('Board displayed:', game.getGameState());
    }

    /**
     * Update board display after difficulty change
     */
    updateBoardDisplay() {
        // Only update if board screen is active
        if (this.boardScreen.classList.contains('active')) {
            const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
            const playerNames = [];
            const numPlayers = parseInt(this.numPlayersInput.value);

            for (let i = 1; i <= numPlayers; i++) {
                const input = document.getElementById(`player-${i}`);
                if (input) {
                    playerNames.push(input.value.trim() || `Player ${i}`);
                }
            }

            game.initializeGame(difficulty, playerNames);
            this.displayBoard();
        }
    }

    /**
     * Go back to settings
     */
    goBackToSettings() {
        this.boardScreen.classList.remove('active');
        this.settingsScreen.classList.add('active');
        game.resetGame();
    }

    /**
     * Start the actual game (Phase 2)
     */
    startGame() {
        alert('🎮 Game play coming in Phase 2!\n\nCurrent features:\n✅ Game setup\n✅ Board visualization\n✅ Snake & Ladder placement\n\nNext: Dice rolling, player movement, turn management');
        console.log('Starting game...');
        console.log('Game State:', game.getGameState());
    }

    /**
     * Show error message
     */
    showError(message) {
        // Create error element
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            this.settingsForm.insertBefore(errorDiv, this.settingsForm.firstChild);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        const settings = {
            numPlayers: parseInt(this.numPlayersInput.value),
            difficulty: document.querySelector('input[name="difficulty"]:checked').value,
            playerNames: []
        };

        for (let i = 1; i <= settings.numPlayers; i++) {
            const input = document.getElementById(`player-${i}`);
            if (input) {
                settings.playerNames.push(input.value);
            }
        }

        localStorage.setItem('snakeLaddersSettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    loadSavedSettings() {
        const saved = localStorage.getItem('snakeLaddersSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.numPlayersInput.value = settings.numPlayers;
                this.updatePlayerNameInputs(settings.numPlayers);

                // Restore player names
                settings.playerNames.forEach((name, index) => {
                    const input = document.getElementById(`player-${index + 1}`);
                    if (input) {
                        input.value = name;
                    }
                });

                // Restore difficulty
                const difficultyRadio = document.querySelector(
                    `input[name="difficulty"][value="${settings.difficulty}"]`
                );
                if (difficultyRadio) {
                    difficultyRadio.checked = true;
                }
            } catch (error) {
                console.error('Error loading saved settings:', error);
            }
        } else {
            // Initialize with default
            this.updatePlayerNameInputs(2);
        }
    }

    /**
     * Clear all saved data
     */
    clearSavedData() {
        localStorage.removeItem('snakeLaddersSettings');
        location.reload();
    }
}

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎲 Snake and Ladders Game - Initializing...');
    window.app = new SnakeAndLaddersApp();
    console.log('✅ Application ready!');
});
