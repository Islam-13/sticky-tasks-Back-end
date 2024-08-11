import taskModel from "../../../db/models/task.model.js";
import { AppError, asyncHandler } from "../../utils/helpers.js";

export const createTask = asyncHandler(async (req, res, next) => {
  const task = await taskModel.create({ ...req.body, userId: req.user._id });

  if (!task) return next(new AppError("Error creating task", 500));

  res.status(201).json({
    status: "success",
    message: "Task added successfully",
    data: task,
  });
});

export const getAllTasks = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find();

  if (!tasks) return next(new AppError("Error getting tasks", 500));

  res.status(201).json(tasks);
});

export const getTasks = asyncHandler(async (req, res, next) => {
  let tasks;

  if (req.query?.search) {
    tasks = await taskModel.find({
      userId: req.user._id,
      title: { $regex: req.query.search, $options: "i" },
    });
  } else tasks = await taskModel.find({ userId: req.user._id });

  if (!tasks) return next(new AppError("Error getting tasks", 500));

  res.status(201).json(tasks);
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;

  const task = await taskModel.findOneAndUpdate(
    { _id, userId: req.user._id },
    req.body,
    { new: true }
  );

  !task
    ? next(new AppError("Task not found", 404))
    : res.status(201).json({
        status: "success",
        message: "Task updated successfully",
        data: task,
      });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const task = await taskModel.findOneAndDelete({ _id, userId: req.user._id });

  !task
    ? next(new AppError("Task not found", 404))
    : res.status(201).json({
        status: "success",
        message: "Task deleted successfully",
      });
});

export const getTasksByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;

  const tasks = await taskModel.find({ userId: req.user._id, category });

  if (!tasks) return next(new AppError("Error getting tasks", 500));

  res.status(201).json(tasks);
});

export const clearTasks = asyncHandler(async (req, res, next) => {
  const { category } = req.params;

  if (category == "all") {
    const tasks = await taskModel.deleteMany({ userId: req.user._id });
    if (!tasks) return next(new AppError("Error clearing tasks", 500));

    return res.status(201).json({
      status: "success",
      message: "Tasks cleared successfully",
    });
  }

  const tasks = await taskModel.deleteMany({ userId: req.user._id, category });
  if (!tasks) return next(new AppError("Error clearing tasks", 500));

  res.status(201).json({
    status: "success",
    message: `${category} tasks cleared successfully`,
  });
});
