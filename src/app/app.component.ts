import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    @if (authService.loading()) {
      <!-- Loading Screen -->
      <div class="min-h-screen bg-slate-900 flex items-center justify-center">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <span class="text-5xl">🐷</span>
          </div>
          <p class="text-white font-medium">Cargando...</p>
        </div>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  styles: []
})
export class AppComponent {
  authService = inject(AuthService);
}
