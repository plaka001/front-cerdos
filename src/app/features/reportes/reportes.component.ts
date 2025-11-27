import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReportesService } from '../../core/services/reportes.service';
import { ReporteRentabilidad } from '../../core/models';

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {
    private reportesService = inject(ReportesService);

    reportes = signal<ReporteRentabilidad[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    ngOnInit() {
        this.loadReportes();
    }

    async loadReportes() {
        try {
            this.loading.set(true);
            const data = await this.reportesService.getReporteRentabilidad();
            this.reportes.set(data);
        } catch (err) {
            this.error.set('Error al cargar el reporte de rentabilidad.');
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
