import Payment from "../Payment/payment.model.js";
import Order from "../Order/order.model.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const getTotalSales = async () => {
    const result = await Payment.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$amount" },
                totalTransactions: { $sum: 1 }
            }
        }
    ]);
    return result;
};

export const getDailySales = async () => {
    const result = await Payment.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                totalSales: { $sum: "$amount" },
                transactions: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": -1 }
        }
    ]);
    return result;
};

export const getMonthlySales = async () => {
    const result = await Payment.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                totalSales: { $sum: "$amount" },
                transactions: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.month": -1 }
        }
    ]);
    return result;
};

export const getWeeklySales = async () => {
    return await Payment.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $group: {
                _id: { week: { $week: "$createdAt" } },
                totalSales: { $sum: "$amount" },
                transactions: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.week": -1 }
        }
    ]);
};

export const topProducts = async () => {
    return await Order.aggregate([
        { $unwind: "$products" },
        {
            $group: {
                _id: "$products.productId",
                totalSold: { $sum: "$products.quantity" }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
    ]);
};

export const averageOrderValue = async () => {
    return await Payment.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $group: {
                _id: null,
                average: { $avg: "$amount" }
            }
        }
    ]);
};

export const operationalMetrics = async () => {
    return await Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
};

export const exportSalesExcel = async () => {
    const payments = await Payment.find({ isDeleted: false });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
        { header: "Order ID", key: "orderId", width: 20 },
        { header: "User ID", key: "userId", width: 20 },
        { header: "Amount", key: "amount", width: 10 },
        { header: "Status", key: "status", width: 10 },
        { header: "Date", key: "createdAt", width: 25 }
    ];

    payments.forEach(payment => {
        worksheet.addRow(payment);
    });

    return workbook;
};

export const exportSalesPDF = async (payments) => {
    const doc = new PDFDocument();
    doc.fontSize(18).text("Sales Report", { align: "center" });
    doc.moveDown();

    payments.forEach(payment => {

        doc
            .fontSize(12)
            .text(
                `Order: ${payment.orderId} | User: ${payment.userId} | Amount: ${payment.amount} | Status: ${payment.status}`
            );

    });
    
    return doc;
};