import { Component, EventEmitter, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { FinanzasService } from '../../../../core/services/finanzas.service';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
    selector: 'app-alimentar-cerdas-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputComponent],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="close.emit()">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-slate-700" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/95 backdrop-blur-sm">
          <div>
            <h3 class="text-lg font-bold text-white">Registro Alimento</h3>
            <p class="text-sm text-slate-400">Maternidad / Gestación</p>
          </div>
          <button (click)="close.emit()" type="button" class="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <span class="text-xl">✖️</span>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <!-- Producto -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Producto de Alimento</label>
            <select 
              formControlName="insumo_id"
              class="block w-full h-12 rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm transition-all px-3"
            >
              <option [value]="null">Seleccione un producto</option>
              @for (insumo of insumosDisponibles(); track insumo.id) {
                <option [value]="insumo.id">
                  {{ insumo.nombre }} (Stock: {{ insumo.stock_actual }} {{ insumo.unidad_medida_uso }})
                </option>
              }
            </select>
            @if (form.get('insumo_id')?.invalid && form.get('insumo_id')?.touched) {
              <p class="mt-1 text-sm text-red-400">Producto requerido</p>
            }
          </div>

          <!-- Info del Producto Seleccionado -->
          @if (insumoSeleccionado()) {
            <div class="bg-slate-700/50 border-l-4 border-emerald-500 p-3 rounded-r-md">
              <p class="text-sm text-slate-300">
                <span class="font-semibold">📦 Presentación:</span> 
                {{ insumoSeleccionado()!.presentacion_compra }} {{ insumoSeleccionado()!.unidad_medida_uso }}
              </p>
              <p class="text-sm text-slate-300 mt-1">
                <span class="font-semibold">💵 Costo:</span> 
                \${{ insumoSeleccionado()!.costo_promedio.toLocaleString('es-CO') }} / {{ insumoSeleccionado()!.unidad_medida_uso }}
              </p>
            </div>
          }

          <!-- Cantidad -->
          <div>
            <app-input 
              label="Cantidad (kg/bultos)" 
              type="number" 
              formControlName="cantidad" 
              placeholder="Ej: 2"
            ></app-input>

            @if (textoConversion()) {
              <div class="mt-3 bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-md">
                <p class="text-sm text-white font-medium">{{ textoConversion() }}</p>
              </div>
            }
          </div>

          <!-- Etapa (Opcional) -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Etapa (Opcional)</label>
            <select 
              formControlName="etapa"
              class="block w-full h-12 rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm transition-all px-3"
            >
              <option value="">Sin especificar</option>
              <option value="Gestación">Gestación</option>
              <option value="Lactancia">Lactancia</option>
            </select>
          </div>

          <!-- Costo Total Estimado -->
          @if (costoTotal()) {
            <div class="bg-emerald-900/20 border-l-4 border-emerald-500 p-3 rounded-r-md">
              <p class="text-sm text-emerald-300">
                <span class="font-semibold">💰 Costo Total Estimado:</span>
                <span class="text-lg ml-2">\${{ costoTotal()!.toLocaleString('es-CO') }}</span>
              </p>
            </div>
          }

          <!-- Error Message -->
          @if (error()) {
            <div class="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-900/30 flex items-start gap-2">
              <span class="text-lg">⚠️</span>
              <span>{{ error() }}</span>
            </div>
          }

          <!-- Submit Button -->
          <div class="pt-2">
            <button 
              type="submit" 
              [disabled]="form.invalid || loading()"
              class="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center border border-emerald-500/20"
            >
              @if (loading()) {
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              } @else {
                🍽️ REGISTRAR ALIMENTACIÓN
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: []
})
export class AlimentarCerdasModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private produccionService = inject(ProduccionService);
    private finanzasService = inject(FinanzasService);

    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    // Insumos disponibles (alimentos con stock > 0)
    insumosDisponibles = computed(() => {
        return this.finanzasService.insumos()
            .filter(i => i.tipo === 'alimento' && i.stock_actual > 0);
    });

    form: FormGroup = this.fb.group({
        insumo_id: [null, Validators.required],
        cantidad: [null, [Validators.required, Validators.min(0.1)]],
        etapa: ['']
    });

    // Computed para insumo seleccionado
    insumoSeleccionado = computed(() => {
        const insumoId = this.form.get('insumo_id')?.value;
        if (!insumoId) return null;
        return this.finanzasService.insumos().find(i => i.id == insumoId) || null;
    });

    // Texto de conversión (igual que en finanzas)
    textoConversion = computed(() => {
        const insumo = this.insumoSeleccionado();
        const cantidad = this.form.get('cantidad')?.value;
        if (!insumo || !cantidad) return '';

        const totalKg = cantidad * insumo.presentacion_compra;
        return `= ${totalKg.toLocaleString('es-CO')} ${insumo.unidad_medida_uso} de alimento`;
    });

    // Costo total
    costoTotal = computed(() => {
        const insumo = this.insumoSeleccionado();
        const cantidad = this.form.get('cantidad')?.value;
        if (!insumo || !cantidad) return null;

        const totalKg = cantidad * insumo.presentacion_compra;
        return totalKg * insumo.costo_promedio;
    });

    constructor() {
        // Escuchar cambios en el form para actualizar signals
        this.form.valueChanges.subscribe(() => {
            // Trigger re-computation
            this.insumoSeleccionado();
        });
    }

    async onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        try {
            const formVal = this.form.value;
            const insumo = this.insumoSeleccionado();

            if (!insumo) {
                throw new Error('Insumo no encontrado');
            }

            const cantidadKg = formVal.cantidad * insumo.presentacion_compra;

            await this.produccionService.registrarAlimentacionCerdas({
                insumo_id: formVal.insumo_id,
                cantidad: cantidadKg,
                costo_unitario_momento: insumo.costo_promedio,
                etapa: formVal.etapa || ''
            });

            this.saved.emit();
            this.close.emit();
        } catch (err: any) {
            console.error('Error al registrar alimentación:', err);
            this.error.set(err.message || 'Error al registrar la alimentación');
        } finally {
            this.loading.set(false);
        }
    }
}
