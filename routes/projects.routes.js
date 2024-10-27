import { Router } from "express";
import ProjectsController from "../controllers/projects.controller.js";
const router = Router();

router.post("/", ProjectsController.addProject);
router.get("/", ProjectsController.getProjects);
router.get("/:id", ProjectsController.getProjectById);
router.delete("/:id", ProjectsController.deleteProjectById);
router.patch("/:id", ProjectsController.updateProjectById);

export default router;
