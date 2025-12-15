import { Component, EventEmitter, Input, Output, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { LoteDetalle, Corral, EstadoCorral } from '../../../../core/models';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { CorralesService } from '../../../../core/services/corrales.service';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
    selector: 'app-traslado-etapa-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, InputComponent],
    template: `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm fade-in pb-20 sm:pb-6">
      <div class="bg-slate-900 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden scale-in flex flex-col max-h-[80vh] sm:max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 flex-shrink-0">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300">
                <lucide-icon name="truck" [size]="20"></lucide-icon>
             </div>
             <div>
               <h2 class="text-xl font-bold text-white">Pasar a Engorde</h2>
               <p class="text-xs text-slate-400">{{ lote.codigo }} - Actual: {{ lote.cantidad_actual }} cerdos</p>
             </div>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white transition-colors">
            <lucide-icon name="x" [size]="24"></lucide-icon>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-6 flex-1 overflow-y-auto pb-24">
            
            <!-- Warning/Info Banner (Redesigned) -->
            <div class="bg-slate-800/80 border-l-4 border-blue-500/80 p-4 rounded-r-lg flex gap-3">
                 <lucide-icon name="info" [size]="20" class="text-blue-400 shrink-0 mt-0.5"></lucide-icon>
                 <div class="space-y-1">
                    <p class="text-sm font-medium text-slate-200">Cambio de Etapa</p>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        Este lote pasará de <strong class="text-slate-300">Precebo</strong> a <strong class="text-slate-300">Engorde</strong>, actualizando su ubicación en el sistema.
                    </p>
                 </div>
            </div>

            <!-- Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <!-- Fecha -->
                 <div class="order-1">
                     <app-input label="Fecha de Traslado" type="date"
                        formControlName="fecha"
                        [error]="form.controls['fecha'].touched && form.controls['fecha'].invalid ? 'Fecha requerida' : ''">
                     </app-input>
                 </div>

                 <!-- Cantidad -->
                 <div class="space-y-1 order-2">
                    <app-input label="Cantidad a Mover" type="number"
                        formControlName="cantidad"
                        (input)="actualizarValidacion()"
                        [error]="form.controls['cantidad'].touched && form.controls['cantidad'].invalid ? 'Cantidad inválida' : ''">
                    </app-input>
                    
                    <!-- Cantidad Error (Capacity) -->
                     @if (errorCapacidad()) {
                        <p class="text-xs text-red-400 font-medium flex items-center gap-1 animate-pulse mt-1">
                            <lucide-icon name="alert-circle" [size]="12"></lucide-icon>
                            Excede capacidad disponible
                        </p>
                     }
                 </div>

                <!-- Nuevo Corral -->
                <div class="order-3">
                     <label class="block text-sm font-medium text-slate-300 mb-1.5">
                        Nuevo Corral (Engorde) <span class="text-red-400">*</span>
                    </label>
                    <select formControlName="corral_id" (change)="actualizarValidacion()"
                        class="block w-full h-12 rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm transition-all px-3 outline-none appearance-none">
                        <option [ngValue]="null" disabled selected>Seleccionar Corral...</option>
                        @for (corral of corralesDisponibles(); track corral.id) {
                            <option [value]="corral.id" [disabled]="corral.ocupacion_total >= corral.capacidad_maxima">
                                {{ corral.nombre }} (Disp: {{ corral.capacidad_maxima - corral.ocupacion_total }})
                            </option>
                        }
                    </select>
                </div>

                <!-- Peso Promedio -->
                 <div class="order-4">
                     <app-input label="Peso Promedio (Kg)" type="number"
                        formControlName="peso_promedio"
                        placeholder="Ej: 25"
                        [error]="form.controls['peso_promedio'].touched && form.controls['peso_promedio'].invalid ? 'Peso inválido' : ''">
                     </app-input>
                 </div>
            </div>

            <!-- Validation Info Box (Subtle) -->
            @if (infoCorralSeleccionado()) {
                <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <div class="flex justify-between items-center text-xs text-slate-400 mb-2">
                        <span>Capacidad Total</span>
                        <span class="font-mono text-slate-300">{{ infoCorralSeleccionado()?.capacidad_maxima }}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-slate-400 mb-2">
                         <span>Ocupación Actual</span>
                         <span class="font-mono text-slate-300">{{ infoCorralSeleccionado()?.ocupacion_total }}</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-slate-700/50 text-xs">
                        <span class="text-emerald-500 font-medium">Espacio Disponible</span>
                        <span class="font-mono font-bold text-emerald-400">{{ (infoCorralSeleccionado()?.capacidad_maxima || 0) - (infoCorralSeleccionado()?.ocupacion_total || 0) }}</span>
                    </div>
                </div>
            }

            <!-- Footer Buttons -->
            <div class="pt-6 flex gap-4">
                <button type="button" (click)="close.emit()"
                    class="px-6 py-3.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    Cancelar
                </button>
                <button type="submit" 
                    [disabled]="form.invalid || loading() || errorCapacidad()"
                    class="flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base">
                    @if (loading()) {
                        <lucide-icon name="loader-2" class="animate-spin"></lucide-icon>
                        Procesando...
                    } @else {
                        <lucide-icon name="check-circle" [size]="20"></lucide-icon>
                        Confirmar Traslado
                    }
                </button>
            </div>
        </form>
      </div>
    </div>
  `
})
export class TrasladoEtapaModalComponent implements OnInit {
    @Input() lote!: LoteDetalle;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private produccionService = inject(ProduccionService);
    private corralesService = inject(CorralesService);

