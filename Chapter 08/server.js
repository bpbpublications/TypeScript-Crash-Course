const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { loadData, saveData } = require('./utils');

const app = express();

app.use(express.json());
app.use(cors());

let tasks = [];

// Load initial data
loadData().then((data) => {
    tasks = data;
});

app.post('/tasks', async (req, res) => {
    const task = {
        id: uuidv4(),
        text: req.body.text,
        completed: false,
    };
    tasks.push(task);
    await saveData(tasks);
    res.status(201).send(task);
});

app.get('/tasks', (_req, res) => {
    res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (task) {
        res.send(task);
    } else {
        res.status(404).send();
    }
});

app.put('/tasks/:id', async (req, res) => {
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = req.body.text;
        tasks[taskIndex].completed = req.body.completed;
        await saveData(tasks);
        res.send(tasks[taskIndex]);
    } else {
        res.status(404).send();
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const taskIndex = tasks.findIndex(task => task.id === req.params.id);
    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1);
        await saveData(tasks);
        res.send(deletedTask[0]);
    } else {
        res.status(404).send();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
