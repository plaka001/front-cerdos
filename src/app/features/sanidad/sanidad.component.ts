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
            <div class="px-5 space-y-8">

                <!-- 1. ATRASADO (Rojo) -->
                @if (tareasAtrasadas().length > 0) {
                    <div class="animate-in fade-in slide-in-from-bottom-2">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xs font-bold text-red-400 uppercase tracking-widest">
                                Atrasado
                            </h2>
                            <span class="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md text-xs font-bold border border-red-500/20">
                                {{ tareasAtrasadas().length }} Tareas
                            </span>
                        </div>
                        
                        <div class="space-y-3">
                            @for (tarea of tareasAtrasadas(); track tarea.id_referencia + tarea.nombre_tarea) {
                                <div class="bg-slate-800 rounded-xl border border-slate-700/50 shadow-md p-5 flex items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-600">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 class="font-bold text-white text-lg leading-tight">{{ tarea.nombre_tarea }}</h3>
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20 whitespace-nowrap">
                                                Vencido
                                            </span>
                                        </div>
                                        <div class="flex items-center text-slate-400 text-sm gap-3">
                                            <div class="flex items-center gap-1.5">
                                                <lucide-icon name="target" [size]="14" class="text-slate-500"></lucide-icon>
                                                <span>{{ formatearDestino(tarea) }}</span>
                                            </div>
                                            <span class="text-slate-600">|</span>
                                            <span class="text-red-400 font-medium text-xs">Hace {{ Math.abs(tarea.dias_vencimiento) }} días</span>
                                        </div>
                                    </div>
                                    
                                    <button (click)="abrirModalAplicar(tarea)" 
                                            class="shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm group">
                                        <lucide-icon name="syringe" [size]="18" class="group-hover:scale-110 transition-transform"></lucide-icon>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- 2. PARA HOY (Verde) -->
                @if (tareasHoy().length > 0) {
                    <div class="animate-in fade-in slide-in-from-bottom-3">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                                Para Hoy
                            </h2>
                            <span class="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-500/20">
                                {{ tareasHoy().length }} Tareas
                            </span>
                        </div>
                        
                        <div class="space-y-3">
                            @for (tarea of tareasHoy(); track tarea.id_referencia + tarea.nombre_tarea) {
                                <div class="bg-slate-800 rounded-xl border border-slate-700/50 shadow-md p-5 flex items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-600">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 class="font-bold text-white text-lg leading-tight">{{ tarea.nombre_tarea }}</h3>
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap">
                                                Hoy
                                            </span>
                                        </div>
                                        <div class="flex items-center text-slate-400 text-sm gap-3">
                                             <div class="flex items-center gap-1.5">
                                                <lucide-icon name="target" [size]="14" class="text-slate-500"></lucide-icon>
                                                <span>{{ formatearDestino(tarea) }}</span>
                                            </div>
                                            <span class="text-slate-600">|</span>
                                            <span class="text-slate-400 text-xs">Programado para hoy</span>
                                        </div>
                                    </div>
                                    
                                    <button (click)="abrirModalAplicar(tarea)" 
                                            class="shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all active:scale-95 shadow-md hover:shadow-lg group border border-emerald-500/50">
                                        <lucide-icon name="check" [size]="20" class="group-hover:stroke-[3px] transition-all"></lucide-icon>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- 3. PROXIMOS (Azul) -->
                @if (tareasProximas().length > 0) {
                    <div class="animate-in fade-in slide-in-from-bottom-4">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                Próximos 7 Días
                            </h2>
                            <span class="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-500/20">
                                {{ tareasProximas().length }} Futuras
                            </span>
                        </div>
                        
                        <div class="space-y-3">
                            @for (tarea of tareasProximas(); track tarea.id_referencia + tarea.nombre_tarea) {
                                <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-sm p-4 flex items-center justify-between gap-3 opacity-90 hover:opacity-100 hover:bg-slate-800 transition-all">
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-3 mb-1">
                                            <h3 class="font-semibold text-slate-200 text-base leading-tight">{{ tarea.nombre_tarea }}</h3>
                                        </div>
                                        <div class="flex items-center text-slate-500 text-xs gap-3">
                                            <span>{{ formatearDestino(tarea) }}</span>
                                            <span class="text-slate-700">|</span>
                                            <span class="text-blue-400 font-medium">En {{ tarea.dias_vencimiento }} días</span>
                                        </div>
                                    </div>
                                    <div class="shrink-0 p-2 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
                                        <lucide-icon name="clock" [size]="16"></lucide-icon>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- Empty State -->
                @if (tareasAtrasadas().length === 0 && tareasHoy().length === 0 && tareasProximas().length === 0) {
                    <div class="flex flex-col items-center justify-center py-20 text-center opacity-75">
                        <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-xl">
                             <lucide-icon name="check-circle" [size]="32" class="text-emerald-500"></lucide-icon>
                        </div>
                        <h3 class="text-lg font-bold text-white mb-1">¡Todo al día!</h3>
                        <p class="text-sm text-slate-400 max-w-[200px]">No hay tareas sanitarias pendientes.</p>
                    </div>
                }

            </div>
        }

        <!-- MODALS -->
        @if (selectedCerda()) {
            <app-event-modal 
                [cerda]="selectedCerda()!" 
                [tipoEvento]="'sanidad'"
                [nombreTarea]="selectedTarea()?.nombre_tarea"
                (close)="cerrarModales()"
                (saved)="onTareaCompletada()">
            </app-event-modal>
        }

        @if (selectedLote()) {
            <app-registrar-sanidad-lote-modal
                [lote]="selectedLote()!"
                [nombreTarea]="selectedTarea()?.nombre_tarea"
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
    selectedTarea = signal<TareaSanitaria | null>(null);

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
            this.selectedTarea.set(tarea);

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
        this.selectedTarea.set(null);
    }

    async onTareaCompletada() {
        this.cerrarModales();
        await this.cargarAgenda();
        // In a real app, maybe show a success toast here
    }
}
