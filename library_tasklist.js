"use strict";

var taskList = {
  tasks: [], //array to hold Task objects
  storage: getTaskStorage("tasks_11"), //storage object
  displayDiv: null, // div that displays tasks
  deleteClickHandler: null, // delete click event handler
  editClickHandler: null,
  load: function () {
    if (this.tasks.length === 0) {
      taskList.tasks = this.storage.get();
    }
    return this;
  },
  save: function () {
    this.storage.set(this.tasks);
    return this;
  },
  sort: function () {
    this.tasks.sort();
    return this;
  },
  add: function (task) {
    this.tasks.push(task.toString());
    return this;
  },
  delete: function (i) {
    this.sort();
    this.tasks.splice(i, 1);
    return this;
  },
  edit: function (i, task) {
    this.tasks[i] = task.toString();
    return this;
  },
  clear: function () {
    this.tasks.length = 0;
    this.storage.clear();
    this.display();
    return this;
  },
  display: function () {
    this.sort();
    this.displayDiv.replaceChildren();
    document.getElementById("task-count").textContent = String(
      this.tasks.length,
    ).padStart(2, "0");
    document.getElementById("clear_tasks").disabled = this.tasks.length === 0;
    if (!this.tasks.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      const illustration = document.createElement("div");
      illustration.className = "empty-cards";
      illustration.setAttribute("aria-hidden", "true");
      const heading = document.createElement("h3");
      heading.textContent = "A fresh sheet of possibility.";
      const description = document.createElement("p");
      description.textContent =
        "Add your first task. We'll keep a place for it.";
      empty.append(illustration, heading, description);
      this.displayDiv.append(empty);
    }
    this.tasks.forEach((task, i) => {
      const row = document.createElement("article");
      row.className = "task-card";
      const number = document.createElement("span");
      number.className = "task-number";
      number.textContent = String(i + 1).padStart(2, "0");
      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = String(task);
      const actions = document.createElement("div");
      actions.className = "task-actions";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.index = String(i);
      remove.className = "remove-task";
      remove.setAttribute("aria-label", "Delete task: " + task);
      remove.textContent = "×";
      remove.onclick = this.deleteClickHandler;
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.index = String(i);
      edit.dataset.editIndex = String(i);
      edit.setAttribute("aria-label", "Edit task: " + task);
      edit.textContent = "Edit";
      edit.onclick = this.editClickHandler;
      actions.append(edit, remove);
      row.append(number, text, actions);
      this.displayDiv.append(row);
    });
    return this;
  },
};
