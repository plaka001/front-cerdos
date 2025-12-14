
import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';

interface HistorialItem {
    id: number;
    fecha: string;
    cantidad: number;
    costo_unitario_momento: number;
    notas: string;
    insumos: {
        nombre: string;
        unidad_medida: string;
    };
}

interface MonthGroup {
    label: string; // "Diciembre 2025"
    totalKg: number;
    totalCost: number;
    items: HistorialItem[];
    expanded: boolean;
}

@Component({
    selector: 'app-historial-alimentacion-cerdas-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './historial-alimentacion-cerdas-modal.component.html'
})
export class HistorialAlimentacionCerdasModalComponent implements OnInit {
    private produccionService = inject(ProduccionService);

    @Output() close = new EventEmitter<void>();

    loading = signal<boolean>(true);
    error = signal<string | null>(null);
    monthGroups = signal<MonthGroup[]>([]);
    grandTotalKg = signal<number>(0);
    grandTotalCost = signal<number>(0);

    async ngOnInit() {
        await this.cargarHistorial();
    }

    async cargarHistorial() {
        try {
            this.loading.set(true);
            const data = await this.produccionService.getHistorialAlimentacionGeneral();
            this.groupDataByMonth(data);
        } catch (err: any) {
            this.error.set('Error cargando el historial');
        } finally {
            this.loading.set(false);
        }
    }

    groupDataByMonth(data: any[]) {
        const groups: { [key: string]: MonthGroup } = {};
        let gTotalKg = 0;
        let gTotalCost = 0;

        data.forEach(item => {
            const date = new Date(item.fecha + 'T12:00:00'); // Valid date
            // Format: "Diciembre 2025"
            const monthLabel = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            // Key for sorting: "2025-12"
            const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!groups[key]) {
                groups[key] = {
                    label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
                    totalKg: 0,
                    totalCost: 0,
                    items: [],
                    expanded: true // Default open
                };
            }

            const cost = (item.cantidad * item.costo_unitario_momento) || 0;



            groups[key].items.push(item);
            groups[key].totalKg += item.cantidad;
            groups[key].totalCost += cost;

            gTotalKg += item.cantidad;
            gTotalCost += cost;
        });

        // Convert map to array and sort by key desc (newest months first)
        const sortedGroups = Object.keys(groups)
            .sort((a, b) => b.localeCompare(a))
            .map(key => groups[key]);

        this.monthGroups.set(sortedGroups);
        this.grandTotalKg.set(gTotalKg);
        this.grandTotalCost.set(gTotalCost);
    }

    toggleGroup(group: MonthGroup) {
        group.expanded = !group.expanded;
    }

    formatearMoneda(valor: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    }

    cerrar() {
        this.close.emit();
    }

    getStageFromNotes(notes: string): string {
        if (!notes) return 'General';
        const parts = notes.split(' - ');
        return parts.length > 1 ? parts[1].trim() : notes;
    }

    getFormattedDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }

}
