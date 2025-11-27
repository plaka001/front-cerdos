import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PanelCerdasComponent } from './features/produccion/panel-cerdas/panel-cerdas.component';
import { RegistroTransaccionComponent } from './features/finanzas/registro-transaccion/registro-transaccion.component';
import { AlimentarLoteComponent } from './features/alimentacion/alimentar-lote/alimentar-lote.component';

import { CerdasListComponent } from './features/produccion/cerdas-list/cerdas-list.component';
import { LotesListComponent } from './features/produccion/lotes-list/lotes-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'produccion', component: CerdasListComponent },
    { path: 'lotes', component: LotesListComponent },
    { path: 'finanzas', component: RegistroTransaccionComponent },
    { path: 'reportes', loadComponent: () => import('./features/reportes/reportes.component').then(m => m.ReportesComponent) },
    { path: '**', redirectTo: '/dashboard' }
];
