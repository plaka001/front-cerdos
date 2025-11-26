import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Home, PiggyBank, DollarSign, Menu, Plus, AlertTriangle, Baby, TrendingUp, Wheat, ChevronDown, ChevronUp, ChevronRight, X } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({ Home, PiggyBank, DollarSign, Menu, Plus, AlertTriangle, Baby, TrendingUp, Wheat, ChevronDown, ChevronUp, ChevronRight, X }))
  ]
};
