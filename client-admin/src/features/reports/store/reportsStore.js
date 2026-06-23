import { create } from 'zustand';
import {
  getSalesReportTotalRequest,
  getSalesReportDailyRequest,
  getSalesReportWeeklyRequest,
  getSalesReportMonthlyRequest,
  getTopProductsReportRequest,
  getAverageOrderReportRequest,
  getOperationalReportRequest,
  exportExcelReportRequest,
  exportPDFReportRequest
} from '../../../shared/api/adminApi';
import toast from 'react-hot-toast';

export const useReportsStore = create((set) => ({
  totalSales: { totalVentas: 0, cantidadTransacciones: 0 },
  dailySales: [],
  weeklySales: [],
  monthlySales: [],
  topProducts: [],
  averageOrder: { promedioVenta: 0 },
  operationalMetrics: [],
  isLoading: false,

  fetchAllReports: async () => {
    set({ isLoading: true });
    try {
      const [
        totalRes,
        dailyRes,
        weeklyRes,
        monthlyRes,
        topRes,
        avgRes,
        opsRes
      ] = await Promise.all([
        getSalesReportTotalRequest().catch(() => ({ data: { totalVentas: 0, cantidadTransacciones: 0 } })),
        getSalesReportDailyRequest().catch(() => ({ data: [] })),
        getSalesReportWeeklyRequest().catch(() => ({ data: [] })),
        getSalesReportMonthlyRequest().catch(() => ({ data: [] })),
        getTopProductsReportRequest().catch(() => ({ data: [] })),
        getAverageOrderReportRequest().catch(() => ({ data: { promedioVenta: 0 } })),
        getOperationalReportRequest().catch(() => ({ data: [] }))
      ]);

      const totalRaw = Array.isArray(totalRes.data) ? totalRes.data[0] : (totalRes.data?.data || totalRes.data);
      const avgRaw = Array.isArray(avgRes.data) ? avgRes.data[0] : (avgRes.data?.data || avgRes.data);

      set({
        totalSales: {
          totalVentas: totalRaw?.totalSales ?? totalRaw?.totalVentas ?? 0,
          cantidadTransacciones: totalRaw?.totalTransactions ?? totalRaw?.cantidadTransacciones ?? 0,
        },
        dailySales: dailyRes.data?.data || dailyRes.data || [],
        weeklySales: weeklyRes.data?.data || weeklyRes.data || [],
        monthlySales: monthlyRes.data?.data || monthlyRes.data || [],
        topProducts: topRes.data?.data || topRes.data || [],
        averageOrder: {
          promedioVenta: avgRaw?.average ?? avgRaw?.promedioVenta ?? 0,
        },
        operationalMetrics: opsRes.data?.data || opsRes.data || [],
      });
    } catch (err) {
      console.error(err);
      toast.error('Error al compilar reportes');
    } finally {
      set({ isLoading: false });
    }
  },

  exportExcel: async () => {
    try {
      const res = await exportExcelReportRequest();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_ventas_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel exportado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al exportar Excel');
    }
  },

  exportPdf: async () => {
    try {
      const res = await exportPDFReportRequest();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_ventas_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF exportado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al exportar PDF');
    }
  }
}));
