import express from 'express';
import { tasksData } from './tasksData';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();


router.get('/:id', (req, res) => {
    const { id } = req.params;
    const task = tasksData.tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    return res.status(200).json(task);
});


router.post('/', (req, res) => {
    const { title, description, deadline, priority, done } = req.body;
    
    if (!title || !deadline) {
        return res.status(400).json({ status: 400, message: 'Title and deadline are required.' });
    }
    
    const newTask = {
        id: uuidv4(),
        title,
        description,
        deadline,
        priority: priority || 'medium', 
        done: done || false, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    tasksData.tasks.push(newTask);
    tasksData.total_results++; 
    return res.status(201).json(newTask);
});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    
    const updatedTask = {
        ...tasksData.tasks[taskIndex],
        ...req.body,
        updated_at: new Date().toISOString() 
    };
    
    tasksData.tasks[taskIndex] = updatedTask;
    return res.status(200).json(updatedTask);
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    
    tasksData.tasks.splice(taskIndex, 1); 
    tasksData.total_results--; 
    return res.status(204).send(); 
});

export default router;
