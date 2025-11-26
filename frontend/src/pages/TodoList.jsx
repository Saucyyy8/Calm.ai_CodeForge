import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('calm_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    localStorage.setItem('calm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Check for reminders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.completed && task.reminderTime) {
          const reminder = new Date(task.reminderTime);
          // Check if reminder is due (within the last minute to avoid double alerts if interval is fast)
          if (reminder <= now && reminder > new Date(now.getTime() - 60000) && !task.notified) {
            // Send notification
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: `It's time to: ${task.text}`,
                icon: '/vite.svg' // Fallback icon
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  new Notification('Task Reminder', {
                    body: `It's time to: ${task.text}`
                  });
                }
              });
            }
            
            // Mark as notified so we don't spam
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, notified: true } : t));
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [tasks]);

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      reminderTime: reminderTime || null,
      notified: false
    };

    setTasks([task, ...tasks]);
    setNewTask('');
    setReminderTime('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
            // Trigger completion notification
             if (Notification.permission === 'granted') {
                new Notification('Great Job!', {
                  body: `You completed: ${task.text}`,
                });
              }
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="todo-container">
      <header className="todo-header">
        <div className="logo">Calm.ai</div>
        <h1>My Tasks</h1>
        <Link to="/dashboard" className="back-btn">Back to Dashboard</Link>
      </header>

      <div className="todo-content">
        <form className="add-task-card" onSubmit={addTask}>
          <input
            type="text"
            className="task-input"
            placeholder="What do you need to do?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            type="datetime-local"
            className="reminder-input"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            title="Set a reminder"
          />
          <button type="submit" className="add-btn">Add Task</button>
        </form>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-left">
                  <div className="checkbox-wrapper" onClick={() => toggleComplete(task.id)}>
                    <div className="custom-checkbox">
                      {task.completed && <span>✓</span>}
                    </div>
                  </div>
                  <span className="task-text">{task.text}</span>
                </div>
                
                <div className="task-meta">
                  {task.reminderTime && (
                    <div className="reminder-badge" title="Reminder set">
                      ⏰ {formatTime(task.reminderTime)}
                    </div>
                  )}
                  <button className="delete-btn" onClick={() => deleteTask(task.id)} title="Delete task">
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
