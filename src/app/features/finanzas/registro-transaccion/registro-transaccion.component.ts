import { Component, inject, signal, computed, effect, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FinanzasService } from '../../../core/services/finanzas.service';
import { StorageService } from '../../../core/services/storage.service';
import { CategoriaFinanciera, Insumo, TipoMovimientoCaja, FormaPago } from '../../../core/models';

@Component({
  selector: 'app-registro-transaccion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-transaccion.component.html'
})
export class RegistroTransaccionComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private finanzasService = inject(FinanzasService);
  private storageService = inject(StorageService);

  form: FormGroup;
  loading = signal(false);
  tipo = signal<TipoMovimientoCaja>('egreso');
  selectedFile = signal<File | null>(null);
  afectaInventario = signal<boolean>(false);
  formaPago = signal<FormaPago>('contado');

  @ViewChild('montoInput') montoInput?: ElementRef;

  // Signals para inputs reactivos
  insumoId = signal<number | null>(null);
  cantidad = signal<number>(0);
  monto = signal<number>(0);
  categoriaId = signal<number | null>(null);
  montoFormateado = signal<string>('');

  // Dynamic font size for amount input
  montoFontSize = computed(() => {
    const len = this.montoFormateado().length;
    if (len > 12) return 'text-3xl';
    if (len > 9) return 'text-4xl';
    if (len > 6) return 'text-5xl';
    return 'text-6xl';
  });

  categorias = this.finanzasService.categorias;
  insumos = this.finanzasService.insumos;
  cuentas = this.finanzasService.cuentas;
  proveedores = this.finanzasService.proveedores;

  // La compra a crédito no toca caja: solo aplica en gastos de insumo con inventario
  esCompraCredito = computed(() =>
    this.tipo() === 'egreso' && this.afectaInventario() && this.formaPago() === 'credito'
  );

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

  ngOnInit(): void {
    this.finanzasService.loadInsumos();
    this.finanzasService.loadCategorias();
    this.finanzasService.loadCuentas();
    this.finanzasService.loadProveedores();
  }

  ngAfterViewInit(): void {
    // Auto-focus on amount input for immediate keyboard activation
    setTimeout(() => {
      this.montoInput?.nativeElement.focus();
    }, 300);
  }

  // ✅ REFACTORED: Filtrado reactivo mejorado de insumos
  filteredInsumos = computed(() => {
    const catId = this.categoriaId();
    const allInsumos = this.insumos();

    if (!catId) return [];

    const cat = this.categorias().find(c => c.id == catId);
    if (!cat) return [];

    const nombreCat = cat.nombre.toLowerCase();

    // Filtrar por tipo de insumo basado en el nombre de la categoría
    if (nombreCat.includes('alimento')) {
      return allInsumos.filter(i => i.tipo === 'alimento');
    }

    if (nombreCat.includes('medicamento') ||
      nombreCat.includes('medicina') ||
      nombreCat.includes('sanidad') ||
      nombreCat.includes('veterinario')) {
      // Medicamentos Y biológicos (vacunas)
      return allInsumos.filter(i => i.tipo === 'medicamento' || i.tipo === 'biologico');
    }

    if (nombreCat.includes('material')) {
      return allInsumos.filter(i => i.tipo === 'material');
    }

    // Si no coincide con ninguna categoría específica, no mostrar insumos
    return [];
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
      cuenta_id: [null, Validators.required],
      // Campos opcionales para insumos
      insumo_id: [null],
      cantidad_comprada: [null],
      proveedor: [''],
      proveedor_id: [null]
    });

    // Default de caja: Efectivo Yeison (quien maneja la plata del día a día)
    effect(() => {
      const cuentas = this.cuentas();
      if (cuentas.length > 0 && !this.form.get('cuenta_id')?.value) {
        const yeison = cuentas.find(c => c.nombre.toLowerCase().includes('yeison'));
        this.form.get('cuenta_id')?.setValue((yeison || cuentas[0]).id, { emitEvent: false });
      }
    }, { allowSignalWrites: true });

    // Reaccionar a cambios en categoría para validar insumos
    this.form.get('categoria_id')?.valueChanges.subscribe(catId => {
      this.updateValidators(catId);
      this.categoriaId.set(catId); // Sync signal
    });

    // Sincronizar inputs con signals
    this.form.get('insumo_id')?.valueChanges.subscribe(val => this.insumoId.set(val));
    this.form.get('cantidad_comprada')?.valueChanges.subscribe(val => this.cantidad.set(Number(val) || 0));
    this.form.get('monto')?.valueChanges.subscribe(val => this.monto.set(Number(val) || 0));
    // ✅ NUEVO: Effect para resetear insumo cuando cambia la categoría
    effect(() => {
      // Leer la categoría (esto registra la dependencia)
      const catId = this.categoriaId();

      // Limpiar el insumo seleccionado cuando cambia la categoría
      // Esto previene que quede seleccionado un alimento cuando cambias a medicamentos
      if (catId) {
        this.form.get('insumo_id')?.setValue(null, { emitEvent: false });
        this.insumoId.set(null);
      }
    }, { allowSignalWrites: true }); // ✅ FIX: Permitir escritura en signals dentro del effect
  }

  onMontoInput(event: any) {
    const input = event.target.value;
    // Remover todo excepto números
    const numeros = input.replace(/\D/g, '');
    const numero = parseInt(numeros) || 0;

    // Actualizar el valor del formulario
    this.form.get('monto')?.setValue(numero, { emitEvent: false });
    this.monto.set(numero);

    // Formatear para mostrar
    if (numero === 0) {
      this.montoFormateado.set('');
    } else {
      this.montoFormateado.set(numero.toLocaleString('es-CO'));
    }
  }

  onMontoFocus() {
    // Seleccionar todo el texto al hacer foco para fácil edición
    setTimeout(() => {
      this.montoInput?.nativeElement.select();
    }, 0);
  }

  setTipo(t: TipoMovimientoCaja) {
    this.tipo.set(t);
    this.form.get('categoria_id')?.setValue(null);
    if (t === 'ingreso') {
      this.setFormaPago('contado');
    }
  }

  setFormaPago(fp: FormaPago) {
    this.formaPago.set(fp);
    const provCtrl = this.form.get('proveedor_id');
    if (fp === 'credito') {
      provCtrl?.setValidators(Validators.required);
    } else {
      provCtrl?.clearValidators();
    }
    provCtrl?.updateValueAndValidity();
  }

  toggleInventario() {
    this.afectaInventario.set(!this.afectaInventario());
    if (!this.afectaInventario()) {
      this.setFormaPago('contado');
    }
    this.updateValidators(this.form.get('categoria_id')?.value);
  }

  esCompraInsumo(): boolean {
    const catId = this.form.get('categoria_id')?.value;
    if (!catId) return false;
    const cat = this.categorias().find(c => c.id == catId);

    if (!cat) return false;

    const nombre = cat.nombre.toLowerCase();

    // ✅ Lógica mejorada: Detectar cualquier categoría de compra de inventario
    return nombre.includes('alimento') ||
      nombre.includes('medicamento') ||
      nombre.includes('medicina') ||
      nombre.includes('sanidad') ||
      nombre.includes('veterinario') ||
      nombre.includes('material') ||
      nombre.includes('insumo') ||
      nombre.includes('compra');
  }

  updateValidators(catId: number) {
    const esInsumo = this.esCompraInsumo();

    // Si la categoría dejó de ser compra de insumo, apagar inventario y crédito
    if (!esInsumo && this.afectaInventario()) {
      this.afectaInventario.set(false);
      this.setFormaPago('contado');
    }

    const afecta = this.afectaInventario();
    const insumoCtrl = this.form.get('insumo_id');
    const cantCtrl = this.form.get('cantidad_comprada');

    // Only require inventory fields if toggle is ON
    if (esInsumo && afecta) {
      insumoCtrl?.setValidators(Validators.required);
      cantCtrl?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      insumoCtrl?.clearValidators();
      cantCtrl?.clearValidators();
    }
    insumoCtrl?.updateValueAndValidity();
    cantCtrl?.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (ej: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('El archivo es demasiado grande (Max 5MB)', 'error');
        return;
      }
      this.selectedFile.set(file);
    }
  }

  removeFile() {
    this.selectedFile.set(null);
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

      // 1. Subir archivo si existe
      let urlComprobante: string | undefined;
      const file = this.selectedFile();
      if (file) {
        const url = await this.storageService.uploadFile(file, 'comprobantes_movimientos');
        if (!url) {
          throw new Error('Error al subir el comprobante');
        }
        urlComprobante = url;
      }

      // Preparar objeto base de movimiento
      const movimiento = {
        fecha: val.fecha,
        tipo: tipoActual,
        categoria_id: val.categoria_id,
        monto: val.monto,
        descripcion: val.descripcion,
        metodo_pago: 'efectivo', // Default
        url_comprobante: urlComprobante,
        cuenta_id: val.cuenta_id
      };

      let compra = undefined;
      const esCredito = this.esCompraCredito();

      // Escenario B: Compra de Insumo (Impacta Inventario) - Solo para Gastos y si toggle está ON
      if (tipoActual === 'egreso' && this.esCompraInsumo() && this.afectaInventario()) {
        const proveedorSeleccionado = esCredito
          ? this.proveedores().find(p => p.id == val.proveedor_id)
          : null;

        compra = {
          fecha: val.fecha,
          insumo_id: val.insumo_id,
          cantidad_comprada: val.cantidad_comprada,
          proveedor: esCredito ? (proveedorSeleccionado?.nombre || '') : val.proveedor,
          forma_pago: esCredito ? 'credito' as const : 'contado' as const,
          proveedor_id: esCredito ? val.proveedor_id : null
        };
      }

      // Llamada al servicio (Maneja ambos escenarios)
      await this.finanzasService.registrarMovimiento(movimiento, compra);

      // Éxito - Mensaje específico según tipo
      const mensajeExito = tipoActual === 'ingreso'
        ? 'Ingreso registrado correctamente'
        : (esCredito
          ? 'Compra a crédito registrada: la deuda del proveedor quedó actualizada'
          : 'Gasto registrado correctamente');
      this.showToast(mensajeExito, 'success');

      // Reset form but keep date and cuenta
      const fecha = val.fecha;
      const cuentaId = val.cuenta_id;
      this.form.reset({ fecha, cuenta_id: cuentaId });
      this.setTipo('egreso'); // Reset to default
      this.selectedFile.set(null); // Reset file

      // Reset signals
      this.insumoId.set(null);
      this.cantidad.set(0);
      this.monto.set(0);
      this.montoFormateado.set(''); // Reset formatted display
      this.afectaInventario.set(false);
      this.setFormaPago('contado');

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
