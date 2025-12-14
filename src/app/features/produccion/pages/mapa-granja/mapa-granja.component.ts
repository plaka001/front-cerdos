import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CorralesService } from '../../../../core/services/corrales.service';
import { EstadoCorral } from '../../../../core/models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mapa-granja',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="min-h-screen pb-20 bg-slate-900">
      
      <!-- Sticky Header Wrapper -->
      <div class="sticky top-0 z-30 shadow-xl bg-slate-900">
        
        <!-- Row 1: Simple Navigation -->
        <div class="bg-slate-950 border-b border-slate-800 h-14 flex items-center px-4 justify-between">
            <div class="flex items-center gap-3">
                <button (click)="goBack()" class="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                    <lucide-icon name="arrow-left" [size]="22"></lucide-icon>
                </button>
                <h1 class="text-lg font-bold text-slate-100">Mapa General</h1>
            </div>
        </div>

        <!-- Row 2: Scoreboard Stats -->
        <div class="bg-slate-800 py-3 grid grid-cols-3 divide-x divide-slate-700/50 border-b border-slate-700">
            <!-- Total Block -->
            <div class="flex flex-col items-center justify-center">
                <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Ocupación</span>
                <div class="flex items-baseline text-white leading-none">
                    <span class="text-xl font-bold">{{ stats().totalOcupacion }}</span>
                    <span class="text-xs text-slate-500 font-medium ml-0.5">/{{ stats().totalCapacidad }}</span>
                </div>
            </div>

            <!-- Full Block -->
            <div class="flex flex-col items-center justify-center">
                <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Llenos</span>
                <span class="text-xl font-bold text-red-500 leading-none">{{ stats().llenos }}</span>
            </div>

            <!-- Free Block -->
            <div class="flex flex-col items-center justify-center">
                <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Libres</span>
                <span class="text-xl font-bold text-emerald-500 leading-none">{{ stats().libres }}</span>
            </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="p-3 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 fade-in w-full max-w-7xl mx-auto pt-4">
        @if (loading()) {
            <div class="col-span-full flex justify-center py-20">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        } @else {
            @for (corral of corrales(); track corral.id) {
                <!-- Grid Card -->
                <div class="relative bg-slate-800 rounded-lg overflow-hidden shadow-sm transition-all active:scale-95 cursor-pointer group"
                     [ngClass]="getCardClasses(corral)">
                    
                    <div class="p-3 flex flex-col justify-between h-full">
                        <!-- Header: Name + Badge -->
                         <div class="flex justify-between items-start mb-2">
                            <h3 class="text-base font-bold text-slate-100 truncate w-full pr-2">{{ corral.nombre }}</h3>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase shrink-0">
                                {{ corral.tipo.charAt(0) }}
                            </span>
                         </div>

                        <!-- Center: Occupancy Number -->
                        <div class="flex flex-col items-center justify-center py-2">
                            <div class="flex items-baseline gap-0.5" 
                                 [ngClass]="getTextClasses(corral)">
                                <span class="text-2xl font-bold tracking-tighter">{{ corral.ocupacion_total }}</span>
                                <span class="text-xs text-slate-500 font-medium">/{{ corral.capacidad_maxima }}</span>
                            </div>
                        </div>

                        <!-- Footer: Details -->
                        <div class="flex items-center justify-center gap-1 opacity-70 mt-1">
                            @if (corral.ocupacion_lotes > 0) {
                                <lucide-icon name="box" [size]="12" class="text-slate-400"></lucide-icon>
                                <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">{{ corral.ocupacion_lotes }} lote</span>
                            } @else if (corral.ocupacion_cerdas > 0) {
                                <lucide-icon name="piggy-bank" [size]="12" class="text-slate-400"></lucide-icon>
                                <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">{{ corral.ocupacion_cerdas }} cer.</span>
                            } @else {
                                <span class="text-[11px] text-emerald-500/70 font-medium">Libre</span>
                            }
                        </div>

                    </div>
                </div>
            }
        }
      </div>
    </div>
  `
})
export class MapaGranjaComponent implements OnInit {
    private corralesService = inject(CorralesService);
    private router = inject(Router);

    corrales = signal<EstadoCorral[]>([]);
    loading = signal<boolean>(true);

    stats = signal({ totalOcupacion: 0, totalCapacidad: 0, llenos: 0, libres: 0 });

    ngOnInit() {
        this.loadData();
    }

    async loadData() {
        try {
            this.loading.set(true);
            const data = await this.corralesService.getEstadoCorrales();
            this.corrales.set(data);
            this.calculateStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            this.loading.set(false);
        }
    }

    calculateStats(data: EstadoCorral[]) {
        const stats = data.reduce((acc, c) => {
            acc.totalOcupacion += c.ocupacion_total;
            acc.totalCapacidad += c.capacidad_maxima;
            if (c.ocupacion_total >= c.capacidad_maxima) acc.llenos++;
            else acc.libres++;
            return acc;
        }, { totalOcupacion: 0, totalCapacidad: 0, llenos: 0, libres: 0 });
        this.stats.set(stats);
    }

    getCorralStatus(corral: EstadoCorral) {
        const isFull = corral.ocupacion_total >= corral.capacidad_maxima;
        const percentage = corral.capacidad_maxima > 0 ? (corral.ocupacion_total / corral.capacidad_maxima) * 100 : 0;
        const isWarning = percentage > 70 && percentage < 90;
        const isDanger = percentage >= 90;

        return { isFull, isWarning, isDanger };
    }

    getCardClasses(corral: EstadoCorral) {
        const { isFull, isWarning, isDanger } = this.getCorralStatus(corral);
        return {
            'border-l-4': false,
            'border-b-4': !isFull && !isDanger,
            'border-emerald-500': !isDanger && !isWarning && !isFull,
            'border-amber-500': isWarning,
            'border': isDanger || isFull,
            'border-red-500': isDanger || isFull,
            'shadow-red-500/20': isDanger || isFull,
            'shadow-lg': isDanger || isFull
        };
    }

    getTextClasses(corral: EstadoCorral) {
        const { isFull, isWarning, isDanger } = this.getCorralStatus(corral);
        return {
            'text-red-400': isDanger || isFull,
            'text-amber-400': isWarning,
            'text-white': !isDanger && !isWarning && !isFull
        };
    }

    goBack() {
        this.router.navigate(['/produccion']);
    }
}
