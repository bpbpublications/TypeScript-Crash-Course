import React, { useState, useEffect } from 'react';

function Task({ task, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
      onSave(task.id, text, completed);
      toggleEdit();
  }

  const handleDelete = () => onDelete(task.id);

  return (
      <li>
          <input 
              type="checkbox" 
              checked={completed} 
              onChange={e => setCompleted(e.target.checked)} 
          />
          {isEditing ? (
              <input 
                  type="text" 
                  value={text} 
                  onChange={e => setText(e.target.value)} 
              />
          ) : (
              <span>{text}</span>
          )}
          <button onClick={isEditing ? handleSave : toggleEdit}>
              {isEditing ? 'Save' : 'Edit'}
          </button>
          <button onClick={handleDelete}>Delete</button>
      </li>
  )
}

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Load tasks from local storage on component mount
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (Array.isArray(storedTasks)) {
            setTasks(storedTasks);
        }
    }, []);

    const addTask = (text) => {
        const task = {
            id: Math.random(), // Note: replace this with a proper unique id generator
            text,
            completed: false,
            createdAt: new Date(),
        };
        setTasks([task, ...tasks]);
    }

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    }

    const saveTask = (id, text, completed) => {
        const updatedTasks = tasks.map((task) => task.id === id ? { ...task, text, completed } : task);
        setTasks(updatedTasks);
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        addTask(newTask);
        setNewTask("");
    }

    // Update local storage whenever tasks array is updated
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    return (
        <div>
            <form onSubmit={onFormSubmit}>
                <input 
                    type="text" 
                    value={newTask} 
                    onChange={e => setNewTask(e.target.value)} 
                />
                <button type="submit">Add task</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <Task 
                        key={task.id} 
                        task={task} 
                        onSave={saveTask} 
                        onDelete={deleteTask} 
                    />
                ))}
            </ul>
        </div>
    )
}



export default App;
