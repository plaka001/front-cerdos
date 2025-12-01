export type TipoInsumo = 'alimento' | 'medicamento' | 'biologico' | 'material' | 'otro';
export type UnidadMedida = 'kg' | 'gr' | 'ml' | 'dosis' | 'unidad' | 'bulto';
export type EstadoCerda = 'vacia' | 'gestante' | 'lactante' | 'descarte';
export type EstadoLote = 'activo' | 'cerrado_vendido';
export type TipoFlujo = 'operativo' | 'inversion' | 'administrativo';
export type DestinoSalida = 'lote' | 'cerda' | 'general';
export type TipoMovimientoCaja = 'ingreso' | 'egreso';
export type TipoEventoSanitario = 'muerte' | 'enfermedad' | 'tratamiento';

export interface CategoriaFinanciera {
    id: number;
    nombre: string;
    tipo_flujo: TipoFlujo;
    descripcion?: string;
    es_automatica?: boolean; // default false - true para categoras usadas solo por el sistema
    created_at?: string;
}

export interface Insumo {
    id: number;
    nombre: string;
    tipo: TipoInsumo;
    unidad_medida: UnidadMedida;
    presentacion_compra: number; // default 40
    stock_actual: number; // default 0
    costo_promedio: number; // default 0
    stock_minimo: number; // default 5
    activo: boolean; // default true
    created_at?: string;
}

export interface Cerda {
    id: number;
    chapeta: string;
    fecha_nacimiento?: string;
    raza?: string;
    estado: EstadoCerda; // default 'vacia'
    partos_acumulados: number; // default 0
    activa: boolean; // default true
    notas?: string;
    created_at?: string;
}

export interface CicloReproductivo {
    id: number;
    cerda_id: number;
    // Inseminacin
    fecha_inseminacion?: string;
    padre_semen?: string;
    costo_servicio: number; // default 0
    // Parto
    fecha_parto_probable?: string;
    fecha_parto_real?: string;
    nacidos_vivos: number; // default 0
    nacidos_muertos: number; // default 0
    momias: number; // default 0
    // Destete
    fecha_destete?: string;
    lechones_destetados: number; // default 0
    peso_promedio_destete?: number;
    estado: string; // default 'abierto'
    observaciones?: string;
    created_at?: string;
}

export interface CerdaDetalle extends Cerda {
    cicloActivo?: {
        id: number;
        fecha_inseminacion: string;
        fecha_parto_probable?: string;
        fecha_parto_real?: string;
        fecha_destete?: string;
        nacidos_vivos: number;
        nacidos_muertos: number;
        estado: string;
    };
    // Campos calculados
    diasGestacion?: number;
    diasLactancia?: number;
    diasParaParto?: number;
}

export interface Lote {
    id: number;
    codigo: string;
    fecha_inicio: string; // default current_date
    fecha_cierre?: string;
    ubicacion: string; // default 'precebo'
    cantidad_inicial: number;
    cantidad_actual: number;
    costo_inicial_lote: number; // default 0
    estado: EstadoLote; // default 'activo'
    created_at?: string;
    peso_promedio_inicial?: number;
    observaciones?: string;
    peso_promedio_actual?: number;
}

export interface LoteDetalle extends Lote {
    diasEnGranja: number;
}

export interface LoteOrigen {
    id: number;
    lote_id: number;
    ciclo_id: number;
    cantidad_aportada: number;
    created_at?: string;
}

export interface CompraInsumo {
    id: number;
    fecha: string; // default current_date
    insumo_id: number;
    proveedor?: string;
    cantidad_comprada: number;
    cantidad_real_ingresada?: number;
    precio_total_factura: number;
    precio_unitario_final?: number;
    numero_factura?: string;
    created_at?: string;
}

export interface SalidaInsumo {
    id: number;
    fecha: string; // default current_date
    insumo_id: number;
    cantidad: number;
    destino_tipo: DestinoSalida;
    lote_id?: number;
    cerda_id?: number;
    costo_unitario_momento: number;
    costo_total_salida?: number; // generated
    notas?: string;
    created_at?: string;
}

export interface MovimientoCaja {
    id: number;
    fecha: string; // default current_date
    tipo: TipoMovimientoCaja;
    categoria_id: number;
    monto: number;
    descripcion?: string;
    metodo_pago: string; // default 'efectivo'
    lote_relacionado_id?: number;
    url_comprobante?: string;
    created_at?: string;
}

export interface EventoSanitario {
    id: number;
    fecha: string; // default current_date
    tipo: TipoEventoSanitario;
    lote_id?: number;
    cerda_id?: number;
    cantidad_afectada: number; // default 1
    observacion?: string;
    created_at?: string;
}

export interface ReporteRentabilidad {
    lote_id: number;
    codigo: string;
    estado: EstadoLote;
    cantidad_inicial: number;
    cantidad_actual: number;
    inversion_animales: number;
    costo_alimentacion: number;
    costo_total_acumulado: number;
    total_ventas: number;
    ganancia_neta: number;
}

export interface ReporteCostosMaternidad {
    mes: string;
    total_gastos_madres: number;
    total_lechones_producidos: number;
    costo_por_lechon: number;
}

export interface ReporteGastoCategoria {
    mes: string;
    categoria_nombre: string;
    tipo_flujo: 'operativo' | 'inversion' | 'administrativo';
    total_gastado: number;
    cantidad_movimientos: number;
}

export interface ReporteFlujoCaja {
    mes: string;
    categoria_nombre: string;
    tipo: 'ingreso' | 'egreso';
    total: number;
}
