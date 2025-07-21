import { loadTasks, saveTasks } from './utils/storage.js';
import { renderTasks } from './ui/render.js';
import { setupFormSubmit, setupTaskListClicks, setupSortControls, setupFilterControls } from './features/taskHandlers.js';
import { setupDragAndDrop } from './features/dragAndDrop.js'; 

let tasks = loadTasks();

let currentFilter = 'all';
let currentSortBy = 'date';
let currentSortOrder = 'asc';

const initApp = () => {
    renderTasks(tasks, currentFilter, currentSortBy, currentSortOrder);

    setupFormSubmit(tasks, renderTasks, saveTasks, () => [tasks, currentFilter, currentSortBy, currentSortOrder]);
    setupTaskListClicks(tasks, renderTasks, saveTasks, () => [tasks, currentFilter, currentSortBy, currentSortOrder]);
    setupDragAndDrop(tasks, renderTasks, saveTasks);

    setupSortControls(tasks, renderTasks, saveTasks, (sortBy, sortOrder) => {
        currentSortBy = sortBy;
        currentSortOrder = sortOrder;
        renderTasks(tasks, currentFilter, currentSortBy, currentSortOrder);
    });

    setupFilterControls(tasks, renderTasks, saveTasks, (filterBy) => {
        currentFilter = filterBy;
        renderTasks(tasks, currentFilter, currentSortBy, currentSortOrder);
    });
};

document.addEventListener('DOMContentLoaded', initApp);