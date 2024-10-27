import { Router } from "express";
import ReviewsController from "../controllers/reviews.controller.js";

const router = Router();

router.post("/", ReviewsController.addReview);
router.get("/", ReviewsController.getReviews);
router.get("/:id", ReviewsController.getReviewById);
router.delete("/:id", ReviewsController.deleteReviewById);
router.patch("/:id", ReviewsController.updateReviewById);

export default router;
