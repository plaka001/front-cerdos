import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../core/services/produccion.service';
import { CerdaDetalle } from '../../../core/models';
import { EventModalComponent } from '../components/event-modal/event-modal.component';
import { NuevaCerdaModalComponent } from '../components/nueva-cerda-modal/nueva-cerda-modal.component';
import { AlimentarCerdasModalComponent } from '../components/alimentar-cerdas-modal/alimentar-cerdas-modal.component';
import { CerdaHistorialModalComponent } from '../components/cerda-historial-modal/cerda-historial-modal.component';

@Component({
    selector: 'app-cerdas-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, EventModalComponent, NuevaCerdaModalComponent, AlimentarCerdasModalComponent, CerdaHistorialModalComponent],
    templateUrl: './cerdas-list.component.html'
})
export class CerdasListComponent implements OnInit {
    private produccionService = inject(ProduccionService);

    cerdas = signal<CerdaDetalle[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    // Modal state
    selectedCerda = signal<CerdaDetalle | null>(null);
    modalOpen = signal<boolean>(false);
    modalType = signal<'inseminacion' | 'parto' | 'destete' | 'falla' | 'sanidad' | 'venta' | 'muerte' | null>(null);

    // Historial Modal
    historialModalOpen = signal<boolean>(false);

    // Dropdown Menu State
    openMenuId = signal<number | null>(null);

    // Nueva Cerda Modal
    nuevaCerdaModalOpen = signal<boolean>(false);

    // Alimentar Cerdas Modal
    alimentarModalOpen = signal<boolean>(false);

    // Accordion state
    expandedCerdas = signal<Set<number>>(new Set());

    async ngOnInit() {
        await this.cargarCerdas();

        // Close menu on click outside
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.menu-trigger') && !target.closest('.menu-dropdown')) {
                this.openMenuId.set(null);
            }
        });
    }

    async cargarCerdas() {
        try {
            this.loading.set(true);
            const data = await this.produccionService.getCerdasConCiclos();
            // Ordenar cerdas por prioridad: críticas primero, luego por estado y urgencia
            const cerdasOrdenadas = this.ordenarCerdasPorPrioridad(data);
            this.cerdas.set(cerdasOrdenadas);
        } catch (err: any) {
            this.error.set('Error cargando la lista de cerdas');
        } finally {
            this.loading.set(false);
        }
    }

    /**
     * Ordena las cerdas por prioridad:
     * 1. Cerdas gestantes con parto en ≤3 días (CRÍTICO)
     * 2. Cerdas lactantes con ≥21 días (necesitan destete)
     * 3. Cerdas gestantes con parto en ≤7 días (ADVERTENCIA)
     * 4. Cerdas lactantes con ≥14 días
     * 5. Resto de cerdas gestantes
     * 6. Resto de cerdas lactantes
     * 7. Cerdas vacías (ordenadas por chapeta)
     */
    private ordenarCerdasPorPrioridad(cerdas: CerdaDetalle[]): CerdaDetalle[] {
        return [...cerdas].sort((a, b) => {
            // Función para obtener prioridad numérica (menor = más prioritario)
            const getPrioridad = (cerda: CerdaDetalle): number => {
                // CRÍTICO: Gestante con parto en ≤3 días
                if (cerda.estado === 'gestante' && cerda.cicloActivo?.fecha_parto_probable) {
                    const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_probable, true);
                    if (dias <= 3) return 1; // Máxima prioridad
                    if (dias <= 7) return 3; // Alta prioridad
                    return 5; // Prioridad media
                }

                // CRÍTICO: Lactante con ≥21 días (necesita destete)
                if (cerda.estado === 'lactante' && cerda.cicloActivo?.fecha_parto_real) {
                    const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_real, false);
                    if (dias >= 21) return 2; // Muy alta prioridad
                    if (dias >= 14) return 4; // Prioridad alta
                    return 6; // Prioridad media-baja
                }

                // Gestante sin fecha de parto o con más de 7 días
                if (cerda.estado === 'gestante') return 5;

                // Lactante con menos de 14 días
                if (cerda.estado === 'lactante') return 6;

                // Vacía: menor prioridad
                return 7;
            };

            const prioridadA = getPrioridad(a);
            const prioridadB = getPrioridad(b);

            // Si tienen la misma prioridad, ordenar por criterio secundario
            if (prioridadA === prioridadB) {
                // Para cerdas gestantes con la misma prioridad, ordenar por días hasta parto (menos días primero)
                if (a.estado === 'gestante' && b.estado === 'gestante' &&
                    a.cicloActivo?.fecha_parto_probable && b.cicloActivo?.fecha_parto_probable) {
                    const diasA = this.getDiasDiferencia(a.cicloActivo.fecha_parto_probable, true);
                    const diasB = this.getDiasDiferencia(b.cicloActivo.fecha_parto_probable, true);
                    return diasA - diasB;
                }

                // Para cerdas lactantes con la misma prioridad, ordenar por días de lactancia (más días primero)
                if (a.estado === 'lactante' && b.estado === 'lactante' &&
                    a.cicloActivo?.fecha_parto_real && b.cicloActivo?.fecha_parto_real) {
                    const diasA = this.getDiasDiferencia(a.cicloActivo.fecha_parto_real, false);
                    const diasB = this.getDiasDiferencia(b.cicloActivo.fecha_parto_real, false);
                    return diasB - diasA; // Más días primero (más urgente)
                }

                // Para el resto, ordenar alfabéticamente por chapeta
                return (a.chapeta || '').localeCompare(b.chapeta || '');
            }

            return prioridadA - prioridadB;
        });
    }

    toggleMenu(id: number, event: Event) {
        event.stopPropagation();
        if (this.openMenuId() === id) {
            this.openMenuId.set(null);
        } else {
            this.openMenuId.set(id);
        }
    }

    abrirModalEvento(cerda: CerdaDetalle, tipo?: 'inseminacion' | 'parto' | 'destete' | 'falla' | 'sanidad' | 'venta' | 'muerte') {
        this.selectedCerda.set(cerda);
        this.openMenuId.set(null); // Close menu

        if (tipo) {
            this.modalType.set(tipo);
        } else {
            // Default behavior (legacy click)
            if (cerda.estado === 'vacia') this.modalType.set('inseminacion');
            else if (cerda.estado === 'gestante') this.modalType.set('parto');
            else if (cerda.estado === 'lactante') this.modalType.set('destete');
        }

        this.modalOpen.set(true);
    }

    cerrarModal() {
        this.modalOpen.set(false);
        this.selectedCerda.set(null);
        this.modalType.set(null);
    }

    async onEventoGuardado() {
        // CRITICAL: Reload data FIRST to ensure UI updates
        await this.cargarCerdas();
        // THEN close modal
        this.cerrarModal();
    }

    // Historial Logic
    abrirHistorial(cerda: CerdaDetalle) {
        this.selectedCerda.set(cerda);
        this.openMenuId.set(null); // Close menu
        this.historialModalOpen.set(true);
    }

    cerrarHistorialModal() {
        this.historialModalOpen.set(false);
        this.selectedCerda.set(null);
    }

    // Nueva Cerda Logic
    abrirNuevaCerdaModal() {
        this.nuevaCerdaModalOpen.set(true);
    }

    cerrarNuevaCerdaModal() {
        this.nuevaCerdaModalOpen.set(false);
    }

    async onNuevaCerdaGuardada() {
        this.cerrarNuevaCerdaModal();
        await this.cargarCerdas();
    }

    // Alimentar Cerdas Logic
    abrirAlimentarModal() {
        this.alimentarModalOpen.set(true);
    }

    cerrarAlimentarModal() {
        this.alimentarModalOpen.set(false);
    }

    async onAlimentacionGuardada() {
        this.cerrarAlimentarModal();
        // No necesitamos recargar cerdas, pero podríamos mostrar un toast
    }

    // Accordion methods
    toggleExpand(id: number, event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        const current = new Set(this.expandedCerdas());

        // If clicking the already open one, close it
        if (current.has(id)) {
            current.clear();
        } else {
            // Otherwise, close all others and open this one
            current.clear();
            current.add(id);
        }

        this.expandedCerdas.set(current);
    }

    isExpanded(id: number): boolean {
        return this.expandedCerdas().has(id);
    }

    // Helpers para visualización
    getDiasDiferencia(fechaStr: string | undefined | null, esFuturo: boolean): number {
        if (!fechaStr) return 0;
        const hoy = new Date();
        const fecha = new Date(fechaStr);
        hoy.setHours(0, 0, 0, 0);
        fecha.setHours(0, 0, 0, 0);

        const diff = esFuturo ? fecha.getTime() - hoy.getTime() : hoy.getTime() - fecha.getTime();
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

        // Si es un evento pasado (Lactancia), siempre devolver positivo (incluso si la fecha es futura por error)
        // Si es futuro (Gestación), permitir negativos para indicar retraso
        return esFuturo ? dias : Math.abs(dias);
    }

    getBadgeLabel(cerda: CerdaDetalle): string {
        switch (cerda.estado) {
            case 'gestante':
                if (cerda.cicloActivo?.fecha_parto_probable) {
                    const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_probable, true);
                    if (dias < 0) return `Parto hace ${Math.abs(dias)} días`;
                    if (dias === 0) return 'Parto HOY';
                    return `Parto en ${dias} días`;
                }
                return 'Gestante';
            case 'lactante':
                if (cerda.cicloActivo?.fecha_parto_real) {
                    const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_real, false);
                    return `Lactancia: Día ${dias}`;
                }
                return 'Lactante';
            case 'vacia':
                return 'Disponible';
            default:
                return cerda.estado;
        }
    }

    // Métodos para colores de badges según criticidad
    getBadgeBackground(cerda: CerdaDetalle): string {
        if (cerda.estado === 'gestante' && cerda.cicloActivo?.fecha_parto_probable) {
            const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_probable, true);
            // Crítico: parto en 3 días o menos (o ya pasó)
            if (dias <= 3) return 'var(--color-critical)';
            // Advertencia: parto en 7 días o menos
            if (dias <= 7) return 'var(--color-warning)';
            // Normal: más de 7 días
            return 'var(--color-success-light)';
        }

        if (cerda.estado === 'lactante' && cerda.cicloActivo?.fecha_parto_real) {
            const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_real, false);
            // Crítico: lactancia >= 21 días (tiempo de destete)
            if (dias >= 21) return 'var(--color-critical)';
            // Advertencia: lactancia >= 14 días
            if (dias >= 14) return 'var(--color-warning)';
            // Normal: menos de 14 días
            return 'var(--color-warning-light)';
        }

        // Vacía: color neutral
        return 'var(--color-bg)';
    }

    getBadgeColor(cerda: CerdaDetalle): string {
        if (cerda.estado === 'gestante' && cerda.cicloActivo?.fecha_parto_probable) {
            const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_probable, true);
            if (dias <= 3) return 'white'; // Texto blanco para fondo crítico
            if (dias <= 7) return 'var(--color-warning-dark)';
            return 'var(--color-success-dark)';
        }

        if (cerda.estado === 'lactante' && cerda.cicloActivo?.fecha_parto_real) {
            const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_real, false);
            if (dias >= 21) return 'white'; // Texto blanco para fondo crítico
            if (dias >= 14) return 'var(--color-warning-dark)';
            return 'var(--color-warning-dark)';
        }

        return 'var(--color-text-secondary)'; // Vacía
    }

    getBadgeBorderColor(cerda: CerdaDetalle): string {
        if (cerda.estado === 'gestante' && cerda.cicloActivo?.fecha_parto_probable) {
            const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_probable, true);
            if (dias <= 3) return 'var(--color-critical)';
            if (dias <= 7) return 'var(--color-warning)';
            return 'var(--color-success)';
        }

        if (cerda.estado === 'lactante' && cerda.cicloActivo?.fecha_parto_real) {
            const dias = this.getDiasDiferencia(cerda.cicloActivo.fecha_parto_real, false);
            if (dias >= 21) return 'var(--color-critical)';
            if (dias >= 14) return 'var(--color-warning)';
            return 'var(--color-warning)';
        }

        return 'var(--color-border)'; // Vacía
    }
}
