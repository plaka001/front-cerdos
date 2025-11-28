import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { LoteDetalle, EventoSanitario, SalidaInsumo } from '../../../../core/models';

interface SalidaInsumoConNombre extends SalidaInsumo {
    insumos?: {
        nombre: string;
        unidad_medida: string;
    };
}

@Component({
    selector: 'app-lote-detalle-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './lote-detalle-modal.component.html'
})
export class LoteDetalleModalComponent implements OnInit {
    @Input() lote!: LoteDetalle;
    @Output() close = new EventEmitter<void>();

    private produccionService = inject(ProduccionService);

    // Estado de tabs
    tabActivo = signal<'sanidad' | 'alimentacion' | 'crecimiento'>('sanidad');

    // Datos
    historialSanitario = signal<EventoSanitario[]>([]);
    historialAlimento = signal<SalidaInsumoConNombre[]>([]);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    ngOnInit() {
        this.cargarDatos();
    }

    async cargarDatos() {
        try {
            this.loading.set(true);
            this.error.set(null);

            // Cargar todos los datos en paralelo
            const [sanitario, alimento] = await Promise.all([
                this.produccionService.getHistorialSanitario(this.lote.id),
                this.produccionService.getHistorialAlimento(this.lote.id)
            ]);

            this.historialSanitario.set(sanitario);
            this.historialAlimento.set(alimento);
        } catch (err: any) {
            console.error('Error cargando historial:', err);
            this.error.set('Error al cargar el historial del lote');
        } finally {
            this.loading.set(false);
        }
    }

    cambiarTab(tab: 'sanidad' | 'alimentacion' | 'crecimiento') {
        this.tabActivo.set(tab);
    }

    formatearFecha(fecha: string): string {
        return new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatearMoneda(valor: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    }

    getTipoEventoLabel(tipo: string): string {
        const labels: Record<string, string> = {
            'muerte': 'Muerte',
            'enfermedad': 'Enfermedad',
            'tratamiento': 'Tratamiento'
        };
        return labels[tipo] || tipo;
    }

    getTipoEventoColor(tipo: string): string {
        const colores: Record<string, string> = {
            'muerte': 'text-red-400',
            'enfermedad': 'text-yellow-400',
            'tratamiento': 'text-blue-400'
        };
        return colores[tipo] || 'text-slate-400';
    }

    getTotalAlimentacion(): number {
        return this.historialAlimento().reduce((sum, s) => sum + (s.costo_total_salida || 0), 0);
    }

    getGananciaPeso(): string {
        if (!this.lote.peso_promedio_actual || !this.lote.peso_promedio_inicial) {
            return '0.00';
        }
        return (this.lote.peso_promedio_actual - this.lote.peso_promedio_inicial).toFixed(2);
    }

    getIncrementoPorcentual(): string {
        if (!this.lote.peso_promedio_actual || !this.lote.peso_promedio_inicial || this.lote.peso_promedio_inicial === 0) {
            return '0.0';
        }
        return (((this.lote.peso_promedio_actual - this.lote.peso_promedio_inicial) / this.lote.peso_promedio_inicial) * 100).toFixed(1);
    }

    onClose() {
        this.close.emit();
    }
}

