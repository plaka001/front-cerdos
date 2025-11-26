import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { CerdaDetalle } from '../../../../core/models';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ getTitle() }}</h3>
            <p class="text-sm text-gray-500">Cerda {{ cerda.chapeta }}</p>
          </div>
          <button (click)="close.emit()" class="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <lucide-icon name="x" [size]="20" class="text-gray-500"></lucide-icon>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4">
          
          <!-- Inseminación Fields -->
          @if (tipoEvento === 'inseminacion') {
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Inseminación</label>
                <input type="date" formControlName="fecha" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Macho / Semen</label>
                <input type="text" formControlName="macho" placeholder="Ej: Duroc 05" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
                <textarea formControlName="observaciones" rows="2" placeholder="Notas adicionales..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          }

          <!-- Parto Fields -->
          @if (tipoEvento === 'parto') {
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Parto</label>
                <input type="date" formControlName="fecha" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
              </div>
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Vivos</label>
                  <input type="number" formControlName="nacidos_vivos" class="w-full p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Muertos</label>
                  <input type="number" formControlName="nacidos_muertos" class="w-full p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Momias</label>
                  <input type="number" formControlName="momias" class="w-full p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
                <textarea formControlName="observaciones" rows="2" placeholder="Complicaciones, hora del parto, etc..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          }

          <!-- Destete Fields -->
          @if (tipoEvento === 'destete') {
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Destete</label>
                <input type="date" formControlName="fecha" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input type="number" formControlName="cantidad" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Peso Prom. (Kg)</label>
                  <input type="number" formControlName="peso" step="0.1" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none">
                </div>
              </div>
              
              <div class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input type="checkbox" formControlName="crear_lote" id="crear_lote" class="w-5 h-5 text-black rounded focus:ring-black border-gray-300">
                <label for="crear_lote" class="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Crear Lote de Engorde automáticamente
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional)</label>
                <textarea formControlName="observaciones" rows="2" placeholder="Condiciones de los lechones, etc..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          }

          <!-- Error Message -->
          @if (error()) {
            <div class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {{ error() }}
            </div>
          }

          <!-- Actions -->
          <div class="pt-2">
            <button type="submit" 
                    [disabled]="form.invalid || loading()"
                    class="w-full py-3 px-4 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center">
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
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        cantidad: [null, [Validators.required, Validators.min(1)]],
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
