"use strict";

var taskList = {
    tasks: [], //array to hold Task objects
    storage: getTaskStorage("tasks_11"), //storage object
    displayDiv: null, // div that displays tasks
    deleteClickHandler: null, // delete click event handler
    editClickHandler: null,
    load: function() {
        if (this.tasks.length === 0) {
            taskList.tasks = this.storage.get();
        }
        return this;
    },
    save: function() {
        this.storage.set(this.tasks);
        return this;
    },
    sort: function() {
        this.tasks.sort();
        return this;
    },
    add: function(task) {
        this.tasks.push(task.toString());
        return this;
    },
    delete: function(i) {
        this.sort();
        this.tasks.splice(i, 1);
        return this;
    },
    edit: function(i, task) {
        this.tasks[i] = task.toString();
        return this;
    },
    clear: function() {
        this.tasks.length = 0;
        this.storage.clear();
        this.displayDiv.innerHTML = "";
        return this;
    },
    display: function() {
        this.sort();
        this.displayDiv.replaceChildren();
        this.tasks.forEach((task, i) => {
            const row = document.createElement("p");
            const remove = document.createElement("a");
            remove.href = "#";
            remove.title = String(i);
            remove.textContent = "Delete";
            remove.onclick = this.deleteClickHandler;
            const edit = document.createElement("a");
            edit.href = "#";
            edit.title = String(i);
            edit.textContent = "Edit";
            edit.onclick = this.editClickHandler;
            // Stored tasks are user text, never HTML or executable markup.
            row.append(remove, edit, document.createTextNode(String(task)));
            this.displayDiv.append(row);
        });
        return this;
    }
};