import { setDefaultTaskDueDate } from './utils/date.js';
import { loadTasks, saveTasks } from './utils/storage.js';
import { renderTasks } from './ui/render.js';
import { setupFormSubmit, setupTaskListClicks, setupSortControls, setupFilterControls } from './features/taskHandlers.js';
import { setupDragAndDrop } from './features/dragAndDrop.js';
import { setupDarkMode } from './features/darkMode.js';

let tasks = loadTasks();

let currentFilter = 'all';
let currentSortBy = 'date';
let currentSortOrder = 'asc';

const getStateAndRender = () => {
    return [tasks, currentFilter, currentSortBy, currentSortOrder];
};

const initApp = () => {
    setDefaultTaskDueDate();
    
    renderTasks(...getStateAndRender());

    setupFormSubmit(tasks, renderTasks, saveTasks, getStateAndRender);
    setupTaskListClicks(tasks, renderTasks, saveTasks, getStateAndRender);
    setupDragAndDrop(tasks, renderTasks, saveTasks, getStateAndRender);
    setupSortControls(tasks, renderTasks, saveTasks, (sortBy, sortOrder) => {
        currentSortBy = sortBy;
        currentSortOrder = sortOrder;
        renderTasks(...getStateAndRender());
    });
    setupFilterControls(tasks, renderTasks, saveTasks, (filterBy) => {
        currentFilter = filterBy;
        renderTasks(...getStateAndRender());
    });

    setupDarkMode();
};

document.addEventListener('DOMContentLoaded', initApp);