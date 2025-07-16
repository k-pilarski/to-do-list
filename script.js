let tasks = []

class Task {
    constructor(description, date, priority) {
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
        listItem.innerHTML = `
            ${task.description} - Priority: ${task.priority} Date: ${task.date}
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
        console.log(tasks);

        renderTasks()
    }
});
