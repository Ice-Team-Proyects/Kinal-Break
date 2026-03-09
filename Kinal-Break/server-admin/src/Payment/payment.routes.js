import { Router } from "express";
import { validateCreatePayment, validatePaymentId } from "../../middlewares/validators/payment.validator.js";
import {
    createPayment,
    getPayments,
    getPaymentByOrder,
    financialReport,
    removePayment,
    restorePaymentController,
    setUnpaid
} from "./payment.controller.js";

const router = Router();

router.post(
    "/",
    validateCreatePayment,
    createPayment
);
router.get(
    "/",
    getPayments
);
router.get(
    "/order/:orderId",
    getPaymentByOrder
);
router.get(
    "/report/financial",
    financialReport
);
router.patch(
    "/restore/:id",
    validatePaymentId,
    restorePaymentController
);
router.patch(
    "/unpaid/:id",
    validatePaymentId,
    setUnpaid
);

router.patch("/unpaid/:id", setUnpaid);

export default router;