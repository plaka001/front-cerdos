import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FinanzasService } from '../../../core/services/finanzas.service';
import { CuadreDia } from '../../../core/models';

@Component({
    selector: 'app-cuadre-dia',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './cuadre-dia.component.html'
})
export class CuadreDiaComponent implements OnInit {
    private finanzasService = inject(FinanzasService);

    loading = signal(true);
    error = signal<string | null>(null);
    fecha = signal<string>(this.hoyColombia());
    cuadre = signal<CuadreDia | null>(null);

    ngOnInit() {
        this.cargar();
    }

    private hoyColombia(): string {
        // Fecha actual en hora Colombia (UTC-5)
        const ahora = new Date(Date.now() - 5 * 60 * 60 * 1000);
        return ahora.toISOString().split('T')[0];
    }

    async cargar() {
        this.loading.set(true);
        this.error.set(null);
        try {
            const data = await this.finanzasService.getCuadreDia(this.fecha());
            this.cuadre.set(data);
        } catch (err: any) {
            console.error('Error cargando cuadre del día:', err);
            this.error.set(err.message || 'Error cargando el cuadre');
        } finally {
            this.loading.set(false);
        }
    }

    onFechaChange(nueva: string) {
        if (!nueva) return;
        this.fecha.set(nueva);
        this.cargar();
    }

    irAHoy() {
        this.fecha.set(this.hoyColombia());
        this.cargar();
    }

    formatMonto(valor: number): string {
        return '$' + (valor || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });
    }

    fechaLegible(): string {
        return new Date(`${this.fecha()}T12:00:00-05:00`).toLocaleDateString('es-CO', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    horaRegistro(createdAt?: string): string {
        if (!createdAt) return '';
        return new Date(createdAt).toLocaleTimeString('es-CO', {
            hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota'
        });
    }

    tipoMovProveedorLabel(tipo: string): string {
        switch (tipo) {
            case 'compra_credito': return 'Compra fiada';
            case 'abono': return 'Abono';
            case 'saldo_inicial': return 'Saldo inicial';
            default: return tipo;
        }
    }
}
