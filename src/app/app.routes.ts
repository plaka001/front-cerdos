import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

// Layout
import { LayoutComponent } from './core/layout/layout.component';

// Auth
import { LoginComponent } from './features/auth/login/login.component';

// Features
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CerdasListComponent } from './features/produccion/cerdas-list/cerdas-list.component';
import { LotesListComponent } from './features/produccion/lotes-list/lotes-list.component';
import { RegistroTransaccionComponent } from './features/finanzas/registro-transaccion/registro-transaccion.component';

export const routes: Routes = [
    // Ruta Pública: Login
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [publicGuard] // Si ya está logueado, redirige a dashboard
    },

    // Rutas Protegidas: Todas bajo Layout con AuthGuard
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard], // Requiere autenticación
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'produccion',
                component: CerdasListComponent
            },
            {
                path: 'lotes',
                component: LotesListComponent
            },
            {
                path: 'finanzas',
                component: RegistroTransaccionComponent
            },
            {
                path: 'reportes',
                loadComponent: () => import('./features/reportes/reportes.component').then(m => m.ReportesComponent)
            },
            {
                path: 'configuracion',
                loadComponent: () => import('./features/configuracion/pages/configuracion/configuracion.component').then(m => m.ConfiguracionComponent)
            },
            {
                path: 'inventario',
                loadComponent: () => import('./features/inventario/inventario.component').then(m => m.InventarioComponent)
            }
        ]
    },

    // Wildcard: Redirigir a dashboard (el guard lo mandará al login si no está autenticado)
    {
        path: '**',
        redirectTo: ''
    }
];
