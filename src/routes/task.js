import express from 'express';
import requireAuth from '../middlewares/requireAuth.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';

const taskRouter = express.Router();

// All routes below require authentication
taskRouter.use(requireAuth);

// Create a new task
taskRouter.post('/', createTask);

// Get tasks with search, filter, pagination
taskRouter.get('/', getTasks);

// Get a single task
taskRouter.get('/:id', getTaskById);

// Update a task
taskRouter.put('/:id', updateTask);

// Delete a task
taskRouter.delete('/:id', deleteTask);

export default taskRouter;
