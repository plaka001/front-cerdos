import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionService, Insumo } from '../../../../core/services/configuracion.service';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
    selector: 'app-insumo-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputComponent],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="close.emit()">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-slate-700" (click)="$event.stopPropagation()">
        
        <div class="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">{{ insumo ? 'Editar' : 'Nuevo' }} Insumo</h3>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <app-input label="Nombre del Producto" formControlName="nombre" placeholder="Ej: Concentrado Inicio"></app-input>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de Insumo</label>
            <select formControlName="tipo" class="w-full bg-slate-700 border-slate-600 rounded-lg text-white p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
              <option value="alimento">Alimento 🌽</option>
              <option value="medicamento">Medicamento 💊</option>
              <option value="biologico">Biológico (Vacuna) 💉</option>
              <option value="material">Material / Equipo 🛠️</option>
              <option value="otro">Otro 📦</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Unidad</label>
                <select formControlName="unidad_medida" class="w-full bg-slate-700 border-slate-600 rounded-lg text-white p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                <option value="kg">Kilos (kg)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="dosis">Dosis</option>
                <option value="unidad">Unidad</option>
                </select>
            </div>
            <app-input label="Presentación (Cant)" type="number" formControlName="presentacion_compra" placeholder="Ej: 40"></app-input>
          </div>
          <p class="text-xs text-slate-400 -mt-2">Ej: Si compras bultos de 40kg, pon 40.</p>

          <app-input label="Stock Mínimo (Alerta)" type="number" formControlName="stock_minimo" placeholder="Ej: 5"></app-input>

          <div class="pt-2">
            <button type="submit" [disabled]="form.invalid || loading" 
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center">
                @if (loading) {
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                }
                {{ loading ? 'Guardando...' : 'Guardar Insumo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InsumoModalComponent implements OnInit {
    @Input() insumo: Insumo | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private configService = inject(ConfiguracionService);

    loading = false;

    form = this.fb.group({
        nombre: ['', Validators.required],
        tipo: ['alimento', Validators.required],
        unidad_medida: ['kg', Validators.required],
        presentacion_compra: [1, [Validators.required, Validators.min(0.1)]],
        stock_minimo: [0, [Validators.required, Validators.min(0)]]
    });

    ngOnInit() {
        if (this.insumo) {
            this.form.patchValue(this.insumo as any);
        }
    }

    async onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        try {
            const data = {
                ...this.form.value,
                id: this.insumo?.id
            } as Insumo;

            await this.configService.saveInsumo(data);
            this.saved.emit();
            this.close.emit();
        } catch (error) {
            console.error(error);
            // Aquí idealmente usaríamos un toast, pero por simplicidad y tiempo:
            alert('Error al guardar el insumo');
        } finally {
            this.loading = false;
        }
    }
}
