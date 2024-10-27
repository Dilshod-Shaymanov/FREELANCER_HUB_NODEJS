import { Router } from "express";
import clientController from "../controllers/client.controller.js";
import client_police from "../middleware/client_police.js";

const router = Router();

router.post("/", clientController.addClient);
router.post("/login", clientController.clientLogin);
router.get("/logout", clientController.clientLogout);
router.get("/activate/:link", clientController.clientActivate);

router.get("/refresh", clientController.clientRefreshToken);

router.get("/", client_police, clientController.getClients);
router.get("/:id", client_police, clientController.getClientById);
router.delete("/:id", client_police, clientController.clientDeleteById);
router.patch("/:id", client_police, clientController.clientUpdateById);

export default router;
