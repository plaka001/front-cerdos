import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { CorralesService } from '../../../../core/services/corrales.service';
import { CerdaDetalle, Insumo, Corral, EstadoCorral } from '../../../../core/models';
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
              <app-input label="Costo del Servicio / Semen ($)" type="currency" formControlName="costo" placeholder="Ej: 30000"></app-input>
              <app-input label="Observaciones (opcional)" formControlName="observaciones" placeholder="Notas adicionales..."></app-input>
            </div>
          }

          <!-- Parto Fields -->
          @if (tipoEvento === 'parto') {
            <div class="space-y-4">
              <app-input label="Fecha de Parto" type="date" formControlName="fecha"></app-input>

              <!-- Selector Paridera -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Mover a Paridera (Corral) <span class="text-red-400">*</span></label>
                <select formControlName="corral_id" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                  <option value="" disabled>Seleccione paridera...</option>
                  @for (c of corralesParidera(); track c.id) {
                    <option [value]="c.id">
                      {{ c.nombre }} (Cap: {{ c.capacidad_maxima }})
                    </option>
                  }
                </select>
                @if (form.get('corral_id')?.touched && form.get('corral_id')?.invalid) {
                  <p class="text-xs text-red-400 mt-1">Debe asignar el corral.</p>
                }
              </div>
              
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

              <!-- Regresar Madre -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Regresar Madre a... (Gestación) <span class="text-red-400">*</span></label>
                <select formControlName="corral_madre_id" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                  <option value="" disabled>Seleccione gestación...</option>
                  @for (c of corralesGestacion(); track c.id) {
                    <option [value]="c.id">
                      {{ c.nombre }}
                    </option>
                  }
                </select>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <app-input label="Cantidad" type="number" formControlName="cantidad" (input)="validarCapacidadPrecebo()" placeholder="0"></app-input>
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
                  Crear Lote de Precebo / Inicio
                </label>
              </div>

               <!-- Ubicación Precebo (Solo si crea lote) -->
               @if (form.get('crear_lote')?.value) {
                <div class="animate-in fade-in slide-in-from-top-2">
                    <label class="block text-sm font-medium text-slate-300 mb-1">Ubicación (Precebo) <span class="text-red-400">*</span></label>
                    <select formControlName="corral_lote_id" (change)="validarCapacidadPrecebo()" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                    <option value="" disabled>Seleccione precebo...</option>
                    @for (c of corralesPrecebo(); track c.id) {
                        <option [value]="c.id" [disabled]="c.ocupacion_total >= c.capacidad_maxima">
                        {{ c.nombre }} (Disp: {{ c.capacidad_maxima - c.ocupacion_total }})
                        </option>
                    }
                    </select>
                    @if (form.get('corral_lote_id')?.touched && form.get('corral_lote_id')?.invalid) {
                        <p class="text-xs text-red-400 mt-1">Ubicación requerida.</p>
                    }
                    @if (errorCapacidadPrecebo()) {
                        <p class="text-xs text-red-400 font-medium flex items-center gap-1 animate-pulse mt-1">
                            <lucide-icon name="alert-circle" [size]="12"></lucide-icon>
                            Excede capacidad disponible
                        </p>
                    }
                </div>
              }

              <!-- ✅ NUEVO: Sección de Venta -->
              @if (!form.get('crear_lote')?.value) {
                <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-800/50 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <h4 class="text-sm font-bold text-blue-200 flex items-center gap-2">
                    <lucide-icon name="dollar-sign" [size]="16"></lucide-icon>
                    Datos de Venta
                  </h4>
                  
                  <app-input label="Valor Total Venta ($)" type="currency" formControlName="valor_venta" placeholder="0"></app-input>
                  <app-input label="Cliente / Comprador (Opcional)" formControlName="comprador" placeholder="Nombre del cliente"></app-input>
                  
                  <p class="text-xs text-blue-300/80 italic">
                    ℹ️ Se registrará un Ingreso en Caja por "Venta de Lechones".
                  </p>
                </div>
              }

              <app-input label="Observaciones (opcional)" formControlName="observaciones" placeholder="Condiciones de los lechones, etc..."></app-input>
            </div>
          }

          <!-- Falla Reproductiva -->
          @if (tipoEvento === 'falla') {
            <div class="space-y-4">
              <div class="p-3 bg-amber-900/20 text-amber-300 text-sm rounded-lg border border-amber-900/30">
                ⚠️ Se reportará la falla del ciclo actual y la cerda volverá a estado "Vacía".
              </div>
              <app-input label="Fecha de Reporte" type="date" formControlName="fecha"></app-input>
              <app-input label="Observaciones" formControlName="observaciones" placeholder="Repetición de celo, aborto, etc..."></app-input>
            </div>
          }

          <!-- Evento Sanitario -->
          @if (tipoEvento === 'sanidad') {
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

              <app-input label="Observaciones" formControlName="observaciones" placeholder="Motivo de aplicación..."></app-input>
            </div>
          }

          <!-- Venta Descarte -->
          @if (tipoEvento === 'venta') {
            <div class="space-y-4">
              <div class="p-3 bg-red-900/20 text-red-300 text-sm rounded-lg border border-red-900/30">
                🚫 La cerda será marcada como INACTIVA (Descarte) y saldrá del inventario.
              </div>
              <app-input label="Fecha de Venta" type="date" formControlName="fecha"></app-input>
              <div class="grid grid-cols-2 gap-4">
                <app-input label="Peso (Kg)" type="number" formControlName="peso" placeholder="0.0"></app-input>
                <app-input label="Valor Total ($)" type="currency" formControlName="valor_total" placeholder="0"></app-input>
              </div>
              <app-input label="Cliente" formControlName="cliente" placeholder="Nombre del comprador"></app-input>
              <app-input label="Motivo" formControlName="motivo" placeholder="Edad, baja productividad, etc..."></app-input>
            </div>
          }

          <!-- Mortalidad -->
          @if (tipoEvento === 'muerte') {
            <div class="space-y-4">
              <div class="p-3 bg-red-900/20 text-red-300 text-sm rounded-lg border border-red-900/30">
                ☠️ Se registrará la muerte y la cerda será marcada como INACTIVA.
              </div>
              <app-input label="Fecha de Muerte" type="date" formControlName="fecha"></app-input>
              <app-input label="Causa de Muerte" formControlName="causa" placeholder="Enfermedad, accidente, etc..."></app-input>
              <app-input label="Observaciones" formControlName="observaciones" placeholder="Detalles adicionales..."></app-input>
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
                    [disabled]="form.invalid || loading() || errorCapacidadPrecebo()"
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
  @Input({ required: true }) tipoEvento!: 'inseminacion' | 'parto' | 'destete' | 'falla' | 'sanidad' | 'venta' | 'muerte';
  @Input() nombreTarea?: string; // Tarea que viene de la agenda
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private produccionService = inject(ProduccionService);
  private corralesService = inject(CorralesService);

  // Corrales Signals
  corralesParidera = signal<Corral[]>([]);
  corralesGestacion = signal<Corral[]>([]);
  corralesPrecebo = signal<EstadoCorral[]>([]);
  errorCapacidadPrecebo = signal<boolean>(false);

  form!: FormGroup;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  maxLechonesDestete = signal<number | null>(null);
  insumos = signal<Insumo[]>([]);
  insumosFiltrados = signal<Insumo[]>([]);

  ngOnInit() {
    this.initForm();
    if (this.tipoEvento === 'sanidad') {
      this.loadInsumos();
    }
    // Load Corrales based on Event Type
    if (this.tipoEvento === 'parto' || this.tipoEvento === 'destete') {
      this.loadCorrales();
    }
  }

  async loadCorrales() {
    try {
      if (this.tipoEvento === 'parto') {
        const data = await this.corralesService.getCorrales();
        const activos = data.filter(c => c.activo);
        this.corralesParidera.set(activos.filter(c => c.tipo === 'paridera'));
      } else if (this.tipoEvento === 'destete') {
        // Use EstadoCorrales for validation
        const dataConOcupacion = await this.corralesService.getEstadoCorrales();
        const activos = dataConOcupacion.filter(c => c.activo);

        const dataBasica = await this.corralesService.getCorrales();
        this.corralesGestacion.set(dataBasica.filter(c => c.activo && c.tipo === 'gestacion'));
        this.corralesPrecebo.set(activos.filter(c => c.tipo === 'precebo'));
      }
    } catch (e) {
      console.error('Error loading corrales', e);
    }
  }

  get insumosArray() {
    return this.form.get('insumos') as FormArray;
  }

  async loadInsumos() {
    try {
      const data = await this.produccionService.getInsumosMedicos();
      const disponibles = data.filter(i => i.stock_actual > 0);
      this.insumos.set(data);
      this.insumosFiltrados.set(disponibles);
    } catch (err) {
      console.error('Error loading insumos', err);
    }
  }

  initForm() {
    const hoy = new Date().toISOString().split('T')[0];

    if (this.tipoEvento === 'inseminacion') {
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        macho: ['', Validators.required],
        costo: [0, [Validators.min(0)]],
        observaciones: ['']
      });
    } else if (this.tipoEvento === 'parto') {
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        nacidos_vivos: [null, [Validators.required, Validators.min(0)]],
        nacidos_muertos: [0, [Validators.required, Validators.min(0)]],
        momias: [0, [Validators.required, Validators.min(0)]],
        corral_id: ['', Validators.required], // New Field
        observaciones: ['']
      });
    } else if (this.tipoEvento === 'destete') {
      const nacidosVivos = this.cerda.cicloActivo?.nacidos_vivos || 0;
      this.maxLechonesDestete.set(nacidosVivos);

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
        corral_madre_id: ['', Validators.required], // New field for Mom
        corral_lote_id: ['', Validators.required],  // New field for Piglets
        valor_venta: [null],
        comprador: [''],
        observaciones: ['']
      });

      this.form.get('crear_lote')?.valueChanges.subscribe(crear => {
        this.updateDesteteValidators(crear);
      });
    } else if (this.tipoEvento === 'falla') {
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        observaciones: ['', Validators.required]
      });
    } else if (this.tipoEvento === 'sanidad') {
      // ✅ Multi-producto
      this.form = this.fb.group({
        insumos: this.fb.array([]), // FormArray
        observaciones: [this.nombreTarea || '']
      });
      // Agregar el primero por defecto
      this.agregarInsumo();

    } else if (this.tipoEvento === 'venta') {
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        peso: [null, [Validators.required, Validators.min(1)]],
        valor_total: [null, [Validators.required, Validators.min(0)]],
        cliente: ['', Validators.required],
        motivo: ['']
      });
    } else if (this.tipoEvento === 'muerte') {
      this.form = this.fb.group({
        fecha: [hoy, Validators.required],
        causa: ['', Validators.required],
        observaciones: ['']
      });
    }
  }

  // Métodos para FormArray
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
        group.setErrors({ stock_insuficiente: `Max: ${insumo.stock_actual}` });
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

  updateDesteteValidators(crearLote: boolean) {
    const valorVentaCtrl = this.form.get('valor_venta');
    const compradorCtrl = this.form.get('comprador');
    const corralLoteCtrl = this.form.get('corral_lote_id');

    if (!crearLote) {
      valorVentaCtrl?.setValidators([Validators.required, Validators.min(0)]);
      corralLoteCtrl?.clearValidators(); // No need for precebo location if sold
      corralLoteCtrl?.setValue(null);
    } else {
      valorVentaCtrl?.clearValidators();
      valorVentaCtrl?.setValue(null);
      compradorCtrl?.setValue('');
      corralLoteCtrl?.setValidators([Validators.required]); // Require location
    }
    valorVentaCtrl?.updateValueAndValidity();
    corralLoteCtrl?.updateValueAndValidity();
  }

  validarCapacidadPrecebo() {
    const corralId = Number(this.form.get('corral_lote_id')?.value);
    const cantidad = Number(this.form.get('cantidad')?.value || 0);

    if (!corralId || !cantidad) {
      this.errorCapacidadPrecebo.set(false);
      return;
    }

    const corral = this.corralesPrecebo().find(c => c.id === corralId);
    if (corral) {
      const disponible = corral.capacidad_maxima - corral.ocupacion_total;
      this.errorCapacidadPrecebo.set(cantidad > disponible);
    }
  }

  getTitle(): string {
    switch (this.tipoEvento) {
      case 'inseminacion': return 'Nueva Inseminación';
      case 'parto': return 'Registrar Parto';
      case 'destete': return 'Registrar Destete';
      case 'falla': return 'Reportar Falla Reproductiva';
      case 'sanidad': return 'Evento Sanitario';
      case 'venta': return 'Venta de Descarte';
      case 'muerte': return 'Registrar Mortalidad';
      default: return 'Evento';
    }
  }

  getSubmitLabel(): string {
    switch (this.tipoEvento) {
      case 'inseminacion': return 'Guardar Inseminación';
      case 'parto': return 'Guardar Parto';
      case 'destete': return 'Finalizar Lactancia';
      case 'falla': return 'Reportar Falla';
      case 'sanidad': return 'Guardar Evento';
      case 'venta': return 'Registrar Venta';
      case 'muerte': return 'Confirmar Muerte';
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
          this.error.set('Esta cerda no tiene un ciclo reproductivo activo.');
          return;
        }
        await this.produccionService.registrarParto(this.cerda.id, this.cerda.cicloActivo.id, {
          ...val,
          corral_id: Number(val.corral_id)
        });
      } else if (this.tipoEvento === 'destete') {
        if (!this.cerda.cicloActivo) {
          this.error.set('Esta cerda no tiene un ciclo reproductivo activo.');
          return;
        }
        const cantidad = val.cantidad;
        const nacidosVivos = this.cerda.cicloActivo.nacidos_vivos || 0;

        if (cantidad > nacidosVivos) {
          this.error.set(`Error: La cerda solo tiene ${nacidosVivos} lechones vivos registrados.`);
          this.loading.set(false);
          return;
        }

        await this.produccionService.registrarDestete(this.cerda.id, this.cerda.cicloActivo.id, {
          fecha: val.fecha,
          cantidad: val.cantidad,
          peso: val.peso,
          crear_lote: val.crear_lote,
          observaciones: val.observaciones,
          valor_venta: val.valor_venta,
          comprador: val.comprador,
          corral_madre_id: Number(val.corral_madre_id),
          corral_lote_id: val.crear_lote ? Number(val.corral_lote_id) : undefined
        });
      } else if (this.tipoEvento === 'falla') {
        if (!this.cerda.cicloActivo) {
          this.error.set('Esta cerda no tiene un ciclo activo para reportar falla.');
          return;
        }
        await this.produccionService.registrarFallaInseminacion(this.cerda.id, this.cerda.cicloActivo.id, val);
      } else if (this.tipoEvento === 'sanidad') {
        // Prepare multi-product payload
        const insumosProcessor = [];
        const formVal = this.form.value;

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

        await this.produccionService.registrarSanidadCerda(this.cerda.id, {
          insumos: insumosProcessor,
          observaciones: formVal.observaciones,
          nombre_tarea: this.nombreTarea
        });
      } else if (this.tipoEvento === 'venta') {
        await this.produccionService.registrarVentaDescarte(this.cerda.id, val);
      } else if (this.tipoEvento === 'muerte') {
        await this.produccionService.registrarMuerteCerda(this.cerda.id, val);
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
