import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { DashboardData, DashboardKpi, AlertaInsumo, AlertaParto } from '../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private supabase = inject(SupabaseService).client;

    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    async getDashboardData(): Promise<DashboardData> {
        try {
            this.loading.set(true);
            this.error.set(null);

            // Ejecutar todas las consultas en paralelo para máxima eficiencia
            const [kpisData, alertasInsumosData, alertasPartosData] = await Promise.all([
                this.getKpis(),
                this.getAlertasInsumos(),
                this.getAlertasPartos()
            ]);

            return {
                kpis: kpisData,
                alertasInsumos: alertasInsumosData,
                alertasPartos: alertasPartosData
            };
        } catch (err: any) {
            console.error('Error cargando dashboard:', err);
            this.error.set(err.message || 'Error al cargar el dashboard');
            throw err;
        } finally {
            this.loading.set(false);
        }
    }

    private async getKpis(): Promise<DashboardKpi> {
        // Calcular rango del mes actual
        const hoy = new Date();
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        const primerDiaStr = primerDiaMes.toISOString().split('T')[0];
        const ultimoDiaStr = ultimoDiaMes.toISOString().split('T')[0];

        // Ejecutar todas las consultas en paralelo
        const [
            { count: totalCerdas },
            { data: lotesData },
            { count: muertesMes },
            { data: egresosData }
        ] = await Promise.all([
            // 1. Contar cerdas activas
            this.supabase
                .from('cerdas')
                .select('*', { count: 'exact', head: true })
                .eq('activa', true),

            // 2. Sumar animales en lotes activos
            this.supabase
                .from('lotes')
                .select('cantidad_actual')
                .eq('estado', 'activo'),

            // 3. Contar muertes del mes actual
            this.supabase
                .from('eventos_sanitarios')
                .select('*', { count: 'exact', head: true })
                .eq('tipo', 'muerte')
                .gte('fecha', primerDiaStr)
                .lte('fecha', ultimoDiaStr),

            // 4. Sumar egresos del mes actual
            this.supabase
                .from('movimientos_caja')
                .select('monto')
                .eq('tipo', 'egreso')
                .gte('fecha', primerDiaStr)
                .lte('fecha', ultimoDiaStr)
        ]);

        const totalEngorde = lotesData?.reduce((sum, lote) => sum + (lote.cantidad_actual || 0), 0) || 0;
        const lotesActivos = lotesData?.length || 0;

        // Calcular tasa de mortalidad
        const totalAnimales = (totalCerdas || 0) + totalEngorde;
        const tasaMortalidad = totalAnimales > 0
            ? parseFloat(((muertesMes || 0) / totalAnimales * 100).toFixed(1))
            : 0;

        // Calcular gasto del mes
        const gastoMes = egresosData?.reduce((sum, mov) => sum + (mov.monto || 0), 0) || 0;

        return {
            totalCerdas: totalCerdas || 0,
            totalEngorde,
            lotesActivos,
            tasaMortalidad,
            gastoMes
        };
    }

    private async getAlertasInsumos(): Promise<AlertaInsumo[]> {
        // Consultar insumos activos y filtrar en cliente
        const { data, error } = await this.supabase
            .from('insumos')
            .select('id, nombre, stock_actual, stock_minimo, unidad_medida')
            .eq('activo', true)
            .order('stock_actual', { ascending: true });

        if (error) {
            console.error('Error cargando alertas de insumos:', error);
            return [];
        }

        // Filtrar donde stock_actual <= stock_minimo
        return (data || [])
            .filter(insumo => insumo.stock_actual <= insumo.stock_minimo)
            .map(insumo => ({
                id: insumo.id,
                nombre: insumo.nombre,
                stockActual: insumo.stock_actual,
                stockMinimo: insumo.stock_minimo,
                unidad: insumo.unidad_medida
            }));
    }

    private async getAlertasPartos(): Promise<AlertaParto[]> {
        // Calcular rango de fechas (hoy + 7 días)
        const hoy = new Date();
        const enUnaSemana = new Date();
        enUnaSemana.setDate(hoy.getDate() + 7);

        const hoyStr = hoy.toISOString().split('T')[0];
        const semanaStr = enUnaSemana.toISOString().split('T')[0];

        // Consultar ciclos con partos próximos (JOIN con cerdas)
        // IMPORTANTE: Filtrar solo cerdas en estado 'gestante' para evitar mostrar alertas de cerdas que ya parieron
        const { data, error } = await this.supabase
            .from('ciclos_reproductivos')
            .select(`
                fecha_parto_probable,
                cerdas!inner (
                    chapeta,
                    estado
                )
            `)
            .gte('fecha_parto_probable', hoyStr)
            .lte('fecha_parto_probable', semanaStr)
            .eq('estado', 'abierto')
            .eq('cerdas.estado', 'gestante')  // Solo cerdas gestantes, no lactantes
            .order('fecha_parto_probable', { ascending: true });

        if (error) {
            console.error('Error cargando alertas de partos:', error);
            return [];
        }

        return (data || []).map(ciclo => {
            const fechaProbable = new Date(ciclo.fecha_parto_probable);
            const diasRestantes = Math.ceil((fechaProbable.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

            return {
                chapetaCerda: (ciclo.cerdas as any).chapeta,
                fechaProbable,
                diasRestantes
            };
        });
    }
}
