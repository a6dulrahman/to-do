/**
 * TODOS are going to be an objects
 *  MINIMUM PROPERTIES: 'title, description, dueDate, priority'.
 *    ADDITION PROPERTIES: 'notes, checklist'.
 * DEFAULT PROJECT: all todos go there.
 *  ADD A NEW PROJECTS: user can add new projects and put todos there also.
 * SEPARATE APPLICATION LOGIC OF UI 'DOM' LOGIC.
 * UI: should be able to do the following:
 *  1. show all the projects
 *  2. expand each projects to see the todos
 *  3. expand a single todo to see/ edit details
 *  4. delete a todo
 */

import { ToDo, Project } from './todos.js';
import deleteProject from './todos.js';

const addProject = document.querySelector('aside svg');
const dialog = document.querySelector('dialog');
const projectNameInput = document.querySelector('#name');
const submitNewProject = document.querySelector('form button + button');
const cancel = document.querySelector('button#cancel');

addProject.addEventListener('click', (e) => {
  dialog.showModal();
});

cancel.addEventListener('click', (e) => {
  dialog.close;
});

submitNewProject.addEventListener('click', (e) => {
  e.preventDefault();

  const check = Project.listProjects().some((project) => {
    return project.name === projectNameInput.value;
  });

  if (!check) {
    new Project(projectNameInput.value);
    dialog.close();
  } else {
    const p = document.createElement('p')
    p.textContent = `'${projectNameInput.value}' already token!`
    p.style.color = 'red'
    projectNameInput.after(p)
  }
});
