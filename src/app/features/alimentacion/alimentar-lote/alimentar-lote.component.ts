import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FinanzasService } from '../../../core/services/finanzas.service';
import { ProduccionService } from '../../../core/services/produccion.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { SalidaInsumo } from '../../../core/models';

@Component({
  selector: 'app-alimentar-lote',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent],
  template: `
    <div class="max-w-md mx-auto p-4 pb-24">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Alimentación Diaria</h2>

      <app-card>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          
          <!-- Lote -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lote</label>
            <select formControlName="lote_id" class="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
              <option [ngValue]="null">Seleccione Lote</option>
              <option *ngFor="let lote of lotes()" [value]="lote.id">
                {{ lote.codigo }} ({{ lote.cantidad_actual }} cerdos)
              </option>
            </select>
          </div>

          <!-- Alimento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alimento</label>
            <select formControlName="insumo_id" class="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
              <option [ngValue]="null">Seleccione Alimento</option>
              <option *ngFor="let insumo of alimentos()" [value]="insumo.id">
                {{ insumo.nombre }} (Stock: {{ insumo.stock_actual }} {{ insumo.unidad_medida }})
              </option>
            </select>
          </div>

          <!-- Cantidad -->
          <app-input label="Cantidad Total (kg)" type="number" formControlName="cantidad" placeholder="0.00"></app-input>

          <!-- Notas -->
          <app-input label="Notas" formControlName="notas" placeholder="Opcional"></app-input>

          <div class="pt-4">
            <app-button type="submit" [disabled]="form.invalid || loading()" [fullWidth]="true" variant="primary">
              {{ loading() ? 'Registrando...' : 'Registrar Alimentación' }}
            </app-button>
          </div>

        </form>
      </app-card>
    </div>
  `
})
export class AlimentarLoteComponent {
  private fb = inject(FormBuilder);
  private finanzasService = inject(FinanzasService);
  private produccionService = inject(ProduccionService);

  form: FormGroup;
  loading = signal(false);

  lotes = this.produccionService.lotes;
  insumos = this.finanzasService.insumos;

  alimentos = computed(() => {
    return this.insumos().filter(i => i.tipo === 'alimento');
  });

  constructor() {
    this.form = this.fb.group({
      lote_id: [null, Validators.required],
      insumo_id: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.min(0.1)]],
      notas: ['']
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const val = this.form.value;

      const salida: Partial<SalidaInsumo> = {
        fecha: new Date().toISOString().split('T')[0],
        insumo_id: val.insumo_id,
        cantidad: val.cantidad,
        destino_tipo: 'lote',
        lote_id: val.lote_id,
        notas: val.notas
        // costo_unitario_momento se calcula en el backend/servicio
      };

      await this.finanzasService.registrarSalidaInsumo(salida);

      this.form.reset();
      alert('Alimentación registrada correctamente');

    } catch (error) {
      console.error(error);
      alert('Error al registrar alimentación');
    } finally {
      this.loading.set(false);
    }
  }
}
