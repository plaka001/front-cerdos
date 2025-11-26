import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Home, PiggyBank, DollarSign, Menu } from 'lucide-angular';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 pb-safe z-50" style="background-color: var(--color-bg); border-top: 1px solid var(--color-border);">
      <div class="flex justify-around items-center h-16">
        <a routerLink="/dashboard" routerLinkActive="active-nav-link" class="nav-link flex flex-col items-center justify-center w-full h-full">
          <lucide-icon name="home" [size]="24"></lucide-icon>
          <span class="text-xs mt-1">Inicio</span>
        </a>
        <a routerLink="/produccion" routerLinkActive="active-nav-link" class="nav-link flex flex-col items-center justify-center w-full h-full">
          <lucide-icon name="piggy-bank" [size]="24"></lucide-icon>
          <span class="text-xs mt-1">Prod</span>
        </a>
        <a routerLink="/finanzas" routerLinkActive="active-nav-link" class="nav-link flex flex-col items-center justify-center w-full h-full">
          <lucide-icon name="dollar-sign" [size]="24"></lucide-icon>
          <span class="text-xs mt-1">Finanzas</span>
        </a>
        <a routerLink="/menu" routerLinkActive="active-nav-link" class="nav-link flex flex-col items-center justify-center w-full h-full">
          <lucide-icon name="menu" [size]="24"></lucide-icon>
          <span class="text-xs mt-1">Más</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link {
      color: var(--color-text-secondary);
      transition: color var(--transition-fast);
    }
    .nav-link:hover {
      color: var(--color-primary);
    }
    .active-nav-link {
      color: var(--color-text-primary);
    }
  `]
})
export class BottomNavComponent { }
