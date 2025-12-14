import { Component, EventEmitter, Input, Output, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { CorralesService } from '../../../../core/services/corrales.service';
import { EstadoCorral } from '../../../../core/models';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-traslado-lote-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="close.emit()">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-slate-700" (click)="$event.stopPropagation()">
        
        <div class="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">Trasladar Lote</h3>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <!-- Lote Info -->
          <div class="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
            <span class="text-xs text-slate-400 uppercase font-bold">Lote a Trasladar</span>
            <div class="text-white font-bold text-lg">{{ lote?.nombre }}</div>
            <div class="text-sm text-slate-300">Cantidad: {{ lote?.cantidad_actual }} cerdos</div>
          </div>

          <!-- Target Corral -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Corral de Destino</label>
            @if (loadingCorrales()) {
                <div class="animate-pulse h-10 w-full bg-slate-700 rounded-lg"></div>
            } @else {
                <select formControlName="corral_destino_id" class="w-full bg-slate-700 border-slate-600 rounded-lg text-white p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                  <option [ngValue]="null">Seleccione un corral...</option>
                  @for (c of corrales(); track c.id) {
                    <option [value]="c.id" [disabled]="!c.activo">
                        {{ c.nombre }} ({{ c.tipo | titlecase }}) - Espacio: {{ c.capacidad_maxima - c.ocupacion_total }} disp.
                    </option>
                  }
                </select>
            }
          </div>

          <!-- Capacity Warning -->
           @if (selectedCorral(); as target) {
             @let totalFuture = target.ocupacion_total + (lote?.cantidad_actual || 0);
             @let isOverCapacity = totalFuture > target.capacidad_maxima;

             @if (isOverCapacity) {
                <div class="bg-amber-900/20 border border-amber-500/50 p-3 rounded-lg flex gap-3">
                    <lucide-icon name="alert-triangle" class="text-amber-500 shrink-0"></lucide-icon>
                    <div>
                        <h4 class="text-amber-500 font-bold text-sm">Advertencia de Capacidad</h4>
                        <p class="text-amber-200/80 text-xs">
                            El corral destino quedará con {{ totalFuture }} animales (Cap: {{ target.capacidad_maxima }}).
                            Sobrepasa la capacidad por {{ totalFuture - target.capacidad_maxima }}.
                        </p>
                    </div>
                </div>
             } @else {
                <div class="bg-emerald-900/20 border border-emerald-500/50 p-3 rounded-lg flex gap-3">
                    <lucide-icon name="check-circle" class="text-emerald-500 shrink-0"></lucide-icon>
                    <div>
                        <h4 class="text-emerald-500 font-bold text-sm">Capacidad Correcta</h4>
                        <p class="text-emerald-200/80 text-xs">
                            Nueva ocupación: {{ totalFuture }} / {{ target.capacidad_maxima }}.
                        </p>
                    </div>
                </div>
             }
           }

          <div class="pt-2">
            <button type="submit" [disabled]="form.invalid || loading()" 
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center">
                @if (loading()) {
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                }
                {{ loading() ? 'Trasladando...' : 'Confirmar Traslado' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TrasladoLoteModalComponent implements OnInit {
    @Input() lote: any | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private corralesService = inject(CorralesService);
    private produccionService = inject(ProduccionService);

    corrales = signal<EstadoCorral[]>([]);
    loadingCorrales = signal<boolean>(true);
    loading = signal<boolean>(false);

    form = this.fb.group({
        corral_destino_id: [null, Validators.required]
    });

    selectedCorral = computed(() => {
        const id = Number(this.form.value.corral_destino_id);
        return this.corrales().find(c => c.id === id) || null;
    });

    ngOnInit() {
        this.loadCorrales();
    }

    async loadCorrales() {
        try {
            this.loadingCorrales.set(true);
            // Fetch corrales status to see occupancy
            // Ideally exclude current corral, but logic is fine for now
            const data = await this.corralesService.getEstadoCorrales();
            // Filter out the current corral if assigned
            const filtered = this.lote?.corral_id
                ? data.filter(c => c.id !== this.lote.corral_id)
                : data;

            this.corrales.set(filtered);
        } catch (e) {
            console.error(e);
        } finally {
            this.loadingCorrales.set(false);
        }
    }

    async onSubmit() {
        if (this.form.invalid || !this.lote) return;

        this.loading.set(true);
        try {
            const corralId = Number(this.form.value.corral_destino_id);
            const targetCorral = this.selectedCorral();

            if (targetCorral && targetCorral.tipo === 'engorde' && this.lote.etapa !== 'engorde') {
                // Smart Move: Precebo -> Engorde
                await this.produccionService.trasladarAEngorde(this.lote.id, {
                    fecha: new Date().toISOString().split('T')[0],
                    corral_id: corralId
                });
            } else {
                // Standard Move (Same Stage)
                await this.corralesService.trasladarLote(this.lote.id, corralId);
            }

            this.saved.emit();
            this.close.emit();
        } catch (error) {
            console.error(error);
            alert('Error al trasladar lote');
        } finally {
            this.loading.set(false);
        }
    }
}
