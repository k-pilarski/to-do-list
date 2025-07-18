import { loadTasks, saveTasks } from './utils/storage.js';
import { renderTasks } from './ui/render.js';
import { setupFormSubmit, setupTaskListClicks, setupSortControls } from './features/taskHandlers.js';
import { setupDragAndDrop } from './features/dragAndDrop.js'; 

let tasks = loadTasks();

const initApp = () => {
    renderTasks(tasks);
    setupFormSubmit(tasks, renderTasks, saveTasks);
    setupTaskListClicks(tasks, renderTasks, saveTasks);
    setupDragAndDrop(tasks, renderTasks, saveTasks);
    setupSortControls(tasks, renderTasks, saveTasks);
};

document.addEventListener('DOMContentLoaded', initApp);