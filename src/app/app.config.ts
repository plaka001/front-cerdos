import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Home, PiggyBank, DollarSign, Menu, Plus, AlertTriangle, Baby, TrendingUp, Wheat, ChevronDown, ChevronUp, ChevronRight, X, RefreshCw, BarChart2, Settings, Package, Tags, ToggleRight, ToggleLeft, Lock, ArrowLeft, Tag, CheckCircle, Loader2, Search, LogOut, Eye, AlertCircle } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';

import { routes } from './app.routes';

// Function to initialize auth before app loads
export function initializeAuth(authService: AuthService) {
  return () => authService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({ Home, PiggyBank, DollarSign, Menu, Plus, AlertTriangle, Baby, TrendingUp, Wheat, ChevronDown, ChevronUp, ChevronRight, X, RefreshCw, BarChart2, Settings, Package, Tags, ToggleRight, ToggleLeft, Lock, ArrowLeft, Tag, CheckCircle, Loader2, Search, LogOut, Eye, AlertCircle })),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
