const LOCAL_STORAGE_KEY = 'tasks';

export const loadTasks = () => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
}

export const saveTasks = (tasksToSave) => { 
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasksToSave));
};