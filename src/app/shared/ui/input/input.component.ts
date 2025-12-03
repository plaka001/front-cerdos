import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    template: `
    <div class="mb-4">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-slate-300 mb-1.5">
        {{ label }}
      </label>
      <div class="relative rounded-md shadow-sm">
        <!-- Currency prefix indicator -->
        <div *ngIf="type === 'currency'" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-slate-400 sm:text-sm">$</span>
        </div>
        
        <input
          [type]="getInputType()"
          [id]="id"
          [name]="name"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [(ngModel)]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          class="appearance-none block w-full h-12 leading-[3rem] md:leading-normal rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-white focus:ring-white focus:ring-2 sm:text-sm transition-all px-3 placeholder-slate-400"
          [class.pl-7]="type === 'currency'"
          [class.pr-10]="type === 'date'"
          [class.border-red-500]="error"
          [class.focus:ring-red-500]="error"
          [class.focus:border-red-500]="error"
          [style.color-scheme]="type === 'date' ? 'dark' : 'auto'"
          [style.min-height]="'48px'"
        />
      </div>
      <p *ngIf="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() type = 'text';
    @Input() id = '';
    @Input() name = '';
    @Input() placeholder = '';
    @Input() error = '';
    @Input() disabled = false;

    val = '';
    displayValue = '';
    isFocused = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    get value() {
        return this.val;
    }

    set value(val) {
        this.val = val;
        this.onChange(val);
        this.onTouched();
    }

    getInputType(): string {
        return this.type === 'currency' ? 'text' : this.type;
    }


    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        if (this.type === 'currency') {
            // Remove all non-numeric characters
            const numericValue = value.replace(/[^\d]/g, '');

            if (numericValue) {
                const numberValue = parseInt(numericValue, 10);
                this.val = numberValue.toString();
                this.onChange(numberValue);

                // Always show formatted value while typing
                this.displayValue = this.formatCurrency(numberValue);

                // Preserve cursor position
                setTimeout(() => {
                    const cursorPosition = this.displayValue.length;
                    input.setSelectionRange(cursorPosition, cursorPosition);
                }, 0);
            } else {
                this.val = '';
                this.displayValue = '';
                this.onChange(null);
            }
        } else {
            this.val = value;
            this.displayValue = value;
            this.onChange(value);
        }
    }


    onFocus(): void {
        this.isFocused = true;
    }

    onBlur(): void {
        this.isFocused = false;
        this.onTouched();
    }

    formatCurrency(value: number): string {
        return value.toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            this.val = value.toString();

            if (this.type === 'currency') {
                this.displayValue = this.formatCurrency(parseInt(this.val, 10));
            } else {
                this.displayValue = this.val;
            }
        } else {
            this.val = '';
            this.displayValue = '';
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
