import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { LoteDetalle, Insumo } from '../../../../core/models';

@Component({
    selector: 'app-alimentar-lote-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './alimentar-lote-modal.component.html'
})
export class AlimentarLoteModalComponent implements OnInit {
    @Input() lote!: LoteDetalle;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private produccionService = inject(ProduccionService);

    form!: FormGroup;
    insumos = signal<Insumo[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    ngOnInit() {
        this.initForm();
        this.loadInsumos();
    }

    private initForm() {
        this.form = this.fb.group({
            insumo_id: ['', Validators.required],
            cantidad: ['', [Validators.required, Validators.min(0.01)]]
        });
    }

    async loadInsumos() {
        try {
            const data = await this.produccionService.getInsumosAlimento();
            this.insumos.set(data);
        } catch (err: any) {
            this.error.set('Error cargando alimentos disponibles');
        }
    }

    getInsumoSeleccionado(): Insumo | undefined {
        const id = this.form.get('insumo_id')?.value;
        return this.insumos().find(i => i.id === Number(id));
    }

    getStockDisponible(): number {
        const insumo = this.getInsumoSeleccionado();
        return insumo?.stock_actual || 0;
    }

    isStockSuficiente(): boolean {
        const cantidad = this.form.get('cantidad')?.value || 0;
        const stockDisponible = this.getStockDisponible();
        return cantidad <= stockDisponible;
    }

    async onSubmit() {
        if (this.form.invalid || !this.isStockSuficiente()) {
            return;
        }

        try {
            this.loading.set(true);
            this.error.set(null);

            const insumo = this.getInsumoSeleccionado();
            if (!insumo) {
                this.error.set('Insumo no encontrado');
                return;
            }

            await this.produccionService.registrarConsumo({
                insumo_id: insumo.id,
                lote_id: this.lote.id,
                cantidad: this.form.get('cantidad')?.value,
                costo_unitario_momento: insumo.costo_promedio
            });

            this.saved.emit();
        } catch (err: any) {
            this.error.set(err.message || 'Error al registrar consumo');
        } finally {
            this.loading.set(false);
        }
    }

    onClose() {
        this.close.emit();
    }
}
