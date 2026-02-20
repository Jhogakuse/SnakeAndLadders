/**
 * Dice System
 * Handles dice rolling, animations, and dice value management
 */

class Dice {
    constructor() {
        this.currentValue = 0;
        this.isRolling = false;
        this.rollDuration = 600; // milliseconds
        this.rollFrames = 12; // number of face changes during roll
    }

    /**
     * Roll the dice and return a value 1-6
     */
    roll() {
        if (this.isRolling) {
            return null;
        }

        this.isRolling = true;
        return new Promise((resolve) => {
            this.animateRoll().then(() => {
                this.currentValue = Math.floor(Math.random() * 6) + 1;
                this.isRolling = false;
                resolve(this.currentValue);
            });
        });
    }

    /**
     * Animate the dice rolling
     */
    animateRoll() {
        return new Promise((resolve) => {
            const diceDisplay = document.getElementById('dice-display');
            if (!diceDisplay) {
                resolve();
                return;
            }

            let frame = 0;
            const frameInterval = this.rollDuration / this.rollFrames;

            const rollInterval = setInterval(() => {
                const randomValue = Math.floor(Math.random() * 6) + 1;
                this.displayDice(randomValue);
                frame++;

                if (frame >= this.rollFrames) {
                    clearInterval(rollInterval);
                    resolve();
                }
            }, frameInterval);
        });
    }

    /**
     * Display dice face
     */
    displayDice(value) {
        const diceDisplay = document.getElementById('dice-display');
        if (!diceDisplay) return;

        const diceFace = diceDisplay.querySelector('.dice-face');
        if (diceFace) {
            diceFace.textContent = value;
            diceFace.style.transform = `rotateY(${Math.random() * 360}deg) rotateX(${Math.random() * 360}deg)`;
        }
    }

    /**
     * Set final dice display
     */
    setFinalDisplay(value) {
        const diceDisplay = document.getElementById('dice-display');
        if (!diceDisplay) return;

        const diceFace = diceDisplay.querySelector('.dice-face');
        if (diceFace) {
            diceFace.textContent = value;
            diceFace.style.transform = 'rotateY(0deg) rotateX(0deg)';
        }
    }

    /**
     * Get current dice value
     */
    getValue() {
        return this.currentValue;
    }

    /**
     * Check if dice is currently rolling
     */
    isCurrentlyRolling() {
        return this.isRolling;
    }

    /**
     * Reset dice
     */
    reset() {
        this.currentValue = 0;
        this.isRolling = false;
        const diceFace = document.querySelector('.dice-face');
        if (diceFace) {
            diceFace.textContent = '?';
            diceFace.style.transform = 'rotateY(0deg) rotateX(0deg)';
        }
    }
}

/**
 * Global dice instance
 */
const dice = new Dice();
