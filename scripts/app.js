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

        // Dice mode elements
        this.randomRollControls = document.getElementById('random-roll-controls');
        this.manualRollControls = document.getElementById('manual-roll-controls');
        this.manualDiceValue = document.getElementById('manual-dice-value');
        this.manualRollBtn = document.getElementById('manual-roll-btn');

        // Game state
        this.diceMode = 'random';

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
        this.manualRollBtn.addEventListener('click', () => this.handleManualRoll());
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
            const diceMode = document.querySelector('input[name="dice-mode"]:checked').value;

            // Store dice mode for gameplay
            this.diceMode = diceMode;

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
        const difficultyText = game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1);
        this.difficultyDisplay.textContent = `📊 Difficulty: ${difficultyText}`;
        this.boardSizeDisplay.textContent = `📏 Size: ${game.maxSquares}`;

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
        this.gameplayScreen.classList.remove('active');
        this.winScreen.style.display = 'none';
        this.settingsScreen.classList.add('active');
        // game.resetGame();
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
                    const snakePairId = app.getSnakePairId(square.number, game.difficulty);
                    if (snakePairId) {
                        squareElement.dataset.snakePair = snakePairId;
                    }
                } else if (square.isLadder) {
                    squareElement.classList.add('ladder');
                    const ladderPairId = app.getLadderPairId(square.number, game.difficulty);
                    if (ladderPairId) {
                        squareElement.dataset.ladderPair = ladderPairId;
                    }
                } else {
                    // Check if this square is a snake destination
                    const snakePairId = app.getSnakeTailPairId(square.number, game.difficulty);
                    if (snakePairId) {
                        squareElement.classList.add('snake-destination');
                        squareElement.dataset.snakePair = snakePairId;
                    } else {
                        // Check if this square is a ladder destination
                        const ladderPairId = app.getLadderTopPairId(square.number, game.difficulty);
                        if (ladderPairId) {
                            squareElement.classList.add('ladder-destination');
                            squareElement.dataset.ladderPair = ladderPairId;
                        }
                    }
                }

                const numberSpan = document.createElement('span');
                numberSpan.className = 'square-number';
                numberSpan.textContent = square.number;
                squareElement.appendChild(numberSpan);

                // Add destination number if snake or ladder
                if (square.destination) {
                    const destSpan = document.createElement('span');
                    destSpan.className = 'destination-number';
                    destSpan.textContent = square.destination;
                    squareElement.appendChild(destSpan);
                }

                // Add token placeholders for each player inside the square
                const allPlayers = game.playerManager.getAllPlayers();
                allPlayers.forEach((player, index) => {
                    const tokenDiv = document.createElement('div');
                    tokenDiv.id = `game-board-${square.number}-${player.id}`;
                    tokenDiv.className = 'player-token';
                    tokenDiv.style.display = 'none'; // Hidden by default

                    // Calculate dynamic position within square based on player index
                    const position = this.calculateTokenPosition(index, allPlayers.length);
                    tokenDiv.style.left = position.left;
                    tokenDiv.style.top = position.top;

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
            // const startingSquare = document.getElementById('square-1');
            // if (startingSquare) {
            //     game.playerManager.getAllPlayers().forEach(player => {
            //         tokenManager.showTokenAtSquare(player.id, 1);
            //     });
            // }

            // Switch to gameplay screen
            this.boardScreen.classList.remove('active');
            this.gameplayScreen.classList.add('active');

            // Switch dice mode controls based on settings
            this.switchDiceMode(this.diceMode);

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

            // All moves are now valid with bounce-back logic
            if (moveResult.bouncedBack) {
                this.rollMessage.textContent = `🔄 Bounce back! From ${moveResult.previousPosition} to ${moveResult.finalPosition}`;
                this.rollMessage.className = 'roll-message bounce';
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
            console.log(`Winner check - Final Position: ${moveResult.finalPosition}, Max Squares: ${game.maxSquares}, isWinner: ${moveResult.isWinner}`);
            if (moveResult.isWinner || moveResult.finalPosition === game.maxSquares) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log(`🏆 Winner detected: ${moveResult.player.name}!`);
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
     * Switch dice mode controls
     */
    switchDiceMode(mode) {
        // Hide all controls
        this.randomRollControls.style.display = 'none';
        this.manualRollControls.style.display = 'none';

        // Show appropriate controls
        switch (mode) {
            case 'random':
                this.randomRollControls.style.display = 'block';
                break;
            case 'manual':
                this.manualRollControls.style.display = 'block';
                break;
        }
    }

    /**
     * Handle manual dice roll
     */
    async handleManualRoll() {
        const diceValue = parseInt(this.manualDiceValue.value);
        
        if (isNaN(diceValue) || diceValue < 1 || diceValue > 6) {
            this.rollMessage.textContent = 'Please enter a valid number (1-6)';
            this.rollMessage.className = 'roll-message error';
            return;
        }

        // Disable controls during roll
        this.manualRollBtn.disabled = true;
        this.manualDiceValue.disabled = true;

        try {
            // Show the dice value
            dice.setFinalDisplay(diceValue);
            this.rollMessage.textContent = `Manual roll: ${diceValue}`;

            // Perform animated move
            const moveResult = await game.performAnimatedMove(diceValue);

            // Update display
            await new Promise(resolve => setTimeout(resolve, 500));

            // All moves are now valid with bounce-back logic
            if (moveResult.bouncedBack) {
                this.rollMessage.textContent = `🔄 Bounce back! From ${moveResult.player.currentPosition} to ${moveResult.finalPosition}`;
                this.rollMessage.className = 'roll-message bounce';
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
                this.showWinnerScreen(moveResult.player);
                return;
            }

            // Next turn
            game.nextTurn();
            this.updateGameDisplay();
            this.populateGameLog();
        } catch (error) {
            console.error('Error during manual roll:', error);
            this.rollMessage.textContent = 'Error during move!';
        } finally {
            // Re-enable controls
            this.manualRollBtn.disabled = false;
            this.manualDiceValue.disabled = false;
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
     * Get snake pair identifier for styling
     */
    getSnakePairId(squareNumber, difficulty) {
        const config = BOARD_CONFIG[difficulty];
        const snakes = config.snakes;
        const snakeIndex = snakes.findIndex(s => s.head === squareNumber);
        return snakeIndex >= 0 ? `snake-${snakeIndex}` : '';
    }

    /**
     * Get snake tail (destination) pair identifier for styling
     */
    getSnakeTailPairId(squareNumber, difficulty) {
        const config = BOARD_CONFIG[difficulty];
        const snakes = config.snakes;
        const snakeIndex = snakes.findIndex(s => s.tail === squareNumber);
        return snakeIndex >= 0 ? `snake-${snakeIndex}` : '';
    }

    /**
     * Get ladder pair identifier for styling
     */
    getLadderPairId(squareNumber, difficulty) {
        const config = BOARD_CONFIG[difficulty];
        const ladders = config.ladders;
        const ladderIndex = ladders.findIndex(l => l.bottom === squareNumber);
        return ladderIndex >= 0 ? `ladder-${ladderIndex}` : '';
    }

    /**
     * Get ladder top (destination) pair identifier for styling
     */
    getLadderTopPairId(squareNumber, difficulty) {
        const config = BOARD_CONFIG[difficulty];
        const ladders = config.ladders;
        const ladderIndex = ladders.findIndex(l => l.top === squareNumber);
        return ladderIndex >= 0 ? `ladder-${ladderIndex}` : '';
    }

    /**
     * Clear all saved data
     */
    clearSavedData() {
        localStorage.removeItem('snakeLaddersSettings');
        location.reload();
    }

    /**
     * Calculate dynamic position for token within a square
     * Positions tokens in a circle or grid pattern to avoid overlap
     */
    calculateTokenPosition(playerIndex, totalPlayers) {
        const squareSize = 60; // Approximate square size in pixels
        const tokenSize = 40; // Token size in pixels
        const padding = 10; // Padding from square edges
        
        // Available space for positioning
        const availableSpace = squareSize - (padding * 2) - tokenSize;
        
        if (totalPlayers === 1) {
            // Single player - center the token
            return {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            };
        } else if (totalPlayers <= 4) {
            // 2-4 players - position in corners or cardinal points
            return this.calculateCardinalPosition(playerIndex, totalPlayers, squareSize, tokenSize);
        } else if (totalPlayers <= 6) {
            // 5-6 players - position in hexagon pattern
            return this.calculateHexagonPosition(playerIndex, totalPlayers, squareSize, tokenSize);
        } else {
            // 7+ players - position in grid pattern
            return this.calculateGridPosition(playerIndex, totalPlayers, squareSize, tokenSize);
        }
    }

    /**
     * Calculate positions for 2-4 players in cardinal directions
     */
    calculateCardinalPosition(index, total, squareSize, tokenSize) {
        let positions = [];
        
        if (total === 2) {
            positions = [
                { left: '15%', top: '15%' },  // Top-left
                { left: '65%', top: '65%' }   // Bottom-right
            ];
        } else if (total === 3) {
            positions = [
                { left: '15%', top: '15%' },  // Top-left
                { left: '65%', top: '15%' },  // Top-right
                { left: '40%', top: '65%' }   // Bottom-center
            ];
        } else if (total === 4) {
            positions = [
                { left: '15%', top: '15%' },  // Top-left
                { left: '65%', top: '15%' },  // Top-right
                { left: '15%', top: '65%' },  // Bottom-left
                { left: '65%', top: '65%' }   // Bottom-right
            ];
        }
        
        return positions[index] || { left: '40%', top: '40%' };
    }

    /**
     * Calculate positions for 5-6 players in hexagon pattern
     */
    calculateHexagonPosition(index, total, squareSize, tokenSize) {
        const centerX = 40; // 40% from left
        const centerY = 40; // 40% from top
        const radius = 20;   // 20% radius
        
        const angle = (index * 2 * Math.PI) / total;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        return {
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)'
        };
    }

    /**
     * Calculate positions for 7+ players in grid pattern
     */
    calculateGridPosition(index, total, squareSize, tokenSize) {
        const cols = Math.ceil(Math.sqrt(total));
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        const cellWidth = 80 / cols; // 80% of square width divided by columns
        const cellHeight = 80 / cols; // 80% of square height divided by rows
        
        const left = 10 + (col * cellWidth) + (cellWidth / 2); // 10% padding + position + center
        const top = 10 + (row * cellHeight) + (cellHeight / 2); // 10% padding + position + center
        
        return {
            left: `${left}%`,
            top: `${top}%`,
            transform: 'translate(-50%, -50%)'
        };
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
