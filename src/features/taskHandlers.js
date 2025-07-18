import { taskForm, taskDescription, taskDueDate, taskPriority, tasksList } from '../dom/elements.js';
import { Task } from '../models/Task.js';

let draggedItem = null;

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

export const setupFormSubmit = (tasks, renderTasks, saveTasks) => {
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
};

export const setupTaskListClicks = (tasks, renderTasks, saveTasks) => {
    tasksList.addEventListener('click', (event) => {
        const listItem = event.target.closest('li');
        if (!listItem) return;
        const taskId = listItem.dataset.id;
        const taskToModify = tasks.find(task => task.id === taskId);

        if (!taskToModify) return;

        if (event.target.closest('.delete-task-btn')) {
            tasks = tasks.filter(task => task.id !== taskId);
            renderTasks(tasks);
            saveTasks(tasks);
        }

        if (event.target.closest('.edit-task-btn')) {
            if (!taskToModify.isCompleted) { 
                taskToModify.isEditing = !taskToModify.isEditing;
                renderTasks(tasks);
                saveTasks(tasks);
            }
        }

        if (event.target.closest('.save-edit-btn')) {
            const editDescription = listItem.querySelector('.edit-description-input');
            const editDueDate = listItem.querySelector('.edit-date-input');
            const editPriority = listItem.querySelector('.edit-priority-select');

            taskToModify.description = editDescription.value;
            taskToModify.date = editDueDate.value;
            taskToModify.priority = editPriority.value;
            taskToModify.isEditing = false;
            renderTasks(tasks);
            saveTasks(tasks);
        }

        if (event.target.closest('.cancel-edit-btn')) {
            taskToModify.isEditing = false;
            renderTasks(tasks);
        }

        if (event.target.closest('.complete-checkbox')) {
            taskToModify.isCompleted = !taskToModify.isCompleted;
            renderTasks(tasks);
            saveTasks(tasks);
        }
    });
};

export const setupDragAndDrop = (tasks, renderTasks, saveTasks) => {
    tasksList.addEventListener('dragstart', (event) => {
        const listItem = event.target.closest('li');
        if (!listItem) return;

        draggedItem = listItem;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', listItem.dataset.id);

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
};