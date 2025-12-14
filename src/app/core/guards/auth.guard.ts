import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Si el usuario NO está autenticado, redirige al login
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si está autenticado, permite el acceso
    if (authService.isAuthenticated()) {
        return true;
    }

    // Si NO está autenticado, redirige al login
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};

/**
 * Guard para rutas públicas (como login)
 * Si el usuario YA está autenticado, redirige al dashboard
 */
export const publicGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si NO está autenticado, permite acceso (puede ver login)
    if (!authService.isAuthenticated()) {
        return true;
    }

    // Si YA está autenticado, redirige al dashboard
    router.navigate(['/dashboard']);
    return false;
};
