import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FinanzasService } from '../../../core/services/finanzas.service';
import { CuentaCajaSaldo, ProveedorSaldo, MovimientoProveedor } from '../../../core/models';

@Component({
    selector: 'app-cajas-deudas',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './cajas-deudas.component.html'
})
export class CajasDeudasComponent implements OnInit {
    private finanzasService = inject(FinanzasService);

    loading = signal(true);
    cuentas = signal<CuentaCajaSaldo[]>([]);
    proveedores = signal<ProveedorSaldo[]>([]);

    // Historial expandido por proveedor
    historialAbierto = signal<number | null>(null);
    historial = signal<MovimientoProveedor[]>([]);
    historialLoading = signal(false);

    // Modal de abono
    abonoProveedor = signal<ProveedorSaldo | null>(null);
    abonoMonto = signal<number>(0);
    abonoMontoFormateado = signal<string>('');
    abonoCuentaId = signal<number | null>(null);
    abonoFecha = signal<string>(new Date().toISOString().split('T')[0]);
    abonoGuardando = signal(false);

    // Modal de transferencia
    transferAbierta = signal(false);
    transferOrigenId = signal<number | null>(null);
    transferDestinoId = signal<number | null>(null);
    transferMonto = signal<number>(0);
    transferMontoFormateado = signal<string>('');
    transferGuardando = signal(false);

    // Modal nuevo proveedor
    nuevoProveedorAbierto = signal(false);
    nuevoProveedorNombre = signal('');

    toastMessage = signal<{ text: string, type: 'success' | 'error' } | null>(null);

    totalCajas = computed(() =>
        this.cuentas().reduce((sum, c) => sum + c.saldo_actual, 0)
    );

    totalDeudas = computed(() =>
        this.proveedores().reduce((sum, p) => sum + p.deuda_actual, 0)
    );

    netoReal = computed(() => this.totalCajas() - this.totalDeudas());

    ngOnInit() {
        this.cargarTodo();
    }

    async cargarTodo() {
        this.loading.set(true);
        try {
            const [cuentas, proveedores] = await Promise.all([
                this.finanzasService.getSaldosCuentas(),
                this.finanzasService.getProveedoresConSaldo()
            ]);
            this.cuentas.set(cuentas);
            this.proveedores.set(proveedores);
        } catch (err) {
            console.error('Error cargando cajas y deudas:', err);
            this.showToast('Error cargando la información', 'error');
        } finally {
            this.loading.set(false);
        }
    }

    // ============ Historial ============

    async toggleHistorial(proveedorId: number) {
        if (this.historialAbierto() === proveedorId) {
            this.historialAbierto.set(null);
            return;
        }
        this.historialAbierto.set(proveedorId);
        this.historialLoading.set(true);
        try {
            const movs = await this.finanzasService.getHistorialProveedor(proveedorId);
            this.historial.set(movs);
        } catch (err) {
            console.error('Error cargando historial:', err);
            this.showToast('Error cargando el historial', 'error');
        } finally {
            this.historialLoading.set(false);
        }
    }

    // ============ Abono ============

    abrirAbono(proveedor: ProveedorSaldo) {
        this.abonoProveedor.set(proveedor);
        this.abonoMonto.set(0);
        this.abonoMontoFormateado.set('');
        this.abonoFecha.set(new Date().toISOString().split('T')[0]);
        // Default: Efectivo Yeison (quien suele pagar el cuido)
        const yeison = this.cuentas().find(c => c.nombre.toLowerCase().includes('yeison'));
        this.abonoCuentaId.set((yeison || this.cuentas()[0])?.id ?? null);
    }

    onAbonoMontoInput(event: any) {
        const numero = parseInt(event.target.value.replace(/\D/g, '')) || 0;
        this.abonoMonto.set(numero);
        this.abonoMontoFormateado.set(numero === 0 ? '' : numero.toLocaleString('es-CO'));
    }

