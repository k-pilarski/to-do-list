let tasks = []

const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
    tasks = JSON.parse(storedTasks);
}

class Task {
    constructor(description, date, priority) {
        this.id = Date.now().toString();
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.isCompleted = false;
        this.isEditing = false;
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
        
        if (task.isCompleted) {
            listItem.classList.add('completed');
        }

        if (task.isEditing) {
            listItem.innerHTML = `
                <div class="left-li">
                    <input type="text" class="edit-description-input" value="${task.description}">
                    <input type="datetime-local" class="edit-date-input" value="${task.date}">
                </div>
                <div class="right-li">
                    <select class="edit-priority-select">
                        <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                        <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                    </select>
                    <button class="save-edit-btn">Save</button>
                    <button class="cancel-edit-btn">Cancel</button>
                </div>
            `
        } else {
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
                <div class="left-li">
                    <input type="checkbox" class="complete-checkbox" ${task.isCompleted ? 'checked' : ''}>
                    <span class="span-description">${task.description} - Priorytet: ${task.priority} Data: ${formattedDate}</span>
                </div>
                <div class="right-li">
                    <button class="edit-task-btn">Edit task</button>
                    <button class="delete-task-btn">Delete task</button>
                </div>
            `;

        }
        
        tasksList.appendChild(listItem);
    });
};

renderTasks();

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
        
        localStorage.setItem('tasks', JSON.stringify(tasks));

    }
});

tasksList.addEventListener('click', (event) => {
    if (event.target.closest('.delete-task-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToDelete = listItem.dataset.id;
        
        tasks = tasks.filter(task => task.id !== taskIdToDelete)

        renderTasks();

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    if (event.target.closest('.edit-task-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToEdit = listItem.dataset.id;

        const taskToEdit = tasks.find(task => task.id === taskIdToEdit);

        if (taskToEdit.isCompleted === false) {
            if (taskToEdit) {
                taskToEdit.isEditing = !taskToEdit.isEditing;

                renderTasks();
            }
        }
    }

    if(event.target.closest('.save-edit-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToSave = listItem.dataset.id;

        const taskToSave = tasks.find(task => task.id === taskIdToSave);

        if (taskToSave) {
            const editDescription = listItem.querySelector('.edit-description-input');
            const editDueDate = listItem.querySelector('.edit-date-input');
            const editPriority = listItem.querySelector('.edit-priority-select');

            taskToSave.description = editDescription.value;
            taskToSave.date = editDueDate.value;
            taskToSave.priority = editPriority.value;

            taskToSave.isEditing = false;

            renderTasks();

            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    if(event.target.closest('.cancel-edit-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToCancel = listItem.dataset.id;

        const taskToCancel = tasks.find(task => task.id === taskIdToCancel);

        if (taskToCancel) {
            taskToCancel.isEditing = false;

            renderTasks();
        }
    }

    if(event.target.closest('.complete-checkbox')) {
        const checkbox = event.target;
        
        const listItem = checkbox.closest('li');

        const taskIdToToggle = listItem.dataset.id;

        const taskToUpdate = tasks.find(task => task.id === taskIdToToggle);

        if (taskToUpdate) {
            taskToUpdate.isCompleted = !taskToUpdate.isCompleted;

            renderTasks();

            localStorage.setItem('tasks', JSON.stringify(tasks));
        }    
    }
});