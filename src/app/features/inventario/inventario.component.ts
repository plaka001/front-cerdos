import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InventarioService, InventarioItem, AjusteInventario } from '../../core/services/inventario.service';
import { CurrencyCopDirective } from '../../shared/directives/currency-cop.directive';

@Component({
    selector: 'app-inventario',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, CurrencyCopDirective],
    templateUrl: './inventario.component.html'
})
export class InventarioComponent implements OnInit {
    private inventarioService = inject(InventarioService);
    private fb = inject(FormBuilder);

    // Estado
    inventario = signal<InventarioItem[]>([]);
    valorTotalInventario = signal<number>(0);
    loading = signal<boolean>(true);
    error = signal<string | null>(null);

    // Filtros
    busqueda = signal<string>('');
    tipoFiltro = signal<string>('todos');

    // Inventario filtrado (reactivo)
    inventarioFiltrado = computed(() => {
        const busquedaLower = this.busqueda().toLowerCase().trim();
        const tipo = this.tipoFiltro();
        let items = this.inventario();

        // Filtrar por tipo
        if (tipo !== 'todos') {
            items = items.filter(item => item.tipo === tipo);
        }

        // Filtrar por búsqueda
        if (busquedaLower) {
            items = items.filter(item =>
                item.nombre.toLowerCase().includes(busquedaLower) ||
                item.tipo.toLowerCase().includes(busquedaLower)
            );
        }

        return items;
    });

    // Modal de ajuste
    ajusteModalOpen = signal<boolean>(false);
    insumoSeleccionado = signal<InventarioItem | null>(null);
    ajusteForm!: FormGroup;
    loadingAjuste = signal<boolean>(false);

    // Accordion state
    expandedInsumos = signal<Set<number>>(new Set());

    ngOnInit() {
        this.initForm();
        this.cargarInventario();
    }

    private initForm() {
        this.ajusteForm = this.fb.group({
            tipo: ['perdida', Validators.required],
            cantidad: ['', [Validators.required, Validators.min(0.01)]],
            nota: ['']
        });
    }

    async cargarInventario() {
        try {
            this.loading.set(true);
            this.error.set(null);

            const [inventario, valorTotal] = await Promise.all([
                this.inventarioService.getInventarioCompleto(),
                this.inventarioService.getValorTotalInventario()
            ]);

            this.inventario.set(inventario);
            this.valorTotalInventario.set(valorTotal);
        } catch (err: any) {
            console.error('Error cargando inventario:', err);
            this.error.set('Error al cargar el inventario. Por favor, intenta de nuevo.');
        } finally {
            this.loading.set(false);
        }
    }

    // Filtros
    onBusquedaChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.busqueda.set(input.value);
    }

    // Modal de ajuste
    abrirModalAjuste(insumo: InventarioItem) {
        this.insumoSeleccionado.set(insumo);
        this.ajusteForm.reset({
            tipo: 'perdida',
            cantidad: '',
            nota: ''
        });
        this.ajusteModalOpen.set(true);
    }

    cerrarModalAjuste() {
        this.ajusteModalOpen.set(false);
        this.insumoSeleccionado.set(null);
        this.ajusteForm.reset();
    }

    async guardarAjuste() {
        if (this.ajusteForm.invalid || !this.insumoSeleccionado()) {
            return;
        }

        try {
            this.loadingAjuste.set(true);

            const ajuste: AjusteInventario = {
                insumo_id: this.insumoSeleccionado()!.id!,
                tipo: this.ajusteForm.get('tipo')?.value,
                cantidad: this.ajusteForm.get('cantidad')?.value,
                nota: this.ajusteForm.get('nota')?.value || undefined
            };

            await this.inventarioService.registrarAjuste(ajuste);

            // Recargar inventario
            await this.cargarInventario();

            // Cerrar modal
            this.cerrarModalAjuste();
        } catch (err: any) {
            console.error('Error guardando ajuste:', err);
            this.error.set(err.message || 'Error al guardar el ajuste');
        } finally {
            this.loadingAjuste.set(false);
        }
    }

    // Accordion methods
    toggleExpand(id: number, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        const current = new Set(this.expandedInsumos());
        if (current.has(id)) {
            current.delete(id);
        } else {
            current.add(id);
        }
        this.expandedInsumos.set(current);
    }

    isExpanded(id: number): boolean {
        return this.expandedInsumos().has(id);
    }

    // Helpers para UI
    getBadgeColorTipo(tipo: string): string {
        const colores: Record<string, string> = {
            'alimento': 'bg-emerald-900 text-emerald-300',
            'medicamento': 'bg-blue-900 text-blue-300',
            'biologico': 'bg-purple-900 text-purple-300',
            'material': 'bg-amber-900 text-amber-300',
            'otro': 'bg-slate-700 text-slate-300'
        };
        return colores[tipo] || colores['otro'];
    }

    getEmojiTipo(tipo: string): string {
        const emojis: Record<string, string> = {
            'alimento': '🌾',
            'medicamento': '💊',
            'biologico': '💉',
            'material': '🔧',
            'otro': '📦'
        };
        return emojis[tipo] || emojis['otro'];
    }

    isStockBajo(item: InventarioItem): boolean {
        return (item.stock_actual || 0) < (item.stock_minimo || 0);
    }

    formatearMoneda(valor: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    }
}

