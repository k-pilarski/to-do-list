let tasks = []

class Task {
    constructor(description, date, priority) {
        this.id = Date.now().toString();
        this.description = description;
        this.date = date;
        this.priority = priority;
    }
};

const taskForm = document.getElementById("js--task-form-id");
const taskDescription = document.getElementById("js--task-description-id");
const taskDueDate = document.getElementById("js--task-due-date-id");
const taskPriority = document.getElementById("js--task-priority-id");
const tasksList = document.getElementById("js--task-list-id");

function renderTasks() {
    tasksList.innerHTML = "";

    tasks.forEach(task => {
        const listItem = document.createElement('li'); 
        listItem.dataset.id = task.id;     
        
        const taskDateObj = new Date(task.date);
        
        const datePart = taskDateObj.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });

        const timePart = taskDateObj.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        });

        let formattedDate = ` ${datePart} ${timePart}`;

        listItem.innerHTML = `
            <span>${task.description} - Priorytet: ${task.priority} Data: ${formattedDate}</span>
            <button class="delete-task-btn">Delete task</button>
        `;
        tasksList.appendChild(listItem);
    });
};

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (taskDescription.value.trim() === "") {
        alert("Task description is empty")
    } else if (taskDueDate.value === "") {
        alert("Task date is empty")
    } else {
        const newTask = new Task(
            taskDescription.value, 
            taskDueDate.value, 
            taskPriority.value
        );

        tasks.push(newTask);

        taskForm.reset();

        renderTasks()

    }
});

tasksList.addEventListener('click', (event) => {
    if (event.target.closest('.delete-task-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToDelete = listItem.dataset.id;

        tasks = tasks.filter(task => task.id !== taskIdToDelete);

        renderTasks();
    }
});