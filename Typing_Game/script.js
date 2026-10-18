// 🔤 Dictionary of words for the typing test
const cyberWords = [
    "mainframe", "cyberpunk", "override", "protocol", "neon", "matrix", "hacker",
    "proxy", "data", "terminal", "console", "virtual", "reality", "bandwidth",
    "encryption", "algorithm", "binary", "fiber", "optic", "upload", "server",
    "corpo", "street", "samurai", "chrome", "wire", "ghost", "shell", "blade",
    "runner", "nexus", "deck", "jack", "port", "access", "denied", "granted",
    "breach", "firewall", "node", "packet", "stream", "uplink", "byte", "ping"
];

// 🎯 DOM Elements Setup
const gameContainer = document.getElementById('game');
const wordsContainer = document.getElementById('words');
const cursor = document.getElementById('cursor');
const timerDisplay = document.getElementById('timer');
const wpmBox = document.getElementById('wpm-box');
const wpmVal = document.getElementById('wpm-val');

// ⚙️ Game State Variables
let timeLimit = 60;          // ⏳ Total time for the test (in seconds)
let timeLeft = timeLimit;    // ⏱️ Current time remaining
let timerInterval = null;    // 🔄 Holds the setInterval for the timer
let idleTimeout = null;      // ⏸️ Tracks the 5-second idle time to pause the game
let isPlaying = false;       // 🎮 Is the game currently running?
let isFinished = false;      // 🏁 Is the game over?

let typedCorrectChars = 0;   // ✅ Count of correctly typed characters (for WPM math)
let currentScrollY = 0;      // 📜 Tracks vertical scrolling of the word container

// 🎲 Generate a random array of words
function generateWords(count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        // Pick a random word from our array
        result.push(cyberWords[Math.floor(Math.random() * cyberWords.length)]);
    }
    return result;
}

// 🖌️ Render the words into the HTML
function renderWords() {
    wordsContainer.innerHTML = ''; // 🧹 Clear old words
    currentScrollY = 0;            // 🔄 Reset scroll position
    wordsContainer.style.transform = `translateY(${currentScrollY}px)`;

    const words = generateWords(100); // 📝 Generate 100 random words

    // 🏗️ Build the HTML structure for each word and letter
    words.forEach((word) => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');

        word.split('').forEach((char) => {
            const span = document.createElement('span');
            span.classList.add('letter');
            span.innerText = char;
            wordDiv.appendChild(span);
        });
        wordsContainer.appendChild(wordDiv);
    });

    // ✨ Highlight the very first word and letter to start
    const firstWord = wordsContainer.firstChild;
    firstWord.classList.add('current-word');
    firstWord.firstChild.classList.add('current-letter');
}

// 📏 Update the position of the blinking cursor
function updateCursor() {
    const currentWord = document.querySelector('.current-word');
    const currentLetter = document.querySelector('.current-letter');

    if (!currentWord) return;

    let targetElement = currentLetter;
    let isAtEnd = false;

    // ➡️ If no current letter, we are at the space *after* the word
    if (!targetElement) {
        targetElement = currentWord.lastElementChild;
        isAtEnd = true;
    }

    // 📐 Get dimensions and positions to calculate cursor placement
    const gameRect = gameContainer.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const wordRect = currentWord.getBoundingClientRect();

    // 📜 Scroll Logic: Calculate word top relative to game container
    const wordRelativeTop = wordRect.top - gameRect.top;

    // If word falls below the top line significantly, scroll up one line!
    if (wordRelativeTop > 60) {
        currentScrollY -= 55; // ⬆️ Scroll up by exactly one line's height
        wordsContainer.style.transform = `translateY(${currentScrollY}px)`;

        // 🔄 Wait for the next frame after DOM updates to recalculate position
        requestAnimationFrame(updateCursor);
        return;
    }

    // 🎯 Calculate exact absolute position inside the #game container
    let leftPos = targetRect.left - gameRect.left;
    let topPos = targetRect.top - gameRect.top;

    if (isAtEnd) {
        leftPos += targetRect.width; // ⏩ Offset past the last letter if at the end of word
    }

    // ✨ Apply the new coordinates to the cursor
    cursor.style.left = `${leftPos}px`;
    cursor.style.top = `${topPos + 5}px`; // Add 5px padding from top to center visually
}

// ⏸️ Pause Game Function (Triggers if you stop typing)
function pauseTimer() {
    clearInterval(timerInterval);
    isPlaying = false;
    timerDisplay.style.opacity = 0.5; // 👻 Visual cue that the timer is paused
}

// ⏳ Reset Idle Timer Function
function resetIdleTimer() {
    clearTimeout(idleTimeout);
    // Set a new 5-second trap
    idleTimeout = setTimeout(() => {
        if (isPlaying && !isFinished) {
            pauseTimer(); // 💤 Pause the game if idle for 5000ms
        }
    }, 5000); 
}

