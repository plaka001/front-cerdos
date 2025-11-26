// Dashboard Data Models

export interface DashboardKpi {
    totalCerdas: number;
    totalEngorde: number;
    lotesActivos: number;
    tasaMortalidad: number; // Porcentaje con 1 decimal
    gastoMes: number; // Total egresos del mes actual
}

export interface AlertaInsumo {
    nombre: string;
    stockActual: number;
    stockMinimo: number;
    unidad: string;
}

export interface AlertaParto {
    chapetaCerda: string;
    fechaProbable: Date;
    diasRestantes: number;
}

export interface DashboardData {
    kpis: DashboardKpi;
    alertasInsumos: AlertaInsumo[];
    alertasPartos: AlertaParto[];
}
