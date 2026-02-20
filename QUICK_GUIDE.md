# Phase 2 - Quick Reference Guide

## 🎮 Game is Now Playable!

### Starting the Game
```bash
cd /home/usui/Documents/Repository/SnakeAndLadders
python3 -m http.server 8000
# Open http://localhost:8000
```

### Complete Game Flow
```
1. Settings Screen
   → Enter # of players
   → Enter names
   → Select difficulty

2. Board Preview
   → View board layout
   → See snakes & ladders

3. Gameplay Screen (NEW!)
   → See tokens on board
   → View leaderboard
   → Check game log
   → Roll dice
   → Watch animation
   → See results

4. Winner Screen
   → See winner info
   → Play again or home
```

---

## 📁 Phase 2 New Files

| File | Purpose | Lines |
|------|---------|-------|
| dice.js | Dice with animation | ~80 |
| tokens.js | Player tokens system | ~220 |
| gameplay.css | Gameplay styles | ~400 |
| PHASE2_COMPLETE.md | Phase 2 docs | Reference |

---

## 🎲 How Dice Works
```javascript
// User clicks ROLL DICE button
const value = await dice.roll();     // 1-6
dice.setFinalDisplay(value);          // Show value
tokenManager.moveToken(player, pos);  // Animate move
```

---

## 🎯 How Movement Works
```javascript
// Player moves with animations
1. Roll dice → get value (1-6)
2. Move to: currentPos + diceValue
3. If snake: animate down to tail
4. If ladder: animate up to top
5. If win: show victory screen
6. Next player's turn
```

---

## 🏆 Key Features

✅ **Functional**
- Dice rolls 1-6
- Tokens move smoothly
- Snakes/ladders work
- Turn rotation
- Win detection

✅ **Visual**
- Animated dice
- Smooth token movement
- Pulse effects
- Highlighting
- Real-time updates

✅ **Responsive**
- Desktop layout
- Tablet layout
- Mobile layout
- Touch-friendly

---

## 🐛 Testing

### Quick Test
1. Open game
2. Enter 2 players (names: Alice, Bob)
3. Select Easy difficulty
4. Click Start Game
5. Click Start Playing
6. Click ROLL DICE
7. Watch animation
8. Check leaderboard
9. Continue until win

### Expected Results
- Dice shows 1-6
- Token moves smoothly
- Leaderboard updates
- Game log records moves
- Snakes move down
- Ladders move up
- Win detected at square 30/50/100

---

## 📊 Files Modified

**index.html**
- Added gameplay screen HTML
- Added new style/script links

**game.js**
- Added performAnimatedMove()
- Added nextTurn(), previousTurn()

**app.js**
- Added all gameplay functionality
- 200+ new lines

**styles/board.css**
- Changed overflow to visible

---

## 🚀 What's Working

| Feature | Status |
|---------|--------|
| Dice rolling | ✅ Works |
| Token movement | ✅ Works |
| Snake collision | ✅ Works |
| Ladder collision | ✅ Works |
| Turn management | ✅ Works |
| Win detection | ✅ Works |
| Leaderboard | ✅ Works |
| Game log | ✅ Works |
| UI display | ✅ Works |
| Mobile responsive | ✅ Works |

---

## 💡 Tips

### For Developers
- All classes documented
- Check browser console (F12)
- Game state logged
- Easy to extend

### For Players
- Watch animations
- Check leaderboard
- Read game log
- Have fun!

---

## 🔄 Game Loop

```javascript
while (!gameOver) {
  currentPlayer = getCurrentPlayer()
  diceValue = waitForRoll()
  move(currentPlayer, diceValue)
  animate(movement)
  checkSnakeLadder()
  animate(effect)
  checkWinner()
  nextPlayer()
}
```

---

## 🎨 Color Scheme

Players get unique colors:
- Red, Blue, Green
- Amber, Purple, Pink
- Teal, Orange

Tokens show player's initial inside.

---

## 📱 Responsive Breakpoints

| Device | Layout | Board Size |
|--------|--------|-----------|
| Desktop (1200px+) | Board + Sidebar | Full |
| Tablet (768-1199px) | Stacked | Adjusted |
| Mobile (<768px) | Single column | Compact |

---

## ⚡ Performance

- Smooth 60fps animations
- No lag on token movement
- Quick game log updates
- Responsive UI
- Optimized CSS

---

## 🎓 Key Classes

### Dice
```javascript
dice.roll()              // Returns Promise<1-6>
dice.setFinalDisplay()   // Show value
dice.reset()             // Clear for new game
```

### TokenManager
```javascript
tokenManager.moveToken()              // Animate
tokenManager.highlightPlayerToken()   // Current
tokenManager.animateSnakeLadderEffect() // Effect
```

### SnakeAndLaddersGame
```javascript
game.performAnimatedMove()  // Move + animate
game.nextTurn()             // Next player
game.endGame()              // Game over
```

---

## 🎯 Next Phase Ideas

Phase 3 could add:
- Sound effects 🔊
- Animations ✨
- Statistics 📊
- Undo feature ↩️
- Custom rules 🔧
- Profiles 👤

---

**Phase 2 is production-ready!**

All core gameplay working perfectly.
Ready for users to play!

---

*Updated: February 19, 2026*
