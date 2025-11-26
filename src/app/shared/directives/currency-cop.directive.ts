import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: 'input[appCurrencyCop]',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CurrencyCopDirective),
            multi: true
        }
    ]
})
export class CurrencyCopDirective implements ControlValueAccessor {
    private el: HTMLInputElement;
    private onChange: (value: number | null) => void = () => { };
    private onTouched: () => void = () => { };

    constructor(private elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value: string): void {
        // Remover todo excepto números y coma
        const cleanValue = value.replace(/[^\d,]/g, '');

        // Separar parte entera y decimal
        const parts = cleanValue.split(',');
        let integerPart = parts[0] || '';
        const decimalPart = parts[1] || '';

        // Formatear parte entera con puntos como separadores de miles
        if (integerPart) {
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        // Reconstruir el valor formateado
        let formattedValue = integerPart;
        if (parts.length > 1) {
            formattedValue += ',' + decimalPart.substring(0, 2); // Máximo 2 decimales
        }

        // Actualizar el input visualmente
        this.el.value = formattedValue;

        // Convertir a número para el form control
        const numericValue = this.parseToNumber(formattedValue);
        this.onChange(numericValue);
    }

    @HostListener('blur')
    onBlur(): void {
        this.onTouched();
    }

    @HostListener('focus')
    onFocus(): void {
        // Opcional: Seleccionar todo el texto al hacer focus
        this.el.select();
    }

    writeValue(value: number | null): void {
        if (value !== null && value !== undefined) {
            this.el.value = this.formatNumber(value);
        } else {
            this.el.value = '';
        }
    }

    registerOnChange(fn: (value: number | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled;
    }

    private parseToNumber(value: string): number | null {
        if (!value) return null;

        // Remover puntos (separadores de miles) y reemplazar coma por punto (decimal)
        const cleanValue = value.replace(/\./g, '').replace(',', '.');
        const num = parseFloat(cleanValue);

        return isNaN(num) ? null : num;
    }

    private formatNumber(value: number): string {
        // Formatear usando el locale español de Colombia
        return value.toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }
}
