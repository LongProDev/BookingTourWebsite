const express = require("express");
const router = express.Router();
const tourController = require("../controllers/TourController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);

// Protected routes (admin only)
router.use(authMiddleware);
router.post("/", tourController.createTour);
router.put("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;