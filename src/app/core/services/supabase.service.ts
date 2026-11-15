import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabasePublishableKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false, // Handled explicitly in /auth/callback and appUrlOpen to avoid PKCE double-exchange race conditions
          flowType: 'pkce' // Mandatory PKCE authorization code exchange
        }
      }
    );
  }

  get supabase(): SupabaseClient {
    return this.client;
  }
}

