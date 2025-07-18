import { Task } from './models/Task.js';
import { loadTasks, saveTasks } from './utils/storage.js';
import {
    taskForm,
    taskDescription,
    taskDueDate,
    taskPriority,
    tasksList,
} from './dom/elements.js';
import { renderTasks } from './ui/render.js';

let tasks = loadTasks();
let draggedItem = null;



const initApp = () => {
    renderTasks(tasks);
    // setupFormSubmit();
    // setupTaskListClicks();
    // setupDragAndDrop();
    if (taskDescription) {
        taskDescription.focus();
    }
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

        renderTasks(tasks);
        
        saveTasks(tasks);
    }
});

tasksList.addEventListener('click', (event) => {
    if (event.target.closest('.delete-task-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToDelete = listItem.dataset.id;
        
        tasks = tasks.filter(task => task.id !== taskIdToDelete)

        renderTasks(tasks);
        
        saveTasks(tasks);
    }

    if (event.target.closest('.edit-task-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToEdit = listItem.dataset.id;

        const taskToEdit = tasks.find(task => task.id === taskIdToEdit);

        if (taskToEdit.isCompleted === false) {
            if (taskToEdit) {
                taskToEdit.isEditing = !taskToEdit.isEditing;

                renderTasks(tasks);

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

            renderTasks(tasks);

            saveTasks(tasks);
        }
    }

    if(event.target.closest('.cancel-edit-btn')) {
        const listItem = event.target.closest('li');

        const taskIdToCancel = listItem.dataset.id;

        const taskToCancel = tasks.find(task => task.id === taskIdToCancel);

        if (taskToCancel) {
            taskToCancel.isEditing = false;

            renderTasks(tasks);

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

            renderTasks(tasks);

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
    renderTasks(tasks);
    saveTasks(tasks);
});

document.addEventListener('DOMContentLoaded', initApp);