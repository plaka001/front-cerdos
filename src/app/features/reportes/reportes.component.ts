import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReportesService } from '../../core/services/reportes.service';
import { ReporteRentabilidad, ReporteCostosMaternidad } from '../../core/models';

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {
    private reportesService = inject(ReportesService);

    reportes = signal<ReporteRentabilidad[]>([]);
    reporteMaternidad = signal<ReporteCostosMaternidad[]>([]);
    activeTab = signal<'lotes' | 'maternidad'>('lotes');
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    ngOnInit() {
        this.loadReportes();
    }

    async loadReportes() {
        try {
            this.loading.set(true);
            const [dataLotes, dataMaternidad] = await Promise.all([
                this.reportesService.getReporteRentabilidad(),
                this.reportesService.getReporteMaternidad()
            ]);

            this.reportes.set(dataLotes);
            this.reporteMaternidad.set(dataMaternidad);
        } catch (err) {
            this.error.set('Error al cargar los reportes financieros.');
        } finally {
            this.loading.set(false);
        }
    }

    getRentabilidadClass(valor: number): string {
        if (valor > 0) return 'text-emerald-400 font-bold';
        if (valor < 0) return 'text-red-400 font-bold';
        return 'text-slate-400';
    }

    // Helper para calcular porcentaje de margen (opcional)
    getMargenPorcentaje(costo: number, ganancia: number): number {
        if (costo === 0) return 0;
        return (ganancia / costo) * 100;
    }
}
