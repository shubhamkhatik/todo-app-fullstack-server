import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import Task from "../models/task.model.js";

const taskRouter = express.Router();

// require authentication
taskRouter.use(requireAuth);

// Create a new task
taskRouter.post("/create", async (req, res) => {
  const { name, description, status } = req.body;

  if (!name || !description || !status) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  try {
    const task = new Task({
      name,
      description,
      status,
      user: req.user._id,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" ,error});
  }
});

// Get tasks with search, filter, pagination
taskRouter.get("/tasks", async (req, res) => {
  const { page = 1, limit = 10, status, search, date } = req.query;

  const query = { user: req.user._id };

  if (status) {
    query.status = status; // Filter by status (PENDING or DONE)
  }

  if (search) {
    query.name = { $regex: search, $options: "i" }; // Search by task name (case-insensitive)
  }

  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    query.createdAt = { $gte: startDate, $lte: endDate }; // Filter by tasks created within that day
  }

  try {
    const tasks = await Task.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // (newest first)

    const totalTasks = await Task.countDocuments(query); // require for frontend pagination
    res.json({
      tasks,
      totalTasks,
      page,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single task
taskRouter.get("/task/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, user: req.user._id }); //task id and user
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task
taskRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  try {
    const task = await Task.findOne({ _id: id, user: req.user._id }); //task id and user

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.name = name || task.name;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task
taskRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id }); //task id and user

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default taskRouter;
