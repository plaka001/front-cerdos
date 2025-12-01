import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Cerda, CicloReproductivo, Lote, CerdaDetalle, LoteDetalle, Insumo, SalidaInsumo, EventoSanitario } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ProduccionService {
    private supabase = inject(SupabaseService).client;

    cerdas = signal<Cerda[]>([]);
    lotes = signal<Lote[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    constructor() {
        this.init();
    }

    private async init() {
        await this.corregirContadoresPartos();
        await Promise.all([
            this.loadCerdas(),
            this.loadLotes()
        ]);
    }

    private async corregirContadoresPartos() {
        try {
            const { data: ciclos } = await this.supabase
                .from('ciclos_reproductivos')
                .select('cerda_id')
                .not('fecha_parto_real', 'is', null);

            if (!ciclos) return;

            const conteo: Record<number, number> = {};
            ciclos.forEach((c: any) => {
                conteo[c.cerda_id] = (conteo[c.cerda_id] || 0) + 1;
            });

            const { data: cerdas } = await this.supabase.from('cerdas').select('id, partos_acumulados');

            if (!cerdas) return;

            const updates = [];
            for (const cerda of cerdas) {
                const real = conteo[cerda.id] || 0;
                if (cerda.partos_acumulados !== real) {
                    updates.push(
                        this.supabase.from('cerdas').update({ partos_acumulados: real }).eq('id', cerda.id)
                    );
                }
            }

            if (updates.length > 0) {
                await Promise.all(updates);
                console.log(`Corregidos ${updates.length} contadores de partos.`);
            }
        } catch (err) {
            console.error('Error corrigiendo contadores:', err);
        }
    }

    async loadCerdas() {
        try {
            this.loading.set(true);
            this.error.set(null);

            const { data, error } = await this.supabase
                .from('cerdas')
                .select('*')
                .order('chapeta');

            if (error) {
                console.error('Error cargando cerdas:', error);
                this.error.set(error.message);
                return;
            }

            if (data) {
                this.cerdas.set(data as Cerda[]);
            }
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al cargar las cerdas');
        } finally {
            this.loading.set(false);
        }
    }

    async getCerdasConCiclos(): Promise<CerdaDetalle[]> {
        try {
            this.loading.set(true);
            this.error.set(null);

            const { data, error } = await this.supabase
                .from('cerdas')
                .select(`
                    *,
                    ciclos_reproductivos (
                        id,
                        fecha_inseminacion,
                        fecha_parto_probable,
                        fecha_parto_real,
                        fecha_destete,
                        nacidos_vivos,
                        nacidos_muertos,
                        estado
                    )
                `)
                .eq('activa', true)
                .order('chapeta');

            if (error) {
                console.error('Error cargando cerdas con ciclos:', error);
                this.error.set(error.message);
                return [];
            }

            const hoy = new Date();
            const cerdasDetalle: CerdaDetalle[] = (data || []).map((item: any) => {
                const cicloActivo = item.ciclos_reproductivos?.find((c: any) => c.estado === 'abierto');

                const cerda: CerdaDetalle = {
                    ...item,
                    cicloActivo: cicloActivo || undefined
                };

                if (cerda.cicloActivo) {
                    const fechaInseminacion = new Date(cerda.cicloActivo.fecha_inseminacion);

                    if (cerda.estado === 'gestante' && cerda.cicloActivo.fecha_parto_probable) {
                        const fechaParto = new Date(cerda.cicloActivo.fecha_parto_probable);
                        cerda.diasParaParto = Math.ceil((fechaParto.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                        cerda.diasGestacion = Math.abs(Math.ceil((hoy.getTime() - fechaInseminacion.getTime()) / (1000 * 60 * 60 * 24)));
                    }

                    if (cerda.estado === 'lactante' && cerda.cicloActivo.fecha_parto_real) {
                        const fechaParto = new Date(cerda.cicloActivo.fecha_parto_real);
                        cerda.diasLactancia = Math.abs(Math.ceil((hoy.getTime() - fechaParto.getTime()) / (1000 * 60 * 60 * 24)));
                    }
                }

                return cerda;
            });

            return cerdasDetalle;
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al cargar cerdas con ciclos');
            return [];
        } finally {
            this.loading.set(false);
        }
    }

    async loadLotes() {
        try {
            this.loading.set(true);
            this.error.set(null);

            const { data, error } = await this.supabase
                .from('lotes')
                .select('*')
                .order('codigo');

            if (error) {
                console.error('Error cargando lotes:', error);
                this.error.set(error.message);
                return;
            }

            if (data) {
                this.lotes.set(data as Lote[]);
            }
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al cargar los lotes');
        } finally {
            this.loading.set(false);
        }
    }

    async registrarInseminacion(cerdaId: number, data: { fecha: string; macho: string; observaciones?: string }) {
        try {
            this.error.set(null);

            // Step 1: Insert new reproductive cycle
            const ciclo: Partial<CicloReproductivo> = {
                cerda_id: cerdaId,
                fecha_inseminacion: data.fecha,
                padre_semen: data.macho,
                estado: 'abierto',
                nacidos_vivos: 0,
                nacidos_muertos: 0,
                momias: 0,
                lechones_destetados: 0,
                observaciones: data.observaciones || undefined
            };

            const nuevoCiclo = await this.registrarEventoCerda(ciclo);

            // Step 2: CRITICAL - Update cerda status to 'gestante'
            await this.actualizarEstadoCerda(cerdaId, 'gestante');

            return nuevoCiclo;
        } catch (err: any) {
            console.error('Error registrando inseminación:', err);
            this.error.set(err.message || 'Error al registrar inseminación');
            throw err;
        }
    }

    async registrarParto(cerdaId: number, cicloId: number, data: { fecha: string; nacidos_vivos: number; nacidos_muertos: number; momias: number; observaciones?: string }) {
        try {
            this.error.set(null);

            // 1. Actualizar el ciclo reproductivo
            const { error: errorCiclo } = await this.supabase
                .from('ciclos_reproductivos')
                .update({
                    fecha_parto_real: data.fecha,
                    nacidos_vivos: data.nacidos_vivos,
                    nacidos_muertos: data.nacidos_muertos,
                    momias: data.momias,
                    observaciones: data.observaciones || null
                })
                .eq('id', cicloId);

            if (errorCiclo) throw errorCiclo;

            // 2. Obtener partos actuales para incrementar
            const { data: cerdaActual, error: errorGet } = await this.supabase
                .from('cerdas')
                .select('partos_acumulados')
                .eq('id', cerdaId)
                .single();

            if (errorGet) throw errorGet;

            const nuevosPartos = (cerdaActual?.partos_acumulados || 0) + 1;

            // 3. Actualizar cerda (estado y contador)
            const { error: errorUpdate } = await this.supabase
                .from('cerdas')
                .update({
                    estado: 'lactante',
                    partos_acumulados: nuevosPartos
                })
                .eq('id', cerdaId);

            if (errorUpdate) throw errorUpdate;

        } catch (err: any) {
            console.error('Error registrando parto:', err);
            this.error.set(err.message);
            throw err;
        }
    }

    async registrarDestete(cerdaId: number, cicloId: number, data: { fecha: string; cantidad: number; peso: number; crear_lote: boolean; observaciones?: string; valor_venta?: number; comprador?: string }) {
        try {
            this.error.set(null);

            // 1. Cerrar ciclo (Común)
            const { error: errorCiclo } = await this.supabase
                .from('ciclos_reproductivos')
                .update({
                    fecha_destete: data.fecha,
                    lechones_destetados: data.cantidad,
                    peso_promedio_destete: data.peso,
                    estado: 'cerrado',
                    observaciones: data.observaciones || null
                })
                .eq('id', cicloId);

            if (errorCiclo) throw errorCiclo;

            // 2. Bifurcación: Lote vs Venta
            if (data.crear_lote) {
                // Camino A: Crear Lote
                const { error: errorLote } = await this.supabase
                    .from('lotes')
                    .insert({
                        codigo: `L-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                        fecha_inicio: data.fecha,
                        cantidad_inicial: data.cantidad,
                        cantidad_actual: data.cantidad,
                        peso_promedio_inicial: data.peso,
                        estado: 'activo'
                    });

                if (errorLote) throw errorLote;
            } else {
                // Camino B: Venta Inmediata
                // Buscar categoría 'Venta de Lechones'
                const { data: catData } = await this.supabase
                    .from('categorias_financieras')
                    .select('id')
                    .eq('nombre', 'Venta de Lechones')
                    .single();

                const categoriaId = catData?.id;

                if (!categoriaId) {
                    console.warn('Categoría "Venta de Lechones" no encontrada. Se registrará sin categoría.');
                }

                // Obtener chapeta para descripción
                const { data: cerda } = await this.supabase
                    .from('cerdas')
                    .select('chapeta')
                    .eq('id', cerdaId)
                    .single();

                const descripcion = `Venta de Lechones al Destete - Cerda ${cerda?.chapeta || '?'}${data.comprador ? ' - Cliente: ' + data.comprador : ''}`;

                const { error: errorVenta } = await this.supabase
                    .from('movimientos_caja')
                    .insert({
                        fecha: data.fecha,
                        tipo: 'ingreso',
                        categoria_id: categoriaId,
                        monto: data.valor_venta || 0,
                        descripcion: descripcion,
                        metodo_pago: 'efectivo'
                    });

                if (errorVenta) throw errorVenta;
            }

            await this.actualizarEstadoCerda(cerdaId, 'vacia');
        } catch (err: any) {
            console.error('Error registrando destete:', err);
            this.error.set(err.message);
            throw err;
        }
    }

    async registrarEventoCerda(ciclo: Partial<CicloReproductivo>) {
        try {
            this.error.set(null);

            const { data, error } = await this.supabase
                .from('ciclos_reproductivos')
                .insert(ciclo)
                .select()
                .single();

            if (error) {
                console.error('Error registrando evento:', error);
                this.error.set(error.message);
                throw error;
            }

            return data as CicloReproductivo;
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al registrar evento');
            throw err;
        }
    }

    async actualizarEstadoCerda(id: number, estado: string) {
        try {
            this.error.set(null);

            const { error } = await this.supabase
                .from('cerdas')
                .update({ estado })
                .eq('id', id);

            if (error) {
                console.error('Error actualizando estado:', error);
                this.error.set(error.message);
                throw error;
            }

            // Component will handle reload with getCerdasConCiclos()
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al actualizar estado');
            throw err;
        }
    }

    async getLotes(): Promise<LoteDetalle[]> {
        try {
            this.loading.set(true);
            this.error.set(null);

            const { data, error } = await this.supabase
                .from('lotes')
                .select('*')
                .order('estado', { ascending: true })
                .order('fecha_inicio', { ascending: false });

            if (error) {
                console.error('Error cargando lotes:', error);
                this.error.set(error.message);
                return [];
            }

            const hoy = new Date();
            const lotesConDias: LoteDetalle[] = (data || []).map((lote: any) => {
                const fechaInicio = new Date(lote.fecha_inicio);
                const diasEnGranja = Math.floor((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));

                return {
                    ...lote,
                    diasEnGranja
                };
            });

            return lotesConDias;
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al cargar los lotes');
            return [];
        } finally {
            this.loading.set(false);
        }
    }

    async getInsumosAlimento(): Promise<Insumo[]> {
        try {
            const { data, error } = await this.supabase
                .from('insumos')
                .select('*')
                .eq('tipo', 'alimento')
                .gt('stock_actual', 0)
                .eq('activo', true)
                .order('nombre');

            if (error) {
                console.error('Error cargando alimentos:', error);
                throw error;
            }

            return (data || []) as Insumo[];
        } catch (err: any) {
            console.error('Error inesperado:', err);
            throw err;
        }
    }

    async registrarConsumo(data: {
        insumo_id: number;
        lote_id: number;
        cantidad: number;
        costo_unitario_momento: number;
    }): Promise<void> {
        try {
            this.error.set(null);

            const salidaData: Partial<SalidaInsumo> = {
                fecha: new Date().toISOString().split('T')[0],
                insumo_id: data.insumo_id,
                cantidad: data.cantidad,
                destino_tipo: 'lote',
                lote_id: data.lote_id,
                costo_unitario_momento: data.costo_unitario_momento
            };

            const { error } = await this.supabase
                .from('salidas_insumos')
                .insert(salidaData);

            if (error) {
                console.error('Error registrando consumo:', error);
                this.error.set(error.message);
                throw error;
            }
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al registrar consumo');
            throw err;
        }
    }

    async registrarMortalidad(data: {
        lote_id: number;
        fecha: string;
        tipo: string;
        cantidad_afectada: number;
        observacion: string | null;
    }): Promise<void> {
        try {
            this.error.set(null);

            const { error: errorEvento } = await this.supabase
                .from('eventos_sanitarios')
                .insert({
                    fecha: data.fecha,
                    tipo: data.tipo,
                    lote_id: data.lote_id,
                    cantidad_afectada: data.cantidad_afectada,
                    observacion: data.observacion
                });

            if (errorEvento) {
                console.error('Error registrando evento:', errorEvento);
                this.error.set(errorEvento.message);
                throw errorEvento;
            }

            const { data: loteActual, error: errorGetLote } = await this.supabase
                .from('lotes')
                .select('cantidad_actual')
                .eq('id', data.lote_id)
                .single();

            if (errorGetLote) {
                console.error('Error obteniendo lote:', errorGetLote);
                this.error.set(errorGetLote.message);
                throw errorGetLote;
            }

            const nuevaCantidad = loteActual.cantidad_actual - data.cantidad_afectada;

            const { error: errorUpdateLote } = await this.supabase
                .from('lotes')
                .update({ cantidad_actual: nuevaCantidad })
                .eq('id', data.lote_id);

            if (errorUpdateLote) {
                console.error('Error actualizando lote:', errorUpdateLote);
                this.error.set(errorUpdateLote.message);
                throw errorUpdateLote;
            }
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al registrar mortalidad');
            throw err;
        }
    }

    async registrarPesaje(data: {
        lote_id: number;
        fecha: string;
        peso_promedio: number;
    }): Promise<void> {
        try {
            this.error.set(null);

            const { error } = await this.supabase
                .from('lotes')
                .update({ peso_promedio_actual: data.peso_promedio })
                .eq('id', data.lote_id);

            if (error) {
                console.error('Error registrando pesaje:', error);
                this.error.set(error.message);
                throw error;
            }
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al registrar pesaje');
            throw err;
        }
    }

    async registrarVenta(data: {
        lote_id: number;
        lote_codigo: string;
        fecha: string;
        cliente: string;
        cantidad_vendida: number;
        peso_total: number;
        precio_por_kilo: number;
        total_venta: number;
        cerrar_lote: boolean;
    }): Promise<void> {
        try {
            this.error.set(null);

            const descripcion = `Venta Lote ${data.lote_codigo} - ${data.cliente}`;

            // Obtener categoría de forma robusta (busca "Venta de Cerdos" o fallback a tipo "operativo")
            const categoriaId = await this.obtenerCategoriaId('Venta de Cerdos', 'operativo');

            // VALIDACIÓN CRÍTICA: No permitir insertar con categoria_id null
            if (!categoriaId) {
                const errorMsg = 'No se pudo encontrar la categoría financiera para la venta. Por favor, asegúrate de que existe la categoría "Venta de Cerdos" o una categoría de tipo "operativo" en el sistema.';
                console.error('❌ Error de integridad de datos:', errorMsg);
                this.error.set(errorMsg);
                throw new Error(errorMsg);
            }

            console.log('✅ Categoría ID encontrada para venta:', categoriaId);

            const { error: errorIngreso } = await this.supabase
                .from('movimientos_caja')
                .insert({
                    fecha: data.fecha,
                    tipo: 'ingreso',
                    categoria_id: categoriaId, // Garantizado que no es null
                    monto: data.total_venta,
                    descripcion: descripcion,
                    lote_relacionado_id: data.lote_id
                });

            if (errorIngreso) {
                console.error('❌ Error registrando ingreso:', errorIngreso);
                this.error.set(errorIngreso.message);
                throw errorIngreso;
            }

            console.log('✅ Ingreso de venta registrado correctamente');

            // CRITICAL: Get current cantidad_actual to calculate remaining animals
            const { data: loteActual, error: errorLote } = await this.supabase
                .from('lotes')
                .select('cantidad_actual')
                .eq('id', data.lote_id)
                .single();

            if (errorLote) throw errorLote;

            // MATH: Always subtract sold quantity
            const nuevaCantidad = (loteActual?.cantidad_actual || 0) - data.cantidad_vendida;

            const updateData: any = {
                cantidad_actual: Math.max(0, nuevaCantidad) // Never negative
            };

            // Only close if explicitly requested
            if (data.cerrar_lote) {
                updateData.estado = 'cerrado_vendido';
                updateData.fecha_cierre = data.fecha;
            }

            const { error: errorUpdateLote } = await this.supabase
                .from('lotes')
                .update(updateData)
                .eq('id', data.lote_id);

            if (errorUpdateLote) {
                console.error('Error actualizando lote:', errorUpdateLote);
                this.error.set(errorUpdateLote.message);
                throw errorUpdateLote;
            }
        } catch (err: any) {
            console.error('Error inesperado:', err);
            this.error.set(err.message || 'Error al registrar venta');
            throw err;
        }
    }

    async crearCerda(data: {
        chapeta: string;
        raza: string;
        fecha_nacimiento: string;
        partos_acumulados: number;
        fue_comprada: boolean;
        valor_compra?: number;
        fecha_compra?: string;
    }): Promise<void> {
        try {
            this.error.set(null);

            // 1. Insertar Cerda
            const { data: cerda, error: errorCerda } = await this.supabase
                .from('cerdas')
                .insert({
                    chapeta: data.chapeta,
                    raza: data.raza,
                    fecha_nacimiento: data.fecha_nacimiento,
                    partos_acumulados: data.partos_acumulados,
                    estado: 'vacia',
                    activa: true
                })
                .select()
                .single();

            if (errorCerda) throw errorCerda;

            // 2. Registrar Compra si aplica
            if (data.fue_comprada && data.valor_compra && data.valor_compra > 0) {
                const descripcion = `Compra Cerda ${data.chapeta}`;

                // Obtener categoría de forma robusta (busca "Compra de Pie de Cría" o fallback a tipo "inversion")
                const categoriaId = await this.obtenerCategoriaId('Compra de Pie de Cría', 'inversion');

                // VALIDACIÓN CRÍTICA: No permitir insertar con categoria_id null
                if (!categoriaId) {
                    const errorMsg = 'No se pudo encontrar la categoría financiera para la compra de cerda. Por favor, asegúrate de que existe la categoría "Compra de Pie de Cría" o una categoría de tipo "inversión" en el sistema.';
                    console.error('❌ Error de integridad de datos:', errorMsg);
                    this.error.set(errorMsg);
                    throw new Error(errorMsg);
                }

                console.log('✅ Categoría ID encontrada para compra de cerda:', categoriaId);

                const { error: errorEgreso } = await this.supabase
                    .from('movimientos_caja')
                    .insert({
                        fecha: data.fecha_compra || new Date().toISOString().split('T')[0],
                        tipo: 'egreso',
                        categoria_id: categoriaId, // Garantizado que no es null
                        monto: data.valor_compra,
                        descripcion: descripcion,
                        metodo_pago: 'efectivo'
                    });

                if (errorEgreso) {
                    console.error('❌ Error registrando egreso de compra:', errorEgreso);
                    this.error.set(errorEgreso.message);
                    throw errorEgreso;
                }

                console.log('✅ Egreso de compra de cerda registrado correctamente');
            }

            await this.loadCerdas();

        } catch (err: any) {
            console.error('Error creando cerda:', err);
            this.error.set(err.message || 'Error al crear la cerda');
            throw err;
        }
    }

    /**
     * Registrar alimentación grupal para cerdas (maternidad/gestación)
     */
    async registrarAlimentacionCerdas(data: {
        insumo_id: number;
        cantidad: number;  // en kg
        costo_unitario_momento: number;
        etapa: string;  // 'Gestación' o 'Lactancia'
    }): Promise<void> {
        try {
            this.error.set(null);

            const notas = data.etapa
                ? `Alimentación Grupal - ${data.etapa}`
                : 'Alimentación Grupal - Maternidad';

            // Insertar en salidas_insumos
            const { error: errorSalida } = await this.supabase
                .from('salidas_insumos')
                .insert({
                    insumo_id: data.insumo_id,
                    cantidad: data.cantidad,
                    fecha: new Date().toISOString().split('T')[0],
                    costo_unitario_momento: data.costo_unitario_momento,
                    destino_tipo: 'cerda',  // CRÍTICO: Identifica gasto de cerdas
                    lote_id: null,
                    cerda_id: null,  // Gasto grupal, no específico
                    notas: notas
                });

            if (errorSalida) {
                console.error('Error registrando salida de insumo:', errorSalida);
                throw errorSalida;
            }

            console.log('Alimentación de cerdas registrada correctamente');

        } catch (err: any) {
            console.error('Error en registrarAlimentacionCerdas:', err);
            this.error.set(err.message || 'Error al registrar la alimentación');
            throw err;
        }
    }

    /**
     * Método robusto para obtener el ID de una categoría financiera
     * Busca por nombre exacto, y si no encuentra, busca por tipo_flujo como fallback
     * @param nombreCategoria Nombre exacto de la categoría a buscar
     * @param tipoFlujo Tipo de flujo como fallback ('operativo', 'inversion', 'administrativo')
     * @returns ID de la categoría o null si no se encuentra
     */
    private async obtenerCategoriaId(nombreCategoria: string, tipoFlujo?: 'operativo' | 'inversion' | 'administrativo'): Promise<number | null> {
        try {
            // Primera búsqueda: por nombre exacto
            const { data: categoria, error: errorCategoria } = await this.supabase
                .from('categorias_financieras')
                .select('id')
                .eq('nombre', nombreCategoria)
                .maybeSingle();

            if (errorCategoria) {
                console.warn(`Error buscando categoría "${nombreCategoria}":`, errorCategoria);
            }

            if (categoria?.id) {
                console.log(`✅ Categoría ID encontrada: ${categoria.id} para "${nombreCategoria}"`);
                return categoria.id;
            }

            // Segunda búsqueda: por tipo_flujo si se proporciona
            if (tipoFlujo) {
                const { data: categoriaFallback, error: errorFallback } = await this.supabase
                    .from('categorias_financieras')
                    .select('id')
                    .eq('tipo_flujo', tipoFlujo)
                    .limit(1)
                    .maybeSingle();

                if (categoriaFallback?.id) {
                    console.warn(`⚠️ Categoría "${nombreCategoria}" no encontrada. Usando categoría de tipo "${tipoFlujo}" (ID: ${categoriaFallback.id})`);
                    return categoriaFallback.id;
                }
            }

            console.error(`❌ Categoría "${nombreCategoria}" no encontrada y no hay fallback disponible`);
            return null;
        } catch (err: any) {
            console.error(`Error en obtenerCategoriaId para "${nombreCategoria}":`, err);
            return null;
        }
    }

    /**
     * Obtiene el historial sanitario de un lote
     */
    async getHistorialSanitario(loteId: number): Promise<EventoSanitario[]> {
        try {
            const { data, error } = await this.supabase
                .from('eventos_sanitarios')
                .select('*')
                .eq('lote_id', loteId)
                .order('fecha', { ascending: false });

            if (error) {
                console.error('Error cargando historial sanitario:', error);
                throw error;
            }

            return (data || []) as EventoSanitario[];
        } catch (err: any) {
            console.error('Error inesperado cargando historial sanitario:', err);
            throw err;
        }
    }

    /**
     * Obtiene el historial de alimentación de un lote
     */
    async getHistorialAlimento(loteId: number): Promise<SalidaInsumo[]> {
        try {
            const { data, error } = await this.supabase
                .from('salidas_insumos')
                .select(`
                    *,
                    insumos (
                        nombre,
                        unidad_medida
                    )
                `)
                .eq('lote_id', loteId)
                .eq('destino_tipo', 'lote')
                .order('fecha', { ascending: false });

            if (error) {
                console.error('Error cargando historial de alimento:', error);
                throw error;
            }

            return (data || []) as any[];
        } catch (err: any) {
            console.error('Error inesperado cargando historial de alimento:', err);
            throw err;
        }
    }

    clearError() {
        this.error.set(null);
    }
}
