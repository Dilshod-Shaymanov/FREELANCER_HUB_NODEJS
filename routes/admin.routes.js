import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import adminPolice from "../middleware/admin_police.js";
import creator_police from "../middleware/creator_police.js";

const router = Router();

router.post("/",creator_police, AdminController.addAdmin);
router.post("/login", AdminController.loginAdmin);
router.post("/reset-password", AdminController.resetPassword);
router.get("/resetadminpassword", AdminController.requestPasswordReset);
router.get("/logout", AdminController.logoutAdmin);
router.get("/refresh", AdminController.adminRefreshToken);
router.get("/", creator_police, AdminController.getAdmins);
router.get("/:id", adminPolice, AdminController.getAdminById);
router.delete("/:id", adminPolice, AdminController.adminDeleteById);
router.patch("/:id", adminPolice, AdminController.adminUpdateById);

export default router;
