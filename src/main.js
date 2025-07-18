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
import { setupFormSubmit, setupTaskListClicks, setupDragAndDrop } from './features/taskHandlers.js';

let tasks = loadTasks();

const initApp = () => {
    renderTasks(tasks);
    setupFormSubmit(tasks, renderTasks, saveTasks);
    setupTaskListClicks(tasks, renderTasks, saveTasks);
    setupDragAndDrop(tasks, renderTasks, saveTasks);
    
    if (taskDescription) {
        taskDescription.focus();
    }
};

document.addEventListener('DOMContentLoaded', initApp);