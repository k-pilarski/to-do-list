import { tasksList, emptyListMessage } from '../dom/elements.js';
import { filterTasks } from '../utils/filter.js';
import { sortTasks } from '../utils/sort.js';

export const renderTasks = (tasks, currentFilter = 'all', currentSortBy = 'date', currentSortOrder = 'asc') => {
    const filteredTasks = filterTasks(tasks, currentFilter);

    const tasksToRender = sortTasks(filteredTasks, currentSortBy, currentSortOrder);

    tasksList.innerHTML = "";

    if (tasksToRender.length === 0) {
        emptyListMessage.style.display = 'block';
        emptyListMessage.querySelector('p').textContent = (tasks.length === 0) ?
            'No tasks. Add your first task using the form above!' :
            'No tasks match the current filter criteria.';
    } else {
        emptyListMessage.style.display = 'none';

        tasksToRender.forEach(task => {
            const listItem = document.createElement('li');
            listItem.dataset.id = task.id;
            listItem.draggable = true;

            if (task.isCompleted) {
                listItem.classList.add('completed');
            }

            switch (task.priority) {
                case 'Low':
                    listItem.classList.add('priority-low');
                    break;
                case 'Medium':
                    listItem.classList.add('priority-medium');
                    break;
                case 'High':
                    listItem.classList.add('priority-high');
                    break;
            }

            if (task.isEditing) {
                listItem.innerHTML = `
                    <div class="left-li">
                        <input type="text" class="edit-description-input" name="editTaskDescription" value="${task.description}">
                        <input type="datetime-local" class="edit-date-input" name="editTaskDueDate" value="${task.date}">
                        <select class="edit-priority-select" name="editTaskPriority">
                            <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                            <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="right-li">
                        <button class="save-edit-btn">Save</button>
                        <button class="cancel-edit-btn">Cancel</button>
                    </div>
                `;
            } else {
                const taskDateObj = new Date(task.date);

                const datePart = taskDateObj.toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                });

                const timePart = taskDateObj.toLocaleTimeString('pl-PL', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                let formattedDate = ` ${datePart} ${timePart}`;

                listItem.innerHTML = `
                    <div class="left-li">
                        <input type="checkbox" class="complete-checkbox" name="checkbox" ${task.isCompleted ? 'checked' : ''}>
                        <span class="span-description">${task.description} - Priorytet: ${task.priority} Data: ${formattedDate}</span>
                    </div>
                    <div class="right-li">
                        <button class="edit-task-btn">Edit task</button>
                        <button class="delete-task-btn">Delete task</button>
                    </div>
                `;
            }

            tasksList.appendChild(listItem);
        });
    }
};