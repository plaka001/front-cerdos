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
        <input
          [type]="type"
          [id]="id"
          [name]="name"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [(ngModel)]="value"
          (blur)="onTouched()"
          class="appearance-none block w-full h-12 leading-[3rem] rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-white focus:ring-white focus:ring-2 sm:text-sm transition-all px-3 placeholder-slate-400"
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

    writeValue(value: any): void {
        if (value !== undefined) {
            this.val = value;
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
