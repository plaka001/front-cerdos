import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Insumo {
    id?: number;
    nombre: string;
    tipo: 'alimento' | 'medicamento' | 'biologico' | 'material' | 'otro';
    unidad_medida: 'kg' | 'ml' | 'dosis' | 'unidad';
    presentacion_compra: number;
    stock_minimo: number;
    stock_actual?: number;
    costo_promedio?: number;
    activo: boolean;
}

export interface CategoriaFinanciera {
    id?: number;
    nombre: string;
    tipo_flujo: 'operativo' | 'inversion' | 'administrativo';
    descripcion?: string;
    es_automatica: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionService {
    private supabase = inject(SupabaseService).client;

    // --- INSUMOS ---

    async getInsumos(): Promise<Insumo[]> {
        const { data, error } = await this.supabase
            .from('insumos')
            .select('*')
            .order('nombre');

        if (error) throw error;
        return data || [];
    }

    async saveInsumo(insumo: Insumo): Promise<void> {
        // Extraemos id para saber si es update o insert
        const { id, ...rest } = insumo;

        let payload: any = { ...rest };

        // Si es nuevo, inicializamos valores por defecto
        if (!id) {
            payload.activo = true;
            payload.stock_actual = 0;
            payload.costo_promedio = 0;
        }

        const { error } = await this.supabase
            .from('insumos')
            .upsert(id ? { id, ...payload } : payload);

        if (error) throw error;
    }

    async toggleEstadoInsumo(id: number, estadoActual: boolean): Promise<void> {
        const { error } = await this.supabase
            .from('insumos')
            .update({ activo: !estadoActual })
            .eq('id', id);

        if (error) throw error;
    }

    // --- CATEGORIAS ---

    async getCategorias(): Promise<CategoriaFinanciera[]> {
        const { data, error } = await this.supabase
            .from('categorias_financieras')
            .select('*')
            .order('nombre');

        if (error) throw error;
        return data || [];
    }

    async saveCategoria(categoria: CategoriaFinanciera): Promise<void> {
        const { id, ...rest } = categoria;

        let payload: any = { ...rest };

        // Seguridad: Siempre false para categorías creadas por usuario
        payload.es_automatica = false;

        const { error } = await this.supabase
            .from('categorias_financieras')
            .upsert(id ? { id, ...payload } : payload);

        if (error) throw error;
    }
}
