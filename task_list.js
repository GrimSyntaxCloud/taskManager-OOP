"use strict";

var $ = function (id) {
  return document.getElementById(id);
};
var announce = function (text) {
  $("feedback").textContent = text;
};
var persist = function (message) {
  try {
    taskList.sort().save();
    taskList.display();
    announce(message);
  } catch (_) {
    taskList.display();
    announce(
      "Your change is on this desk, but this browser could not save it. Keep this tab open to avoid losing it.",
    );
  }
};
var addToTaskList = function (event) {
  if (event) event.preventDefault();
  var field = $("task");
  var task = getTask(field.value);
  if (!task.isValid()) {
    field.setAttribute("aria-invalid", "true");
    announce("Write a task first. A few words will do.");
  } else {
    field.removeAttribute("aria-invalid");
    taskList.add(task);
    persist("Added to your list. Filed alphabetically, ready when you are.");
    field.value = "";
  }
  field.focus();
};
var clearTaskList = function () {
  try {
    taskList.clear();
    announce("A clear desk. Make room for something new.");
  } catch (_) {
    taskList.display();
    announce(
      "The list is clear here, but browser storage could not be updated.",
    );
  }
  $("task").focus();
};
var deleteFromTaskList = function () {
  var index = Number(this.dataset.index);
  taskList.delete(index);
  persist("Task removed. A little more room on your desk.");
  var next = $("tasks").querySelectorAll(".remove-task");
  if (next.length) next[Math.min(index, next.length - 1)].focus();
  else $("task").focus();
};
var cancelTaskEdit = function (index) {
  taskList.display();
  var button = $("tasks").querySelector('[data-edit-index="' + index + '"]');
  if (button) button.focus();
  announce("Edit cancelled. Your task is unchanged.");
};
var editTaskListItem = function () {
  var index = Number(this.dataset.index);
  taskList.display();
  var row = $("tasks").children[index];
  row.replaceChildren();
  var form = document.createElement("form");
  form.className = "edit-form";
  var label = document.createElement("label");
  label.htmlFor = "edit-task";
  label.textContent = "A LITTLE REVISION";
  var input = document.createElement("input");
  input.id = "edit-task";
  input.value = taskList.tasks[index];
  input.setAttribute("aria-describedby", "feedback");
  var save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save changes";
  var cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "cancel-edit";
  cancel.textContent = "Cancel";
  cancel.onclick = function () {
    cancelTaskEdit(index);
  };
  form.onkeydown = function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelTaskEdit(index);
    }
  };
  form.onsubmit = function (event) {
    event.preventDefault();
    var task = getTask(input.value);
    if (!task.isValid()) {
      input.setAttribute("aria-invalid", "true");
      announce("Keep a few words on the card before saving.");
      input.focus();
      return;
    }
    taskList.edit(index, task);
    persist("Task updated and filed back into your list.");
    $("task").focus();
  };
  form.append(label, input, save, cancel);
  row.append(form);
  input.focus();
  input.select();
};
window.onload = function () {
  $("add-form").onsubmit = addToTaskList;
  $("clear_tasks").onclick = clearTaskList;
  taskList.deleteClickHandler = deleteFromTaskList;
  taskList.editClickHandler = editTaskListItem;
  taskList.displayDiv = $("tasks");
  try {
    taskList.load().display();
  } catch (_) {
    taskList.display();
    announce(
      "This browser cannot read saved tasks. You can still use this desk while the tab stays open.",
    );
  }
};
