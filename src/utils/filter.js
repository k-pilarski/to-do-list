export const filterTasks = (tasks, filterBy) => {

    if (filterBy === 'all') {
        return tasks;
    }

    return tasks.filter((task) => {
        switch (filterBy) {
            case 'high-priority':
                return task.priority === 'High';
            case 'medium-priority':
                return task.priority === 'Medium';
            case 'low-priority':
                return task.priority === 'Low';
            case 'completed':
                return task.isCompleted === true;
            case 'active':
                return task.isCompleted === false;
            default:
                return true;
        }
    });

};