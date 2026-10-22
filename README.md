# Object-Oriented Task Manager

A small, browser-local task desk by Andres Macias. Warm paper, coral notes and numbered index cards give an original JavaScript coursework exercise a tactile home. Add a task, revise it in place, remove it or clear the desk. The list automatically files tasks alphabetically.

[Live demo](https://grimsyntaxcloud.github.io/taskManager-OOP/) · [Portfolio](https://grimsyntaxcloud.github.io/)

## What you can do

- Add tasks by button or Enter, edit inline, and cancel with the Cancel button or Escape.
- Delete individual tasks or clear the entire list.
- Reload the page and keep using the same saved list in the same browser.
- Use the interface with a keyboard, a narrow mobile screen or reduced-motion preferences.

Card arrivals and button presses use short CSS transitions. There is no continuous animation, external font request or animation library. The empty desk intentionally starts blank: screenshots may show fictional tasks added for demonstration, but the app does not seed tasks into your list.

## How it works

This is static HTML, CSS and native JavaScript. It retains the original object-oriented structure:

| File                        | Responsibility                                                                 |
| --------------------------- | ------------------------------------------------------------------------------ |
| `library_task.js`           | Task factory and shared validation/string methods through `taskPrototype`      |
| `library_tasklist.js`       | Task collection, alphabetical sorting, CRUD operations and safe text rendering |
| `library_storage.js`        | Storage prototype inheritance and versioned browser persistence                |
| `library_native_objects.js` | Original capitalization helper                                                 |
| `task_list.js`              | Form events, inline editing, keyboard controls and save feedback               |

The storage key is still **`tasks_11`**. New writes use `{ "version": 1, "tasks": ["Task text"] }`. Legacy pipe-separated lists remain readable and become JSON on the next save, so newly entered tasks may contain literal pipes. User content is rendered with `textContent`, never interpreted as HTML.

This is a personal browser-local exercise, not a shared account or database app. Tasks have **no automatic expiry**. Clearing this list or browser storage removes the saved tasks, and another browser/device will have its own list. If browser storage is blocked or full, the interface explains that changes remain in the current tab but cannot be saved. There is no cloud backup.

## Run locally

With Python 3, from this directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/. No build step or package installation is required.

## Verify changes

With Node.js 22 or newer:

```sh
node --test test/*.test.mjs
```

Tests cover legacy/JSON storage, literal pipes and markup, whitespace validation, canceled edits, save/re-sort, add/delete/clear and counts. They use lightweight DOM stand-ins; browser checks separately cover desktop/mobile layouts, keyboard interactions and reload persistence. GitHub Actions runs the tests on pushes and pull requests. Dependabot checks Actions weekly. There are no application package dependencies to audit.

## Hosting and provenance

GitHub Pages serves the default branch for free. No accounts, API keys, backend services or paid libraries are needed. This project began as an object-oriented JavaScript coursework task manager. In October 2026, Andres collaborated with an AI coding assistant to redesign the interface and improve inline editing, accessibility, persistence feedback and regression coverage while retaining the original task features and prototype-based organization.
