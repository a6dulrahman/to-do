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
import deleteProjectObject from './todos.js';

const aside = document.querySelector('aside');
const tpl = document.querySelector('#project-tpl');
const addProject = document.querySelector('aside svg');
const addProjectDialog = document.querySelector('dialog.project');
const projectNameInput = document.querySelector('#name');
const submitNewProject = document.querySelector('button[type=submit]');
const cancelProject = document.querySelector('#cancel-project');
const addToDoDialog = document.querySelector('dialog.to-do');
const cancelToDo = document.querySelector('#cancel-to-do');

if (!localStorage.getItem('main')) {
  new Project('main');
}

const clearProjects = function () {
  const projects = document.querySelectorAll('.added');
  projects.forEach((elem) => {
    elem.remove();
  });
};

const displayProjects = function () {
  const projects = Object.keys(localStorage);
  clearProjects();

  for (let i = 0; i < projects.length; i++) {
    const node = tpl.content.cloneNode(true);
    node.querySelector('p').textContent = projects[i];
    node.querySelector('svg + svg + svg').setAttribute('id', `${projects[i]}`);

    aside.append(node);
  }

  const addToDoBtns = document.querySelectorAll('.added svg:first-child');
  addToDoBtns.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      addToDoDialog.showModal();
    });
  });

  const deleteBtns = document.querySelectorAll('svg + svg + svg');
  deleteBtns.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      localStorage.removeItem(elem.id);
      displayProjects();
    });
  });
};

displayProjects();

addProject.addEventListener('click', (e) => {
  addProjectDialog.showModal();
});

cancelProject.addEventListener('click', (e) => {
  addProjectDialog.close;
});

addProjectDialog.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.preventDefault();
});

projectNameInput.addEventListener('keydown', (e) => {
  const error = addProjectDialog.querySelector('.error');
  if (error) error.remove();

  const empty = document.querySelector('.empty');
  if (empty) empty.remove();
});

submitNewProject.addEventListener('click', (e) => {
  e.preventDefault();

  if (!(projectNameInput.value.trim().length === 0)) {
    const check = Project.listProjects().some((project) => {
      return project === projectNameInput.value.trim();
    });

    if (!check) {
      new Project(projectNameInput.value);
      addProjectDialog.close();
    } else {
      const error = document.querySelector('.error');
      if (!error) {
        const p = document.createElement('p');
        p.classList.add('error');
        p.textContent = `'${projectNameInput.value}' already token!`;
        projectNameInput.insertAdjacentElement('afterend', p);
      }
    }
  } else {
    const empty = document.querySelector('.empty');
    if (!empty) {
      const p = document.createElement('p');
      p.classList.add('empty');
      p.textContent = 'Enter name for the project';
      p.style.color = 'red';
      projectNameInput.insertAdjacentElement('afterend', p);
    }
  }

  displayProjects();
});

cancelProject.addEventListener('click', (e) => {
  e.preventDefault;
  addProjectDialog.close();
});
