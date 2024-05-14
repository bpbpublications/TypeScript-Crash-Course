import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { loadData, saveData, Task } from './utils';

const app = express();

app.use(express.json());
app.use(cors());

let tasks: Task[] = [];

loadData().then((data: Task[]) => {
    tasks = data;
});

app.post('/tasks', async (req: Request, res: Response) => {
    const task: Task = {
        id: uuidv4(),
        text: req.body.text,
        completed: false,
    };
    tasks.push(task);
    await saveData(tasks);
    res.status(201).send(task);
});

app.get('/tasks', (_req: Request, res: Response) => {
    res.send(tasks);
});

app.get('/tasks/:id', (req: Request, res: Response) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (task) {
        res.send(task);
    } else {
        res.status(404).send();
    }
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (task) {
        task.text = req.body.text;
        task.completed = req.body.completed;
        await saveData(tasks);
        res.send(task);
    } else {
        res.status(404).send();
    }
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
    const index = tasks.findIndex(task => task.id === req.params.id);
    if (index !== -1) {
        const deletedTask = tasks.splice(index, 1);
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
