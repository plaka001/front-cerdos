import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, Session } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase = inject(SupabaseService).client;

    user = signal<User | null>(null);
    session = signal<Session | null>(null);

    constructor() {
        this.supabase.auth.getSession().then(({ data: { session } }) => {
            this.session.set(session);
            this.user.set(session?.user ?? null);
        });

        this.supabase.auth.onAuthStateChange((_event, session) => {
            this.session.set(session);
            this.user.set(session?.user ?? null);
        });
    }

    async signIn(email: string) {
        // Magic link login for simplicity in this demo, or password if preferred.
        // Given the prompt doesn't specify auth method details, I'll assume email/password or magic link.
        // For now, let's just expose the method.
        return this.supabase.auth.signInWithOtp({ email });
    }

    async signOut() {
        return this.supabase.auth.signOut();
    }
}
