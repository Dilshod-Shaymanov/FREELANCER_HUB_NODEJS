import { Router } from "express";
import ContractController from "../controllers/contract.controller.js";
const router = Router();

router.post("/", ContractController.addContract);
router.get("/", ContractController.getContracts);
router.get("/:id", ContractController.getContractById);
router.delete("/:id", ContractController.deleteContractById);
router.patch("/:id", ContractController.updateContractById);

export default router;
