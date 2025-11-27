import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { Session, User, AuthError } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabaseService = inject(SupabaseService);
    private router = inject(Router);

    // Estado de la sesión
    session = signal<Session | null>(null);
    user = signal<User | null>(null);
    loading = signal<boolean>(true);

    constructor() {
        // La inicialización se llama explícitamente desde APP_INITIALIZER
    }

    /**
     * Inicializa la autenticación verificando si existe una sesión activa
     */
    async init(): Promise<void> {
        try {
            // Obtener sesión actual de Supabase
            const { data: { session } } = await this.supabaseService.client.auth.getSession();

            this.session.set(session);
            this.user.set(session?.user ?? null);

            // Escuchar cambios en el estado de autenticación
            this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
                this.session.set(session);
                this.user.set(session?.user ?? null);
            });
        } catch (error) {
            console.error('Error al inicializar autenticación:', error);
        } finally {
            this.loading.set(false);
        }
    }

    /**
     * Iniciar sesión con email y contraseña
     */
    async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error('Error en signIn:', error);
                return {
                    success: false,
                    error: this.getErrorMessage(error)
                };
            }

            if (data.session) {
                this.session.set(data.session);
                this.user.set(data.user);
                return { success: true };
            }

            return { success: false, error: 'No se pudo establecer la sesión' };
        } catch (error: any) {
            console.error('Error inesperado en signIn:', error);
            return {
                success: false,
                error: 'Error inesperado. Intenta de nuevo.'
            };
        }
    }

    /**
     * Cerrar sesión
     */
    async signOut(): Promise<void> {
        try {
            await this.supabaseService.client.auth.signOut();
            this.session.set(null);
            this.user.set(null);
            this.router.navigate(['/login']);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Forzar limpieza local incluso si hay error
            this.session.set(null);
            this.user.set(null);
            this.router.navigate(['/login']);
        }
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated(): boolean {
        return this.session() !== null;
    }

    /**
     * Obtener el token de acceso actual
     */
    getAccessToken(): string | null {
        return this.session()?.access_token ?? null;
    }

    /**
     * Convertir errores de Supabase a mensajes legibles
     */
    private getErrorMessage(error: AuthError): string {
        switch (error.message) {
            case 'Invalid login credentials':
                return 'Credenciales inválidas. Verifica tu email y contraseña.';
            case 'Email not confirmed':
                return 'Email no confirmado. Revisa tu correo.';
            case 'User not found':
                return 'Usuario no encontrado.';
            default:
                return error.message || 'Error al iniciar sesión';
        }
    }
}
