import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ConfiguracionService, Insumo, CategoriaFinanciera } from '../../../../core/services/configuracion.service';
import { InsumoModalComponent } from '../../components/insumo-modal/insumo-modal.component';
import { CategoriaModalComponent } from '../../components/categoria-modal/categoria-modal.component';
import { CorralModalComponent } from '../../components/corral-modal/corral-modal.component';
import { CorralesService } from '../../../../core/services/corrales.service';
import { Corral } from '../../../../core/models';

@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, InsumoModalComponent, CategoriaModalComponent, CorralModalComponent],
    templateUrl: './configuracion.component.html'
})
export class ConfiguracionComponent implements OnInit {
    private router = inject(Router);
    private configService = inject(ConfiguracionService);
    private corralesService = inject(CorralesService);

    activeTab = signal<'insumos' | 'categorias' | 'corrales'>('insumos');

    insumos = signal<Insumo[]>([]);
    categorias = signal<CategoriaFinanciera[]>([]);
    corrales = signal<Corral[]>([]);

    loading = signal<boolean>(true);

    // Modal states
    showInsumoModal = signal<boolean>(false);
    selectedInsumo = signal<Insumo | null>(null);

    showCategoriaModal = signal<boolean>(false);
    selectedCategoria = signal<CategoriaFinanciera | null>(null);

    showCorralModal = signal<boolean>(false);
    selectedCorral = signal<Corral | null>(null);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.loading.set(true);
        try {
            const [insumosData, categoriasData, corralesData] = await Promise.all([
                this.configService.getInsumos(),
                this.configService.getCategorias(),
                this.corralesService.getCorrales()
            ]);

            this.insumos.set(insumosData);
            this.categorias.set(categoriasData);
            this.corrales.set(corralesData);
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

    // --- CORRAL ACTIONS ---
    openNewCorral() {
        this.selectedCorral.set(null);
        this.showCorralModal.set(true);
    }

    editCorral(corral: Corral) {
        this.selectedCorral.set(corral);
        this.showCorralModal.set(true);
    }

    async toggleCorral(corral: Corral, event: Event) {
        event.stopPropagation();
        try {
            await this.corralesService.updateCorral(corral.id, { activo: !corral.activo });
            await this.loadData();
        } catch (e) {
            console.error(e);
        }
    }

    closeCorralModal() {
        this.showCorralModal.set(false);
        this.selectedCorral.set(null);
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

