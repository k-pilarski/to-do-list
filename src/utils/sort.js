export const sortTasks = (tasks, sortBy, sortOrder) => {
    const sortedTasks = [...tasks];

    switch (sortBy) {
        case 'date':
            sortedTasks.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (sortOrder === 'asc') {
                    return dateA.getTime() - dateB.getTime();
                } else {
                    return dateB.getTime() - dateA.getTime();
                }
            });
            break;
        case 'priority':
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            sortedTasks.sort((a, b) => {
                const priorityA = priorityOrder[a.priority];
                const priorityB = priorityOrder[b.priority];
                if (sortOrder === 'high-low') {
                    return priorityB - priorityA;
                } else {
                    return priorityA - priorityB;
                }
            });
            break;
        default:
            sortedTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            break;
    }

    return sortedTasks;
};