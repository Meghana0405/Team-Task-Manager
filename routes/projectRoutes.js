const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController");

// Validation middleware
const projectValidation = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description").optional().trim(),
];

const projectUpdateValidation = [
  body("name").optional().trim().notEmpty().withMessage("Project name cannot be empty"),
  body("description").optional().trim(),
];

const memberValidation = [
  body("memberId").notEmpty().withMessage("Member ID is required"),
];

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  projectValidation,
  createProject
);

router.get(
  "/",
  authMiddleware,
  getProjects
);

router.get(
  "/:id",
  authMiddleware,
  getProjectById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  projectUpdateValidation,
  updateProject
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProject
);

router.post(
  "/:id/members",
  authMiddleware,
  roleMiddleware("admin"),
  memberValidation,
  addMember
);

router.delete(
  "/:id/members",
  authMiddleware,
  roleMiddleware("admin"),
  removeMember
);

module.exports = router;