// todos.js

const Project = function (name) {
  if (!new.target) {
    throw Error("can't call Project without `new` keyword!");
  }
  this.name = name;
  this.todos = [];
  localStorage.setItem(this.name, JSON.stringify(this));
};

Project.listProjects = () => {
  return Object.keys(localStorage);
};

Project.prototype.addToDo = function (todo) {
  this.todos.push(todo);
};

Project.prototype.removeToDo = function (todoId) {
  const index = this.todos.findIndex((item) => {
    item.id === todoId;
  });

  this.todos.splice(index, 1);
};

class ToDo {
  constructor(title, description, dueDate, priority, notes) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = [];
  }
  addToCheckList(text) {
    this.checklist.push({ text, completed: false });
  }
}

const deleteProject = function (projectId) {
  const index = Projects.findIndex((item) => {
    item.id === projectId;
  });

  Projects.splice(index, 1);
};

export default deleteProject;

export { ToDo, Project };
