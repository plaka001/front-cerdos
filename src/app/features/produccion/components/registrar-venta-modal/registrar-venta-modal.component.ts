import { Component, Input, Output, EventEmitter, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { LoteDetalle } from '../../../../core/models';

@Component({
    selector: 'app-registrar-venta-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './registrar-venta-modal.component.html'
})
export class RegistrarVentaModalComponent implements OnInit {
    @Input() lote!: LoteDetalle;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private produccionService = inject(ProduccionService);

    form!: FormGroup;
    loading = signal<boolean>(false);
    error = signal<string | null>(null);
    totalVenta = signal<number>(0);

    ngOnInit() {
        this.initForm();
        this.setupTotalCalculation();
    }

    private initForm() {
        const hoy = new Date().toISOString().split('T')[0];

        this.form = this.fb.group({
            fecha: [hoy, Validators.required],
            cliente: ['', Validators.required],
            cantidad_vendida: [this.lote.cantidad_actual, [Validators.required, Validators.min(1), Validators.max(this.lote.cantidad_actual)]],
            peso_total: ['', [Validators.required, Validators.min(0.01)]],
            precio_por_kilo: ['', [Validators.required, Validators.min(0.01)]],
            cerrar_lote: [true]
        });
    }

    private setupTotalCalculation() {
        // Calculate total whenever peso_total or precio_por_kilo changes
        this.form.get('peso_total')?.valueChanges.subscribe(() => this.calculateTotal());
        this.form.get('precio_por_kilo')?.valueChanges.subscribe(() => this.calculateTotal());
    }

    private calculateTotal() {
        const pesoTotal = this.form.get('peso_total')?.value || 0;
        const precioPorKilo = this.form.get('precio_por_kilo')?.value || 0;
        this.totalVenta.set(pesoTotal * precioPorKilo);
    }

    isCantidadValida(): boolean {
        const cantidad = this.form.get('cantidad_vendida')?.value || 0;
        return cantidad > 0 && cantidad <= this.lote.cantidad_actual;
    }

    async onSubmit() {
        if (this.form.invalid || !this.isCantidadValida()) {
            return;
        }

        try {
            this.loading.set(true);
            this.error.set(null);

            await this.produccionService.registrarVenta({
                lote_id: this.lote.id,
                lote_codigo: this.lote.codigo,
                fecha: this.form.get('fecha')?.value,
                cliente: this.form.get('cliente')?.value,
                cantidad_vendida: this.form.get('cantidad_vendida')?.value,
                peso_total: this.form.get('peso_total')?.value,
                precio_por_kilo: this.form.get('precio_por_kilo')?.value,
                total_venta: this.totalVenta(),
                cerrar_lote: this.form.get('cerrar_lote')?.value
            });

            this.saved.emit();
        } catch (err: any) {
            this.error.set(err.message || 'Error al registrar venta');
        } finally {
            this.loading.set(false);
        }
    }

    onClose() {
        this.close.emit();
    }
}