    async guardarAbono() {
        const proveedor = this.abonoProveedor();
        const cuentaId = this.abonoCuentaId();
        const monto = this.abonoMonto();

        if (!proveedor || !cuentaId || monto <= 0) return;
        if (monto > proveedor.deuda_actual) {
            this.showToast('El abono no puede ser mayor que la deuda', 'error');
            return;
        }

        this.abonoGuardando.set(true);
        try {
            await this.finanzasService.registrarAbono({
                proveedor_id: proveedor.id,
                cuenta_id: cuentaId,
                monto,
                fecha: this.abonoFecha()
            });
            this.abonoProveedor.set(null);
            this.showToast('Abono registrado: deuda y caja actualizadas', 'success');
            await this.cargarTodo();
            // Refrescar historial si está abierto para este proveedor
            if (this.historialAbierto() === proveedor.id) {
                this.historial.set(await this.finanzasService.getHistorialProveedor(proveedor.id));
            }
        } catch (err) {
            console.error('Error registrando abono:', err);
            this.showToast('Error al registrar el abono', 'error');
        } finally {
            this.abonoGuardando.set(false);
        }
    }

    // ============ Transferencia ============

    abrirTransferencia() {
        this.transferAbierta.set(true);
        this.transferMonto.set(0);
        this.transferMontoFormateado.set('');
        const cuentas = this.cuentas();
        this.transferOrigenId.set(cuentas[0]?.id ?? null);
        this.transferDestinoId.set(cuentas[1]?.id ?? null);
    }

    onTransferMontoInput(event: any) {
        const numero = parseInt(event.target.value.replace(/\D/g, '')) || 0;
        this.transferMonto.set(numero);
        this.transferMontoFormateado.set(numero === 0 ? '' : numero.toLocaleString('es-CO'));
    }

    async guardarTransferencia() {
        const origen = this.transferOrigenId();
        const destino = this.transferDestinoId();
        const monto = this.transferMonto();

        if (!origen || !destino || monto <= 0) return;
        if (origen === destino) {
            this.showToast('Elige cuentas diferentes', 'error');
            return;
        }

        this.transferGuardando.set(true);
        try {
            await this.finanzasService.registrarTransferencia({
                origen_id: origen,
                destino_id: destino,
                monto,
                fecha: new Date().toISOString().split('T')[0]
            });
            this.transferAbierta.set(false);
            this.showToast('Transferencia registrada', 'success');
            await this.cargarTodo();
        } catch (err) {
            console.error('Error en transferencia:', err);
            this.showToast('Error al registrar la transferencia', 'error');
        } finally {
            this.transferGuardando.set(false);
        }
    }

    // ============ Nuevo proveedor ============

    async guardarProveedor() {
        const nombre = this.nuevoProveedorNombre().trim();
        if (!nombre) return;

        try {
            await this.finanzasService.crearProveedor(nombre);
            this.nuevoProveedorAbierto.set(false);
            this.nuevoProveedorNombre.set('');
            this.showToast('Proveedor creado', 'success');
            await this.cargarTodo();
        } catch (err) {
            console.error('Error creando proveedor:', err);
            this.showToast('Error al crear el proveedor', 'error');
        }
    }

    // ============ Helpers ============

    formatMonto(valor: number): string {
        return '$' + (valor || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });
    }

    cuentaIcono(nombre: string): string {
        // Cuenta bancaria → banco; efectivo → billetes
        return nombre.toLowerCase().includes('cuenta') ? 'landmark' : 'banknote';
    }

    tipoMovimientoLabel(tipo: string): string {
        switch (tipo) {
            case 'compra_credito': return 'Compra fiada';
            case 'abono': return 'Abono';
            case 'saldo_inicial': return 'Saldo inicial';
            default: return tipo;
        }
    }

    showToast(text: string, type: 'success' | 'error') {
        this.toastMessage.set({ text, type });
        setTimeout(() => this.toastMessage.set(null), 3000);
    }
}
