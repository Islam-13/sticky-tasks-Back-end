import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { AppError } from "./src/utils/helpers.js";
import connectionDB from "./db/connectionDB.js";
import usersRouter from "./src/modules/users/users.routes.js";
import tasksRouter from "./src/modules/tasks/tasks.routes.js";

dotenv.config({ path: path.resolve("config/.env") });

const app = express();
const port = process.env.PORT || 3000;

connectionDB();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) =>
  res.status(201).json({ message: "Welcome to STICKY TASKS..." })
);

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

app.use("*", (req, res, next) =>
  next(new AppError(`Url ${req.originalUrl} not found`, 404))
);

app.use((err, req, res, next) =>
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message,
  })
);

app.listen(port, () => console.log(`server is running on port ${port}`));
