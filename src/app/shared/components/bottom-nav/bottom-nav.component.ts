import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 pb-safe z-50" style="background-color: var(--color-bg); border-top: 1px solid var(--color-border);">
      <div class="flex justify-around items-center h-16">
        <a routerLink="/dashboard" routerLinkActive="active-nav-link" class="nav-link flex flex-col items-center justify-center w-full h-full">
          <span class="text-2xl">🏠</span>
          <span class="text-xs mt-1">Inicio</span>
        </a>
        <a routerLink="/finanzas" routerLinkActive="active-nav-link" class="nav-link flex flex-col items-center justify-center w-full h-full">
          <span class="text-2xl">💰</span>
          <span class="text-xs mt-1">Finanzas</span>
        </a>
        <a routerLink="/reportes" routerLinkActive="active-nav-link" class="nav-link flex flex-col items-center justify-center w-full h-full">
          <span class="text-2xl">📊</span>
          <span class="text-xs mt-1">Reportes</span>
        </a>
      </div>
    </nav>

    <!-- Logout Confirmation Modal -->
    @if (showLogoutConfirm()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in" (click)="showLogoutConfirm.set(false)">
        <div class="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 p-6 animate-in zoom-in-95 duration-200" (click)="$event.stopPropagation()">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🚪</span>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-white mb-2">Cerrar Sesión</h3>
              <p class="text-sm text-slate-300">¿Estás seguro que deseas salir de la aplicación?</p>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button 
              (click)="showLogoutConfirm.set(false)"
              class="flex-1 py-2.5 px-4 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button 
              (click)="confirmLogout()"
              class="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .nav-link {
      color: var(--color-text-secondary);
      transition: color var(--transition-fast);
      border: none;
      background: none;
      cursor: pointer;
    }
    .nav-link:hover {
      color: var(--color-primary);
    }
    .active-nav-link {
      color: var(--color-text-primary);
    }
  `]
})
export class BottomNavComponent {
  private authService = inject(AuthService);

  showLogoutConfirm = signal<boolean>(false);

  onLogout() {
    this.showLogoutConfirm.set(true);
  }

  async confirmLogout() {
    this.showLogoutConfirm.set(false);
    await this.authService.signOut();
  }
}
