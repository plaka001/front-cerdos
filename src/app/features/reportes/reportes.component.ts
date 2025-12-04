import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ReportesService } from '../../core/services/reportes.service';
import { ReporteRentabilidad, ReporteCostosMaternidad, ReporteFlujoCaja } from '../../core/models';

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
    reporteFlujoCaja = signal<ReporteFlujoCaja[]>([]);

    activeTab = signal<'lotes' | 'maternidad' | 'flujo'>('lotes');
    loading = signal<boolean>(true);
    downloading = signal<boolean>(false);
    error = signal<string | null>(null);

    // Accordion state
    expandedLotes = signal<Set<number>>(new Set());

    // --- Lógica Flujo de Caja ---
    mesSeleccionado = signal<string>('');

    mesesDisponibles = computed(() => {
        const flujo = this.reporteFlujoCaja();
        const meses = new Set(flujo.map(f => f.mes));
        return Array.from(meses).sort().reverse();
    });

    movimientosFiltrados = computed(() => {
        const mes = this.mesSeleccionado();
        if (!mes) return [];
        return this.reporteFlujoCaja().filter(f => f.mes === mes);
    });

    ingresosFiltrados = computed(() => {
        return this.movimientosFiltrados()
            .filter(m => m.tipo === 'ingreso')
            .sort((a, b) => b.total - a.total);
    });

    egresosFiltrados = computed(() => {
        return this.movimientosFiltrados()
            .filter(m => m.tipo === 'egreso')
            .sort((a, b) => b.total - a.total);
    });

    totalIngresosMes = computed(() => {
        return this.ingresosFiltrados().reduce((acc, curr) => acc + curr.total, 0);
    });

    totalEgresosMes = computed(() => {
        return this.egresosFiltrados().reduce((acc, curr) => acc + curr.total, 0);
    });

    balanceMes = computed(() => {
        return this.totalIngresosMes() - this.totalEgresosMes();
    });

    maxIngresoMes = computed(() => {
        const ingresos = this.ingresosFiltrados();
        if (ingresos.length === 0) return 0;
        return Math.max(...ingresos.map(i => i.total));
    });

    maxEgresoMes = computed(() => {
        const egresos = this.egresosFiltrados();
        if (egresos.length === 0) return 0;
        return Math.max(...egresos.map(e => e.total));
    });

    ngOnInit() {
        this.loadReportes();
    }

    async loadReportes() {
        try {
            this.loading.set(true);
            const [dataLotes, dataMaternidad, dataFlujoCaja] = await Promise.all([
                this.reportesService.getReporteRentabilidad(),
                this.reportesService.getReporteMaternidad(),
                this.reportesService.getReporteFlujoCaja()
            ]);

            this.reportes.set(dataLotes);
            this.reporteMaternidad.set(dataMaternidad);
            this.reporteFlujoCaja.set(dataFlujoCaja);

            // Seleccionar mes más reciente por defecto
            if (dataFlujoCaja.length > 0) {
                const meses = Array.from(new Set(dataFlujoCaja.map(f => f.mes))).sort().reverse();
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

    // Accordion methods
    toggleExpand(index: number, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        const current = new Set(this.expandedLotes());
        if (current.has(index)) {
            current.delete(index);
        } else {
            current.add(index);
        }
        this.expandedLotes.set(current);
    }

    isExpanded(index: number): boolean {
        return this.expandedLotes().has(index);
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

    getBarWidthIngreso(monto: number): number {
        const max = this.maxIngresoMes();
        if (max === 0) return 0;
        return (monto / max) * 100;
    }

    getBarWidthEgreso(monto: number): number {
        const max = this.maxEgresoMes();
        if (max === 0) return 0;
        return (monto / max) * 100;
    }

    async downloadExcel() {
        const mesStr = this.mesSeleccionado();
        if (!mesStr) return;

        try {
            this.downloading.set(true);
            const [anio, mes] = mesStr.split('-').map(Number);
            await this.reportesService.descargarReporteExcel(anio, mes);
        } catch (err) {
            console.error('Error downloading excel:', err);
            // Optional: Show toast error
        } finally {
            this.downloading.set(false);
        }
    }
}
