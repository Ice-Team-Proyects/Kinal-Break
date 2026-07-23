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
    const worksheet = workbook.addWorksheet("Reporte de Ventas");

    worksheet.columns = [
        { header: "ID de Pedido", key: "orderId", width: 28 },
        { header: "ID de Usuario", key: "userId", width: 20 },
        { header: "Monto (Q)", key: "amount", width: 14 },
        { header: "Método de Pago", key: "paymentMethod", width: 18 },
        { header: "Estado", key: "status", width: 14 },
        { header: "Fecha", key: "createdAt", width: 25 }
    ];

    payments.forEach(payment => {
        const dateObj = payment.createdAt ? new Date(payment.createdAt) : new Date();
        worksheet.addRow({
            orderId: payment.orderId,
            userId: payment.userId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod || "Efectivo",
            status: payment.confirmedUnpaid ? "Pendiente" : "Pagado",
            createdAt: dateObj.toLocaleString()
        });
    });

    return workbook;
};

export const exportSalesPDF = async (payments) => {
    const doc = new PDFDocument({ margin: 30 });
    doc.fontSize(18).text("Reporte de Ventas - Kinal Break", { align: "center" });
    doc.moveDown();

    payments.forEach(payment => {
        const statusText = payment.confirmedUnpaid ? "Pendiente" : "Pagado";
        const method = payment.paymentMethod || "Efectivo";
        const dateStr = payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A";
        doc
            .fontSize(10)
            .text(
                `Pedido: ${payment.orderId} | Usuario: ${payment.userId} | Monto: Q${payment.amount} | Método: ${method} | Estado: ${statusText} | Fecha: ${dateStr}`
            );
        doc.moveDown(0.5);
    });
    
    return doc;
};