import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { LoteDetalle } from '../../../core/models';
import { ProduccionService } from '../../../core/services/produccion.service';
import { AlimentarLoteModalComponent } from '../components/alimentar-lote-modal/alimentar-lote-modal.component';
import { RegistrarMortalidadModalComponent } from '../components/registrar-mortalidad-modal/registrar-mortalidad-modal.component';
import { RegistrarPesajeModalComponent } from '../components/registrar-pesaje-modal/registrar-pesaje-modal.component';
import { RegistrarVentaModalComponent } from '../components/registrar-venta-modal/registrar-venta-modal.component';
import { LoteDetalleModalComponent } from '../components/lote-detalle-modal/lote-detalle-modal.component';
import { RegistrarSanidadLoteModalComponent } from '../components/registrar-sanidad-lote-modal/registrar-sanidad-lote-modal.component';
import { TrasladoLoteModalComponent } from '../components/traslado-lote-modal/traslado-lote-modal.component';
import { TrasladoEtapaModalComponent } from '../components/traslado-etapa-modal/traslado-etapa-modal.component';

@Component({
    selector: 'app-lotes-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, AlimentarLoteModalComponent, RegistrarMortalidadModalComponent, RegistrarPesajeModalComponent, RegistrarVentaModalComponent, LoteDetalleModalComponent, RegistrarSanidadLoteModalComponent, TrasladoLoteModalComponent, TrasladoEtapaModalComponent],
    templateUrl: './lotes-list.component.html'
})
export class LotesListComponent implements OnInit {
    private produccionService = inject(ProduccionService);
    private route = inject(ActivatedRoute);

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
    showDetalleModal = signal<boolean>(false);
    loteSeleccionadoDetalle = signal<LoteDetalle | null>(null);
    showSanidadModal = signal<boolean>(false);
    loteSeleccionadoSanidad = signal<LoteDetalle | null>(null);
    showTrasladoModal = signal<boolean>(false);
    loteSeleccionadoTraslado = signal<LoteDetalle | null>(null);
    showTrasladoEtapaModal = signal<boolean>(false);
    loteSeleccionadoTrasladoEtapa = signal<LoteDetalle | null>(null);

    // Route Data
    tituloPagina = signal('Lotes');
    etapaActual = signal<string | undefined>(undefined);

    // Accordion state
    expandedLotes = signal<Set<number>>(new Set());

    // Dropdown Menu State
    openMenuId = signal<number | null>(null);

    // Filters
    filtroEstado = signal<'activo' | 'cerrado' | 'todos'>('activo');

    lotesFiltrados = computed(() => {
        const lotes = this.lotes();
        const filtro = this.filtroEstado();

        if (filtro === 'activo') {
            return lotes.filter(l => l.estado === 'activo');
        } else if (filtro === 'cerrado') {
            return lotes.filter(l => l.estado === 'cerrado_vendido');
        }
        return lotes;
    });

    // Computed counts for tabs
    conteoActivos = computed(() => this.lotes().filter(l => l.estado === 'activo').length);
    conteoCerrados = computed(() => this.lotes().filter(l => l.estado === 'cerrado_vendido').length);

    async ngOnInit() {
        this.route.data.subscribe(data => {
            if (data['etapa']) {
                this.etapaActual.set(data['etapa']);
                this.tituloPagina.set(data['titulo'] || (data['etapa'] === 'precebo' ? 'Precebo' : 'Engorde'));
            } else {
                this.tituloPagina.set('Todos los Lotes');
            }
            this.cargarLotes();
        });

        // Close menu on click outside
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.menu-trigger') && !target.closest('.menu-dropdown')) {
                this.openMenuId.set(null);
            }
        });
    }

    // Accordion methods
    toggleExpand(id: number, event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        const current = new Set(this.expandedLotes());

        // If clicking the already open one, close it
        if (current.has(id)) {
            current.clear();
        } else {
            // Otherwise, close all others and open this one
            current.clear();
            current.add(id);
        }

        this.expandedLotes.set(current);
    }

    isExpanded(id: number): boolean {
        return this.expandedLotes().has(id);
    }

    // Menu methods
    toggleMenu(id: number, event: Event) {
        event.stopPropagation();
        if (this.openMenuId() === id) {
            this.openMenuId.set(null);
        } else {
            this.openMenuId.set(id);
        }
    }

    async cargarLotes() {
        try {
            this.loading.set(true);
            const data = await this.produccionService.getLotes(this.etapaActual());
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
        return lote.estado === 'cerrado_vendido';
    }

    // Ver historial del lote
    verHistorial(lote: LoteDetalle) {
        this.loteSeleccionadoDetalle.set(lote);
        this.showDetalleModal.set(true);
    }

    onDetalleClosed() {
        this.showDetalleModal.set(false);
        this.loteSeleccionadoDetalle.set(null);
    }

    // Sanidad
    registrarSanidad(lote: LoteDetalle) {
        this.loteSeleccionadoSanidad.set(lote);
        this.showSanidadModal.set(true);
    }

    onSanidadSaved() {
        this.showSanidadModal.set(false);
        this.loteSeleccionadoSanidad.set(null);
        this.showToast('Evento sanitario registrado');
        this.cargarLotes();
    }

    onSanidadClosed() {
        this.showSanidadModal.set(false);
        this.loteSeleccionadoSanidad.set(null);
    }

    // Traslado
    trasladarLote(lote: LoteDetalle) {
        this.loteSeleccionadoTraslado.set(lote);
        this.showTrasladoModal.set(true);
    }

    onTrasladoSaved() {
        this.showTrasladoModal.set(false);
        this.loteSeleccionadoTraslado.set(null);
        this.showToast('Lote trasladado exitosamente');
        this.cargarLotes();
    }

    onTrasladoClosed() {
        this.showTrasladoModal.set(false);
        this.loteSeleccionadoTraslado.set(null);
    }

    // Traslado Etapa
    trasladarEtapa(lote: LoteDetalle) {
        this.loteSeleccionadoTrasladoEtapa.set(lote);
        this.showTrasladoEtapaModal.set(true);
    }

    onTrasladoEtapaSaved() {
        this.showTrasladoEtapaModal.set(false);
        this.loteSeleccionadoTrasladoEtapa.set(null);
        this.showToast('¡Lote trasladado a Engorde! 🚀');
        this.cargarLotes();
    }

    onTrasladoEtapaClosed() {
        this.showTrasladoEtapaModal.set(false);
        this.loteSeleccionadoTrasladoEtapa.set(null);
    }
}
