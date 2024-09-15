import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [isPomodoroActive, setIsPomodoroActive] = useState(false);
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
    const [timeRemaining, setTimeRemaining] = useState(pomodoroTime);

    useEffect(() => {
        // Load tasks from local storage
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(savedTasks);
    }, []);

    useEffect(() => {
        let timer;
        if (isPomodoroActive && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            // Reset timer and alert user
            alert('Pomodoro session complete! Take a break.');
            setIsPomodoroActive(false);
            setTimeRemaining(pomodoroTime);
        }
        return () => clearInterval(timer);
    }, [isPomodoroActive, timeRemaining]);

    const addTask = (e) => {
        e.preventDefault();
        if (taskInput.trim() === '') return;

        const newTask = {
            text: taskInput.trim(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        setTaskInput('');
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const deleteTask = (taskToDelete) => {
        const updatedTasks = tasks.filter(task => task.text !== taskToDelete.text);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const startPomodoro = () => {
        setIsPomodoroActive(true);
        setTimeRemaining(pomodoroTime);
    };

    const resetPomodoro = () => {
        setIsPomodoroActive(false);
        setTimeRemaining(pomodoroTime);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
        <div className="App">
            <h1>To-Do List & Pomodoro Timer</h1>
            <form onSubmit={addTask}>
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Add a new task"
                />
                <button type="submit">Add</button>
            </form>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <div>
                            <strong>{task.text}</strong><br />
                            <small>{task.date} {task.time}</small>
                        </div>
                        <button onClick={() => deleteTask(task)} className="delete">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <div className="pomodoro">
                <h2>Pomodoro Timer</h2>
                <div className="timer">
                    <span>{formatTime(timeRemaining)}</span>
                </div>
                <button onClick={startPomodoro} disabled={isPomodoroActive}>
                    Start Pomodoro
                </button>
                <button onClick={resetPomodoro}>
                    Reset Timer
                </button>
            </div>
        </div>
    );
}

export default App;
