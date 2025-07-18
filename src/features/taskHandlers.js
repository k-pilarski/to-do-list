import { taskForm, taskDescription, taskDueDate, taskPriority, tasksList, sortButton, sortOptionsDropdown } from '../dom/elements.js';
import { Task } from '../models/Task.js';
import { sortTasks } from '../utils/sort.js'; 

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
            const taskIndexToDelete = tasks.findIndex(task => task.id === taskId);
            if (taskIndexToDelete > -1) {
                tasks.splice(taskIndexToDelete, 1);
            }
            renderTasks(tasks);
            saveTasks(tasks);
        }

        if (event.target.closest('.edit-task-btn')) {
            if (!taskToModify.isCompleted) { 
                taskToModify.isEditing = !taskToModify.isEditing;
                renderTasks(tasks);
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

export const setupSortControls = (tasks, renderTasks, saveTasks) => {
    sortButton.addEventListener('click', () => {
        sortOptionsDropdown.classList.toggle('show');
        sortButton.classList.toggle('active');
    });

    sortOptionsDropdown.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.sort-option');
        if (!clickedButton) return;

        const sortBy = clickedButton.dataset.sortBy;
        const sortOrder = clickedButton.dataset.sortOrder;

        const sortedTasks = sortTasks(tasks, sortBy, sortOrder);

        tasks.splice(0, tasks.length, ...sortedTasks);

        renderTasks(tasks);
        saveTasks(tasks);

        sortOptionsDropdown.classList.remove('show');
        sortButton.classList.remove('active');
    });

    document.addEventListener('click', (event) => {
        if (!sortButton.contains(event.target) && !sortOptionsDropdown.contains(event.target)) {
            sortOptionsDropdown.classList.remove('show');
            sortButton.classList.remove('active');
        }
    });
};
