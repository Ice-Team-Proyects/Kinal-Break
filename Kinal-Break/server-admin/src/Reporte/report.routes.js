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

/**
 * @swagger
 * /reports/sales/total:
 *   get:
 *     summary: Reporte total de ventas
 *     description: Obtiene la suma total de ingresos y el conteo de todas las transacciones realizadas.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Reporte de ventas totales generado exitosamente.
 *       500:
 *         description: Error interno al generar el reporte.
 */
router.get("/sales/total", totalSalesReport);

/**
 * @swagger
 * /reports/sales/daily:
 *   get:
 *     summary: Reporte de ventas diarias
 *     description: Agrupa y devuelve el total de ventas y transacciones por cada día.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Reporte diario generado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/sales/daily", dailySalesReport);

/**
 * @swagger
 * /reports/sales/monthly:
 *   get:
 *     summary: Reporte de ventas mensuales
 *     description: Agrupa y devuelve el total de ventas y transacciones por mes.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Reporte mensual generado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/sales/monthly", monthlySalesReport);

/**
 * @swagger
 * /reports/sales/weekly:
 *   get:
 *     summary: Reporte de ventas semanales
 *     description: Agrupa y devuelve el total de ventas y transacciones por semana.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Reporte semanal generado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/sales/weekly", weeklySalesReport);

/**
 * @swagger
 * /reports/products/top:
 *   get:
 *     summary: Top 5 productos más vendidos
 *     description: Analiza las órdenes y devuelve los 5 productos con mayor cantidad de ventas.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Lista de los productos más vendidos generada exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/products/top", topProductsReport);

/**
 * @swagger
 * /reports/sales/average:
 *   get:
 *     summary: Promedio de ventas
 *     description: Calcula y devuelve el valor promedio gastado por orden.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Promedio calculado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/sales/average", averageOrderReport);

/**
 * @swagger
 * /reports/metrics/operations:
 *   get:
 *     summary: Métricas operativas
 *     description: Devuelve métricas sobre el estado de los pagos (ej. cuántos completados, pendientes, cancelados).
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Métricas obtenidas exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/metrics/operations", operationalReport);

/**
 * @swagger
 * /reports/export/excel:
 *   get:
 *     summary: Exportar reporte a Excel
 *     description: Genera y descarga un archivo Excel (.xlsx) con el reporte completo de ventas.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Archivo Excel generado y listo para descargar.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error al generar el archivo Excel.
 */
router.get("/export/excel", exportExcelReport);

/**
 * @swagger
 * /reports/export/pdf:
 *   get:
 *     summary: Exportar reporte a PDF
 *     description: Genera y descarga un documento PDF con el reporte de ventas.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Documento PDF generado y listo para descargar.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error al generar el documento PDF.
 */
router.get("/export/pdf", exportPDFReport);

export default router;