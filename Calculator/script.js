// Get the input box element
let input = document.getElementById('inputBox');

// Get all buttons on the page
let buttons = document.querySelectorAll('button');

// This variable will store the current input as a string
let string = "";

// Add click event to each button
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Get the value of the clicked button
        const value = e.target.innerHTML;

        // Check which button was clicked
        switch(value) {
            // If "=" button clicked, calculate the result
            case '=':
                try {
                    string = Function('"use strict"; return (' + string + ')')(); //safe way
                    // string = eval(string); unsafe way
                    input.value = string; // Show result
                } catch {
                    input.value = "Error"; // Show error if invalid
                    string = ""; // Reset string
                }
                break;

            // If "AC" button clicked, clear everything
            case 'AC':
                string = "";
                input.value = string;
                break;

            // If "DEL" button clicked, delete last character
            case 'DEL':
                string = string.slice(0, -1);
                input.value = string;
                break;

            // For all other buttons, add their value to the string
            default:
                string += value;
                input.value = string;
        }
    });
});



const toggleBtn = document.getElementById('toggleMode');

toggleBtn.addEventListener('click', () => {
    // Toggle a single 'light-mode' class
    document.body.classList.toggle('dark-mode');

    // Change icon based on the current mode
    if (document.body.classList.contains('light-mode')) {
        toggleBtn.innerHTML = `<i class="ri-moon-line"></i>`; // show moon icon for light mode
    } else {
        toggleBtn.innerHTML = `<i class="ri-sun-line"></i>`; // show sun icon for dark mode
    }
});
