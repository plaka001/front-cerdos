import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardData, AlertaInsumo, AlertaParto } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  // Signals para estado reactivo
  dashboardData = signal<DashboardData | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Signals para controlar expansión de alertas
  mostrarDetalleInsumos = signal<boolean>(false);
  mostrarDetallePartos = signal<boolean>(false);

  // Fecha actual formateada
  fechaActual = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      this.loading.set(true);
      this.error.set(null);

      const data = await this.dashboardService.getDashboardData();
      this.dashboardData.set(data);
    } catch (err: any) {
      console.error('Error cargando dashboard:', err);
      this.error.set('No se pudo cargar el dashboard. Por favor, intenta de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  toggleDetalleInsumos() {
    this.mostrarDetalleInsumos.update(v => !v);
  }

  toggleDetallePartos() {
    this.mostrarDetallePartos.update(v => !v);
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  formatearFechaParto(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric'
    });
  }
}
