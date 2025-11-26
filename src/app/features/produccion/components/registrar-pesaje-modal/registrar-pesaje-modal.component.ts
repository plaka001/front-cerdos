import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { LoteDetalle } from '../../../../core/models';

@Component({
    selector: 'app-registrar-pesaje-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './registrar-pesaje-modal.component.html'
})
export class RegistrarPesajeModalComponent implements OnInit {
    @Input() lote!: LoteDetalle;
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

    private initForm() {
        const hoy = new Date().toISOString().split('T')[0];

        this.form = this.fb.group({
            fecha: [hoy, Validators.required],
            peso_promedio: ['', [Validators.required, Validators.min(0.01)]]
        });
    }

    get pesoActual(): number {
        return this.lote.peso_promedio_actual || this.lote.peso_promedio_inicial || 0;
    }

    async onSubmit() {
        if (this.form.invalid) {
            return;
        }

        try {
            this.loading.set(true);
            this.error.set(null);

            await this.produccionService.registrarPesaje({
                lote_id: this.lote.id,
                fecha: this.form.get('fecha')?.value,
                peso_promedio: this.form.get('peso_promedio')?.value
            });

            this.saved.emit();
        } catch (err: any) {
            this.error.set(err.message || 'Error al registrar pesaje');
        } finally {
            this.loading.set(false);
        }
    }

    onClose() {
        this.close.emit();
    }
}
