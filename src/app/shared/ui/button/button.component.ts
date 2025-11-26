import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="getClasses()"
      (click)="onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
    styles: []
})
export class ButtonComponent {
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' = 'primary';
    @Input() disabled = false;
    @Input() fullWidth = false;

    getClasses(): string {
        const baseClasses = 'inline-flex items-center justify-center px-4 py-3 border text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 h-12'; // h-12 for touch targets

        let variantClasses = '';
        switch (this.variant) {
            case 'primary':
                variantClasses = 'border-transparent text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500';
                break;
            case 'secondary':
                variantClasses = 'border-transparent text-emerald-400 bg-emerald-900/30 hover:bg-emerald-900/50 focus:ring-emerald-500';
                break;
            case 'danger':
                variantClasses = 'border-transparent text-white bg-red-500 hover:bg-red-600 focus:ring-red-500';
                break;
            case 'outline':
                variantClasses = 'border-slate-600 text-slate-300 bg-transparent hover:bg-slate-700 focus:ring-emerald-500';
                break;
        }

        const widthClass = this.fullWidth ? 'w-full' : '';
        const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : '';

        return `${baseClasses} ${variantClasses} ${widthClass} ${disabledClass}`;
    }

    onClick(event: Event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
