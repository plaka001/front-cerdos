import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { LoteDetalle, Insumo } from '../../../../core/models';


@Component({
  selector: 'app-registrar-sanidad-lote-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-700 max-h-[90vh] flex flex-col">
        
        <!-- Header -->
        <div class="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800 shrink-0">
          <div>
            <h3 class="text-lg font-bold text-white">Sanidad - Lote {{ lote.codigo }}</h3>
            <p class="text-sm text-slate-400">Registrar tratamiento o vacuna</p>
          </div>
          <button (click)="close.emit()" class="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <lucide-icon name="x" [size]="20" class="text-slate-400"></lucide-icon>
          </button>
        </div>

        <!-- Form (Scrollable) -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          
          <div class="space-y-4">
            
            <div formArrayName="insumos" class="space-y-3">
                <div *ngFor="let control of insumosArray.controls; let i = index" [formGroupName]="i" 
                     class="flex flex-col sm:flex-row gap-3 items-start sm:items-end animate-in fade-in slide-in-from-right-4 bg-slate-700/30 p-3 rounded-xl border border-slate-700 sm:border-0 sm:bg-transparent sm:p-0">
                    
                    <!-- Selector -->
                    <div class="w-full sm:flex-1 space-y-1">
                        <label *ngIf="i === 0" class="block text-xs font-medium text-slate-400 mb-1 pl-1">Medicamento</label>
                        <label *ngIf="i > 0" class="sm:hidden block text-xs font-medium text-slate-400">Medicamento</label>
                        <select formControlName="insumo_id" 
                                class="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-[42px]">
                            <option value="" disabled>Seleccionar...</option>
                            @for (item of insumosFiltrados(); track item.id) {
                            <option [value]="item.id">
                                {{ item.nombre }} (Stock: {{ item.stock_actual }} {{ item.unidad_medida }})
                            </option>
                            }
                        </select>
                         <!-- Stock Warning -->
                         @if (getError(i, 'max')) {
                            <p class="text-[10px] text-red-400 mt-1 absolute sm:relative">{{ getError(i, 'msg') }}</p>
                        }
                    </div>

                    <!-- Cantidad -->
                    <div class="w-full sm:w-32 space-y-1">
                         <label *ngIf="i === 0" class="block text-xs font-medium text-slate-400 mb-1 pl-1">Dosis</label>
                         <label *ngIf="i > 0" class="sm:hidden block text-xs font-medium text-slate-400">Dosis</label>
                         <input type="number" formControlName="cantidad" placeholder="Cant." 
                                class="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-[42px]">
                    </div>

                    <!-- Remove Button -->
                    <div class="flex items-center h-[42px]">
                        <button type="button" (click)="eliminarInsumo(i)" 
                                [class.invisible]="insumosArray.length === 1"
                                class="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Eliminar">
                            <lucide-icon name="x" [size]="20"></lucide-icon>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Add Button -->
            <button type="button" (click)="agregarInsumo()" 
                    class="w-full py-3 border border-dashed border-emerald-500/30 bg-emerald-500/5 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all flex items-center justify-center gap-2 text-sm font-bold mt-2">
                <lucide-icon name="plus" [size]="18"></lucide-icon>
                Agregar otro producto
            </button>
            
            <!-- Observaciones -->
            <div class="space-y-1 pt-2 border-t border-slate-700/50">
                <label class="block text-sm font-medium text-slate-300">Observación / Motivo (Para Historial)</label>
                <textarea formControlName="observaciones" rows="2" 
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Ej: Vacuna Circovirus o Tratamiento diarrea"></textarea>
                <p class="text-xs text-slate-500">Este texto se usará para confirmar la tarea en la agenda.</p>
            </div>
          </div>

          <!-- Error Global -->
          @if (error()) {
            <div class="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-900/30 flex items-start gap-2">
              <lucide-icon name="alert-circle" [size]="18"></lucide-icon>
              <span>{{ error() }}</span>
            </div>
          }

          <!-- Actions -->
          <div class="pt-2 shrink-0">
            <button type="submit" 
                    [disabled]="form.invalid || loading()"
                    class="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center border border-emerald-500/20">
              @if (loading()) {
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              } @else {
                Guardar Evento
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
  @Input() nombreTarea?: string; // Tarea que viene de la agenda
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private produccionService = inject(ProduccionService);

  form!: FormGroup;
  loading = signal<boolean>(false);
  loadingInsumos = signal<boolean>(true);
  error = signal<string | null>(null);
  insumos = signal<Insumo[]>([]);
  insumosFiltrados = signal<Insumo[]>([]);

  ngOnInit() {
    this.initForm();
    this.loadInsumos();
  }

  get insumosArray() {
    return this.form.get('insumos') as FormArray;
  }

  initForm() {
    this.form = this.fb.group({
      insumos: this.fb.array([]),
      observaciones: [this.nombreTarea || '', Validators.required]
    });

    // Agregar primer insumo
    this.agregarInsumo();
  }

  crearInsumoGroup(): FormGroup {
    const group = this.fb.group({
      insumo_id: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(0.01)]]
    });

    // Validación dinámica de stock
    group.get('cantidad')?.valueChanges.subscribe(val => {
      const insumoId = group.get('insumo_id')?.value;
      this.validarStock(group, insumoId, val);
    });

    group.get('insumo_id')?.valueChanges.subscribe(id => {
      const cantidad = group.get('cantidad')?.value;
      this.validarStock(group, id, cantidad);
    });

    return group;
  }

  validarStock(group: FormGroup, insumoId: any, cantidad: any) {
    if (insumoId && cantidad) {
      const insumo = this.insumos().find(i => i.id == insumoId);
      if (insumo && cantidad > insumo.stock_actual) {
        group.get('cantidad')?.setErrors({ max: true });
        group.setErrors({ stock_insuficiente: `Max: ${insumo.stock_actual}` }); // Custom error property on group for easy access
      } else {
        group.get('cantidad')?.setErrors(null);
        group.setErrors(null);
      }
    }
  }

  agregarInsumo() {
    this.insumosArray.push(this.crearInsumoGroup());
  }

  eliminarInsumo(index: number) {
    this.insumosArray.removeAt(index);
  }

  getError(index: number, type: string): any {
    const group = this.insumosArray.at(index) as FormGroup;
    if (type === 'max') {
      return group.hasError('stock_insuficiente');
    }
    if (type === 'msg') {
      return group.getError('stock_insuficiente');
    }
    return null;
  }

  async loadInsumos() {
    try {
      this.loadingInsumos.set(true);
      const data = await this.produccionService.getInsumosMedicos();
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

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      this.error.set(null);

      const formVal = this.form.value;
      const insumosProcessor = [];

      // Preparar array de insumos para el servicio
      for (const item of formVal.insumos) {
        const insumoReal = this.insumos().find(i => i.id == item.insumo_id);
        if (!insumoReal) throw new Error('Insumo inválido');

        if (item.cantidad > insumoReal.stock_actual) {
          throw new Error(`Stock insuficiente para ${insumoReal.nombre}`);
        }

        insumosProcessor.push({
          insumo_id: Number(item.insumo_id),
          cantidad: Number(item.cantidad),
          costo_unitario_momento: insumoReal.costo_promedio,
          nombre_producto: insumoReal.nombre
        });
      }

      await this.produccionService.registrarSanidadLote(this.lote.id, {
        insumos: insumosProcessor,
        observaciones: formVal.observaciones,
        nombre_tarea: this.nombreTarea
      });

      this.saved.emit();
    } catch (err: any) {
      console.error(err);
      this.error.set(err.message || 'Error al guardar el evento multitarea');
    } finally {
      this.loading.set(false);
    }
  }
}
