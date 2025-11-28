import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../core/services/produccion.service';
import { CerdaDetalle } from '../../../core/models';
import { EventModalComponent } from '../components/event-modal/event-modal.component';
import { NuevaCerdaModalComponent } from '../components/nueva-cerda-modal/nueva-cerda-modal.component';
import { AlimentarCerdasModalComponent } from '../components/alimentar-cerdas-modal/alimentar-cerdas-modal.component';

@Component({
    selector: 'app-cerdas-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, EventModalComponent, NuevaCerdaModalComponent, AlimentarCerdasModalComponent],
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
    modalType = signal<'inseminacion' | 'parto' | 'destete' | null>(null);

    // Nueva Cerda Modal
    nuevaCerdaModalOpen = signal<boolean>(false);

    // Alimentar Cerdas Modal
    alimentarModalOpen = signal<boolean>(false);

    async ngOnInit() {
        await this.cargarCerdas();
    }

    async cargarCerdas() {
        try {
            this.loading.set(true);
            const data = await this.produccionService.getCerdasConCiclos();
            console.log('🐷 Cerdas cargadas:', data);

            // Force new array reference to trigger change detection
            this.cerdas.set([...data]);

            console.log('🐷 Signal actualizado. Estados:', data.map(c => ({ chapeta: c.chapeta, estado: c.estado })));
        } catch (err: any) {
            console.error('❌ Error cargando cerdas:', err);
            this.error.set('Error cargando la lista de cerdas');
        } finally {
            this.loading.set(false);
        }
    }

    abrirModalEvento(cerda: CerdaDetalle) {
        this.selectedCerda.set(cerda);

        // Determinar tipo de evento según estado
        if (cerda.estado === 'vacia') this.modalType.set('inseminacion');
        else if (cerda.estado === 'gestante') this.modalType.set('parto');
        else if (cerda.estado === 'lactante') this.modalType.set('destete');

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
