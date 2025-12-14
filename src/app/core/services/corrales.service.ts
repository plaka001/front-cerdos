import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Corral, EstadoCorral } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CorralesService {
    private supabase = inject(SupabaseService);

    /**
     * Obtiene la lista de corrales (vista básica) para configuración
     */
    async getCorrales(): Promise<Corral[]> {
        try {
            const { data, error } = await this.supabase.client
                .from('corrales')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            return data as Corral[];
        } catch (error) {
            console.error('Error obteniendo corrales:', error);
            throw error;
        }
    }

    /**
     * Obtiene el estado de ocupación de los corrales (Vista SQL)
     */
    async getEstadoCorrales(): Promise<EstadoCorral[]> {
        try {
            const { data, error } = await this.supabase.client
                .from('vista_estado_corrales')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            return data as EstadoCorral[];
        } catch (error) {
            console.error('Error obteniendo estado de corrales:', error);
            throw error;
        }
    }

    async createCorral(corral: Omit<Corral, 'id' | 'created_at'>): Promise<Corral> {
        try {
            const { data, error } = await this.supabase.client
                .from('corrales')
                .insert(corral)
                .select()
                .single();

            if (error) throw error;
            return data as Corral;
        } catch (error) {
            console.error('Error creando corral:', error);
            throw error;
        }
    }

    async updateCorral(id: number, changes: Partial<Corral>): Promise<Corral> {
        try {
            const { data, error } = await this.supabase.client
                .from('corrales')
                .update(changes)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as Corral;
        } catch (error) {
            console.error('Error actualizando corral:', error);
            throw error;
        }
    }

    /**
     * Traslada un lote a un nuevo corral
     */
    async trasladarLote(loteId: number, nuevoCorralId: number): Promise<void> {
        try {
            const { error } = await this.supabase.client
                .from('lotes')
                .update({ corral_id: nuevoCorralId })
                .eq('id', loteId);

            if (error) throw error;
        } catch (error) {
            console.error('Error trasladando lote:', error);
            throw error;
        }
    }
}
