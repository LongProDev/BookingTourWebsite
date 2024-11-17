import express from "express";
import userController from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", userController.createUser);

// Protected routes
router.use(authMiddleware);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
