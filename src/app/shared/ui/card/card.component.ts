import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-800 border border-slate-700 overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class CardComponent { }
