import { tasksList } from '../dom/elements.js';

let draggedItem = null;

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

export const setupDragAndDrop = (tasks, renderTasks, saveTasks) => {
    tasksList.addEventListener('dragstart', (event) => {
        const listItem = event.target.closest('li[data-id]');
        if (!listItem) {
            event.preventDefault();
            return;
        }

        draggedItem = listItem;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', listItem.dataset.id);

        setTimeout(() => {
            listItem.classList.add('dragging');
        }, 0);
    });

    tasksList.addEventListener('dragend', () => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
            document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        }
    });

    tasksList.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const afterElement = getDragAfterElement(tasksList, event.clientY);
        const currentDraggable = document.querySelector('.dragging');

        if (currentDraggable){
            tasksList.querySelectorAll('li').forEach(item => item.classList.remove('drag-over'));
            if (afterElement == null) {
                if (tasksList.lastChild && tasksList.lastChild !== currentDraggable) {
                    tasksList.lastChild.classList.add('drag-over');
                }
            } else {
                if (afterElement !== currentDraggable) {
                    afterElement.classList.add('drag-over');
                }
            }
        }
    });

    tasksList.addEventListener('drop', (event) => {
        event.preventDefault();

        const droppedTaskId = event.dataTransfer.getData('text/plain');
        const droppedTaskElement = tasksList.querySelector(`li[data-id="${droppedTaskId}"]`);

        if (!droppedTaskElement) return;

        tasksList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        const afterElement = getDragAfterElement(tasksList, event.clientY);

        if (afterElement == null) {
            tasksList.appendChild(droppedTaskElement);
        } else {
            tasksList.insertBefore(droppedTaskElement, afterElement);
        }

        const currentTaskIndex = tasks.findIndex(task => task.id === droppedTaskId);
        if (currentTaskIndex === -1) return;

        const [taskToMove] = tasks.splice(currentTaskIndex, 1);

        let newIndex;
        if (afterElement == null) {
            newIndex = tasks.length;
        } else {
            const afterTaskId = afterElement.dataset.id;
            newIndex = tasks.findIndex(task => task.id === afterTaskId);
            if (newIndex === -1) newIndex = tasks.length;
        }

        tasks.splice(newIndex, 0, taskToMove);
    });
};