const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API routes
let tasks = [];
let id = 1;

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = { id: id++, text: req.body.text, completed: false };
    tasks.push(task);
    res.status(201).json(task);
});

app.patch('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// Catch-all handler for any request to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