// 🚀 Start or Resume the Game
function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    isFinished = false;
    timerDisplay.style.opacity = 1; // 💡 Restore visual brightness when active

    // ⏱️ Start counting down
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;

        // 🛑 Stop game if time runs out
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// 🏁 End the Game and Calculate Score
function endGame() {
    clearInterval(timerInterval);
    clearTimeout(idleTimeout); // 🛑 Clear the idle timer
    isPlaying = false;
    isFinished = true;
    timerDisplay.style.opacity = 1;

    // 🏆 WPM Formula: (Total correct keystrokes / 5) / (Time limit in minutes)
    const wpm = Math.round((typedCorrectChars / 5) / (timeLimit / 60));
    wpmVal.innerText = isNaN(wpm) ? 0 : wpm;
    wpmBox.style.display = 'block'; // 📊 Show results
    
    gameContainer.blur(); // 📴 Triggers the frosted glass overlay automatically
}

// 🔄 Initialize / Reset everything for a fresh game
function initGame() {
    clearInterval(timerInterval);
    clearTimeout(idleTimeout); 
    timeLeft = timeLimit;
    isPlaying = false;
    isFinished = false;
    typedCorrectChars = 0;

    timerDisplay.innerText = `00:${timeLeft}`;
    timerDisplay.style.opacity = 1;
    wpmBox.style.display = 'none'; // Hide old results

    renderWords(); // 🎲 Generate new text

    // 🎯 Let the DOM update, then place cursor and set focus
    requestAnimationFrame(() => {
        updateCursor();
        gameContainer.focus();
    });
}

// ⌨️ TYPING LOGIC (The core engine of the game!)
gameContainer.addEventListener('keydown', (e) => {
    if (isFinished) return; // 🚫 Block input if game is over

    // 🚫 Ignore modifiers and functional keys (Ctrl, Alt, Tab, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'Tab') return;

    // 📥 Only capture space, backspace, and single characters
    if (e.key === ' ' || e.key === 'Backspace' || e.key.length === 1) {
        e.preventDefault(); // Stop default browser behaviors (like scrolling on space)
    } else {
        return;
    }

    if (!isPlaying) startGame(); // 🚀 Start game on first keystroke
    
    // ⏰ Every time a key is pressed, reset the 5-second pause countdown
    resetIdleTimer(); 

    const currentWord = document.querySelector('.current-word');
    const currentLetter = document.querySelector('.current-letter');

    // 🔙 BACKSPACE LOGIC
    if (e.key === 'Backspace') {
        if (currentLetter === currentWord.firstChild) {
            // ⏪ Start of word: Move back to the previous word
            if (currentWord.previousElementSibling) {
                currentWord.classList.remove('current-word');
                const prevWord = currentWord.previousElementSibling;
                prevWord.classList.add('current-word');
                if (currentLetter) currentLetter.classList.remove('current-letter');
                // Cursor hangs at the end of the previous word
            }
        } else if (currentLetter) {
            // ⬅️ Middle of word: Move back one letter
            currentLetter.classList.remove('current-letter', 'correct', 'incorrect');
            const prevLetter = currentLetter.previousElementSibling;
            prevLetter.classList.add('current-letter');
            prevLetter.classList.remove('correct', 'incorrect');
        } else {
            // 🔙 End of word (at the space): Move back onto the last typed letter
            const lastLetter = currentWord.lastElementChild;
            lastLetter.classList.add('current-letter');
            lastLetter.classList.remove('correct', 'incorrect');
        }
    }
    // ␣ SPACEBAR LOGIC
    else if (e.key === ' ') {
        // 🛡️ BUG FIX: Prevent skipping if the word is completely empty
        const hasTyped = currentWord.querySelectorAll('.correct, .incorrect').length > 0;
        if (!hasTyped) {
            return; // 🛑 Ignore spacebar if nothing has been typed yet!
        }

        // ⏭️ Move to next word
        if (currentWord.nextElementSibling) {
            // ❌ Mark any skipped (untyped) letters in the current word as incorrect
            const untyped = currentWord.querySelectorAll('.letter:not(.correct):not(.incorrect)');
            untyped.forEach(l => l.classList.add('incorrect'));

            currentWord.classList.remove('current-word');
            if (currentLetter) currentLetter.classList.remove('current-letter');

            const nextWord = currentWord.nextElementSibling;
            nextWord.classList.add('current-word');
            nextWord.firstChild.classList.add('current-letter');
        }
    }
    // 🔤 NORMAL TYPING LOGIC
    else if (e.key.length === 1) {
        if (currentLetter) {
            const expectedChar = currentLetter.innerText;
            
            // ✅ Did they type the right letter?
            if (e.key === expectedChar) {
                currentLetter.classList.add('correct');
                typedCorrectChars++; // Add to WPM score
            } else {
                currentLetter.classList.add('incorrect'); // ❌ Wrong letter
            }

            // ➡️ Move the cursor to the next letter
            currentLetter.classList.remove('current-letter');
            if (currentLetter.nextElementSibling) {
                currentLetter.nextElementSibling.classList.add('current-letter');
            }
        }
        // 👻 Note: If there's no currentLetter, they are typing extra characters at the end of the word. We just ignore them.
    }

    // 🎯 Immediately update cursor positioning on the screen
    updateCursor();
});

// 🖱️ Click focus handler (Clicking the frosted glass overlay focuses the game)
document.getElementById('focus-overlay').addEventListener('click', () => {
    gameContainer.focus();
});

// 🔄 Initialization & Event Listeners
window.addEventListener('load', initGame); // Start fresh on load
window.addEventListener('resize', () => { 
    if (!isFinished) updateCursor(); // 📐 Fix cursor position if window is resized
});