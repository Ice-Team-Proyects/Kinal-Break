import React, { useEffect } from 'react';
import { useReportsStore } from '../store/reportsStore';
import { FileSpreadsheet, FileText, TrendingUp, BarChart2, Star, Percent, ShoppingBag } from 'lucide-react';

export function ReportsPage() {
  const { totalSales, dailySales, weeklySales, monthlySales, topProducts, averageOrder, operationalMetrics, isLoading, fetchAllReports, exportExcel, exportPdf } = useReportsStore();

  useEffect(() => {
    fetchAllReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#031633] uppercase font-display tracking-wider">Módulo de Reportes</h1>
          <p className="text-sm font-bold text-[#ff8928] uppercase tracking-wide">Analítica detallada e informes de ventas de Kinal Break</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={exportExcel}
            className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 py-3 rounded-2xl border-2 border-[#031633] shadow-[3px_3px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] transition-all flex items-center justify-center gap-2 uppercase text-xs cursor-pointer"
          >
            <FileSpreadsheet size={16} /> Exportar Excel
          </button>
          <button
            onClick={exportPdf}
            className="flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white font-black px-4 py-3 rounded-2xl border-2 border-[#031633] shadow-[3px_3px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] transition-all flex items-center justify-center gap-2 uppercase text-xs cursor-pointer"
          >
            <FileText size={16} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Grid de Bento de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Recaudado */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#efedf0] pb-2">
            <h3 className="text-xs font-black text-[#031633] uppercase tracking-wider">Ventas Totales</h3>
            <div className="w-10 h-10 rounded-2xl bg-[#ff8928]/10 flex items-center justify-center border-2 border-[#ff8928]/20 text-[#ff8928]">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-black text-[#031633]">
              Q{(totalSales.totalVentas || 0).toFixed(2)}
            </span>
            <p className="text-[10px] text-[#ff8928] font-bold uppercase mt-1">Acumulado total de caja</p>
          </div>
        </div>

        {/* Transacciones */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#efedf0] pb-2">
            <h3 className="text-xs font-black text-[#031633] uppercase tracking-wider">Transacciones Realizadas</h3>
            <div className="w-10 h-10 rounded-2xl bg-[#031633]/10 flex items-center justify-center border-2 border-[#031633]/20 text-[#031633]">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-black text-[#031633]">
              {totalSales.cantidadTransacciones || 0}
            </span>
            <p className="text-[10px] text-[#ff8928] font-bold uppercase mt-1">Pedidos cobrados con éxito</p>
          </div>
        </div>

        {/* Promedio de Venta */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#efedf0] pb-2">
            <h3 className="text-xs font-black text-[#031633] uppercase tracking-wider">Promedio por Pedido</h3>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center border-2 border-amber-300 text-amber-600">
              <Percent size={20} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-black text-[#031633]">
              Q{(averageOrder.promedioVenta || 0).toFixed(2)}
            </span>
            <p className="text-[10px] text-[#ff8928] font-bold uppercase mt-1">Ticket promedio por estudiante</p>
          </div>
        </div>
      </div>

      {/* Reporte de Productos Top y Gráfico de Ventas Diarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Productos más vendidos */}
        <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col overflow-hidden">
          <div className="p-5 border-b-2 border-[#031633] bg-[#f5f3f6] flex justify-between items-center">
            <h3 className="text-lg font-black text-[#031633] uppercase tracking-wide font-display">
              Top 5 Productos más Vendidos
            </h3>
            <div className="text-amber-500">
              <Star size={20} />
            </div>
          </div>

          <div className="p-5 space-y-4 flex-1">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold text-center py-8">No hay registros de ventas suficientes.</p>
            ) : (
              topProducts.slice(0, 5).map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#f5f3f6] border-2 border-[#031633]/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#ff8928] text-white flex items-center justify-center font-black text-xs border border-[#031633]">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-[#031633] uppercase">{prod.name || prod._id}</span>
                  </div>
                  <span className="text-xs font-bold text-[#ff8928] uppercase">{prod.totalVendido || prod.count} uds</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ventas Diarias (Chart) */}
        <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col overflow-hidden">
          <div className="p-5 border-b-2 border-[#031633] bg-[#f5f3f6] flex justify-between items-center">
            <h3 className="text-lg font-black text-[#031633] uppercase tracking-wide font-display">
              Historial de Ventas Diarias
            </h3>
            <div className="text-[#031633]">
              <BarChart2 size={20} />
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-end min-h-[250px] space-y-4">
            {dailySales.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold text-center py-8">Aún no hay transacciones para graficar.</p>
            ) : (
              <div className="flex items-end justify-around h-40 pt-4 px-2">
                {dailySales.slice(-7).map((day, idx) => {
                  const maxVal = Math.max(...dailySales.map(d => d.totalVentas || d.total || 1));
                  const heightPercent = ((day.totalVentas || day.total || 0) / maxVal) * 100;
                  return (
                    <div key={idx} className="flex flex-col items-center group relative w-8">
                      {/* Tooltip */}
                      <div className="absolute -top-8 bg-[#031633] text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        Q{(day.totalVentas || day.total || 0).toFixed(0)}
                      </div>

                      {/* Bar */}
                      <div
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        className="w-full bg-[#ff8928] border-2 border-[#031633] rounded-t-lg shadow-[2px_0_0_0_#031633] hover:bg-[#ff9d47] transition-all"
                      />
                      
                      {/* Label */}
                      <span className="text-[9px] font-black text-[#031633] uppercase mt-2 select-none">
                        {day._id?.day || day.fecha?.substring(5,10) || `D${idx+1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
