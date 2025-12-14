import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorralesService } from '../../../../core/services/corrales.service';
import { Corral } from '../../../../core/models';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-corral-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="close.emit()">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-slate-700" (click)="$event.stopPropagation()">
        
        <div class="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">{{ corral ? 'Editar' : 'Nuevo' }} Corral</h3>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <app-input label="Nombre del Corral" formControlName="nombre" placeholder="Ej: Corral 1"></app-input>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de Corral</label>
            <select formControlName="tipo" class="w-full bg-slate-700 border-slate-600 rounded-lg text-white p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
              <option value="gestacion">Gestación (Jaulas/Corrales)</option>
              <option value="paridera">Paridera (Maternidad)</option>
              <option value="precebo">Precebo (Destete)</option>
              <option value="engorde">Engorde (Ceba)</option>
              <option value="cuarentena">Cuarentena / Enfermería</option>
            </select>
          </div>

          <app-input label="Capacidad Máxima" type="number" formControlName="capacidad_maxima" placeholder="Ej: 20"></app-input>
          <p class="text-xs text-slate-400 -mt-2">Esta capacidad se usará para calcular las alertas de hacinamiento.</p>

          <div class="pt-2">
            <button type="submit" [disabled]="form.invalid || loading" 
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center">
                @if (loading) {
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                }
                {{ loading ? 'Guardando...' : 'Guardar Corral' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CorralModalComponent implements OnInit {
  @Input() corral: Corral | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private corralesService = inject(CorralesService);

  loading = false;

  form = this.fb.group({
    nombre: ['', Validators.required],
    tipo: ['precebo', Validators.required],
    capacidad_maxima: [20, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    if (this.corral) {
      this.form.patchValue(this.corral as any);
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const data = this.form.value as unknown as Omit<Corral, 'id' | 'created_at'>;

      if (this.corral) {
        await this.corralesService.updateCorral(this.corral.id, data);
      } else {
        await this.corralesService.createCorral({ ...data, activo: true });
      }

      this.saved.emit();
      this.close.emit();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el corral');
    } finally {
      this.loading = false;
    }
  }
}
