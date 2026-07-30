import Order from "../Order/order.model.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const getTotalSales = async () => {
    // Ingresos = pedidos ya Pagados y luego Entregados (estado final Entregado).
    // Independiente del método de pago (Efectivo / Transferencia).
    const result = await Order.aggregate([
        {
            $match: {
                activo: { $ne: false },
                estado: "Entregado",
            },
        },
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: {
                        $cond: [
                            { $gt: ["$totalCobrar", 0] },
                            "$totalCobrar",
                            { $ifNull: ["$totalFinal", 0] },
                        ],
                    },
                },
                totalTransactions: { $sum: 1 },
            },
        },
    ]);

    if (!result.length) {
        return [{ totalSales: 0, totalTransactions: 0 }];
    }
    return result;
};

export const getDailySales = async () => {
    const result = await Order.aggregate([
        {
            $match: {
                activo: { $ne: false },
                estado: "Entregado",
            },
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$updatedAt" },
                    month: { $month: "$updatedAt" },
                    year: { $year: "$updatedAt" },
                },
                totalSales: {
                    $sum: {
                        $cond: [
                            { $gt: ["$totalCobrar", 0] },
                            "$totalCobrar",
                            { $ifNull: ["$totalFinal", 0] },
                        ],
                    },
                },
                transactions: { $sum: 1 },
            },
        },
        {
            $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 },
        },
    ]);
    return result;
};

export const getMonthlySales = async () => {
    const result = await Order.aggregate([
        {
            $match: {
                activo: { $ne: false },
                estado: "Entregado",
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: "$updatedAt" },
                    year: { $year: "$updatedAt" },
                },
                totalSales: {
                    $sum: {
                        $cond: [
                            { $gt: ["$totalCobrar", 0] },
                            "$totalCobrar",
                            { $ifNull: ["$totalFinal", 0] },
                        ],
                    },
                },
                transactions: { $sum: 1 },
            },
        },
        {
            $sort: { "_id.year": -1, "_id.month": -1 },
        },
    ]);
    return result;
};

export const getWeeklySales = async () => {
    return await Order.aggregate([
        {
            $match: {
                activo: { $ne: false },
                estado: "Entregado",
            },
        },
        {
            $group: {
                _id: { week: { $week: "$updatedAt" }, year: { $year: "$updatedAt" } },
                totalSales: {
                    $sum: {
                        $cond: [
                            { $gt: ["$totalCobrar", 0] },
                            "$totalCobrar",
                            { $ifNull: ["$totalFinal", 0] },
                        ],
                    },
                },
                transactions: { $sum: 1 },
            },
        },
        {
            $sort: { "_id.year": -1, "_id.week": -1 },
        },
    ]);
};

export const topProducts = async () => {
    return await Order.aggregate([
        {
            $match: {
                activo: { $ne: false },
                estado: "Entregado",
            },
        },
        { $unwind: "$productos" },
        {
            $group: {
                _id: "$productos.productoId",
                totalSold: { $sum: "$productos.cantidad" },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $project: {
                _id: 1,
                totalSold: 1,
                name: { $ifNull: [{ $arrayElemAt: ["$product.name", 0] }, "Producto"] },
            },
        },
    ]);
};

export const averageOrderValue = async () => {
    return await Order.aggregate([
        {
            $match: {
                activo: { $ne: false },
                estado: "Entregado",
            },
        },
        {
            $group: {
                _id: null,
                average: {
                    $avg: {
                        $cond: [
                            { $gt: ["$totalCobrar", 0] },
                            "$totalCobrar",
                            { $ifNull: ["$totalFinal", 0] },
                        ],
                    },
                },
            },
        },
    ]);
};

export const operationalMetrics = async () => {
    return await Order.aggregate([
        {
            $match: { activo: { $ne: false } },
        },
        {
            $group: {
                _id: "$estado",
                count: { $sum: 1 },
            },
        },
    ]);
};

export const exportSalesExcel = async () => {
    const orders = await Order.find({ activo: { $ne: false }, estado: "Entregado" }).sort({ updatedAt: -1 });
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

    orders.forEach((order) => {
        const dateObj = order.updatedAt ? new Date(order.updatedAt) : new Date();
        const amount = order.totalCobrar > 0 ? order.totalCobrar : (order.totalFinal || 0);
        worksheet.addRow({
            orderId: order.numeroPedido || order._id?.toString(),
            userId: order.usuarioId,
            amount,
            paymentMethod: order.metodoPago || "Efectivo",
            status: "Entregado",
            createdAt: dateObj.toLocaleString()
        });
    });

    return workbook;
};

export const exportSalesPDF = async (orders) => {
    const doc = new PDFDocument({ margin: 30 });
    doc.fontSize(18).text("Reporte de Ventas - Kinal Break", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("Solo pedidos pagados y entregados", { align: "center" });
    doc.moveDown();

    (orders || []).forEach((order) => {
        const amount = order.totalCobrar > 0 ? order.totalCobrar : (order.totalFinal || 0);
        const method = order.metodoPago || "Efectivo";
        const dateStr = order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A";
        doc
            .fontSize(10)
            .text(
                `Pedido: ${order.numeroPedido || order._id} | Usuario: ${order.usuarioId} | Monto: Q${amount} | Método: ${method} | Estado: Entregado | Fecha: ${dateStr}`
            );
        doc.moveDown(0.5);
    });
    
    return doc;
};