import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SanidadService, TareaSanitaria } from '../../core/services/sanidad.service';
import { ProduccionService } from '../../core/services/produccion.service';
import { CerdaDetalle, LoteDetalle } from '../../core/models';
import { EventModalComponent } from '../produccion/components/event-modal/event-modal.component';
import { RegistrarSanidadLoteModalComponent } from '../produccion/components/registrar-sanidad-lote-modal/registrar-sanidad-lote-modal.component';

@Component({
    selector: 'app-sanidad',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, EventModalComponent, RegistrarSanidadLoteModalComponent],
    template: `
    <div class="min-h-screen pb-20 bg-slate-900 fade-in">
        
        <!-- Header -->
        <div class="p-5">
            <h1 class="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                <lucide-icon name="stethoscope" [size]="28" class="text-emerald-400"></lucide-icon>
                Agenda Veterinaria
            </h1>
            <p class="text-sm text-slate-400">Control sanitario inteligente</p>
        </div>

        <!-- Loading -->
        @if (loading()) {
            <div class="flex items-center justify-center p-10">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
            </div>
        } 
        
        <!-- Error -->
        @else if (error()) {
            <div class="mx-5 p-4 bg-red-900/20 rounded-xl border border-red-900/30 flex items-start gap-3">
                <lucide-icon name="alert-triangle" class="text-red-400 shrink-0"></lucide-icon>
                <div>
                    <h3 class="font-bold text-red-400">Error</h3>
                    <p class="text-sm text-slate-300">{{ error() }}</p>
                </div>
            </div>
        }

        <!-- Agenda -->
        @else {
            <div class="px-5 space-y-6">

                <!-- 1. ATRASADO (Rojo) -->
                @if (tareasAtrasadas().length > 0) {
                    <div class="animate-in fade-in slide-in-from-bottom-2">
                        <h2 class="text-sm uppercase tracking-wider font-bold text-red-400 mb-3 flex items-center justify-between">
                            <span>🚨 Atrasado</span>
                            <span class="bg-red-900/50 text-red-300 px-2 py-0.5 rounded-full text-xs">{{ tareasAtrasadas().length }}</span>
                        </h2>
                        
                        <div class="space-y-3">
                            @for (tarea of tareasAtrasadas(); track tarea.id_referencia + tarea.nombre_tarea) {
                                <div class="bg-slate-800 rounded-xl border border-l-4 border-slate-700 border-l-red-500 shadow-lg p-4 flex items-center justify-between gap-3">
                                    <div class="min-w-0">
                                        <h3 class="font-bold text-white text-lg leading-tight mb-1">{{ tarea.nombre_tarea }}</h3>
                                        <div class="flex items-center text-slate-400 text-sm gap-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-xs font-medium">
                                                {{ formatearDestino(tarea) }}
                                            </span>
                                            <span class="text-red-400 font-medium text-xs">Vencido hace {{ Math.abs(tarea.dias_vencimiento) }} días</span>
                                        </div>
                                    </div>
                                    <button (click)="abrirModalAplicar(tarea)" 
                                            class="shrink-0 bg-red-600 hover:bg-red-500 text-white p-3 rounded-full shadow-lg transition-all active:scale-95">
                                        <lucide-icon name="syringe" [size]="20"></lucide-icon>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- 2. PARA HOY (Verde) -->
                @if (tareasHoy().length > 0) {
                    <div class="animate-in fade-in slide-in-from-bottom-3">
                        <h2 class="text-sm uppercase tracking-wider font-bold text-emerald-400 mb-3 flex items-center justify-between">
                            <span>📅 Para Hoy</span>
                            <span class="bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full text-xs">{{ tareasHoy().length }}</span>
                        </h2>
                        
                        <div class="space-y-3">
                            @for (tarea of tareasHoy(); track tarea.id_referencia + tarea.nombre_tarea) {
                                <div class="bg-slate-800 rounded-xl border border-l-4 border-slate-700 border-l-emerald-500 shadow-lg p-4 flex items-center justify-between gap-3">
                                    <div class="min-w-0">
                                        <h3 class="font-bold text-white text-lg leading-tight mb-1">{{ tarea.nombre_tarea }}</h3>
                                        <div class="flex items-center text-slate-400 text-sm gap-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-xs font-medium">
                                                {{ formatearDestino(tarea) }}
                                            </span>
                                            <span class="text-emerald-400 font-medium text-xs">Programado para hoy</span>
                                        </div>
                                    </div>
                                    <button (click)="abrirModalAplicar(tarea)" 
                                            class="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full shadow-lg transition-all active:scale-95">
                                        <span>✅</span>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- 3. PROXIMOS (Gris/Azul) -->
                @if (tareasProximas().length > 0) {
                    <div class="animate-in fade-in slide-in-from-bottom-4">
                        <h2 class="text-sm uppercase tracking-wider font-bold text-blue-400 mb-3 flex items-center justify-between">
                            <span>🔜 Próximos 7 días</span>
                            <span class="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full text-xs">{{ tareasProximas().length }}</span>
                        </h2>
                        
                        <div class="space-y-3">
                            @for (tarea of tareasProximas(); track tarea.id_referencia + tarea.nombre_tarea) {
                                <div class="bg-slate-800 rounded-xl border border-slate-700 shadow-md p-4 flex items-center justify-between gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                    <div class="min-w-0">
                                        <h3 class="font-bold text-slate-200 text-lg leading-tight mb-1">{{ tarea.nombre_tarea }}</h3>
                                        <div class="flex items-center text-slate-400 text-sm gap-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded bg-slate-700 text-slate-400 text-xs font-medium">
                                                {{ formatearDestino(tarea) }}
                                            </span>
                                            <span class="text-blue-400 font-medium text-xs">En {{ tarea.dias_vencimiento }} días</span>
                                        </div>
                                    </div>
                                    <button (click)="abrirModalAplicar(tarea)" 
                                            class="shrink-0 bg-slate-700 hover:bg-slate-600 text-slate-300 p-3 rounded-full transition-all active:scale-95">
                                        <lucide-icon name="clock" [size]="20"></lucide-icon>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- Empty State -->
                @if (tareasAtrasadas().length === 0 && tareasHoy().length === 0 && tareasProximas().length === 0) {
                    <div class="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <lucide-icon name="check-circle" [size]="64" class="text-emerald-500 mb-4"></lucide-icon>
                        <h3 class="text-xl font-bold text-white">¡Todo al día!</h3>
                        <p class="text-slate-400">No hay tareas sanitarias pendientes.</p>
                    </div>
                }

            </div>
        }

        <!-- MODALS -->
        @if (selectedCerda()) {
            <app-event-modal 
                [cerda]="selectedCerda()!" 
                [tipoEvento]="'sanidad'"
                (close)="cerrarModales()"
                (saved)="onTareaCompletada()">
            </app-event-modal>
        }

        @if (selectedLote()) {
            <app-registrar-sanidad-lote-modal
                [lote]="selectedLote()!"
                (close)="cerrarModales()"
                (saved)="onTareaCompletada()">
            </app-registrar-sanidad-lote-modal>
        }
    </div>
  `
})
export class SanidadComponent implements OnInit {
    private sanidadService = inject(SanidadService);
    private produccionService = inject(ProduccionService);

    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    tareasAtrasadas = signal<TareaSanitaria[]>([]);
    tareasHoy = signal<TareaSanitaria[]>([]);
    tareasProximas = signal<TareaSanitaria[]>([]);

