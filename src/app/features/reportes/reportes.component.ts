import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ReportesService } from '../../core/services/reportes.service';
import { ReporteRentabilidad, ReporteCostosMaternidad, ReporteGastoCategoria } from '../../core/models';

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {
    private reportesService = inject(ReportesService);

    reportes = signal<ReporteRentabilidad[]>([]);
    reporteMaternidad = signal<ReporteCostosMaternidad[]>([]);
    reporteGastos = signal<ReporteGastoCategoria[]>([]);

    activeTab = signal<'lotes' | 'maternidad' | 'gastos'>('lotes');
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    // --- Lógica Gastos Generales ---
    mesSeleccionado = signal<string>('');

    mesesDisponibles = computed(() => {
        const gastos = this.reporteGastos();
        const meses = new Set(gastos.map(g => g.mes));
        return Array.from(meses).sort().reverse();
    });

    gastosFiltrados = computed(() => {
        const mes = this.mesSeleccionado();
        if (!mes) return [];
        return this.reporteGastos()
            .filter(g => g.mes === mes)
            .sort((a, b) => b.total_gastado - a.total_gastado);
    });

    totalGastosMes = computed(() => {
        return this.gastosFiltrados().reduce((acc, curr) => acc + curr.total_gastado, 0);
    });

    maxGastoMes = computed(() => {
        const gastos = this.gastosFiltrados();
        if (gastos.length === 0) return 0;
        return Math.max(...gastos.map(g => g.total_gastado));
    });

    ngOnInit() {
        this.loadReportes();
    }

    async loadReportes() {
        try {
            this.loading.set(true);
            const [dataLotes, dataMaternidad, dataGastos] = await Promise.all([
                this.reportesService.getReporteRentabilidad(),
                this.reportesService.getReporteMaternidad(),
                this.reportesService.getReporteGastosGenerales()
            ]);

            this.reportes.set(dataLotes);
            this.reporteMaternidad.set(dataMaternidad);
            this.reporteGastos.set(dataGastos);

            // Seleccionar mes más reciente por defecto
            if (dataGastos.length > 0) {
                // dataGastos viene ordenado por mes DESC desde el servicio
                // Pero para estar seguros, buscamos el set de meses
                const meses = Array.from(new Set(dataGastos.map(g => g.mes))).sort().reverse();
                if (meses.length > 0) {
                    this.mesSeleccionado.set(meses[0]);
                }
            } else {
                const now = new Date();
                const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                this.mesSeleccionado.set(mesActual);
            }

        } catch (err) {
            this.error.set('Error al cargar los reportes financieros.');
            console.error(err);
        } finally {
            this.loading.set(false);
        }
    }

    getRentabilidadClass(valor: number): string {
        if (valor > 0) return 'text-emerald-400 font-bold';
        if (valor < 0) return 'text-red-400 font-bold';
        return 'text-slate-400';
    }

    getMargenPorcentaje(costo: number, ganancia: number): number {
        // Calculate margin on sales, not ROI
        // Margin = (Profit / Sales) * 100
        const ventas = costo + ganancia;
        if (ventas === 0) return 0;
        return (ganancia / ventas) * 100;
    }

    getBarWidth(gasto: number): number {
        const max = this.maxGastoMes();
        if (max === 0) return 0;
        return (gasto / max) * 100;
    }
}
