import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
let stored = "Existing|Another";
const context = vm.createContext({
  window: {},
  localStorage: {
    getItem: () => stored,
    setItem: (_, v) => {
      stored = v;
    },
  },
  prompt: () => null,
  alert: () => {
    throw new Error("Cancel should not alert");
  },
});
for (const file of [
  "library_storage.js",
  "library_native_objects.js",
  "library_task.js",
  "task_list.js",
])
  vm.runInContext(
    fs.readFileSync(new URL("../" + file, import.meta.url), "utf8"),
    context,
  );
test("legacy tasks load and JSON saves preserve literal pipes and HTML text", () => {
  const storage = context.getTaskStorage("tasks_11");
  assert.deepEqual(Array.from(storage.get()), ["Existing", "Another"]);
  storage.set(["Read A | B", "<img src=x>"]);
  assert.deepEqual(Array.from(storage.get()), ["Read A | B", "<img src=x>"]);
  storage.clear();
  assert.equal(storage.get().length, 0);
});
test("task validation handles cancelled input and whitespace", () => {
  assert.equal(context.getTask(null).isValid(), false);
  assert.equal(context.getTask("   ").isValid(), false);
  assert.equal(context.getTask("Write tests").isValid(), true);
});
test("cancelling an edit leaves the existing task untouched", () => {
  context.taskList = { tasks: ["Keep me"] };
  assert.equal(context.editTaskListItem.call({ title: "0" }), false);
  assert.deepEqual(context.taskList.tasks, ["Keep me"]);
});
