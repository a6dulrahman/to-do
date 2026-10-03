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
const toDoForm = document.querySelector('dialog.to-do form');
const cancelToDoBtn = document.querySelector('#cancel-to-do');

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
    node.querySelectorAll('svg').forEach((svg) => {
      svg.setAttribute('class', `${projects[i]}`);
    });
    aside.append(node);
  }

  const addToDoBtns = document.querySelectorAll('.added svg:first-child');
  addToDoBtns.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      addToDoDialog.showModal();
      toDoForm.setAttribute('id', elem.classList.value);
    });
  });

  const toggleToDos = document.querySelectorAll('.container svg + svg');
  toggleToDos.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      const todos = JSON.parse(
        localStorage.getItem(e.target.classList.value),
      ).todos;

      const ul =
        e.target.parentElement.parentElement.parentElement.querySelector('ul');

      ul.replaceChildren();

      ul.toggleAttribute('hidden');
      todos.forEach((todo) => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;

        li.addEventListener('click', (e) => {
          const main = document.querySelector('main');
          main.replaceChildren();

          const todoTpl = document
            .querySelector('#to-do-tpl')
            .content.cloneNode(true);

          const project =
            e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
              'svg',
            ).classList.value;

          const todo = JSON.parse(localStorage.getItem(project)).todos.find(
            (todo) => {
              return todo.id === li.dataset.id;
            },
          );
          console.log(todo);

          todoTpl.querySelector('svg').id = li.dataset.id;
          todoTpl.querySelector('.to-do.title').textContent = todo.title;
          todoTpl.querySelector('.to-do.description').textContent =
            todo.description;
          todoTpl.querySelector('.to-do.date').textContent = todo.dueDate;
          todoTpl.querySelector('.to-do.priority').textContent = todo.priority;

          main.append(todoTpl);

          const editToDo = document.querySelector('#display-to-do svg');
          editToDo.addEventListener('click', (e) => {
            const projectName = project;
            const formTpl = document
              .querySelector('#edit-to-do')
              .content.cloneNode(true);

            main.replaceChildren(formTpl);

            const editForm = document.querySelector('main form#edit-to-do');
            editForm.id = editToDo.id;

            editForm.addEventListener('submit', (e) => {
              e.preventDefault();

              const formData = new FormData(editForm);

              const entries = Object.fromEntries(formData);
              entries.id = editForm.id;
              const project = JSON.parse(localStorage.getItem(projectName));
              const toDoIndex = project.todos.findIndex((todo) => {
                return todo.id === entries.id;
              });

              project.todos.splice(toDoIndex, 1);
              project.todos.push(entries);
              localStorage.setItem(projectName, JSON.stringify(project))

              displayProjects();
              main.replaceChildren()
            });

          });
        });

        const title = document.createElement('span');
        title.textContent = todo.title;

        const date = document.createElement('span');
        date.textContent = todo.dueDate;

        const priority = document.createElement('div');
        if (todo.priority === 'low') {
          priority.style.backgroundColor = 'green';
        } else if (todo.priority === 'medium') {
          priority.style.backgroundColor = 'orange';
        } else priority.style.backgroundColor = 'red';

        const div = document.createElement('div');
        div.append(title, date);

        li.append(div, priority);
        ul.append(li);
      });
    });
  });

  const deleteBtns = document.querySelectorAll('svg + svg + svg');
  deleteBtns.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      localStorage.removeItem(elem.classList.value);
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

toDoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const entries = Object.fromEntries(data);
  const todo = new ToDo(
    entries.title,
    entries.description,
    entries['due-date'],
    entries.priority,
  );

  const project = JSON.parse(localStorage.getItem(toDoForm.id));
  project.todos.push(todo);
  localStorage.setItem(toDoForm.id, JSON.stringify(project));

  addToDoDialog.close();
});

cancelToDoBtn.addEventListener('click', (e) => {
  addToDoDialog.close();
});
