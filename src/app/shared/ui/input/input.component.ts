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
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700 mb-1">
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
            class="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md h-12 px-3 text-left"
            [class.border-red-300]="error"
            [class.text-red-900]="error"
            [class.placeholder-red-300]="error"
            [class.focus:ring-red-500]="error"
            [class.focus:border-red-500]="error"
          />
      </div>
      <p *ngIf="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
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
