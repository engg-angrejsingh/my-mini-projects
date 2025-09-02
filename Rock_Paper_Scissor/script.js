// Get references to user and computer image elements
let userimg = document.querySelector("#user img")
let compimg = document.querySelector("#comp img")

// Select all user choice images (rock, scissor, paper)
let userSelect = document.querySelectorAll("#userChoice img")
let selected = ["rock", "scissor", "paper"]

// Get references to result message and score spans
let result = document.querySelector("#result h1")
let userScore = document.querySelector("#user span")
let compScore = document.querySelector("#comp span")

// Initialize scores
let uScore = 1;
let cScore = 1;

// Function to randomly pick computer's choice
let computer = (selected, userSelect) => {
    let rdx = Math.floor(Math.random() * 3); // random index (0-2)
    let comChoice = userSelect[rdx].src;     // get the image link
    compimg.setAttribute("src", `${comChoice}`); // show computer choice image
    return selected[rdx]; // return computer's selected option
}

// Function to display the winner and update scores
let showWinner = (userWin, userClicked, compSelect) => {
    if (userWin) {
        result.innerText = `You Win! Your ${userClicked} beats ${compSelect}`;
        result.style.backgroundColor = "green";
        userScore.innerText = uScore++;
    } else {
        result.innerText = `You lose! Comp. ${compSelect} beats your ${userClicked}`;
        result.style.backgroundColor = "red";
        compScore.innerText = cScore++;
    }
}

// Function to check conditions and decide the result
let condition = (compSelect, userClicked) => {
    if (compSelect === userClicked) {
        // It's a draw
        result.innerText = "Draw";
        result.style.backgroundColor = "purple";
    } else {
        let userWin = true;

        // Logic for determining winner
        if (userClicked === "rock") {
            userWin = compSelect === "paper" ? false : true;
        } else if (userClicked === "paper") {
            userWin = compSelect === "scissor" ? false : true;
        } else {
            userWin = compSelect === "rock" ? false : true;
        }

        showWinner(userWin, userClicked, compSelect);
    }
}

// Add click event listener to each user choice image
userSelect.forEach(function(elem, index) {
    elem.addEventListener("click", (details) => {
        // Update user image based on selected choice
        let userSrc = details.target.src;
        userimg.setAttribute("src", `${userSrc}`);

        // Get user's choice text (rock, scissor, or paper)
        let userClicked = selected[index];

        // Get computer's choice
        let compSelect = computer(selected, userSelect);

        // Check game condition and display result
        condition(compSelect, userClicked);
    });
});
