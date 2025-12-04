import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import * as XLSX from 'xlsx';
import { ReporteRentabilidad, ReporteCostosMaternidad, ReporteGastoCategoria, ReporteFlujoCaja } from '../models';


@Injectable({
    providedIn: 'root'
})
export class ReportesService {
    private supabase = inject(SupabaseService);

    async getReporteRentabilidad(): Promise<ReporteRentabilidad[]> {
        try {
            const { data, error } = await this.supabase.client
                .from('reporte_rentabilidad_lote')
                .select('*')
                .order('codigo', { ascending: false });

            if (error) throw error;
            return data as ReporteRentabilidad[];
        } catch (error) {
            console.error('Error al obtener reporte de rentabilidad:', error);
            throw error;
        }
    }

    async getReporteMaternidad(): Promise<ReporteCostosMaternidad[]> {
        try {
            const { data, error } = await this.supabase.client
                .from('reporte_costos_maternidad')
                .select('*')
                .order('mes', { ascending: false });

            if (error) throw error;
            return data as ReporteCostosMaternidad[];
        } catch (error) {
            console.error('Error al obtener reporte de maternidad:', error);
            throw error;
        }
    }

    async getReporteGastosGenerales(): Promise<ReporteGastoCategoria[]> {
        try {
            const { data, error } = await this.supabase.client
                .from('reporte_gastos_categoria')
                .select('*')
                .order('mes', { ascending: false })
                .order('total_gastado', { ascending: false });

            if (error) throw error;
            return data as ReporteGastoCategoria[];
        } catch (error) {
            console.error('Error al obtener reporte de gastos:', error);
            throw error;
        }
    }

    async getReporteFlujoCaja(): Promise<ReporteFlujoCaja[]> {
        try {
            const { data, error } = await this.supabase.client
                .from('reporte_flujo_caja_mensual')
                .select('*')
                .order('mes', { ascending: false })
                .order('total', { ascending: false });

            if (error) throw error;
            return data as ReporteFlujoCaja[];
        } catch (error) {
            console.error('Error al obtener reporte de flujo de caja:', error);
            throw error;
        }
    }