    // State for modals
    selectedCerda = signal<CerdaDetalle | null>(null);
    selectedLote = signal<LoteDetalle | null>(null);

    // Helper for template
    Math = Math;

    async ngOnInit() {
        await this.cargarAgenda();
    }

    async cargarAgenda() {
        try {
            this.loading.set(true);
            this.error.set(null);

            const agenda = await this.sanidadService.getAgendaSanitaria();

            this.tareasAtrasadas.set(agenda.filter(t => t.estado === 'atrasado'));
            this.tareasHoy.set(agenda.filter(t => t.estado === 'hoy'));
            this.tareasProximas.set(agenda.filter(t => t.estado === 'proximo'));

        } catch (err: any) {
            console.error(err);
            this.error.set('Error cargando la agenda sanitaria');
        } finally {
            this.loading.set(false);
        }
    }

    formatearDestino(tarea: TareaSanitaria): string {
        switch (tarea.tipo_aplicacion) {
            case 'camada': return `Camada ${tarea.codigo_referencia}`;
            case 'madre': return `Cerda ${tarea.codigo_referencia}`;
            case 'lote': return `Lote ${tarea.codigo_referencia}`;
            default: return tarea.codigo_referencia;
        }
    }

    async abrirModalAplicar(tarea: TareaSanitaria) {
        try {
            this.loading.set(true);

            if (tarea.tipo_aplicacion === 'lote') {
                // Fetch full Lote details
                const lote = await this.produccionService.getLoteById(tarea.id_referencia);
                if (lote) {
                    this.selectedLote.set(lote);
                }
            } else {
                // Fetch full Cerda details
                const cerda = await this.produccionService.getCerdaById(tarea.id_referencia);
                if (cerda) {
                    this.selectedCerda.set(cerda);
                }
            }
        } catch (err) {
            console.error('Error fetching details for modal', err);
            // Fallback or toast could go here
        } finally {
            this.loading.set(false);
        }
    }

    cerrarModales() {
        this.selectedCerda.set(null);
        this.selectedLote.set(null);
    }

    async onTareaCompletada() {
        this.cerrarModales();
        await this.cargarAgenda();
        // In a real app, maybe show a success toast here
    }
}
