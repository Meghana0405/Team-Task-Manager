const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getUsers,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.get("/users", authMiddleware, getUsers);

module.exports = router;