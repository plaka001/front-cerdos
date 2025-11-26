import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { CategoriaFinanciera, MovimientoCaja, CompraInsumo, Insumo, SalidaInsumo } from '../models';

@Injectable({
    providedIn: 'root'
})
export class FinanzasService {
    private supabase = inject(SupabaseService).client;

    categorias = signal<CategoriaFinanciera[]>([]);
    insumos = signal<Insumo[]>([]);

    constructor() {
        this.loadCategorias();
        this.loadInsumos();
    }

    async loadCategorias() {
        const { data, error } = await this.supabase
            .from('categorias_financieras')
            .select('*')
            .order('nombre');

        if (data) {
            this.categorias.set(data as CategoriaFinanciera[]);
        }
    }

    async loadInsumos() {
        const { data, error } = await this.supabase
            .from('insumos')
            .select('*')
            .order('nombre');

        if (data) {
            this.insumos.set(data as Insumo[]);
        }
    }

    async registrarMovimiento(movimiento: Partial<MovimientoCaja>, compra?: Partial<CompraInsumo>) {
        // 1. Insertar Movimiento Caja
        const { data: movData, error: movError } = await this.supabase
            .from('movimientos_caja')
            .insert(movimiento)
            .select()
            .single();

        if (movError) throw movError;

        // 2. Si es compra de insumo, insertar en compras_insumos
        if (compra && movimiento.categoria_id) {
            const compraData = {
                ...compra,
                precio_total_factura: movimiento.monto
            };

            const { error: compraError } = await this.supabase
                .from('compras_insumos')
                .insert(compraData);

            if (compraError) throw compraError;
        }

        return movData;
    }

    async registrarSalidaInsumo(salida: Partial<SalidaInsumo>) {
        // 1. Obtener costo promedio actual del insumo si no viene
        if (!salida.costo_unitario_momento && salida.insumo_id) {
            const { data: insumo } = await this.supabase
                .from('insumos')
                .select('costo_promedio')
                .eq('id', salida.insumo_id)
                .single();

            if (insumo) {
                salida.costo_unitario_momento = insumo.costo_promedio;
            }
        }

        // 2. Insertar Salida
        const { data, error } = await this.supabase
            .from('salidas_insumos')
            .insert(salida)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
