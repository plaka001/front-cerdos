import { Component, EventEmitter, Output, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { CurrencyCopDirective } from '../../../../shared/directives/currency-cop.directive';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { CorralesService } from '../../../../core/services/corrales.service';
import { Corral } from '../../../../core/models';

@Component({
  selector: 'app-nueva-cerda-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, InputComponent, CurrencyCopDirective],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="close.emit()">
      <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-slate-700" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/95 backdrop-blur-sm">
          <div>
            <h3 class="text-lg font-bold text-white">Ingresar Nueva Cerda</h3>
            <p class="text-sm text-slate-400">Registro de pie de cría</p>
          </div>
          <button (click)="close.emit()" type="button" class="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <lucide-icon name="x" [size]="20" class="text-slate-400"></lucide-icon>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5 space-y-4 pb-20">
          
          <!-- Datos Biológicos -->
          <div class="space-y-4">
            <app-input label="Chapeta (ID)" formControlName="chapeta" placeholder="Ej: C-012"></app-input>
            
            <app-input label="Raza" formControlName="raza" placeholder="Ej: F1, Landrace..."></app-input>

            <!-- Selector de Corral -->
             <div>
              <label class="block text-sm font-medium text-slate-300 mb-1">Ubicación Inicial (Corral) <span class="text-red-400">*</span></label>
              <select formControlName="corral_id" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                <option value="" disabled>Seleccione ubicación...</option>
                @for (c of corrales(); track c.id) {
                  <option [value]="c.id">
                    {{ c.nombre }} ({{ c.tipo | titlecase }}) - Cap: {{ c.capacidad_maxima }}
                  </option>
                }
              </select>
              @if (form.get('corral_id')?.touched && form.get('corral_id')?.invalid) {
                <p class="text-xs text-red-400 mt-1">La ubicación es obligatoria.</p>
              }
            </div>
            
            <app-input label="Fecha de Nacimiento" type="date" formControlName="fecha_nacimiento"></app-input>
            
            <app-input label="Partos Acumulados" type="number" formControlName="partos_acumulados" placeholder="0"></app-input>
          </div>

          <!-- Sección Financiera -->
          <div class="pt-2 border-t border-slate-700">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-slate-300">¿Fue comprada?</span>
              <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" formControlName="fue_comprada" id="toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer border border-slate-600"></label>
              </div>
            </div>

            @if (form.get('fue_comprada')?.value) {
              <div class="space-y-4 animate-in slide-in-from-top-2">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Valor de Compra</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input 
                      type="text" 
                      formControlName="valor_compra" 
                      appCurrencyCop
                      placeholder="0"
                      class="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <app-input label="Fecha de Compra" type="date" formControlName="fecha_compra"></app-input>
              </div>
            }
          </div>

          <!-- Error Message -->
          @if (error()) {
            <div class="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-900/30 flex items-start gap-2">
              <lucide-icon name="alert-circle" [size]="18"></lucide-icon>
              <span>{{ error() }}</span>
            </div>
          }

          <!-- Footer Actions -->
          <div class="pt-2">
            <button type="submit" 
                    [disabled]="form.invalid || loading()"
                    class="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center border border-emerald-500/20">
              @if (loading()) {
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              } @else {
                REGISTRAR CERDA
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .toggle-checkbox:checked {
      right: 0;
      border-color: #10B981;
    }
    .toggle-checkbox:checked + .toggle-label {
      background-color: #10B981;
    }
    .toggle-checkbox {
      right: 50%;
      transform: translateX(100%);
    }
    .toggle-checkbox {
      top: 0;
      left: 0;
      transform: translateX(0);
      transition: transform 0.2s;
    }
    .toggle-checkbox:checked {
      transform: translateX(100%);
      border-color: white;
    }
    .toggle-label {
      width: 3rem;
      height: 1.5rem;
    }
    .toggle-checkbox {
      width: 1.5rem;
      height: 1.5rem;
      top: 0;
      left: 0;
      border: 0;
    }
  `]
})
export class NuevaCerdaModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private produccionService = inject(ProduccionService);
  private corralesService = inject(CorralesService);

  corrales = signal<Corral[]>([]);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    chapeta: ['', Validators.required],
    raza: ['', Validators.required],
    corral_id: ['', Validators.required],
    fecha_nacimiento: ['', Validators.required],
    partos_acumulados: [0, [Validators.required, Validators.min(0)]],
    fue_comprada: [false],
    valor_compra: [0],
    fecha_compra: [new Date().toISOString().split('T')[0]]
  });

  ngOnInit() {
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    this.loadCorrales();
  }

  async loadCorrales() {
    try {
      const data = await this.corralesService.getCorrales();
      // Filter: Gestación or Cuarentena
      const filtered = data.filter(c => c.activo && (c.tipo === 'gestacion' || c.tipo === 'cuarentena'));
      this.corrales.set(filtered);
    } catch (e) {
      console.error('Error loading corrales', e);
    }
  }

  ngOnDestroy() {
    // Restaurar scroll del body cuando el modal se cierra
    document.body.style.overflow = '';
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const formVal = this.form.value;

      await this.produccionService.crearCerda({
        chapeta: formVal.chapeta,
        raza: formVal.raza,
        fecha_nacimiento: formVal.fecha_nacimiento,
        partos_acumulados: formVal.partos_acumulados,
        fue_comprada: formVal.fue_comprada,
        valor_compra: formVal.fue_comprada ? formVal.valor_compra : 0,
        fecha_compra: formVal.fue_comprada ? formVal.fecha_compra : null,
        corral_id: Number(formVal.corral_id)
      });

      this.saved.emit();
      this.close.emit();
    } catch (err: any) {
      this.error.set(err.message || 'Error al registrar la cerda');
    } finally {
      this.loading.set(false);
    }
  }
}
