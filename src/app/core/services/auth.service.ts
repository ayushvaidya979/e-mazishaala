import { Injectable, signal, computed } from '@angular/core';
import { UserProfile } from '../../models/user.model';
import { ToastService } from './toast.service';

export interface BackendAuthConfig {
  provider: 'firebase' | 'supabase' | 'custom' | null;
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private toastService: ToastService) {
    // Check local storage for persistent guest/authenticated session
    const saved = localStorage.getItem('emazishaala_user');
    if (saved) {
      try {
        this.currentUserSignal.set(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('emazishaala_user');
      }
    }
  }

  // Backend Integration Configuration Slot (Ready for Firebase / Supabase)
  // When null, backend is not connected.
  private backendConfig: BackendAuthConfig = {
    provider: null // Set to 'firebase' or 'supabase' when backend is connected
  };

  private currentUserSignal = signal<UserProfile | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isBackendConnected = computed(() => this.backendConfig.provider !== null);

  /**
   * Safe check and session restore from localStorage
   */
  checkAndRestoreSession(): boolean {
    if (this.currentUserSignal() !== null) {
      return true;
    }
    const saved = localStorage.getItem('emazishaala_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.currentUserSignal.set(user);
        return true;
      } catch (e) {
        localStorage.removeItem('emazishaala_user');
      }
    }
    return false;
  }

  restoreUserSession(user: UserProfile) {
    this.currentUserSignal.set(user);
    localStorage.setItem('emazishaala_user', JSON.stringify(user));
  }

  /**
   * Log in user
   * Verifies backend connection. If backend is not connected, fails with an error
   * as required by project specifications.
   */
  async login(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    // Check if backend is connected
    if (!this.isBackendConnected()) {
      return {
        success: false,
        error: 'Backend authentication service is not connected. Firebase or Supabase credentials are required in auth.service.ts.'
      };
    }

    // Backend connected flow placeholder (e.g., supabase.auth.signInWithPassword or firebase.auth().signInWithEmailAndPassword)
    return { success: true };
  }

  /**
   * Sign up user
   * Verifies backend connection. If backend is not connected, fails with an error.
   */
  async signup(fullName: string, phone: string, pass: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isBackendConnected()) {
      return {
        success: false,
        error: 'Backend authentication service is not connected. Please connect Firebase or Supabase to register new user accounts.'
      };
    }

    return { success: true };
  }

  /**
   * Google Sign-In Integration Ready
   */
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    if (!this.isBackendConnected()) {
      return {
        success: false,
        error: 'Google OAuth provider is not configured. Connect your Google Client ID or Firebase/Supabase OAuth provider.'
      };
    }

    return { success: true };
  }

  /**
   * Explicit Guest / Demo Session mode for UI exploration & evaluation
   */
  enterDemoMode(preferredStandard: number = 10) {
    const demoUser: UserProfile = {
      id: 'demo-student-1',
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phoneNumber: '9112445134',
      standard: preferredStandard,
      schoolName: 'Bal Shivaji Vidyamandir, Pune',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'November 2026',
      enrolledCourseIds: ['c10-math-mastery', 'c10-science-booster'],
      completedCourseIds: [],
      reminderClassIds: ['up-3'],
      downloadedItemIds: ['dl-1', 'dl-2', 'dl-5', 'dl-7'],
      progress: {
        'c10-math-mastery': { percent: 68, completedLessons: 46, lastLessonTitle: 'Quadratic Equations Practice 2.2' },
        'c10-science-booster': { percent: 42, completedLessons: 31, lastLessonTitle: 'Universal Gravitation & Numerical Problems' }
      }
    };

    this.currentUserSignal.set(demoUser);
    localStorage.setItem('emazishaala_user', JSON.stringify(demoUser));
    this.toastService.success(`Welcome, ${demoUser.fullName}! Standard ${demoUser.standard} learning portal loaded.`);
  }

  updateStudentStandard(std: number) {
    const cur = this.currentUserSignal();
    if (cur) {
      const updated = { ...cur, standard: std };
      this.currentUserSignal.set(updated);
      localStorage.setItem('emazishaala_user', JSON.stringify(updated));
      this.toastService.success(`Class updated to Standard ${std}`);
    }
  }

  logout() {
    this.currentUserSignal.set(null);
    localStorage.removeItem('emazishaala_user');
    this.toastService.info('You have been logged out.');
  }
}

