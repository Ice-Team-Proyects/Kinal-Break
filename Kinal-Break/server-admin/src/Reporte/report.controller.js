import {
    getTotalSales,
    getDailySales,
    getMonthlySales
} from "./report.service.js";
import { exportSalesExcel } from "./report.service.js";
import { exportSalesPDF } from "./report.service.js";
import Payment from "../Payment/payment.model.js";


export const totalSalesReport = async (req, res) => {
    try {
        const report = await getTotalSales();
        res.json(report);
    } catch (error) {
        res.status(500).json({
            message: "Error generating total sales report"
        });
    }
};


export const dailySalesReport = async (req, res) => {
    try {
        const report = await getDailySales();
        res.json(report);
    } catch (error) {
        res.status(500).json({
            message: "Error generating daily report"
        });
    }
};


export const monthlySalesReport = async (req, res) => {
    try {
        const report = await getMonthlySales();
        res.json(report);
    } catch (error) {
        res.status(500).json({
            message: "Error generating monthly report"
        });
    }
};

export const weeklySalesReport = async (req, res) => {
    const report = await getWeeklySales();
    res.json(report);
};

export const topProductsReport = async (req, res) => {
    const report = await topProducts();
    res.json(report);
};
export const averageOrderReport = async (req, res) => {
    const report = await averageOrderValue();
    res.json(report);
};
export const operationalReport = async (req, res) => {
    const report = await operationalMetrics();
    res.json(report);
};

export const exportExcelReport = async (req, res) => {
    try {
        const workbook = await exportSalesExcel();

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=sales_report.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            message: "Error generating Excel report"
        });
    }
};

export const exportPDFReport = async (req, res) => {
    try {
        const payments = await Payment.find({ isDeleted: false });
        const doc = await exportSalesPDF(payments);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");

        doc.pipe(res);
        doc.end();
    } catch (error) {
        res.status(500).json({
            message: "Error generating PDF report"
        });
    }
};