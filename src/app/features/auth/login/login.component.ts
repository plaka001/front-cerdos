import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      
      <!-- Login Card -->
      <div class="w-full max-w-md animate-in zoom-in-95 duration-300">
        
        <!-- Logo / Branding -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-2xl shadow-lg mb-4">
            <span class="text-5xl">🐷</span>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">CerdosApp</h1>
          <p class="text-slate-400">Sistema de Gestión Porcina</p>
        </div>

        <!-- Form Card -->
        <div class="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 md:p-8">
          <h2 class="text-xl md:text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                formControlName="email"
                placeholder="usuario@ejemplo.com"
                class="block w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                [class.border-red-500]="form.get('email')?.invalid && form.get('email')?.touched"
              />
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-400">Email requerido</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div class="relative">
                <input 
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  class="block w-full px-4 py-3 pr-12 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  [class.border-red-500]="form.get('password')?.invalid && form.get('password')?.touched"
                />
                <button 
                  type="button"
                  (click)="togglePassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-2xl hover:scale-110 transition-transform"
                >
                  <span>{{ showPassword() ? '🙈' : '👁️' }}</span>
                </button>
              </div>
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-400">Contraseña requerida</p>
              }
            </div>

            <!-- Error Message -->
            @if (errorMessage()) {
              <div class="p-4 bg-red-900/20 border border-red-900/30 rounded-lg">
                <p class="text-sm font-medium text-red-400">Error al iniciar sesión</p>
                <p class="text-sm text-red-300 mt-1">{{ errorMessage() }}</p>
              </div>
            }

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="form.invalid || loading()"
              class="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center border border-emerald-500/20"
            >
              @if (loading()) {
                <div class="flex items-center gap-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </div>
              } @else {
                <span>INGRESAR</span>
              }
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-500">
            © 2025 CerdosApp - Gestión Porcina Profesional
          </p>
        </div>
      </div>
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;

    try {
      const result = await this.authService.signIn(email, password);

      if (result.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set(result.error || 'Error desconocido');
      }
    } catch (error: any) {
      console.error('Error inesperado:', error);
      this.errorMessage.set('Error inesperado. Por favor, intenta de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }
}
