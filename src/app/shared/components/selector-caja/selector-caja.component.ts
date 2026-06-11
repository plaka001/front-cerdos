import { Component, inject, input, model, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanzasService } from '../../../core/services/finanzas.service';

/**
 * Selector uniforme de caja para todos los puntos de la app donde entra o sale plata.
 * Por defecto selecciona "Efectivo Yeison" (quien maneja la plata del día a día).
 */
@Component({
    selector: 'app-selector-caja',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div>
      <label class="block text-xs font-medium text-slate-400 mb-1.5">
        {{ tipo() === 'ingreso' ? '💰 ¿A qué caja entra la plata?' : '💸 ¿De qué caja sale la plata?' }}
      </label>
      <select [ngModel]="cuentaId()" (ngModelChange)="cuentaId.set($event)"
        class="block w-full h-11 rounded-lg border-slate-600 bg-slate-700 text-white text-sm shadow-sm focus:border-white focus:ring-white focus:ring-1 transition-all px-3">
        @for (cuenta of cuentas(); track cuenta.id) {
        <option [ngValue]="cuenta.id">{{ cuenta.nombre }}</option>
        }
      </select>
    </div>
  `
})
export class SelectorCajaComponent {
    private finanzasService = inject(FinanzasService);

    /** 'ingreso' => "¿A qué caja entra?", 'egreso' => "¿De qué caja sale?" */
    tipo = input<'ingreso' | 'egreso'>('egreso');

    /** Cuenta seleccionada (two-way: [(cuentaId)]) */
    cuentaId = model<number | null>(null);

    cuentas = this.finanzasService.cuentas;

    constructor() {
        this.finanzasService.loadCuentas();

        // Default: Efectivo Yeison cuando cargan las cuentas
        effect(() => {
            const cuentas = this.cuentas();
            if (cuentas.length > 0 && this.cuentaId() === null) {
                const yeison = cuentas.find(c => c.nombre.toLowerCase().includes('yeison'));
                this.cuentaId.set((yeison || cuentas[0]).id);
            }
        }, { allowSignalWrites: true });
    }
}
