import express from "express";
import tourController from "../controllers/TourController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);
router.get("/search/getFeaturedTours", tourController.getFeaturedTours);
router.get("/search/getTourBySearch", tourController.getTourBySearch);

// Admin only routes
router.use(authMiddleware, adminMiddleware);
router.get("/admin", tourController.getAdminTours);
router.post("/", tourController.createTour);
router.put("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

export default router;