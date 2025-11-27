import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ConfiguracionService, Insumo, CategoriaFinanciera } from '../../../../core/services/configuracion.service';
import { InsumoModalComponent } from '../../components/insumo-modal/insumo-modal.component';
import { CategoriaModalComponent } from '../../components/categoria-modal/categoria-modal.component';

@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, InsumoModalComponent, CategoriaModalComponent],
    templateUrl: './configuracion.component.html'
})
export class ConfiguracionComponent implements OnInit {
    private router = inject(Router);
    private configService = inject(ConfiguracionService);

    activeTab = signal<'insumos' | 'categorias'>('insumos');

    insumos = signal<Insumo[]>([]);
    categorias = signal<CategoriaFinanciera[]>([]);

    loading = signal<boolean>(true);

    // Modal states
    showInsumoModal = signal<boolean>(false);
    selectedInsumo = signal<Insumo | null>(null);

    showCategoriaModal = signal<boolean>(false);
    selectedCategoria = signal<CategoriaFinanciera | null>(null);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading.set(true);
        try {
            const [insumosData, categoriasData] = await Promise.all([
                this.configService.getInsumos(),
                this.configService.getCategorias()
            ]);

            this.insumos.set(insumosData);
            this.categorias.set(categoriasData);
        } catch (err) {
            console.error('Error loading config data', err);
        } finally {
            this.loading.set(false);
        }
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // --- INSUMO ACTIONS ---
    openNewInsumo() {
        this.selectedInsumo.set(null);
        this.showInsumoModal.set(true);
    }

    editInsumo(insumo: Insumo) {
        this.selectedInsumo.set(insumo);
        this.showInsumoModal.set(true);
    }

    async toggleInsumo(insumo: Insumo, event: Event) {
        event.stopPropagation();
        try {
            await this.configService.toggleEstadoInsumo(insumo.id!, insumo.activo);
            await this.loadData();
        } catch (e) {
            console.error(e);
        }
    }

    // --- CATEGORIA ACTIONS ---
    openNewCategoria() {
        this.selectedCategoria.set(null);
        this.showCategoriaModal.set(true);
    }

    editCategoria(cat: CategoriaFinanciera) {
        if (cat.es_automatica) return;
        this.selectedCategoria.set(cat);
        this.showCategoriaModal.set(true);
    }

    closeInsumoModal() {
        this.showInsumoModal.set(false);
        this.selectedInsumo.set(null);
    }

    closeCategoriaModal() {
        this.showCategoriaModal.set(false);
        this.selectedCategoria.set(null);
    }
}
