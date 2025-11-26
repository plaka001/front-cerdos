import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="min-h-screen bg-slate-900 pb-16 overflow-x-hidden max-w-full px-4">
      <router-outlet></router-outlet>
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Gestión Porcícola';
}
