"use strict";

var taskPrototype = {
  isValid: function () {
    return typeof this.text === "string" && this.text.trim().length > 0;
  },
  toString: function () {
    return this.text.capitalize();
  },
};

var getTask = function (taskText) {
  var task = Object.create(taskPrototype);
  task.text = taskText;
  return task;
};
