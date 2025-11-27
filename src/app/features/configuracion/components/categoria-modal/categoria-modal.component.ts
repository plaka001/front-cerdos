import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionService, CategoriaFinanciera } from '../../../../core/services/configuracion.service';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
    selector: 'app-categoria-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputComponent],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="close.emit()">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-slate-700" (click)="$event.stopPropagation()">
        
        <div class="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">{{ categoria ? 'Editar' : 'Nueva' }} Categoría</h3>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <app-input label="Nombre de la Categoría" formControlName="nombre" placeholder="Ej: Venta de Lechones"></app-input>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de Flujo</label>
            <select formControlName="tipo_flujo" class="w-full bg-slate-700 border-slate-600 rounded-lg text-white p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
              <option value="operativo">Operativo (Día a día)</option>
              <option value="inversion">Inversión (Infraestructura/Equipos)</option>
              <option value="administrativo">Administrativo</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Descripción (Opcional)</label>
            <textarea formControlName="descripcion" rows="3" 
                class="w-full bg-slate-700 border-slate-600 rounded-lg text-white p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-slate-500"
                placeholder="Detalles adicionales..."></textarea>
          </div>

          <div class="pt-2">
            <button type="submit" [disabled]="form.invalid || loading" 
                class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center">
                @if (loading) {
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                }
                {{ loading ? 'Guardando...' : 'Guardar Categoría' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CategoriaModalComponent implements OnInit {
    @Input() categoria: CategoriaFinanciera | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private configService = inject(ConfiguracionService);

    loading = false;

    form = this.fb.group({
        nombre: ['', Validators.required],
        tipo_flujo: ['operativo', Validators.required],
        descripcion: ['']
    });

    ngOnInit() {
        if (this.categoria) {
            this.form.patchValue(this.categoria as any);
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
                id: this.categoria?.id
            } as CategoriaFinanciera;

            await this.configService.saveCategoria(data);
            this.saved.emit();
            this.close.emit();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la categoría');
        } finally {
            this.loading = false;
        }
    }
}
