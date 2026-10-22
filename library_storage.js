"use strict";

var localStoragePrototype = {
  get: function () {
    return localStorage.getItem(this.key);
  },
  set: function (str) {
    localStorage.setItem(this.key, str);
  },
  clear: function () {
    localStorage.setItem(this.key, "");
  },
};

var stringArrayStoragePrototype = Object.create(localStoragePrototype);

// the get and set methods use the functionality of the overridden methods
stringArrayStoragePrototype.get = function () {
  var str = localStoragePrototype.get.call(this) || "";
  if (str === "") return [];
  try {
    var saved = JSON.parse(str);
    if (
      saved &&
      saved.version === 1 &&
      Array.isArray(saved.tasks) &&
      saved.tasks.every(function (task) {
        return typeof task === "string";
      })
    ) {
      return saved.tasks;
    }
  } catch (_) {
    // Older versions used a pipe-separated string, not JSON.
  }
  return str.split("|");
};

stringArrayStoragePrototype.set = function (arr) {
  if (Array.isArray(arr)) {
    var str = JSON.stringify({ version: 1, tasks: arr });
    localStoragePrototype.set.call(this, str);
  }
};

//factory function
var getTaskStorage = function (key) {
  var storage = Object.create(stringArrayStoragePrototype);
  storage.key = key;
  return storage; // return storage object with key property
};
