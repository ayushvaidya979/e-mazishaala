import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserProfile } from '../../models/user.model';
import { ToastService } from './toast.service';

export interface SupabaseProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  standard: number;
  school_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private supabaseService = inject(SupabaseService);
  private toastService = inject(ToastService);

  private readonly supabase = this.supabaseService.supabase;

  /**
   * Fetch current user profile from public.profiles
   */
  async getProfile(userId: string): Promise<SupabaseProfileRow | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching Supabase profile:', error.message);
        return null;
      }

      return data as SupabaseProfileRow;
    } catch (e) {
      console.warn('Failed to get Supabase profile:', e);
      return null;
    }
  }

  /**
   * Update profile details in public.profiles table
   */
  async updateProfile(
    userId: string,
    updates: {
      fullName?: string;
      standard?: number;
      schoolName?: string;
      phoneNumber?: string;
      avatarUrl?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payload: Partial<SupabaseProfileRow> = {
        updated_at: new Date().toISOString()
      };

      if (updates.fullName !== undefined) payload.full_name = updates.fullName;
      if (updates.standard !== undefined) payload.standard = updates.standard;
      if (updates.schoolName !== undefined) payload.school_name = updates.schoolName;
      if (updates.phoneNumber !== undefined) payload.phone_number = updates.phoneNumber;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

      const { error } = await this.supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile.' };
    }
  }

  /**
   * Safely create or ensure profile exists (idempotent, does not duplicate)
   */
  async ensureProfile(
    userId: string,
    email: string | null,
    fullName: string,
    avatarUrl: string,
    standard: number = 10,
    phoneNumber: string = '9112445134'
  ): Promise<SupabaseProfileRow | null> {
    try {
      // First check if profile already exists
      const existing = await this.getProfile(userId);
      if (existing) {
        return existing;
      }

      // Insert if missing (e.g. if signup trigger was bypassed)
      const { data, error } = await this.supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            full_name: fullName,
            email: email,
            avatar_url: avatarUrl,
            standard: standard,
            phone_number: phoneNumber,
            school_name: 'Bal Shivaji Vidyamandir, Pune',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) {
        console.warn('Could not upsert profile:', error.message);
        return null;
      }

      return data as SupabaseProfileRow;
    } catch (e) {
      console.warn('Exception during ensureProfile:', e);
      return null;
    }
  }
}

