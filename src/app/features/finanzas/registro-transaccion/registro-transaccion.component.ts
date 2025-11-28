import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FinanzasService } from '../../../core/services/finanzas.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { CategoriaFinanciera, Insumo, TipoMovimientoCaja } from '../../../core/models';

@Component({
  selector: 'app-registro-transaccion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="w-full sm:max-w-md sm:mx-auto px-4 sm:p-4 pb-24">
      <h2 class="text-2xl font-bold text-white mb-6 pt-6 sm:pt-0">Registrar Movimiento</h2>

      <!-- Main Container: Dark Elevation -->
      <div class="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700/50">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <!-- Segmented Control (Toggle) -->
          <div class="bg-slate-900 p-1 rounded-lg grid grid-cols-2 gap-1">
            <button type="button" 
              (click)="setTipo('ingreso')"
              [class]="tipo() === 'ingreso' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'"
              class="py-2.5 px-4 rounded-md text-sm font-bold transition-all duration-200">
              Ingreso
            </button>
            <button type="button" 
              (click)="setTipo('egreso')"
              [class]="tipo() === 'egreso' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'"
              class="py-2.5 px-4 rounded-md text-sm font-bold transition-all duration-200">
              Gasto
            </button>
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5">Categoría</label>
            <select formControlName="categoria_id" class="block w-full h-12 rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-white focus:ring-white focus:ring-2 sm:text-sm transition-all px-3">
              <option [ngValue]="null">Seleccione una categoría</option>
              <option *ngFor="let cat of filteredCategorias()" [value]="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>

          <!-- Campos Comunes -->
          <div>
            <app-input label="Monto Total ($)" type="currency" formControlName="monto" placeholder="0"></app-input>
            
            <!-- Unit Price Widget -->
            @if (textoPrecioUnitario()) {
              <div class="flex justify-end mt-1">
                <span class="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-900/30">
                  💰 {{ textoPrecioUnitario() }}
                </span>
              </div>
            }
          </div>
          
          <app-input label="Descripción" formControlName="descripcion" placeholder="Detalle del movimiento"></app-input>
          <app-input label="Fecha" type="date" formControlName="fecha"></app-input>

          <!-- Campos Específicos de Insumos -->
          <div *ngIf="esCompraInsumo()" class="border-t border-slate-700/50 pt-5 mt-2 space-y-5">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider opacity-80">Detalles de Compra</h3>
            
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Insumo</label>
              <select formControlName="insumo_id" class="block w-full h-12 rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-white focus:ring-white focus:ring-2 sm:text-sm transition-all px-3">
                <option [ngValue]="null">Seleccione Insumo</option>
                <option *ngFor="let insumo of filteredInsumos()" [ngValue]="insumo.id">
                  {{ insumo.nombre }}
                </option>
              </select>
              
              <!-- Info Badge -->
              @if (textoPresentacion()) {
                <div class="mt-3 bg-slate-700/50 border-l-4 border-slate-500 p-3 rounded-r-md flex items-start gap-3">
                  <span class="text-lg">📦</span>
                  <p class="text-sm text-slate-300 font-medium">{{ textoPresentacion() }}</p>
                </div>
              }
            </div>

            <div>
              <app-input label="Cantidad (Bultos/Unidades)" type="tel" formControlName="cantidad_comprada" placeholder="0"></app-input>
              
              <!-- Calculation Alert -->
              @if (textoTotalInventario()) {
                <div class="mt-3 bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-md flex items-start gap-3">
                  <span class="text-lg">📥</span>
                  <p class="text-sm text-white font-medium">{{ textoTotalInventario() }}</p>
                </div>
              }
            </div>
            
            <app-input label="Proveedor" formControlName="proveedor" placeholder="Nombre del proveedor"></app-input>
          </div>

          <div class="pt-2">
            <app-button type="submit" [disabled]="form.invalid || loading()" [fullWidth]="true" [variant]="tipo() === 'ingreso' ? 'primary' : 'danger'">
              {{ loading() ? 'Guardando...' : 'Guardar Movimiento' }}
            </app-button>
          </div>

        </form>
      </div>
    </div>

    <!-- Toast Notification -->
    <div *ngIf="toastMessage()" 
         class="fixed bottom-20 left-0 right-0 mx-auto w-max max-w-[90vw] px-6 py-3 rounded-xl shadow-2xl text-white text-sm font-bold transition-all duration-300 z-50 flex items-center gap-3 border border-white/10 backdrop-blur-md"
         [ngClass]="toastMessage()?.type === 'success' ? 'bg-emerald-600/90' : 'bg-red-600/90'">
      <span>{{ toastMessage()?.type === 'success' ? '✅' : '❌' }}</span>
      {{ toastMessage()?.text }}
    </div>
  `
})
export class RegistroTransaccionComponent {
  private fb = inject(FormBuilder);
  private finanzasService = inject(FinanzasService);

  form: FormGroup;
  loading = signal(false);
  tipo = signal<TipoMovimientoCaja>('egreso');

  // Signals para inputs reactivos
  insumoId = signal<number | null>(null);
  cantidad = signal<number>(0);
  monto = signal<number>(0);
  categoriaId = signal<number | null>(null);

  categorias = this.finanzasService.categorias;
  insumos = this.finanzasService.insumos;

  filteredCategorias = computed(() => {
    const t = this.tipo();
    return this.categorias().filter(c => {
      // CRÍTICO: Excluir categorías automáticas (usadas solo por el sistema)
      // Esto previene que el usuario venda cerdos manualmente sin descontar inventario
      if (c.es_automatica === true) return false;

      const esVenta = c.nombre.toLowerCase().includes('venta');
      return t === 'ingreso' ? esVenta : !esVenta;
    });
  });

  filteredInsumos = computed(() => {
    const catId = this.categoriaId();
    const allInsumos = this.insumos();

    if (!catId) return [];

    const cat = this.categorias().find(c => c.id == catId);
    if (!cat) return [];

    const nombreCat = cat.nombre.toLowerCase();

    if (nombreCat.includes('alimento')) {
      return allInsumos.filter(i => i.tipo === 'alimento');
    }
    if (nombreCat.includes('medicamento') || nombreCat.includes('medicina') || nombreCat.includes('sanidad')) {
      return allInsumos.filter(i => i.tipo === 'medicamento');
    }
    if (nombreCat.includes('vacuna') || nombreCat.includes('biologico')) {
      return allInsumos.filter(i => i.tipo === 'biologico');
    }

    // Si es una compra operativa pero no específica, mostrar todo
    return allInsumos;
  });

  // Computed Helpers para UX
  selectedInsumo = computed(() => {
    const id = this.insumoId();
    if (!id) return null;
    return this.insumos().find(i => i.id == id) || null;
  });

  textoPresentacion = computed(() => {
    const insumo = this.selectedInsumo();
    if (!insumo) return '';
    return `Presentación: ${insumo.presentacion_compra} ${insumo.unidad_medida}`;
  });

  textoTotalInventario = computed(() => {
    const insumo = this.selectedInsumo();
    const cant = this.cantidad();
    if (!insumo || !cant) return '';
    const total = cant * insumo.presentacion_compra;
    return `Entrarán ${total.toLocaleString()} ${insumo.unidad_medida} al inventario`;
  });

  textoPrecioUnitario = computed(() => {
    const m = this.monto();
    const c = this.cantidad();
    // Solo mostrar si es compra de insumo y hay valores
    if (!this.esCompraInsumo() || !m || !c) return '';
    const unitario = m / c;
    return `$${unitario.toLocaleString('es-CO', { maximumFractionDigits: 0 })} por unidad`;
  });

  toastMessage = signal<{ text: string, type: 'success' | 'error' } | null>(null);

  constructor() {
    this.form = this.fb.group({
      categoria_id: [null, Validators.required],
      monto: [null, [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      // Campos opcionales para insumos
      insumo_id: [null],
      cantidad_comprada: [null],
      proveedor: ['']
    });

    // Reaccionar a cambios en categoría para validar insumos
    this.form.get('categoria_id')?.valueChanges.subscribe(catId => {
      this.updateValidators(catId);
      this.categoriaId.set(catId); // Sync signal
    });

    // Sincronizar inputs con signals
    this.form.get('insumo_id')?.valueChanges.subscribe(val => this.insumoId.set(val));
    this.form.get('cantidad_comprada')?.valueChanges.subscribe(val => this.cantidad.set(Number(val) || 0));
    this.form.get('monto')?.valueChanges.subscribe(val => this.monto.set(Number(val) || 0));
  }

  setTipo(t: TipoMovimientoCaja) {
    this.tipo.set(t);
    this.form.get('categoria_id')?.setValue(null);
  }

  esCompraInsumo(): boolean {
    const catId = this.form.get('categoria_id')?.value;
    if (!catId) return false;
    const cat = this.categorias().find(c => c.id == catId);
    // Lógica: Si la categoría es "Compra Alimento" o "Medicamentos" (o cualquier operativo que implique stock)
    // En el SQL: 'Compra Alimento', 'Medicamentos' son operativos. 'Nomina' es operativo pero no insumo.
    // Una forma robusta es ver si el nombre contiene "Compra" o "Medicamento" o "Insumo".
    return cat ? ['Compra Alimento', 'Medicamentos'].includes(cat.nombre) : false;
  }

  updateValidators(catId: number) {
    const esInsumo = this.esCompraInsumo();
    const insumoCtrl = this.form.get('insumo_id');
    const cantCtrl = this.form.get('cantidad_comprada');

    if (esInsumo) {
      insumoCtrl?.setValidators(Validators.required);
      cantCtrl?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      insumoCtrl?.clearValidators();
      cantCtrl?.clearValidators();
    }
    insumoCtrl?.updateValueAndValidity();
    cantCtrl?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    try {
      const val = this.form.value;
      const tipoActual = this.tipo();

      // Preparar objeto base de movimiento
      const movimiento = {
        fecha: val.fecha,
        tipo: tipoActual,
        categoria_id: val.categoria_id,
        monto: val.monto,
        descripcion: val.descripcion,
        metodo_pago: 'efectivo' // Default
      };

      let compra = undefined;

      // Escenario B: Compra de Insumo (Impacta Inventario) - Solo para Gastos
      if (tipoActual === 'egreso' && this.esCompraInsumo()) {
        compra = {
          fecha: val.fecha,
          insumo_id: val.insumo_id,
          cantidad_comprada: val.cantidad_comprada,
          proveedor: val.proveedor
        };
      }

      // Llamada al servicio (Maneja ambos escenarios)
      await this.finanzasService.registrarMovimiento(movimiento, compra);

      // Éxito - Mensaje específico según tipo
      const mensajeExito = tipoActual === 'ingreso'
        ? 'Ingreso registrado correctamente'
        : 'Gasto registrado correctamente';
      this.showToast(mensajeExito, 'success');

      // Reset form but keep date
      const fecha = val.fecha;
      this.form.reset({ fecha });
      this.setTipo('egreso'); // Reset to default

      // Reset signals
      this.insumoId.set(null);
      this.cantidad.set(0);
      this.monto.set(0);

    } catch (error) {
      console.error(error);
      this.showToast('Error al registrar movimiento', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  showToast(text: string, type: 'success' | 'error') {
    this.toastMessage.set({ text, type });
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
