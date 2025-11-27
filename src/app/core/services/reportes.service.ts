import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ReporteRentabilidad } from '../models';

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
}
