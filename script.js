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


taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    newTask = new Task(taskDescription.value, taskDueDate.value, taskPriority.value);

    tasks.push(newTask);

    taskForm.reset();
    console.log(tasks);
});