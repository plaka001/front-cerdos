import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private _sessionPromise: Promise<any> | null = null;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
    }

    get client(): SupabaseClient {
        return this.supabase;
    }

    get session() {
        if (!this._sessionPromise) {
            this._sessionPromise = this.supabase.auth.getSession().then(({ data }) => data.session);
        }
        return this._sessionPromise;
    }
}
