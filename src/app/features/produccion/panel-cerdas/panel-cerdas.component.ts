import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduccionService } from '../../../core/services/produccion.service';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { Cerda } from '../../../core/models';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-panel-cerdas',
    standalone: true,
    imports: [CommonModule, CardComponent, ButtonComponent, LucideAngularModule],
    template: `
    <div class="p-4 pb-24">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Cerdas</h2>
        <app-button variant="primary" (click)="openNewCerdaModal()">
          <lucide-icon name="plus" [size]="20" class="mr-1"></lucide-icon> Nueva
        </app-button>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <app-card *ngFor="let cerda of cerdas()">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-bold text-gray-900">#{{ cerda.chapeta }}</h3>
              <p class="text-sm text-gray-500">{{ cerda.raza || 'Sin raza' }}</p>
            </div>
            <span [class]="getStatusClass(cerda.estado)" class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ cerda.estado | titlecase }}
            </span>
          </div>
          
          <div class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-600">
              <p>Partos: {{ cerda.partos_acumulados }}</p>
            </div>
            <button (click)="openActionSheet(cerda)" class="text-emerald-600 font-medium text-sm hover:text-emerald-800">
              Registrar Evento
            </button>
          </div>
        </app-card>
      </div>

      <!-- Action Sheet Overlay -->
      <div *ngIf="selectedCerda()" class="fixed inset-0 bg-black bg-opacity-50 z-40" (click)="closeActionSheet()"></div>
      
      <!-- Action Sheet -->
      <div *ngIf="selectedCerda()" class="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 p-4 transform transition-transform duration-300 ease-in-out shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Acciones para #{{ selectedCerda()?.chapeta }}</h3>
          <button (click)="closeActionSheet()" class="text-gray-500 hover:text-gray-700">
            <lucide-icon name="x" [size]="24"></lucide-icon>
          </button>
        </div>
        
        <div class="space-y-3">
          <button (click)="registrarEvento('inseminacion')" class="w-full flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
            <lucide-icon name="activity" [size]="20" class="mr-3"></lucide-icon>
            Inseminación
          </button>
          <button (click)="registrarEvento('parto')" class="w-full flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
            <lucide-icon name="baby" [size]="20" class="mr-3"></lucide-icon>
            Parto
          </button>
          <button (click)="registrarEvento('destete')" class="w-full flex items-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">
            <lucide-icon name="scissors" [size]="20" class="mr-3"></lucide-icon>
            Destete
          </button>
        </div>
      </div>
    </div>
  `
})
export class PanelCerdasComponent {
    private produccionService = inject(ProduccionService);
    cerdas = this.produccionService.cerdas;

    selectedCerda = signal<Cerda | null>(null);

    getStatusClass(estado: string): string {
        switch (estado) {
            case 'gestante': return 'bg-green-100 text-green-800';
            case 'lactante': return 'bg-blue-100 text-blue-800';
            case 'vacia': return 'bg-gray-100 text-gray-800';
            case 'descarte': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    openActionSheet(cerda: Cerda) {
        this.selectedCerda.set(cerda);
    }

    closeActionSheet() {
        this.selectedCerda.set(null);
    }

    openNewCerdaModal() {
        alert('Implementar modal de nueva cerda');
    }

    registrarEvento(tipo: string) {
        const cerda = this.selectedCerda();
        if (!cerda) return;

        // Aquí abriríamos el formulario específico o modal para el evento.
        // Por simplicidad, solo mostraremos un alert.
        alert(`Registrar ${tipo} para cerda ${cerda.chapeta}`);
        this.closeActionSheet();
    }
}