    loading = signal(false);
    corrales = signal<EstadoCorral[]>([]);
    errorCapacidad = signal(false);
    infoCorralSeleccionado = signal<EstadoCorral | null>(null);

    // Computed for filtering only 'engorde' corrales
    corralesDisponibles = computed(() => {
        return this.corrales().filter(c => c.activo && c.tipo === 'engorde');
    });

    form = this.fb.group({
        fecha: [new Date().toISOString().split('T')[0], Validators.required],
        corral_id: [null as number | null, Validators.required],
        peso_promedio: [null as number | null, [Validators.required, Validators.min(0)]],
        cantidad: [0, [Validators.required, Validators.min(1)]]
    });

    async ngOnInit() {
        this.form.patchValue({ cantidad: this.lote.cantidad_actual });
        await this.cargarCorrales();
    }

    async cargarCorrales() {
        try {
            // Get all corrales WITH occupancy
            const data = await this.corralesService.getEstadoCorrales();
            this.corrales.set(data);
        } catch (error) {
            console.error('Error loading corrales', error);
        }
    }

    actualizarValidacion() {
        const corralId = Number(this.form.get('corral_id')?.value);
        const cantidad = Number(this.form.get('cantidad')?.value || 0);

        if (!corralId) {
            this.errorCapacidad.set(false);
            this.infoCorralSeleccionado.set(null);
            return;
        }

        const corral = this.corrales().find(c => c.id === corralId);
        if (corral) {
            this.infoCorralSeleccionado.set(corral);
            const disponible = corral.capacidad_maxima - corral.ocupacion_total;
            this.errorCapacidad.set(cantidad > disponible);
        }
    }

    async onSubmit() {
        this.actualizarValidacion(); // Final check
        if (this.form.invalid || this.errorCapacidad()) return;

        this.loading.set(true);
        try {
            const val = this.form.value;
            await this.produccionService.trasladarAEngorde(this.lote.id, {
                fecha: val.fecha!,
                corral_id: val.corral_id!,
                peso_promedio: val.peso_promedio || undefined,
                cantidad: val.cantidad || undefined
            });

            this.saved.emit();
            this.close.emit();
        } catch (error) {
            console.error('Error traslado etapa', error);
        } finally {
            this.loading.set(false);
        }
    }
}
