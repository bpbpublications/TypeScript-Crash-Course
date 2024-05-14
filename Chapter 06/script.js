"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Identify HTML Elements
const taskList = document.querySelector("#task-list");
const newTaskForm = document.querySelector("#new-task-form");
const newTaskInput = document.querySelector("#new-task-input");
// Initialize the tasks array
let tasks = [];
// Helper function to save task and switch UI to non-edit mode
function saveAndExitEditMode(taskId, taskText, editButton) {
    saveTask(taskId);
    editButton.textContent = "Edit";
    taskText.contentEditable = "false";
}
// Helper function to handle button click event
function onEditButtonClick(taskText, task, editButton) {
    if (editButton.textContent === 'Save') {
        saveAndExitEditMode(task.id, taskText, editButton);
    }
    else {
        editButton.textContent = "Save";
        taskText.contentEditable = "true";
        taskText.focus();
    }
}
// Function to handle keypress event
function onTaskTextEvent(event, task, editButton) {
    if (event.type === "keydown" && event.keyCode === 13) {
        event.preventDefault();
        saveAndExitEditMode(task.id, event.target, editButton);
    }
}
// Helper function to create a task element
function createTaskElement(task) {
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
function addTask(text) {
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
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    const taskElement = taskList.querySelector(`li[data-id="${id}"]`);
    taskList.removeChild(taskElement);
}
function saveTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        const taskElement = taskList.querySelector(`li[data-id="${id}"]`);
        const taskText = taskElement.querySelector(".task-text");
        const taskCheckbox = taskElement.querySelector(".task-checkbox");
        task.text = taskText.textContent || '';
        task.completed = taskCheckbox.checked;
        updateLocalStorage();
    }
}
// Local Storage Management
function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || '[]');
    if (Array.isArray(storedTasks)) {
        tasks = storedTasks.map(task => (Object.assign(Object.assign({}, task), { createdAt: new Date(task.createdAt) })));
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
