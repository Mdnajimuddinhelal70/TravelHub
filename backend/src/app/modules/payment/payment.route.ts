import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/init-payment/:bookingId", PaymentController.initPayment);

router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);

router.get("/success", PaymentController.successPayment);
router.get("/fail", PaymentController.failPayment);
router.get("/cancel", PaymentController.cancelPayment);

router.get(
  "/invoice/:paymentId",
  checkAuth(...Object.values(Role)),
  PaymentController.getInvoiceDownloadUrl,
);
router.get(
  "/by-transaction/:transactionId",
  PaymentController.getPaymentByTransactionId,
);
router.post("/validate-payment", PaymentController.validatePayment);

export const PaymentRoutes = router;
