let bottom = document.querySelector("#cbottom")
let hit = document.querySelector("#hitValue")
let Timer = document.querySelector("#timerValue")
let Score = document.querySelector("#scoreValue")

function playSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Frequency in Hz
    oscillator.type = 'sine'; // Wave type
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function gameOverSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1.5); // Descending tone
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
}

function bubble() {
    let bub = ""
    for (let i = 0; i < 90; i++) {
        let randomNum = Math.floor(Math.random() * 10)
        bub += `<div class="circle">${randomNum}</div>`
    }
    bottom.innerHTML = bub
}


let randomValue;
function HitValue() {
    randomValue = Math.floor(Math.random() * 10)
    hit.innerHTML = randomValue

}


let timeTotal = 60;
let timevalue = setInterval(function () {
    if (timeTotal === -1) {
        clearInterval(timevalue)
        bottom.innerHTML = "<h1>Game Over</h1>"
        bottom.style.backgroundColor = "white"
   
    } else {
        if (timeTotal <= 3 && timeTotal > 0) {
            gameOverSound();
        }
        Timer.innerHTML = timeTotal
        timeTotal--
    }
}, 1000)


let totalScore = 0;

bottom.addEventListener("click", (details) => {
    let Num = (Math.floor(details.target.innerHTML))
    if (Num === randomValue) {
        playSound();
        Score.innerHTML = totalScore;
        HitValue()
        bubble()
        totalScore += 10;
    }
})


bubble()
HitValue()



