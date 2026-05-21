const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Validation middleware
const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("projectId").trim().notEmpty().withMessage("Project ID is required"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid status"),
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];

const taskUpdateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid status"),
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];

router.post(
  "/",
  authMiddleware,
  taskValidation,
  createTask
);

router.get(
  "/",
  authMiddleware,
  getTasks
);

router.get(
  "/:id",
  authMiddleware,
  getTaskById
);

router.put(
  "/:id",
  authMiddleware,
  taskUpdateValidation,
  updateTask
);

router.delete(
  "/:id",
  authMiddleware,
  deleteTask
);

module.exports = router;