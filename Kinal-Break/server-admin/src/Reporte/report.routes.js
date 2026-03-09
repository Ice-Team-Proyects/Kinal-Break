import { Router } from "express";

import {
    totalSalesReport,
    dailySalesReport,
    monthlySalesReport,
    weeklySalesReport,
    topProductsReport,
    averageOrderReport,
    operationalReport,
    exportExcelReport,
    exportPDFReport
} from "./report.controller.js";

const router = Router();

router.get("/sales/total", totalSalesReport);
router.get("/sales/daily", dailySalesReport);
router.get("/sales/monthly", monthlySalesReport);

router.get("/sales/weekly", weeklySalesReport);
router.get("/products/top", topProductsReport);
router.get("/sales/average", averageOrderReport);
router.get("/metrics/operations", operationalReport);

router.get("/export/excel", exportExcelReport);
router.get("/export/pdf", exportPDFReport);

export default router;