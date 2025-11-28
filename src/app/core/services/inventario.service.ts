import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Insumo } from '../models';

export interface InventarioItem extends Insumo {
    valorTotal: number; // stock_actual * costo_promedio
}

export interface AjusteInventario {
    insumo_id: number;
    tipo: 'perdida' | 'entrada';
    cantidad: number;
    nota?: string;
}

@Injectable({
    providedIn: 'root'
})
export class InventarioService {
    private supabase = inject(SupabaseService).client;

    /**
     * Obtiene todos los insumos con su valoración económica
     * Ordenados por stock_actual ascendente (los más bajos primero)
     */
    async getInventarioCompleto(): Promise<InventarioItem[]> {
        try {
            const { data, error } = await this.supabase
                .from('insumos')
                .select('*')
                .eq('activo', true)
                .order('stock_actual', { ascending: true });

            if (error) {
                console.error('Error cargando inventario:', error);
                throw error;
            }

            // Calcular valor total para cada insumo
            return (data || []).map(insumo => ({
                ...insumo,
                valorTotal: (insumo.stock_actual || 0) * (insumo.costo_promedio || 0)
            })) as InventarioItem[];
        } catch (err: any) {
            console.error('Error inesperado cargando inventario:', err);
            throw err;
        }
    }

    /**
     * Calcula el valor total del inventario
     */
    async getValorTotalInventario(): Promise<number> {
        try {
            const inventario = await this.getInventarioCompleto();
            return inventario.reduce((total, item) => total + item.valorTotal, 0);
        } catch (err: any) {
            console.error('Error calculando valor total:', err);
            throw err;
        }
    }

    /**
     * Registra un ajuste manual de inventario
     * Si es pérdida: crea una salida con destino_tipo = 'general'
     * Si es entrada: crea una compra con precio_total_factura = 0 (ajuste)
     */
    async registrarAjuste(ajuste: AjusteInventario): Promise<void> {
        try {
            // Obtener el insumo para tener el costo_promedio actual
            const { data: insumo, error: errorInsumo } = await this.supabase
                .from('insumos')
                .select('costo_promedio, unidad_medida, presentacion_compra')
                .eq('id', ajuste.insumo_id)
                .single();

            if (errorInsumo || !insumo) {
                throw new Error('No se pudo obtener el insumo');
            }

            if (ajuste.tipo === 'perdida') {
                // Registrar como salida con destino_tipo = 'general'
                const { error: errorSalida } = await this.supabase
                    .from('salidas_insumos')
                    .insert({
                        fecha: new Date().toISOString().split('T')[0],
                        insumo_id: ajuste.insumo_id,
                        cantidad: ajuste.cantidad,
                        destino_tipo: 'general',
                        costo_unitario_momento: insumo.costo_promedio || 0,
                        notas: ajuste.nota || `Ajuste manual: Pérdida/Daño`
                    });

                if (errorSalida) {
                    console.error('Error registrando salida de ajuste:', errorSalida);
                    throw errorSalida;
                }
            } else {
                // Registrar como compra con precio_total_factura = 0 (ajuste de entrada)
                // El trigger calculará el costo promedio correctamente
                const cantidadReal = ajuste.cantidad * (insumo.presentacion_compra || 1);
                
                const { error: errorCompra } = await this.supabase
                    .from('compras_insumos')
                    .insert({
                        fecha: new Date().toISOString().split('T')[0],
                        insumo_id: ajuste.insumo_id,
                        cantidad_comprada: ajuste.cantidad,
                        precio_total_factura: 0, // Ajuste sin costo
                        proveedor: 'Ajuste Manual',
                        numero_factura: `AJUSTE-${Date.now()}`
                    });

                if (errorCompra) {
                    console.error('Error registrando compra de ajuste:', errorCompra);
                    throw errorCompra;
                }

                // Actualizar stock manualmente ya que el precio es 0
                // El trigger no actualizará el costo_promedio si precio_total_factura es 0
                const { data: insumoActual, error: errorGet } = await this.supabase
                    .from('insumos')
                    .select('stock_actual')
                    .eq('id', ajuste.insumo_id)
                    .single();

                if (!errorGet && insumoActual) {
                    const nuevoStock = (insumoActual.stock_actual || 0) + cantidadReal;
                    await this.supabase
                        .from('insumos')
                        .update({ stock_actual: nuevoStock })
                        .eq('id', ajuste.insumo_id);
                }
            }
        } catch (err: any) {
            console.error('Error registrando ajuste:', err);
            throw err;
        }
    }
}

