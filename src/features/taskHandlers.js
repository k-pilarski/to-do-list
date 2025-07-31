import { setDefaultTaskDueDate } from '../utils/date.js';
import { taskForm, taskDescription, taskDueDate, taskPriority, tasksList, sortButton, sortOptionsDropdown, filterButton, filterOptionsDropdown, errorDescMessage, errorDateMessage } from '../dom/elements.js';
import { Task } from '../models/Task.js';

export const setupFormSubmit = (tasks, renderTasks, saveTasks, getStateAndRender) => {
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (taskDescription.value.trim() === "") {
            taskDescription.classList.add('error')
            errorDescMessage.style.display = 'block';
            errorDescMessage.innerHTML = 'Task description is empty.'
        } else if (taskDescription.value.trim().length < 4) {
            taskDescription.classList.add('error')
            errorDescMessage.style.display = 'block';
            errorDescMessage.innerHTML = 'Task description is too short.'
        } else if (taskDueDate.value === "") {
            taskDescription.classList.remove('error')
            errorDescMessage.style.display = 'none';
            errorDescMessage.innerHTML = ''
            taskDueDate.classList.add('error')
            errorDateMessage.style.display = 'block';
            errorDateMessage.innerHTML = 'Task date is empty.'
        } else {
            taskDescription.classList.remove('error')
            errorDescMessage.style.display = 'none';
            errorDescMessage.innerHTML = ''
            taskDueDate.classList.remove('error')
            errorDateMessage.style.display = 'none';
            errorDateMessage.innerHTML = ''
            const newTask = new Task(
                taskDescription.value,
                taskDueDate.value,
                taskPriority.value
            );

            tasks.push(newTask);
            taskForm.reset();
            saveTasks(tasks);
            const [updatedTasks, currentFilter, currentSortBy, currentSortOrder] = getStateAndRender();
            renderTasks(updatedTasks, currentFilter, currentSortBy, currentSortOrder);
            setDefaultTaskDueDate();
        }
    });
};

export const setupTaskListClicks = (tasks, renderTasks, saveTasks, getStateAndRender) => {
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
            saveTasks(tasks);
            const [updatedTasks, currentFilter, currentSortBy, currentSortOrder] = getStateAndRender();
            renderTasks(updatedTasks, currentFilter, currentSortBy, currentSortOrder);
        }

        if (event.target.closest('.edit-task-btn')) {
            if (!taskToModify.isCompleted) {
                taskToModify.isEditing = !taskToModify.isEditing;
                const [updatedTasks, currentFilter, currentSortBy, currentSortOrder] = getStateAndRender();
                renderTasks(updatedTasks, currentFilter, currentSortBy, currentSortOrder);
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
            saveTasks(tasks);
            const [updatedTasks, currentFilter, currentSortBy, currentSortOrder] = getStateAndRender();
            renderTasks(updatedTasks, currentFilter, currentSortBy, currentSortOrder);
        }

        if (event.target.closest('.cancel-edit-btn')) {
            taskToModify.isEditing = false;
            const [updatedTasks, currentFilter, currentSortBy, currentSortOrder] = getStateAndRender();
            renderTasks(updatedTasks, currentFilter, currentSortBy, currentSortOrder);
        }

        if (event.target.closest('.complete-checkbox')) {
            taskToModify.isCompleted = !taskToModify.isCompleted;
            saveTasks(tasks);
            const [updatedTasks, currentFilter, currentSortBy, currentSortOrder] = getStateAndRender();
            renderTasks(updatedTasks, currentFilter, currentSortBy, currentSortOrder);
        }
    });
};

export const setupSortControls = (tasks, renderTasks, saveTasks, updateSortStateAndRender) => {
    sortButton.addEventListener('click', () => {
        sortOptionsDropdown.classList.toggle('show');
        sortButton.classList.toggle('active');
        filterOptionsDropdown.classList.remove('show');
        filterButton.classList.remove('active');
    });

    sortOptionsDropdown.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.sort-option');
        if (!clickedButton) return;

        const sortBy = clickedButton.dataset.sortBy;
        const sortOrder = clickedButton.dataset.sortOrder;

        updateSortStateAndRender(sortBy, sortOrder);

        sortOptionsDropdown.classList.remove('show');
        sortButton.classList.remove('active');
    });

    document.addEventListener('click', (event) => {
        if (!sortButton.contains(event.target) && !sortOptionsDropdown.contains(event.target) &&
            !filterButton.contains(event.target) && !filterOptionsDropdown.contains(event.target)) {
            sortOptionsDropdown.classList.remove('show');
            sortButton.classList.remove('active');
            filterOptionsDropdown.classList.remove('show');
            filterButton.classList.remove('active');
        }
    });
};

export const setupFilterControls = (tasks, renderTasks, saveTasks, updateFilterStateAndRender) => {
    filterButton.addEventListener('click', () => {
        filterOptionsDropdown.classList.toggle('show');
        filterButton.classList.toggle('active');
        sortOptionsDropdown.classList.remove('show');
        sortButton.classList.remove('active');
    });

    filterOptionsDropdown.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.filter-option');
        if (!clickedButton) return;

        const filterBy = clickedButton.dataset.filterBy;

        updateFilterStateAndRender(filterBy);

        filterOptionsDropdown.classList.remove('show');
        filterButton.classList.remove('active');
    });
};
