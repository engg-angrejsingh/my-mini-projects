// Wait until the entire DOM is loaded before running the script
document.addEventListener('DOMContentLoaded', () => { 
    // Get references to DOM elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    let confettiFired = false; // Flag to avoid firing confetti repeatedly

    // Show or hide the empty state image
    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    // Update the progress bar and handle confetti trigger
    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        // Update progress bar width
        progressBar.style.width = totalTasks
            ? `${Math.round((completedTasks / totalTasks) * 100)}%`
            : '0';

        // Show completed/total numbers
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        // Fire confetti if all tasks are completed
        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            if (!confettiFired) {
                Confetti();
                confettiFired = true; // Prevent re-trigger
            }
        } else {
            confettiFired = false; // Reset flag if not fully complete
        }
    };

    // Save current tasks to localStorage
    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked,
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Load tasks from localStorage when the page is opened/reloaded
    const loadTaskFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    };

    // Function to add a new task
    const addTask = (text = '', completed = false, checkCompletion = true) => {
        const taskText = text.trim() || taskInput.value.trim();
        if (!taskText) return; // Don't add empty tasks

        // Create a list item for the task
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pencil"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        // Mark as completed if needed
        if (completed) {
            li.classList.add('completed');
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        // Handle task completion toggle
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        });

        // Edit task text
        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        });

        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();

            // Fire confetti if all tasks are deleted
            if (taskList.children.length === 0) {
                Confetti();
            }
        });

        // Add task to the list and update everything
        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };

    // Add task when "Add" button is clicked
    addTaskBtn.addEventListener('click', () => addTask());

    // Add task when pressing "Enter" key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    // Load saved tasks when page loads
    loadTaskFromLocalStorage();
});

// Confetti animation effect
const Confetti = () => {
    const count = 200;
    const defaults = { origin: { y: 1 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
        }));
    }

    // Different styles of confetti bursts
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
