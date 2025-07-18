import { Task } from './models/Task.js';
import { loadTasks, saveTasks } from './utils/storage.js';

let tasks = loadTasks();
let draggedItem = null;


const taskForm = document.getElementById("js--task-form-id");
const taskDescription = document.getElementById("js--task-description-id");
const taskDueDate = document.getElementById("js--task-due-date-id");
const taskPriority = document.getElementById("js--task-priority-id");
const tasksList = document.getElementById("js--task-list-id");
const emptyListMessage = document.getElementById("js--empty-list-message");

function renderTasks() {
    tasksList.innerHTML = "";

    if (tasks.length === 0) {
        emptyListMessage.style.display = 'block';
    } else {
        emptyListMessage.style.display = 'none';

        tasks.forEach(task => {
            const listItem = document.createElement('li'); 
            listItem.dataset.id = task.id;     
            listItem.draggable = true;
            
            if (task.isCompleted) {
                listItem.classList.add('completed');
            }

            switch (task.priority) {
                case 'Low':
                    listItem.classList.add('priority-low');
                    break;
                case 'Medium':
                    listItem.classList.add('priority-medium');
                    break;
                case 'High':
                    listItem.classList.add('priority-high');
                    break;
            }


            if (task.isEditing) {
                listItem.innerHTML = `
                    <div class="left-li">
                        <input type="text" class="edit-description-input" value="${task.description}">
                        <input type="datetime-local" class="edit-date-input" value="${task.date}">
                        <select class="edit-priority-select">
                            <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                            <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="right-li">
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
    }
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
        
        saveTasks(tasks);
    }
});

tasksList.addEventListener('click', (event) => {
    if (event.target.closest('.delete-task-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToDelete = listItem.dataset.id;
        
        tasks = tasks.filter(task => task.id !== taskIdToDelete)

        renderTasks();
        
        saveTasks(tasks);
    }

    if (event.target.closest('.edit-task-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToEdit = listItem.dataset.id;

        const taskToEdit = tasks.find(task => task.id === taskIdToEdit);

        if (taskToEdit.isCompleted === false) {
            if (taskToEdit) {
                taskToEdit.isEditing = !taskToEdit.isEditing;

                renderTasks();

                saveTasks(tasks);
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

            saveTasks(tasks);
        }
    }

    if(event.target.closest('.cancel-edit-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToCancel = listItem.dataset.id;

        const taskToCancel = tasks.find(task => task.id === taskIdToCancel);

        if (taskToCancel) {
            taskToCancel.isEditing = false;

            renderTasks();

            saveTasks(tasks);
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

            saveTasks(tasks);
        }    
    }
});

tasksList.addEventListener('dragstart', (event) => {
    const listItem = event.target.closest('li');

    if (!listItem) return;

    draggedItem = listItem;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', listItem.dataset.id)

    setTimeout(() => {
        listItem.classList.add('dragging');
    }, 0);
});

tasksList.addEventListener('dragend', () => {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;

        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    }
});

tasksList.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(tasksList, event.clientY);
    const currentDraggable = document.querySelector('.dragging');

    if (currentDraggable){
        tasksList.querySelectorAll('li').forEach(item => item.classList.remove('drag-over'));
        if (afterElement == null) {
            if (tasksList.lastChild && tasksList.lastChild !== currentDraggable) {
                tasksList.lastChild.classList.add('drag-over');
            }
        } else {
            if (afterElement !== currentDraggable) {
                afterElement.classList.add('drag-over');
            }
        }
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

tasksList.addEventListener('drop', (event) => {
    event.preventDefault(); 

    const droppedTaskId = event.dataTransfer.getData('text/plain');
    const droppedTaskElement = document.querySelector(`li[data-id="${droppedTaskId}"]`);

    if (!droppedTaskElement) return;

    tasksList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    const afterElement = getDragAfterElement(tasksList, event.clientY);

    if (afterElement == null) {
        tasksList.appendChild(droppedTaskElement);
    } else {
        tasksList.insertBefore(droppedTaskElement, afterElement);
    }

    const currentTaskIndex = tasks.findIndex(task => task.id === droppedTaskId);
    if (currentTaskIndex === -1) return;

    const [taskToMove] = tasks.splice(currentTaskIndex, 1); 

    let newIndex;
    if (afterElement == null) {
        newIndex = tasks.length; 
    } else {
        const afterTaskId = afterElement.dataset.id;
        newIndex = tasks.findIndex(task => task.id === afterTaskId);
        if (newIndex === -1) newIndex = tasks.length; 
    }

    tasks.splice(newIndex, 0, taskToMove); 

    saveTasks(tasks);
});
