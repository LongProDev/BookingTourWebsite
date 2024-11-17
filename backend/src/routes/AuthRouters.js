import express from "express";
import authController from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/change-password", authMiddleware, authController.changePassword);

export default router; 