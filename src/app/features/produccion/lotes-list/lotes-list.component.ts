import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { LoteDetalle } from '../../../core/models';
import { ProduccionService } from '../../../core/services/produccion.service';
import { AlimentarLoteModalComponent } from '../components/alimentar-lote-modal/alimentar-lote-modal.component';
import { RegistrarMortalidadModalComponent } from '../components/registrar-mortalidad-modal/registrar-mortalidad-modal.component';
import { RegistrarPesajeModalComponent } from '../components/registrar-pesaje-modal/registrar-pesaje-modal.component';
import { RegistrarVentaModalComponent } from '../components/registrar-venta-modal/registrar-venta-modal.component';

@Component({
    selector: 'app-lotes-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, AlimentarLoteModalComponent, RegistrarMortalidadModalComponent, RegistrarPesajeModalComponent, RegistrarVentaModalComponent],
    templateUrl: './lotes-list.component.html'
})
export class LotesListComponent implements OnInit {
    private produccionService = inject(ProduccionService);

    lotes = signal<LoteDetalle[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);
    showAlimentarModal = signal<boolean>(false);
    loteSeleccionado = signal<LoteDetalle | null>(null);
    toastMessage = signal<string | null>(null);
    showMortalidadModal = signal<boolean>(false);
    loteSeleccionadoMortalidad = signal<LoteDetalle | null>(null);
    showPesajeModal = signal<boolean>(false);
    loteSeleccionadoPesaje = signal<LoteDetalle | null>(null);
    showVentaModal = signal<boolean>(false);
    loteSeleccionadoVenta = signal<LoteDetalle | null>(null);

    async ngOnInit() {
        await this.cargarLotes();
    }

    async cargarLotes() {
        try {
            this.loading.set(true);
            const data = await this.produccionService.getLotes();
            this.lotes.set(data);
        } catch (err: any) {
            this.error.set('Error cargando la lista de lotes');
        } finally {
            this.loading.set(false);
        }
    }

    // Acciones de lote
    alimentarLote(lote: LoteDetalle) {
        this.loteSeleccionado.set(lote);
        this.showAlimentarModal.set(true);
    }

    onAlimentarSaved() {
        this.showAlimentarModal.set(false);
        this.loteSeleccionado.set(null);
        this.showToast('Registro guardado');
        this.cargarLotes(); // Refresh list
    }

    onAlimentarClosed() {
        this.showAlimentarModal.set(false);
        this.loteSeleccionado.set(null);
    }

    showToast(message: string) {
        this.toastMessage.set(message);
        setTimeout(() => this.toastMessage.set(null), 3000);
    }

    pesarLote(lote: LoteDetalle) {
        this.loteSeleccionadoPesaje.set(lote);
        this.showPesajeModal.set(true);
    }

    onPesajeSaved() {
        this.showPesajeModal.set(false);
        this.loteSeleccionadoPesaje.set(null);
        this.showToast('Pesaje registrado');
        this.cargarLotes(); // Refresh list
    }

    onPesajeClosed() {
        this.showPesajeModal.set(false);
        this.loteSeleccionadoPesaje.set(null);
    }

    registrarMortalidad(lote: LoteDetalle) {
        this.loteSeleccionadoMortalidad.set(lote);
        this.showMortalidadModal.set(true);
    }

    onMortalidadSaved() {
        this.showMortalidadModal.set(false);
        this.loteSeleccionadoMortalidad.set(null);
        this.showToast('Baja registrada');
        this.cargarLotes(); // Refresh list
    }

    onMortalidadClosed() {
        this.showMortalidadModal.set(false);
        this.loteSeleccionadoMortalidad.set(null);
    }

    venderLote(lote: LoteDetalle) {
        this.loteSeleccionadoVenta.set(lote);
        this.showVentaModal.set(true);
    }

    onVentaSaved() {
        this.showVentaModal.set(false);
        const lote = this.loteSeleccionadoVenta();
        this.loteSeleccionadoVenta.set(null);

        // Calculate total from the modal (we'll get it from the event)
        this.showToast('¡Lote vendido exitosamente! 🎉');
        this.cargarLotes(); // Refresh list - lote will disappear if closed
    }

    onVentaClosed() {
        this.showVentaModal.set(false);
        this.loteSeleccionadoVenta.set(null);
    }

    // Helper para determinar si el lote está cerrado
    isLoteCerrado(lote: LoteDetalle): boolean {
        return lote.estado === 'cerrado_vendido' || lote.estado === 'cerrado';
    }
}
