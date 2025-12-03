import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { LoteDetalle, Insumo } from '../../../../core/models';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
    selector: 'app-registrar-sanidad-lote-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, InputComponent],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-700">
        
        <!-- Header -->
        <div class="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div>
            <h3 class="text-lg font-bold text-white">Sanidad - Lote {{ lote.codigo }}</h3>
            <p class="text-sm text-slate-400">Registrar tratamiento o vacuna</p>
          </div>
          <button (click)="close.emit()" class="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <lucide-icon name="x" [size]="20" class="text-slate-400"></lucide-icon>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <div class="space-y-4">
            <!-- Selector de Insumo -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-300">Producto / Medicamento</label>
              <select formControlName="insumo_id" 
                      class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
                <option value="" disabled>Seleccionar...</option>
                @for (item of insumosFiltrados(); track item.id) {
                  <option [value]="item.id">
                    {{ item.nombre }} (Stock: {{ item.stock_actual }} {{ item.unidad_medida }})
                  </option>
                }
              </select>
              @if (insumosFiltrados().length === 0 && !loadingInsumos()) {
                <p class="text-xs text-amber-400 mt-1">No hay medicamentos con stock disponible.</p>
              }
            </div>
            
            <!-- Cantidad -->
            <app-input label="Cantidad Total Aplicada" type="number" formControlName="cantidad" placeholder="0.0"></app-input>
            
            <!-- Observaciones -->
            <div class="space-y-1">
                <label class="block text-sm font-medium text-slate-300">Observación / Motivo</label>
                <textarea formControlName="observaciones" rows="3" 
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Ej: Vacuna Circovirus o Tratamiento diarrea"></textarea>
            </div>
          </div>

          <!-- Error Message -->
          @if (error()) {
            <div class="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-900/30 flex items-start gap-2">
              <lucide-icon name="alert-circle" [size]="18"></lucide-icon>
              <span>{{ error() }}</span>
            </div>
          }

          <!-- Actions -->
          <div class="pt-2">
            <button type="submit" 
                    [disabled]="form.invalid || loading()"
                    class="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center border border-emerald-500/20">
              @if (loading()) {
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              } @else {
                Guardar Evento Sanitario
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class RegistrarSanidadLoteModalComponent {
    @Input({ required: true }) lote!: LoteDetalle;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private produccionService = inject(ProduccionService);

    form!: FormGroup;
    loading = signal<boolean>(false);
    loadingInsumos = signal<boolean>(true);
    error = signal<string | null>(null);
    insumos = signal<Insumo[]>([]);

    // Signal computada o filtrada manualmente
    insumosFiltrados = signal<Insumo[]>([]);

    ngOnInit() {
        this.initForm();
        this.loadInsumos();
    }

    async loadInsumos() {
        try {
            this.loadingInsumos.set(true);
            const data = await this.produccionService.getInsumosMedicos(); // Esto trae tipo 'medicamento' o 'biologico'
            // Filtrar solo los que tienen stock > 0
            const disponibles = data.filter(i => i.stock_actual > 0);
            this.insumos.set(data);
            this.insumosFiltrados.set(disponibles);
        } catch (err) {
            console.error('Error loading insumos', err);
            this.error.set('Error cargando lista de medicamentos');
        } finally {
            this.loadingInsumos.set(false);
        }
    }

    initForm() {
        this.form = this.fb.group({
            insumo_id: ['', Validators.required],
            cantidad: [null, [Validators.required, Validators.min(0.01)]],
            observaciones: ['', Validators.required]
        });

        // Validación dinámica de stock
        this.form.get('cantidad')?.valueChanges.subscribe(val => {
            const insumoId = this.form.get('insumo_id')?.value;
            if (insumoId && val) {
                const insumo = this.insumos().find(i => i.id == insumoId);
                if (insumo && val > insumo.stock_actual) {
                    this.form.get('cantidad')?.setErrors({ max: true });
                    this.error.set(`Stock insuficiente. Disponible: ${insumo.stock_actual} ${insumo.unidad_medida}`);
                } else {
                    this.form.get('cantidad')?.setErrors(null);
                    this.error.set(null);
                }
            }
        });

        // Resetear error al cambiar insumo
        this.form.get('insumo_id')?.valueChanges.subscribe(() => {
            this.form.get('cantidad')?.updateValueAndValidity();
        });
    }

    async onSubmit() {
        if (this.form.invalid) return;

        try {
            this.loading.set(true);
            this.error.set(null);
            const val = this.form.value;

            // Buscar insumo para obtener costo y nombre
            const insumo = this.insumos().find(i => i.id == val.insumo_id);
            if (!insumo) {
                this.error.set('Insumo no válido');
                return;
            }

            if (val.cantidad > insumo.stock_actual) {
                this.error.set(`Stock insuficiente. Disponible: ${insumo.stock_actual}`);
                return;
            }

            await this.produccionService.registrarSanidadLote(this.lote.id, {
                insumo_id: val.insumo_id,
                cantidad: val.cantidad,
                costo_unitario_momento: insumo.costo_promedio,
                observaciones: val.observaciones,
                nombre_producto: insumo.nombre
            });

            this.saved.emit();
        } catch (err: any) {
            console.error(err);
            this.error.set(err.message || 'Error al guardar el evento');
        } finally {
            this.loading.set(false);
        }
    }
}
