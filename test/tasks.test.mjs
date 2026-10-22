import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

function fixture(initial = "Existing|Another") {
  let stored = initial;
  class Element {
    constructor() {
      this.children = [];
      this.dataset = {};
      this.attributes = {};
      this.value = "";
    }
    append(...children) {
      this.children.push(...children);
    }
    replaceChildren(...children) {
      this.children = children;
    }
    setAttribute(key, value) {
      this.attributes[key] = value;
    }
    removeAttribute(key) {
      delete this.attributes[key];
    }
    focus() {
      this.focused = true;
    }
    select() {}
    querySelector() {
      return null;
    }
    querySelectorAll() {
      return [];
    }
  }
  const elements = Object.fromEntries(
    ["tasks", "task", "task-count", "clear_tasks", "feedback", "add-form"].map(
      (id) => [id, new Element()],
    ),
  );
  const context = vm.createContext({
    window: {},
    document: {
      getElementById: (id) => elements[id],
      createElement: () => new Element(),
    },
    localStorage: {
      getItem: () => stored,
      setItem: (_, value) => {
        stored = value;
      },
    },
  });
  for (const file of [
    "library_storage.js",
    "library_native_objects.js",
    "library_task.js",
    "library_tasklist.js",
    "task_list.js",
  ]) {
    vm.runInContext(
      fs.readFileSync(new URL("../" + file, import.meta.url), "utf8"),
      context,
    );
  }
  context.window.onload();
  return { context, elements, stored: () => stored };
}
test("legacy tasks load and version-1 JSON preserves pipes and HTML text", () => {
  const { context } = fixture();
  const storage = context.getTaskStorage("tasks_11");
  assert.deepEqual(Array.from(storage.get()), ["Existing", "Another"]);
  storage.set(["Read A | B", "<img src=x>"]);
  assert.deepEqual(Array.from(storage.get()), ["Read A | B", "<img src=x>"]);
  storage.clear();
  assert.equal(storage.get().length, 0);
});
test("task validation rejects cancelled input and whitespace", () => {
  const { context } = fixture();
  assert.equal(context.getTask(null).isValid(), false);
  assert.equal(context.getTask("   ").isValid(), false);
  assert.equal(context.getTask("Write tests").isValid(), true);
});
test("inline edit cancellation leaves task and persistence unchanged", () => {
  const { context, elements, stored } = fixture();
  context.editTaskListItem.call({ dataset: { index: "0" } });
  const form = elements.tasks.children[0].children[0];
  form.children[1].value = "Discard this change";
  form.children[3].onclick();
  assert.deepEqual(Array.from(context.taskList.tasks), ["Another", "Existing"]);
  assert.equal(stored(), "Existing|Another");
});
test("inline edit saves and re-sorts, while blank edits keep the previous task", () => {
  const { context, elements, stored } = fixture();
  context.editTaskListItem.call({ dataset: { index: "0" } });
  let form = elements.tasks.children[0].children[0];
  form.children[1].value = "   ";
  form.onsubmit({ preventDefault() {} });
  assert.equal(context.taskList.tasks[0], "Another");
  form.children[1].value = "Zebra | sketch";
  form.onsubmit({ preventDefault() {} });
  assert.deepEqual(JSON.parse(stored()), {
    version: 1,
    tasks: ["Existing", "Zebra | sketch"],
  });
});
test("add, delete and clear preserve alphabetical behavior and count", () => {
  const { context, elements, stored } = fixture("");
  elements.task.value = "Zebra";
  context.addToTaskList();
  elements.task.value = "Apple";
  context.addToTaskList();
  assert.deepEqual(Array.from(context.taskList.tasks), ["Apple", "Zebra"]);
  assert.equal(elements["task-count"].textContent, "02");
  context.deleteFromTaskList.call({ dataset: { index: "0" } });
  assert.deepEqual(JSON.parse(stored()).tasks, ["Zebra"]);
  context.clearTaskList();
  assert.equal(stored(), "");
  assert.equal(elements["clear_tasks"].disabled, true);
});
test("user markup remains literal text in task cards", () => {
  const { context, elements } = fixture("");
  elements.task.value = '<img src=x onerror="alert(1)">';
  context.addToTaskList();
  assert.equal(
    elements.tasks.children[0].children[1].textContent,
    '<img src=x onerror="alert(1)">',
  );
});