    async descargarReporteExcel(anio: number, mes: number): Promise<void> {
        try {
            // 1. Definir rango de fechas para el mes seleccionado
            const fechaInicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
            const fechaFin = new Date(anio, mes, 0).toISOString().split('T')[0]; // Último día del mes

            // 2. Consultas en Paralelo
            const [finanzas, insumosCompras, insumosSalidas, eventosSanitarios, ciclosReproductivos] = await Promise.all([
                // Query 1: Finanzas (Movimientos de Caja)
                this.supabase.client
                    .from('movimientos_caja')
                    .select('*, categorias_financieras(nombre)')
                    .gte('fecha', fechaInicio)
                    .lte('fecha', fechaFin)
                    .order('fecha', { ascending: true }),

                // Query 2a: Compras Insumos
                this.supabase.client
                    .from('compras_insumos')
                    .select('*, insumos(nombre, unidad_medida)')
                    .gte('fecha', fechaInicio)
                    .lte('fecha', fechaFin),

                // Query 2b: Salidas Insumos
                this.supabase.client
                    .from('salidas_insumos')
                    .select('*, insumos(nombre, unidad_medida)')
                    .gte('fecha', fechaInicio)
                    .lte('fecha', fechaFin),

                // Query 3a: Eventos Sanitarios
                this.supabase.client
                    .from('eventos_sanitarios')
                    .select('*, cerdas(chapeta)')
                    .gte('fecha', fechaInicio)
                    .lte('fecha', fechaFin),

                // Query 3b: Ciclos Reproductivos (Partos/Destetes en ese mes)
                this.supabase.client
                    .from('ciclos_reproductivos')
                    .select('*, cerdas(chapeta)')
                    .or(`fecha_parto_real.gte.${fechaInicio},fecha_destete.gte.${fechaInicio}`)
            ]);

            if (finanzas.error) throw finanzas.error;
            if (insumosCompras.error) throw insumosCompras.error;
            if (insumosSalidas.error) throw insumosSalidas.error;
            if (eventosSanitarios.error) throw eventosSanitarios.error;
            if (ciclosReproductivos.error) throw ciclosReproductivos.error;

            // 3. Formatear Datos
            const dataFinanzas = finanzas.data.map(f => ({
                Fecha: f.fecha,
                Tipo: f.tipo.toUpperCase(),
                Categoria: f.categorias_financieras?.nombre || 'Sin Categoría',
                Descripcion: f.descripcion,
                Monto: f.monto,
                Usuario: f.usuario_id
            }));

            const dataInventario = [
                ...insumosCompras.data.map(c => ({
                    Fecha: c.fecha,
                    Tipo: 'ENTRADA (COMPRA)',
                    Insumo: c.insumos?.nombre,
                    Cantidad: c.cantidad_comprada || c.cantidad,
                    Unidad: c.insumos?.unidad_medida,
                    Costo_Total: c.precio_total_factura || 0,
                    Proveedor: c.proveedor
                })),
                ...insumosSalidas.data.map(s => ({
                    Fecha: s.fecha,
                    Tipo: 'SALIDA (USO)',
                    Insumo: s.insumos?.nombre,
                    Cantidad: s.cantidad,
                    Unidad: s.insumos?.unidad_medida,
                    Costo_Total: s.costo_total_salida || 0,
                    Proveedor: '-'
                }))
            ].sort((a, b) => new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime());

            const dataBiologico = [
                ...eventosSanitarios.data.map(e => ({
                    Fecha: e.fecha,
                    Evento: 'SANITARIO',
                    Cerda: e.cerdas?.chapeta,
                    Detalle: `${e.tipo} - ${e.producto}`,
                    Observaciones: e.observaciones
                })),
                ...ciclosReproductivos.data
                    .filter(c => c.fecha_parto_real >= fechaInicio && c.fecha_parto_real <= fechaFin)
                    .map(c => ({
                        Fecha: c.fecha_parto_real,
                        Evento: 'PARTO',
                        Cerda: c.cerdas?.chapeta,
                        Detalle: `Vivos: ${c.nacidos_vivos}, Muertos: ${c.nacidos_muertos}, Momias: ${c.momias}`,
                        Observaciones: '-'
                    })),
                ...ciclosReproductivos.data
                    .filter(c => c.fecha_destete >= fechaInicio && c.fecha_destete <= fechaFin)
                    .map(c => ({
                        Fecha: c.fecha_destete,
                        Evento: 'DESTETE',
                        Cerda: c.cerdas?.chapeta,
                        Detalle: `Destetados: ${c.lechones_destetados}, Peso: ${c.peso_promedio_destete}kg (Prom)`,
                        Observaciones: '-'
                    }))
            ].sort((a, b) => new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime());

            // 4. Generar Excel
            this.generateExcel(dataFinanzas, dataInventario, dataBiologico, anio, mes);

        } catch (error) {
            console.error('Error generando Excel:', error);
            throw error;
        }
    }

    private generateExcel(finanzas: any[], inventario: any[], biologico: any[], anio: number, mes: number) {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Finanzas
        const wsFinanzas = XLSX.utils.json_to_sheet(finanzas);
        XLSX.utils.book_append_sheet(wb, wsFinanzas, "Finanzas");

        // Sheet 2: Inventario
        const wsInventario = XLSX.utils.json_to_sheet(inventario);
        XLSX.utils.book_append_sheet(wb, wsInventario, "Inventario");

        // Sheet 3: Biologico
        const wsBiologico = XLSX.utils.json_to_sheet(biologico);
        XLSX.utils.book_append_sheet(wb, wsBiologico, "Biologico");

        // Descargar
        const fileName = `Reporte_Granja_${anio}-${String(mes).padStart(2, '0')}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }
}
