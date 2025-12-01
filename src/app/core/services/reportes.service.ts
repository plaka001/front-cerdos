import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
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
}
