# 🎲 Snake and Ladders Web Game

A fully-featured web-based implementation of classic Snake and Ladders board game with customizable players, multiple difficulty levels, and interactive gameplay.

## 📋 Quick Start

1. **Install**: Clone the repository and open `index.html` in your browser
2. **Setup**: Enter number of players, their names, select difficulty, and choose dice mode
3. **Play**: View the generated board with snakes and ladders
4. **Game**: Roll dice or enter manual values to play!

## 📁 Project Structure

- `index.html` - Main game interface
- `styles/` - CSS files for styling
  - `main.css` - Global styles
  - `settings.css` - Settings screen
  - `board.css` - Game board
  - `gameplay.css` - Gameplay screen
- `scripts/` - JavaScript game logic
  - `app.js` - Main application controller
  - `game.js` - Core game mechanics
  - `board.js` - Board generation
  - `players.js` - Player management
  - `snakesAndLadders.js` - Configuration
  - `dice.js` - Dice rolling system
  - `tokens.js` - Token management and animation

## 🎮 Game Levels

| Level | Squares | Grid | Snakes | Ladders |
|-------|---------|------|--------|---------|
| Easy | 30 | 6×5 | 3 | 3 |
| Medium | 49 | 7×7 | 5 | 5 |
| Hard | 100 | 10×10 | 8-9 | 8-9 |

## 🎲 Dice Modes

### Random Roll Mode
- Traditional dice rolling with animation
- Click "ROLL DICE" button for random 1-6 value

### Manual Input Mode
- Enter specific dice values manually
- Type number (1-6) and click "MOVE"
- Perfect for testing specific scenarios

## ✨ Features

### Phase 1: ✅ Complete
- [x] Settings screen with player configuration
- [x] Three difficulty levels
- [x] Dynamic board generation
- [x] Snake and ladder visualization
- [x] Responsive design
- [x] Settings persistence (localStorage)

### Phase 2: ✅ Complete
- [x] Dice rolling system (Random & Manual modes)
- [x] Player movement with step-by-step animation
- [x] Turn management
- [x] Win conditions
- [x] Bounce-back rule implementation
- [x] Dynamic token positioning
- [x] Snake and ladder effects
- [x] Game log and leaderboard
- [x] Winner screen

### Phase 3: 🎨 Pending
- [ ] Animations
- [ ] Sound effects
- [ ] Multiple language support

## 🎯 Key Features

### 🎮 Gameplay
- **Turn-based system**: Players take turns rolling dice
- **Bounce-back rule**: Players bounce back from finish line if they overshoot
- **Dynamic tokens**: Players positioned dynamically within squares to avoid overlap
- **Step-by-step animation**: Tokens move through each intermediate square
- **Snake & ladder effects**: Automatic movement with visual feedback

### 🎲 Dice System
- **Random mode**: Traditional dice rolling with animation
- **Manual mode**: Enter specific values for testing
- **Input validation**: Ensures only valid dice values (1-6)

### 🏆 Game Management
- **Multiple players**: Support for 1-10 players
- **Difficulty levels**: Easy (30), Medium (49), Hard (100) squares
- **Win detection**: Automatic winner announcement
- **Game statistics**: Track positions and moves

## 🚀 Technologies

- Pure HTML5
- CSS3 (with animations)
- Vanilla JavaScript (no frameworks)
- localStorage API

## 📝 License

See LICENSE file for details.

## 🎯 Current Status

**Phase 2 Complete**: Full gameplay implementation with all core mechanics working!

Simply open `index.html` and start configuring your game. Enjoy playing Snake and Ladders! 🎲🐍🪜
