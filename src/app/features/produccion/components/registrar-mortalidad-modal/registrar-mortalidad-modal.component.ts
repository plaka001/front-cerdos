import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProduccionService } from '../../../../core/services/produccion.service';
import { LoteDetalle, TipoEventoSanitario } from '../../../../core/models';

@Component({
    selector: 'app-registrar-mortalidad-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './registrar-mortalidad-modal.component.html'
})
export class RegistrarMortalidadModalComponent implements OnInit {
    @Input() lote!: LoteDetalle;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private produccionService = inject(ProduccionService);

    form!: FormGroup;
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    tiposBaja: { value: TipoEventoSanitario; label: string }[] = [
        { value: 'muerte', label: 'Mortalidad natural' },
        { value: 'enfermedad', label: 'Sacrificio sanitario' },
        { value: 'tratamiento', label: 'Descarte/Desecho' }
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        const hoy = new Date().toISOString().split('T')[0];

        this.form = this.fb.group({
            fecha: [hoy, Validators.required],
            tipo: ['muerte', Validators.required],
            cantidad_afectada: ['', [Validators.required, Validators.min(1), Validators.max(this.lote.cantidad_actual)]],
            observacion: ['']
        });

        // Make observacion required if tipo is 'muerte'
        this.form.get('tipo')?.valueChanges.subscribe(tipo => {
            const observacionControl = this.form.get('observacion');
            if (tipo === 'muerte') {
                observacionControl?.setValidators([Validators.required]);
            } else {
                observacionControl?.setValidators([]);
            }
            observacionControl?.updateValueAndValidity();
        });
    }

    isCantidadValida(): boolean {
        const cantidad = this.form.get('cantidad_afectada')?.value || 0;
        return cantidad > 0 && cantidad <= this.lote.cantidad_actual;
    }

    async onSubmit() {
        if (this.form.invalid || !this.isCantidadValida()) {
            return;
        }

        try {
            this.loading.set(true);
            this.error.set(null);

            await this.produccionService.registrarMortalidad({
                lote_id: this.lote.id,
                fecha: this.form.get('fecha')?.value,
                tipo: this.form.get('tipo')?.value,
                cantidad_afectada: this.form.get('cantidad_afectada')?.value,
                observacion: this.form.get('observacion')?.value || null
            });

            this.saved.emit();
        } catch (err: any) {
            this.error.set(err.message || 'Error al registrar baja');
        } finally {
            this.loading.set(false);
        }
    }

    onClose() {
        this.close.emit();
    }
}
