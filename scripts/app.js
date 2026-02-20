/**
 * Main Application Logic and UI Controller
 * Coordinates between game logic and UI
 */

class SnakeAndLaddersApp {
    constructor() {
        this.settingsScreen = document.getElementById('settings-screen');
        this.boardScreen = document.getElementById('board-screen');
        this.gameplayScreen = document.getElementById('gameplay-screen');
        this.settingsForm = document.getElementById('settings-form');
        this.numPlayersInput = document.getElementById('num-players');
        this.playerNamesContainer = document.getElementById('player-names-container');
        this.gameBoardContainer = document.getElementById('game-board');
        this.difficultyDisplay = document.getElementById('difficulty-display');
        this.boardSizeDisplay = document.getElementById('board-size-display');
        this.backBtn = document.getElementById('back-btn');
        this.startGameBtn = document.getElementById('start-game-btn');

        // Gameplay elements
        this.gameplayBoard = document.getElementById('gameplay-board');
        this.rollDiceBtn = document.getElementById('roll-dice-btn');
        this.diceDisplay = document.getElementById('dice-display');
        this.currentPlayerDisplay = document.getElementById('current-player-display');
        this.currentPlayerName = document.getElementById('current-player-name');
        this.currentPlayerPosition = document.getElementById('current-player-position');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.gameLogDisplay = document.getElementById('game-log-display');
        this.rollMessage = document.getElementById('roll-message');
        this.winScreen = document.getElementById('win-screen');
        this.winnerName = document.getElementById('winner-name');
        this.winnerStats = document.getElementById('winner-stats');
        this.restartGameBtn = document.getElementById('restart-game-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.backHomeBtn = document.getElementById('back-home-btn');
        this.settingsBtn = document.getElementById('settings-btn');

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
        this.startGameBtn.addEventListener('click', () => this.startGameplay());

        // Difficulty change
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateBoardDisplay());
        });

        // Gameplay controls
        this.rollDiceBtn.addEventListener('click', () => this.handleDiceRoll());
        this.restartGameBtn.addEventListener('click', () => this.restartCurrentGame());
        this.settingsBtn.addEventListener('click', () => this.pauseGameAndSettings());

        // Win screen controls
        this.playAgainBtn.addEventListener('click', () => this.restartCurrentGame());
        this.backHomeBtn.addEventListener('click', () => this.goBackToSettings());
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
     * Start the actual gameplay
     */
    async startGameplay() {
        try {
            // Initialize board for gameplay
            const gameplayBoardDiv = this.gameplayBoard;
            if (!gameplayBoardDiv) {
                throw new Error('Gameplay board element not found');
            }

            // Clear and setup gameplay board
            gameplayBoardDiv.innerHTML = '';
            gameplayBoardDiv.className = `game-board gameplay-board ${game.difficulty}`;
            gameplayBoardDiv.style.position = 'relative';

            // Render board squares with token placeholders
            game.board.squares.forEach(square => {
                const squareElement = document.createElement('div');
                squareElement.className = 'square';
                squareElement.id = `square-${square.number}`;
                squareElement.dataset.number = square.number;

                if (square.isSnake) {
                    squareElement.classList.add('snake');
                } else if (square.isLadder) {
                    squareElement.classList.add('ladder');
                }

                const numberSpan = document.createElement('span');
                numberSpan.className = 'square-number';
                numberSpan.textContent = square.number;
                squareElement.appendChild(numberSpan);

                // Add token placeholders for each player inside the square
                game.playerManager.getAllPlayers().forEach(player => {
                    const tokenDiv = document.createElement('div');
                    tokenDiv.id = `game-board-${square.number}-${player.id}`;
                    tokenDiv.className = 'player-token';
                    tokenDiv.style.display = 'none'; // Hidden by default

                    tokenDiv.innerHTML = `
                        <div class="token-inner" style="background-color: ${player.color}">
                            <span class="token-label">${player.name.charAt(0).toUpperCase()}</span>
                        </div>
                    `;

                    squareElement.appendChild(tokenDiv);
                });

                gameplayBoardDiv.appendChild(squareElement);
            });

            // Initialize token manager with token references
            tokenManager.initializeTokens(game.playerManager.getAllPlayers());

            // Show tokens at starting position (square 1)
            const startingSquare = document.getElementById('square-1');
            if (startingSquare) {
                game.playerManager.getAllPlayers().forEach(player => {
                    tokenManager.showTokenAtSquare(player.id, 1);
                });
            }

            // Switch to gameplay screen
            this.boardScreen.classList.remove('active');
            this.gameplayScreen.classList.add('active');

            // Initialize game display
            this.updateGameDisplay();
            this.populateGameLog();

            console.log('🎮 Gameplay started!');
        } catch (error) {
            this.showError(error.message);
            console.error('Error starting gameplay:', error);
        }
    }

    /**
     * Handle dice roll
     */
    async handleDiceRoll() {
        // Disable button during roll
        this.rollDiceBtn.disabled = true;
        this.rollDiceBtn.textContent = 'Rolling...';

        try {
            // Roll the dice
            const diceValue = await dice.roll();
            dice.setFinalDisplay(diceValue);

            this.rollMessage.textContent = `Rolled: ${diceValue}`;

            // Perform animated move
            const moveResult = await game.performAnimatedMove(diceValue);

            // Update display
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!moveResult.hasMoved) {
                this.rollMessage.textContent = `Cannot move beyond finish! Stay at ${moveResult.player.currentPosition}`;
                this.rollMessage.className = 'roll-message';
            } else if (moveResult.hasLanded) {
                if (moveResult.movedBy === 'snake') {
                    this.rollMessage.textContent = `🐍 Snake! Moved from ${moveResult.newPosition} to ${moveResult.finalPosition}`;
                    this.rollMessage.className = 'roll-message snake';
                } else {
                    this.rollMessage.textContent = `🪜 Ladder! Climbed from ${moveResult.newPosition} to ${moveResult.finalPosition}`;
                    this.rollMessage.className = 'roll-message ladder';
                }
            } else {
                this.rollMessage.textContent = `Moved to square ${moveResult.finalPosition}`;
                this.rollMessage.className = 'roll-message success';
            }

            // Check for winner
            if (moveResult.isWinner) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.showWinScreen(moveResult.player);
                return;
            }

            // Update game display
            this.updateGameDisplay();
            this.populateGameLog();

            // Move to next player
            await new Promise(resolve => setTimeout(resolve, 1500));
            game.nextTurn();
            this.updateGameDisplay();
            this.populateGameLog();
        } catch (error) {
            console.error('Error during dice roll:', error);
            this.rollMessage.textContent = 'Error during move!';
        } finally {
            // Re-enable button
            this.rollDiceBtn.disabled = false;
            this.rollDiceBtn.textContent = 'ROLL DICE';
        }
    }

    /**
     * Update game display elements
     */
    updateGameDisplay() {
        const currentPlayer = game.playerManager.getCurrentPlayer();
        const gameState = game.getGameState();

        // Update current player display
        if (this.currentPlayerName && currentPlayer) {
            this.currentPlayerName.textContent = currentPlayer.name;
            this.currentPlayerName.style.color = currentPlayer.color;
            this.currentPlayerPosition.textContent = `Position: ${currentPlayer.currentPosition}`;
        }

        // Highlight current player token
        tokenManager.highlightPlayerToken(currentPlayer.id);

        // Update leaderboard
        this.updateLeaderboard(gameState.leaderboard);
    }

    /**
     * Update leaderboard display
     */
    updateLeaderboard(leaderboard) {
        if (!this.leaderboardList) return;

        this.leaderboardList.innerHTML = '';
        const currentPlayer = game.playerManager.getCurrentPlayer();

        leaderboard.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            if (player.name === currentPlayer.name) {
                item.classList.add('current');
            }

            item.innerHTML = `
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="player-color-dot" style="background-color: ${player.color}"></div>
                <div class="leaderboard-name">${player.name}</div>
                <div class="leaderboard-position">${player.position}/${game.maxSquares}</div>
            `;

            this.leaderboardList.appendChild(item);
        });
    }

    /**
     * Populate game log
     */
    populateGameLog() {
        if (!this.gameLogDisplay) return;

        const logs = game.getGameLog();
        this.gameLogDisplay.innerHTML = '';

        // Show last 10 entries
        const recentLogs = logs.slice(-10);
        recentLogs.forEach(log => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = log;
            this.gameLogDisplay.appendChild(entry);
        });

        // Scroll to bottom
        this.gameLogDisplay.scrollTop = this.gameLogDisplay.scrollHeight;
    }

    /**
     * Show win screen
     */
    showWinScreen(winner) {
        if (this.winScreen) {
            const stats = game.playerManager.getStatistics();
            const winnerStats = stats.find(p => p.name === winner.name);

            this.winnerName.innerHTML = `🏆 ${winner.name} 🏆`;
            this.winnerStats.textContent = `
                Congratulations! You reached square ${game.maxSquares}!
                Moves taken: ${winnerStats.moveCount}
                Final position: ${winner.currentPosition}
            `;

            this.winScreen.classList.remove('hidden');
        }
    }

    /**
     * Hide win screen
     */
    hideWinScreen() {
        if (this.winScreen) {
            this.winScreen.classList.add('hidden');
        }
    }

    /**
     * Restart current game with same players and difficulty
     */
    restartCurrentGame() {
        this.hideWinScreen();
        game.startNewRound();
        tokenManager.reset();

        // Reset dice
        if (dice) {
            dice.reset();
        }

        // Clear roll message
        this.rollMessage.textContent = '';

        // Restart gameplay
        this.startGameplay();
    }

    /**
     * Pause game and show settings
     */
    pauseGameAndSettings() {
        this.gameplayScreen.classList.remove('active');
        this.boardScreen.classList.add('active');
    }

    /**
     * Start the game (old method - kept for backward compatibility)
     */
    startGame() {
        alert('🎮 Starting gameplay!\n\nFeatures:\n✅ Dice rolling with animation\n✅ Player tokens on board\n✅ Snake & Ladder collision\n✅ Turn management\n✅ Win condition\n✅ Game log');
        this.startGameplay();
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
