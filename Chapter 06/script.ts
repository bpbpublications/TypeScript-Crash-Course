// Define a type for our tasks
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Identify HTML Elements
const taskList = document.querySelector("#task-list") as HTMLUListElement;
const newTaskForm = document.querySelector("#new-task-form") as HTMLFormElement;
const newTaskInput = document.querySelector("#new-task-input") as HTMLInputElement;

// Initialize the tasks array
let tasks: Task[] = [];

// Helper function to save task and switch UI to non-edit mode
function saveAndExitEditMode(taskId: string, taskText: HTMLElement, editButton: HTMLButtonElement): void {
  saveTask(taskId);
  editButton.textContent = "Edit";
  taskText.contentEditable = "false";
}

// Helper function to handle button click event
function onEditButtonClick(taskText: HTMLElement, task: Task, editButton: HTMLButtonElement): void {
  if (editButton.textContent === 'Save') {
    saveAndExitEditMode(task.id, taskText, editButton);
  } else {
    editButton.textContent = "Save";
    taskText.contentEditable = "true";
    taskText.focus();
  }
}

// Function to handle keypress event
function onTaskTextEvent(event: KeyboardEvent, task: Task, editButton: HTMLButtonElement): void {
  if (event.type === "keydown" && event.keyCode === 13) {
    event.preventDefault();
    saveAndExitEditMode(task.id, event.target as HTMLElement, editButton);
  }
}

// Helper function to create a task element
function createTaskElement(task: Task): HTMLLIElement {
  const taskElement = document.createElement("li");
  taskElement.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.classList.add("task-checkbox");
  checkbox.addEventListener("change", () => saveTask(task.id));
  taskElement.appendChild(checkbox);

  const taskText = document.createElement("span");
  taskText.textContent = task.text;
  taskText.classList.add("task-text");
  taskElement.appendChild(taskText);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("task-edit");
  editButton.addEventListener("click", () => onEditButtonClick(taskText, task, editButton));
  taskElement.appendChild(editButton);

  taskText.addEventListener("keydown", (event) => onTaskTextEvent(event, task, editButton));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("task-delete");
  deleteButton.addEventListener("click", () => deleteTask(task.id));
  taskElement.appendChild(deleteButton);

  return taskElement;
}

// Manage Tasks
function addTask(text: string): void {
  const task = {
    id: self.crypto.randomUUID(),
    text,
    completed: false,
    createdAt: new Date(),
  };
  tasks.unshift(task);
  const taskElement = createTaskElement(task);
  taskList.prepend(taskElement);
  updateLocalStorage();
}

function deleteTask(id: string): void {
  tasks = tasks.filter((task) => task.id !== id);
  const taskElement = taskList.querySelector(`li[data-id="${id}"]`) as HTMLLIElement;
  taskList.removeChild(taskElement);
}

function saveTask(id: string): void {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    const taskElement = taskList.querySelector(`li[data-id="${id}"]`) as HTMLLIElement;
    const taskText = taskElement.querySelector(".task-text") as HTMLSpanElement;
    const taskCheckbox = taskElement.querySelector(".task-checkbox") as HTMLInputElement;
    task.text = taskText.textContent || '';
    task.completed = taskCheckbox.checked;
    updateLocalStorage();
  }
}

// Local Storage Management
function updateLocalStorage(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromLocalStorage(): void {
  const storedTasks = JSON.parse(localStorage.getItem("tasks") || '[]');
  if (Array.isArray(storedTasks)) {
    tasks = storedTasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }));
    tasks.forEach((task) => taskList.appendChild(createTaskElement(task)));
  }
}

// Event Listeners
newTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(newTaskInput.value);
  newTaskInput.value = "";
});

// Load tasks from local storage on document load
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

export {};
