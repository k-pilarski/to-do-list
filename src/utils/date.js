import { taskDueDate } from '../dom/elements.js';

export const setDefaultTaskDueDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    taskDueDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
};