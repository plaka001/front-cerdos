import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Home, PiggyBank, DollarSign, Menu, Plus, AlertTriangle, Baby, TrendingUp, Wheat, ChevronDown, ChevronUp, ChevronRight, X, RefreshCw, BarChart2 } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';

import { routes } from './app.routes';

// Function to initialize auth before app loads
export function initializeAuth(authService: AuthService) {
  return () => {
    // Wait until auth is initialized
    return new Promise<void>((resolve) => {
      const checkLoading = setInterval(() => {
        if (!authService.loading()) {
          clearInterval(checkLoading);
          resolve();
        }
      }, 50);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({ Home, PiggyBank, DollarSign, Menu, Plus, AlertTriangle, Baby, TrendingUp, Wheat, ChevronDown, ChevronUp, ChevronRight, X, RefreshCw, BarChart2 })),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
