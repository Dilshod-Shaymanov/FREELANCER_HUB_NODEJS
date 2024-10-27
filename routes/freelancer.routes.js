import { Router } from "express";
import FreelancerController from "../controllers/freelancer.controller.js";
import freelancer_police from "../middleware/freelancer_police.js";

const router = Router();

router.post("/", FreelancerController.addFreelancer);
router.post("/login", FreelancerController.freelancerLogin);
router.get("/logout", FreelancerController.freelancerLogout);
router.get("/refresh", FreelancerController.freelancerRefreshToken);
router.get("/activate/:link", FreelancerController.freelancerActivate);
router.get("/", freelancer_police, FreelancerController.getFreelancers);
router.get("/:id",freelancer_police, FreelancerController.getFreelancerById);
router.delete("/:id",freelancer_police, FreelancerController.deleteFreelancerById);
router.patch("/:id",freelancer_police, FreelancerController.updateFreelancerById);

export default router;
