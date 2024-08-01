import { Router } from "express";
import * as TC from "./tasks.controller.js";
import * as TV from "./tasks.validate.js";
import auth from "../../../middleware/auth.js";
import { params, systemRoles } from "../../utils/helpers.js";
import validation from "../../../middleware/validation.js";

const router = Router();

router.post(
  "/",
  auth(Object.values(systemRoles)),
  validation(TV.createTask),
  TC.createTask
);

router.get("/", auth([systemRoles.admin]), TC.getAllTasks);

router.get("/getTasks", auth(Object.values(systemRoles)), TC.getTasks);

router.get(
  "/:category",
  auth(Object.values(systemRoles)),
  validation(TV.getTasksByCategory),
  TC.getTasksByCategory
);

router.put(
  "/:_id",
  auth(Object.values(systemRoles)),
  validation(TV.updateTask),
  TC.updateTask
);

router.delete(
  "/:_id",
  auth(Object.values(systemRoles)),
  validation(params),
  TC.deleteTask
);

// router.delete("/", auth(Object.values(systemRoles)), TC.clearTasks);

export default router;
