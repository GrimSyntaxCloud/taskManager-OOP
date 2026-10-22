# Object-Oriented Task Manager

A JavaScript coursework task list demonstrating object factories, prototypes and browser persistence. Add, alphabetically sort, edit, remove and clear tasks.

[Live demo](https://grimsyntaxcloud.github.io/taskManager-OOP/) · [Portfolio](https://grimsyntaxcloud.github.io/)

## What it does

Tasks persist in this browser under the tasks_11 localStorage key. Legacy pipe-separated tasks remain readable; new saves use versioned JSON so a task containing a literal pipe stays intact. Task content is rendered as text rather than HTML. Cancelling an edit leaves the task unchanged.

## How it works

The interface is static HTML and CSS, with native JavaScript in `library_task.js, library_tasklist.js, library_storage.js and task_list.js`. There are no npm dependencies, API keys, accounts, backend services or paid libraries.

This is a browser-local exercise, not a shared account system. Clearing browser storage removes its saved list. Storage restrictions or a full browser quota can prevent saving; there is no cloud backup.

## Run locally

Use Python 3 to serve this directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/. No package installation is required to use the app.

## Verify changes

With Node.js 22 or newer:

```sh
node --test test/*.test.mjs
```

The regression tests cover the repaired behavior using lightweight DOM stand-ins. They do not replace a browser layout check. GitHub Actions runs them on pushes and pull requests. Dependabot checks the Actions used by CI weekly; there is no application dependency manifest to scan.

## Hosting and provenance

GitHub Pages serves the default branch for free. This remains an educational project by Andres Macias; the original exercise structure is retained. The October 2026 maintenance pass documents local setup and adds targeted correctness fixes and regression coverage without redesigning the interface.
