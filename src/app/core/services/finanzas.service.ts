import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
    CategoriaFinanciera, MovimientoCaja, CompraInsumo, Insumo, SalidaInsumo,
    Proveedor, ProveedorSaldo, MovimientoProveedor, CuentaCaja, CuentaCajaSaldo
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class FinanzasService {
    private supabase = inject(SupabaseService).client;

    categorias = signal<CategoriaFinanciera[]>([]);
    insumos = signal<Insumo[]>([]);
    cuentas = signal<CuentaCaja[]>([]);
    proveedores = signal<Proveedor[]>([]);

    constructor() {
        this.loadCategorias();
        this.loadInsumos();
        this.loadCuentas();
        this.loadProveedores();
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

    async loadCuentas() {
        const { data } = await this.supabase
            .from('cuentas_caja')
            .select('*')
            .eq('activa', true)
            .order('id');

        if (data) {
            this.cuentas.set(data as CuentaCaja[]);
        }
    }

    async loadProveedores() {
        const { data } = await this.supabase
            .from('proveedores')
            .select('*')
            .eq('activo', true)
            .order('nombre');

        if (data) {
            this.proveedores.set(data as Proveedor[]);
        }
    }

    async registrarMovimiento(movimiento: Partial<MovimientoCaja>, compra?: Partial<CompraInsumo>) {
        // Caso especial: compra de insumo A CRÉDITO
        // No toca la caja: el insumo entra al inventario y el valor carga la deuda del proveedor
        if (compra && compra.forma_pago === 'credito') {
            return this.registrarCompraCredito(movimiento, compra);
        }

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

    /**
     * Compra de insumo a crédito: entra al inventario (trigger de stock)
     * y carga la deuda del proveedor SIN descontar caja.
     */
    private async registrarCompraCredito(movimiento: Partial<MovimientoCaja>, compra: Partial<CompraInsumo>) {
        if (!compra.proveedor_id) {
            throw new Error('Una compra a crédito requiere seleccionar el proveedor');
        }

        // 1. Insertar la compra (el trigger actualiza stock y costo promedio)
        const compraData = {
            ...compra,
            precio_total_factura: movimiento.monto
        };

        const { data: compraInsertada, error: compraError } = await this.supabase
            .from('compras_insumos')
            .insert(compraData)
            .select()
            .single();

        if (compraError) throw compraError;

        // 2. Cargar la deuda del proveedor (el renglón del "cuaderno")
        const { error: deudaError } = await this.supabase
            .from('movimientos_proveedor')
            .insert({
                proveedor_id: compra.proveedor_id,
                fecha: compra.fecha,
                tipo: 'compra_credito',
                monto: movimiento.monto,
                descripcion: movimiento.descripcion,
                compra_id: compraInsertada.id
            });

        if (deudaError) throw deudaError;

        return compraInsertada;
    }

    /**
     * Abono a la deuda de un proveedor: sale plata real de la caja elegida
     * y baja la deuda en el "cuaderno digital".
     */
    async registrarAbono(abono: {
        proveedor_id: number;
        cuenta_id: number;
        monto: number;
        fecha: string;
        descripcion?: string;
    }) {
        const categoriaId = await this.obtenerCategoriaIdPorNombre('Abono Deuda Proveedor');
        const proveedor = this.proveedores().find(p => p.id == abono.proveedor_id);

        // 1. Egreso de caja
        const { data: mov, error: movError } = await this.supabase
            .from('movimientos_caja')
            .insert({
                fecha: abono.fecha,
                tipo: 'egreso',
                categoria_id: categoriaId,
                monto: abono.monto,
                descripcion: abono.descripcion || `Abono deuda ${proveedor?.nombre || 'proveedor'}`,
                metodo_pago: 'efectivo',
                cuenta_id: abono.cuenta_id
            })
            .select()
            .single();

        if (movError) throw movError;

        // 2. Rebaja de la deuda
        const { error: deudaError } = await this.supabase
            .from('movimientos_proveedor')
            .insert({
                proveedor_id: abono.proveedor_id,
                fecha: abono.fecha,
                tipo: 'abono',
                monto: abono.monto,
                descripcion: abono.descripcion || 'Abono',
                movimiento_caja_id: mov.id
            });

        if (deudaError) throw deudaError;

        return mov;
    }

    /**
     * Transferencia interna entre cajas propias (no es gasto ni ingreso real).
     */
    async registrarTransferencia(transferencia: {
        origen_id: number;
        destino_id: number;
        monto: number;
        fecha: string;
        nota?: string;
    }) {
        if (transferencia.origen_id === transferencia.destino_id) {
            throw new Error('La cuenta de origen y destino no pueden ser la misma');
        }

        const categoriaId = await this.obtenerCategoriaIdPorNombre('Transferencia entre Cajas');
        const cuentas = this.cuentas();
        const origen = cuentas.find(c => c.id == transferencia.origen_id);
        const destino = cuentas.find(c => c.id == transferencia.destino_id);
        const descripcion = transferencia.nota
            || `Transferencia: ${origen?.nombre || 'origen'} → ${destino?.nombre || 'destino'}`;

        // 1. Sale de la cuenta origen
        const { error: egresoError } = await this.supabase
            .from('movimientos_caja')
            .insert({
                fecha: transferencia.fecha,
                tipo: 'egreso',
                categoria_id: categoriaId,
                monto: transferencia.monto,
                descripcion,
                metodo_pago: 'efectivo',
                cuenta_id: transferencia.origen_id
            });

        if (egresoError) throw egresoError;

        // 2. Entra a la cuenta destino
        const { error: ingresoError } = await this.supabase
            .from('movimientos_caja')
            .insert({
                fecha: transferencia.fecha,
                tipo: 'ingreso',
                categoria_id: categoriaId,
                monto: transferencia.monto,
                descripcion,
                metodo_pago: 'efectivo',
                cuenta_id: transferencia.destino_id
            });

        if (ingresoError) throw ingresoError;
    }

    /**
     * Saldo actual de cada caja:
     * saldo_inicial (plata contada al corte) + movimientos asignados a la cuenta.
     */
    async getSaldosCuentas(): Promise<CuentaCajaSaldo[]> {
        const [{ data: cuentas, error: cuentasError }, { data: movs, error: movsError }] = await Promise.all([
            this.supabase.from('cuentas_caja').select('*').eq('activa', true).order('id'),
            this.supabase.from('movimientos_caja').select('cuenta_id, tipo, monto').not('cuenta_id', 'is', null)
        ]);

        if (cuentasError) throw cuentasError;
        if (movsError) throw movsError;

        return (cuentas || []).map(cuenta => {
            const movimientosCuenta = (movs || []).filter(m => m.cuenta_id === cuenta.id);
            const neto = movimientosCuenta.reduce(
                (sum, m) => sum + (m.tipo === 'ingreso' ? (m.monto || 0) : -(m.monto || 0)),
                0
            );
            return {
                ...cuenta,
                saldo_actual: (cuenta.saldo_inicial || 0) + neto
            } as CuentaCajaSaldo;
        });
    }

    /**
     * Deuda actual con cada proveedor:
     * saldo_inicial + compras a crédito - abonos.
     */
    async getProveedoresConSaldo(): Promise<ProveedorSaldo[]> {
        const [{ data: proveedores, error: provError }, { data: movs, error: movsError }] = await Promise.all([
            this.supabase.from('proveedores').select('*').eq('activo', true).order('nombre'),
            this.supabase.from('movimientos_proveedor').select('proveedor_id, tipo, monto')
        ]);

        if (provError) throw provError;
        if (movsError) throw movsError;

        return (proveedores || []).map(proveedor => {
            const movimientosProveedor = (movs || []).filter(m => m.proveedor_id === proveedor.id);
            const deuda = movimientosProveedor.reduce(
                (sum, m) => sum + (m.tipo === 'abono' ? -(m.monto || 0) : (m.monto || 0)),
                0
            );
            return {
                ...proveedor,
                deuda_actual: deuda
            } as ProveedorSaldo;
        });
    }

    /**
     * Historial de un proveedor: compras a crédito y abonos (el cuaderno).
     */
    async getHistorialProveedor(proveedorId: number): Promise<MovimientoProveedor[]> {
        const { data, error } = await this.supabase
            .from('movimientos_proveedor')
            .select('*')
            .eq('proveedor_id', proveedorId)
            .order('fecha', { ascending: false })
            .order('id', { ascending: false });

        if (error) throw error;
        return (data || []) as MovimientoProveedor[];
    }

    async crearProveedor(nombre: string, telefono?: string): Promise<Proveedor> {
        const { data, error } = await this.supabase
            .from('proveedores')
            .insert({ nombre, telefono })
            .select()
            .single();

        if (error) throw error;
        await this.loadProveedores();
        return data as Proveedor;
    }

    private async obtenerCategoriaIdPorNombre(nombre: string): Promise<number> {
        const local = this.categorias().find(c => c.nombre === nombre);
        if (local) return local.id;

        const { data, error } = await this.supabase
            .from('categorias_financieras')
            .select('id')
            .eq('nombre', nombre)
            .single();

        if (error || !data) {
            throw new Error(`No existe la categoría financiera "${nombre}"`);
        }
        return data.id;
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
