import { Router } from "express";
import PaymentsController from "../controllers/payments.controller.js";
const router = Router();

router.post("/", PaymentsController.addPayment);
router.get("/", PaymentsController.getPayments);
router.get("/:id", PaymentsController.getPaymentById);
router.delete("/:id", PaymentsController.deletePaymentById);
router.patch("/:id", PaymentsController.updatePaymentById);

export default router;
