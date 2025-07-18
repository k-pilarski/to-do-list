export class Task {
    constructor(description, date, priority) {
        this.id = Date.now().toString();
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.isCompleted = false;
        this.isEditing = false;
    }
};