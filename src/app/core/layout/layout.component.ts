import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, BottomNavComponent],
    template: `
    <div class="min-h-screen bg-slate-900">
      <!-- Main Content Area -->
      <main class="pb-16">
        <router-outlet></router-outlet>
      </main>

      <!-- Bottom Navigation (Fixed) -->
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class LayoutComponent { }
