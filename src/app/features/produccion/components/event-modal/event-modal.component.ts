import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { CerdaDetalle } from '../../../../core/models';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, InputComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-700">
        
        <!-- Header -->
        <div class="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div>
            <h3 class="text-lg font-bold text-white">{{ getTitle() }}</h3>
            <p class="text-sm text-slate-400">Cerda {{ cerda.chapeta }}</p>
          </div>
          <button (click)="close.emit()" class="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <lucide-icon name="x" [size]="20" class="text-slate-400"></lucide-icon>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <!-- Inseminación Fields -->
          @if (tipoEvento === 'inseminacion') {
            <div class="space-y-4">
              <app-input label="Fecha de Inseminación" type="date" formControlName="fecha"></app-input>
              <app-input label="Macho / Semen" formControlName="macho" placeholder="Ej: Duroc 05"></app-input>
              <app-input label="Observaciones (opcional)" formControlName="observaciones" placeholder="Notas adicionales..."></app-input>
            </div>
          }

          <!-- Parto Fields -->
          @if (tipoEvento === 'parto') {
            <div class="space-y-4">
              <app-input label="Fecha de Parto" type="date" formControlName="fecha"></app-input>
              
              <div class="grid grid-cols-3 gap-3">
                <app-input label="Vivos" type="number" formControlName="nacidos_vivos" placeholder="0"></app-input>
                <app-input label="Muertos" type="number" formControlName="nacidos_muertos" placeholder="0"></app-input>
                <app-input label="Momias" type="number" formControlName="momias" placeholder="0"></app-input>
              </div>
              
              <app-input label="Observaciones (opcional)" formControlName="observaciones" placeholder="Complicaciones, hora del parto, etc..."></app-input>
            </div>
          }

          <!-- Destete Fields -->
          @if (tipoEvento === 'destete') {
            <div class="space-y-4">
              <app-input label="Fecha de Destete" type="date" formControlName="fecha"></app-input>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <app-input label="Cantidad" type="number" formControlName="cantidad" placeholder="0"></app-input>
                  @if (form.get('cantidad')?.hasError('max') && form.get('cantidad')?.touched) {
                    <p class="text-xs text-red-400 mt-1">
                      Error: La cerda solo tiene {{ maxLechonesDestete() }} lechones vivos registrados.
                    </p>
                  }
                  @if (maxLechonesDestete() && maxLechonesDestete()! > 0) {
                    <p class="text-xs text-slate-400 mt-1">
                      Máximo permitido: {{ maxLechonesDestete() }} lechones
                    </p>
                  }
                </div>
                <app-input label="Peso Prom. (Kg)" type="number" formControlName="peso" placeholder="0.0"></app-input>
              </div>
              
              <div class="flex items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <input type="checkbox" formControlName="crear_lote" id="crear_lote" class="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500 border-slate-500 bg-slate-600">
                <label for="crear_lote" class="ml-3 text-sm font-medium text-slate-300 cursor-pointer">
                  Crear Lote de Engorde automáticamente
                </label>
              </div>

              <app-input label="Observaciones (opcional)" formControlName="observaciones" placeholder="Condiciones de los lechones, etc..."></app-input>
            </div>
          }

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
                {{ getSubmitLabel() }}
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class EventModalComponent {
  @Input({ required: true }) cerda!: CerdaDetalle;
  @Input({ required: true }) tipoEvento!: 'inseminacion' | 'parto' | 'destete';
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private produccionService = inject(ProduccionService);

  form!: FormGroup;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  maxLechonesDestete = signal<number | null>(null);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const hoy = new Date().toISOString().split('T')[0];

    if (this.tipoEvento === 'inseminacion') {
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        macho: ['', Validators.required],
        observaciones: ['']
      });
    } else if (this.tipoEvento === 'parto') {
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        nacidos_vivos: [null, [Validators.required, Validators.min(0)]],
        nacidos_muertos: [0, [Validators.required, Validators.min(0)]],
        momias: [0, [Validators.required, Validators.min(0)]],
        observaciones: ['']
      });
    } else if (this.tipoEvento === 'destete') {
      // Obtener nacidos_vivos del ciclo activo para validación
      const nacidosVivos = this.cerda.cicloActivo?.nacidos_vivos || 0;
      this.maxLechonesDestete.set(nacidosVivos);

      // Validación: cantidad no puede exceder nacidos_vivos
      const validadoresCantidad = [
        Validators.required,
        Validators.min(1),
        Validators.max(nacidosVivos)
      ];

      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        cantidad: [null, validadoresCantidad],
        peso: [null, [Validators.required, Validators.min(0)]],
        crear_lote: [true],
        observaciones: ['']
      });
    }
  }

  getTitle(): string {
    switch (this.tipoEvento) {
      case 'inseminacion': return 'Nueva Inseminación';
      case 'parto': return 'Registrar Parto';
      case 'destete': return 'Registrar Destete';
      default: return 'Evento';
    }
  }

  getSubmitLabel(): string {
    switch (this.tipoEvento) {
      case 'inseminacion': return 'Guardar Inseminación';
      case 'parto': return 'Guardar Parto';
      case 'destete': return 'Finalizar Lactancia';
      default: return 'Guardar';
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      this.error.set(null);
      const val = this.form.value;

      if (this.tipoEvento === 'inseminacion') {
        await this.produccionService.registrarInseminacion(this.cerda.id, val);
      } else if (this.tipoEvento === 'parto') {
        if (!this.cerda.cicloActivo) {
          this.error.set('Esta cerda no tiene un ciclo reproductivo activo. Primero debe registrar una inseminación.');
          return;
        }
        await this.produccionService.registrarParto(this.cerda.id, this.cerda.cicloActivo.id, val);
      } else if (this.tipoEvento === 'destete') {
        if (!this.cerda.cicloActivo) {
          this.error.set('Esta cerda no tiene un ciclo reproductivo activo.');
          return;
        }

        // Validación adicional: verificar que cantidad no exceda nacidos_vivos
        const cantidad = val.cantidad;
        const nacidosVivos = this.cerda.cicloActivo.nacidos_vivos || 0;
        
        if (cantidad > nacidosVivos) {
          this.error.set(`Error: La cerda solo tiene ${nacidosVivos} lechones vivos registrados. No se pueden destetar más de los que nacieron vivos.`);
          this.loading.set(false);
          return;
        }

        await this.produccionService.registrarDestete(this.cerda.id, this.cerda.cicloActivo.id, val);
      }

      this.saved.emit();
    } catch (err: any) {
      console.error(err);
      this.error.set(err.message || 'Error al guardar el evento');
    } finally {
      this.loading.set(false);
    }
  }
}
