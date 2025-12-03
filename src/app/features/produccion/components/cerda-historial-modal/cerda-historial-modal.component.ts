import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CerdaDetalle, CicloReproductivo, EventoSanitario } from '../../../../core/models';
import { ProduccionService } from '../../../../core/services/produccion.service';

@Component({
  selector: 'app-cerda-historial-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="close.emit()">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-6 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-white">Historial - Cerda {{ cerda?.chapeta }}</h2>
            <p class="text-sm text-slate-400 mt-1">Hoja de vida biológica y sanitaria</p>
          </div>
          <button (click)="close.emit()" class="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <lucide-icon name="x" [size]="24" class="text-slate-400"></lucide-icon>
          </button>
        </div>

        <!-- Tabs Navigation -->
        <div class="p-4 border-b border-slate-700 bg-slate-800/50">
          <div class="flex flex-wrap gap-2">
            <button (click)="activeTab.set('ciclos')" 
                    [class.bg-emerald-600]="activeTab() === 'ciclos'"
                    [class.text-white]="activeTab() === 'ciclos'" 
                    [class.bg-slate-700]="activeTab() !== 'ciclos'"
                    [class.text-slate-400]="activeTab() !== 'ciclos'"
                    class="flex-1 min-w-[120px] md:flex-none md:w-48 rounded-lg py-2.5 px-4 text-sm font-medium transition-all border border-slate-600 shadow-sm flex items-center justify-center gap-2">
              <lucide-icon name="git-branch" [size]="16"></lucide-icon>
              <span>Ciclos Reproductivos</span>
              @if (ciclos().length > 0) {
              <span class="bg-slate-900 text-slate-300 text-xs px-1.5 py-0.5 rounded-full ml-1">
                {{ ciclos().length }}
              </span>
              }
            </button>

            <button (click)="activeTab.set('sanidad')" 
                    [class.bg-emerald-600]="activeTab() === 'sanidad'"
                    [class.text-white]="activeTab() === 'sanidad'"
                    [class.bg-slate-700]="activeTab() !== 'sanidad'"
                    [class.text-slate-400]="activeTab() !== 'sanidad'"
                    class="flex-1 min-w-[120px] md:flex-none md:w-48 rounded-lg py-2.5 px-4 text-sm font-medium transition-all border border-slate-600 shadow-sm flex items-center justify-center gap-2">
              <lucide-icon name="activity" [size]="16"></lucide-icon>
              <span>Sanidad y Tratamientos</span>
              @if (eventosSanitarios().length > 0) {
              <span class="bg-slate-900 text-slate-300 text-xs px-1.5 py-0.5 rounded-full ml-1">
                {{ eventosSanitarios().length }}
              </span>
              }
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          @if (loading()) {
          <div class="flex items-center justify-center h-64">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
              <p class="mt-4 text-sm text-slate-400">Cargando historial...</p>
            </div>
          </div>
          }

          @else if (error()) {
          <div class="bg-red-900/20 border border-red-900/30 rounded-xl p-4">
            <div class="flex items-start">
              <lucide-icon name="alert-triangle" [size]="24" class="text-red-400 mr-3"></lucide-icon>
              <div>
                <h3 class="text-lg font-semibold text-red-400">Error</h3>
                <p class="text-sm text-slate-300 mt-1">{{ error() }}</p>
                <button (click)="cargarHistorial()" class="mt-3 text-sm text-red-400 underline hover:text-red-300">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
          }

          @else {
          <!-- Tab: Ciclos Reproductivos -->
          @if (activeTab() === 'ciclos') {
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-white mb-4">Ciclos Reproductivos</h3>

            @if (ciclos().length === 0) {
            <div class="bg-slate-700/50 rounded-xl p-8 text-center border border-slate-600">
              <lucide-icon name="calendar-off" [size]="48" class="text-slate-500 mx-auto mb-4"></lucide-icon>
              <p class="text-slate-400">No hay registros de ciclos reproductivos</p>
            </div>
            }

            @else {
            <div class="space-y-3">
              @for (ciclo of ciclos(); track ciclo.id) {
              <div class="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden">
                <!-- Header (Clickable) -->
                <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/50 transition-colors"
                     (click)="toggleCiclo(ciclo.id)">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400">
                      <lucide-icon name="git-branch" [size]="20"></lucide-icon>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-white">Ciclo {{ formatearFecha(ciclo.fecha_inseminacion || '') }}</p>
                      <p class="text-xs text-slate-400">{{ ciclo.padre_semen || 'Sin macho registrado' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium" [ngClass]="{
                      'bg-emerald-900/30 text-emerald-400': ciclo.estado === 'abierto' || ciclo.estado === 'activo',
                      'bg-slate-700 text-slate-300': ciclo.estado === 'cerrado',
                      'bg-red-900/30 text-red-400': ciclo.estado === 'fallido'
                    }">{{ ciclo.estado }}</span>
                    <lucide-icon name="chevron-down" [size]="20" class="text-slate-400 transition-transform duration-200"
                        [class.rotate-180]="isCicloExpanded(ciclo.id)"></lucide-icon>
                  </div>
                </div>

                <!-- Body (Collapsible) -->
                @if (isCicloExpanded(ciclo.id)) {
                <div class="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                  <div class="pt-3 border-t border-slate-600/50 grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-slate-400 mb-1">Fecha Parto</p>
                      <p class="text-sm font-medium text-white">
                        {{ ciclo.fecha_parto_real ? formatearFecha(ciclo.fecha_parto_real) : 'Pendiente' }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 mb-1">Nacidos Vivos</p>
                      <p class="text-sm font-medium text-white">{{ ciclo.nacidos_vivos || 0 }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 mb-1">Destetados</p>
                      <p class="text-sm font-medium text-white">{{ ciclo.lechones_destetados || 0 }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 mb-1">Fecha Destete</p>
                      <p class="text-sm font-medium text-white">
                        {{ ciclo.fecha_destete ? formatearFecha(ciclo.fecha_destete) : 'Pendiente' }}
                      </p>
                    </div>
                    @if (ciclo.observaciones) {
                    <div class="col-span-2">
                      <p class="text-xs text-slate-400 mb-1">Observaciones</p>
                      <p class="text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        {{ ciclo.observaciones }}
                      </p>
                    </div>
                    }
                  </div>
                </div>
                }
              </div>
              }
            </div>
            }
          </div>
          }

          <!-- Tab: Sanidad -->
          @if (activeTab() === 'sanidad') {
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-white mb-4">Eventos Sanitarios</h3>

            @if (eventosSanitarios().length === 0) {
            <div class="bg-slate-700/50 rounded-xl p-8 text-center border border-slate-600">
              <lucide-icon name="activity" [size]="48" class="text-slate-500 mx-auto mb-4"></lucide-icon>
              <p class="text-slate-400">No hay eventos sanitarios registrados</p>
            </div>
            }

            @else {
            <div class="space-y-3">
              @for (evento of eventosSanitarios(); track evento.id) {
              <div class="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden">
                <!-- Header (Clickable) -->
                <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/50 transition-colors"
                     (click)="toggleSanidad(evento.id)">
                  <div class="flex items-center gap-3">
                    <div [class]="'w-2 h-2 rounded-full ' + (evento.tipo === 'muerte' ? 'bg-red-500' : evento.tipo === 'enfermedad' ? 'bg-yellow-500' : 'bg-blue-500')"></div>
                    <div>
                      <p class="text-sm font-bold text-white capitalize">{{ evento.tipo || 'Evento Sanitario' }}</p>
                      <p class="text-xs text-slate-400">{{ formatearFecha(evento.fecha) }}</p>
                    </div>
                  </div>
                  <lucide-icon name="chevron-down" [size]="20" class="text-slate-400 transition-transform duration-200"
                      [class.rotate-180]="isSanidadExpanded(evento.id)"></lucide-icon>
                </div>

                <!-- Body (Collapsible) -->
                @if (isSanidadExpanded(evento.id)) {
                <div class="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                  <div class="pt-3 border-t border-slate-600/50 space-y-3">
                    @if (evento.cantidad_afectada) {
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-slate-400">Cantidad afectada</span>
                      <span class="text-sm font-medium text-white">{{ evento.cantidad_afectada }}</span>
                    </div>
                    }
                    @if (evento.observacion) {
                    <div>
                      <p class="text-xs text-slate-400 mb-1">Observación</p>
                      <p class="text-sm text-slate-300 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        {{ evento.observacion }}
                      </p>
                    </div>
                    }
                  </div>
                </div>
                }
              </div>
              }
            </div>
            }
          </div>
          }
          }
        </div>
      </div>
    </div>
  `
})
export class CerdaHistorialModalComponent implements OnInit {
  @Input() cerda: CerdaDetalle | null = null;
  @Output() close = new EventEmitter<void>();

  private produccionService = inject(ProduccionService);

  activeTab = signal<'ciclos' | 'sanidad'>('ciclos');
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Estado Accordion
  expandedCiclos = signal<Set<number>>(new Set());
  expandedSanidad = signal<Set<number>>(new Set());

  ciclos = signal<CicloReproductivo[]>([]);
  eventosSanitarios = signal<any[]>([]);

  tabs = [
    { id: 'ciclos', label: 'Ciclos Reproductivos', icon: 'git-branch' },
    { id: 'sanidad', label: 'Sanidad y Tratamientos', icon: 'stethoscope' }
  ];

  async ngOnInit() {
    if (this.cerda) {
      await this.cargarHistorial();
    }
  }

  toggleCiclo(id: number) {
    const current = new Set(this.expandedCiclos());
    if (current.has(id)) current.delete(id);
    else current.add(id);
    this.expandedCiclos.set(current);
  }

  isCicloExpanded(id: number): boolean {
    return this.expandedCiclos().has(id);
  }

  toggleSanidad(id: number) {
    const current = new Set(this.expandedSanidad());
    if (current.has(id)) current.delete(id);
    else current.add(id);
    this.expandedSanidad.set(current);
  }

  isSanidadExpanded(id: number): boolean {
    return this.expandedSanidad().has(id);
  }

  async cargarHistorial() {
    try {
      this.loading.set(true);
      this.error.set(null);

      if (!this.cerda?.id) return;

      const [ciclosData, sanidadData] = await Promise.all([
        this.produccionService.getHistorialCiclos(this.cerda.id),
        this.produccionService.getHistorialSanitarioCerda(this.cerda.id)
      ]);

      this.ciclos.set(ciclosData);
      this.eventosSanitarios.set(sanidadData);

    } catch (err: any) {
      console.error('Error cargando historial:', err);
      this.error.set('No se pudo cargar el historial completo.');
    } finally {
      this.loading.set(false);
    }
  }

  getIconoSanidad(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'muerte': return 'skull';
      case 'enfermedad': return 'thermometer';
      case 'tratamiento': return 'pill';
      case 'vacunacion': return 'syringe';
      default: return 'activity';
    }
  }

  getTipoEventoColor(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'muerte': return 'text-red-400';
      case 'enfermedad': return 'text-yellow-400';
      case 'tratamiento': return 'text-blue-400';
      case 'vacunacion': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
