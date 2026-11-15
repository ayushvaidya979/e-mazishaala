import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { ProfileService } from './profile.service';
import { ToastService } from './toast.service';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private readonly supabase = this.supabaseService.supabase;

  // Reactive state signals
  private currentSessionSignal = signal<Session | null>(null);
  private currentUserSignal = signal<UserProfile | null>(null);
  private isAuthenticatingSignal = signal<boolean>(false);

  // Public exposed reactive properties
  readonly currentSession = this.currentSessionSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticating = this.isAuthenticatingSignal.asReadonly();

  // Clean computed profile properties
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly userId = computed(() => this.currentUserSignal()?.id || null);
  readonly userFullName = computed(() => this.currentUserSignal()?.fullName || 'Student');
  readonly userEmail = computed(() => this.currentUserSignal()?.email || '');
  readonly userAvatar = computed(() => this.currentUserSignal()?.avatar || '');

  // Flag to track whether native deep-link listener is active
  private nativeListenerRegistered = false;

  constructor() {
    this.initSessionListener();
    this.initNativeDeepLinkListener();
  }

  /**
   * Initialize Supabase Auth state listener and restore any existing session
   */
  private async initSessionListener() {
    // 1. Initial check for existing active session from secure storage
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (session && !error) {
        this.applySession(session);
      } else {
        // Fallback: Check local guest/demo profile cache
        this.checkLocalGuestSession();
      }
    } catch (e) {
      this.checkLocalGuestSession();
    }

    // 2. Continuous real-time auth state listener
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        this.applySession(session);
      } else if (event === 'SIGNED_OUT') {
        this.clearSessionState();
      }
    });
  }

  /**
   * Set up Capacitor Native Deep Link Listener for Android/iOS
   * Captures the custom scheme redirect (e.g. com.emaazishaala.app://auth/callback?code=...)
   */
  private initNativeDeepLinkListener() {
    if (!Capacitor.isNativePlatform() || this.nativeListenerRegistered) {
      return;
    }

    this.nativeListenerRegistered = true;

    App.addListener('appUrlOpen', async (data: URLOpenListenerEvent) => {
      const url = data.url;
      if (!url) return;

      // Check if this deep link is an authentication callback
      const isAuthCallback =
        url.includes('auth/callback') ||
        url.includes('com.emaazishaala.app') ||
        url.includes('code=') ||
        url.includes('error=');

      if (!isAuthCallback) {
        return;
      }

      // Close the in-app browser/Custom Tab
      try {
        await Browser.close();
      } catch (e) {
        // Browser may already be closed by OS
      }

      // Handle the OAuth callback URL
      await this.handleNativeOAuthUrl(url);
    });
  }

  /**
   * Initiates Google Sign-In with Supabase Authentication using PKCE flow
   * Supports both Web browsers and native Android (Capacitor)
   */
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    if (this.isAuthenticatingSignal()) {
      return { success: false, error: 'Authentication is already in progress.' };
    }

    this.isAuthenticatingSignal.set(true);

    try {
      if (Capacitor.isNativePlatform()) {
        // ==========================================
        // NATIVE ANDROID / IOS PKCE OAUTH FLOW
        // ==========================================
        const redirectUri = 'com.emaazishaala.app://auth/callback';

        const { data, error } = await this.supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: true, // We will open via Capacitor Browser
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account'
            }
          }
        });

        if (error || !data?.url) {
          this.isAuthenticatingSignal.set(false);
          const friendlyError = this.getFriendlyErrorMessage(error);
          return { success: false, error: friendlyError };
        }

        // Open the authorization page using the system browser / Chrome Custom Tab
        await Browser.open({
          url: data.url,
          windowName: '_self'
        });

        // The flow continues via App.addListener('appUrlOpen') when redirected back.
        // We leave isAuthenticating true until the deep link completes or the user closes the browser.
        const finishListener = await Browser.addListener('browserFinished', () => {
          setTimeout(() => {
            if (!this.isLoggedIn()) {
              this.isAuthenticatingSignal.set(false);
            }
            finishListener.remove();
          }, 1500);
        });

        return { success: true };

      } else {
        // ==========================================
        // WEB BROWSER PKCE OAUTH FLOW
        // ==========================================
        const webRedirect = `${window.location.origin}/auth/callback`;

        const { data, error } = await this.supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: webRedirect,
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account'
            }
          }
        });

        if (error) {
          this.isAuthenticatingSignal.set(false);
          const friendlyError = this.getFriendlyErrorMessage(error);
          return { success: false, error: friendlyError };
        }

        // The browser will redirect to Google's sign-in page.
        return { success: true };
      }
    } catch (err: any) {
      this.isAuthenticatingSignal.set(false);
      const friendlyError = this.getFriendlyErrorMessage(err);
      return { success: false, error: friendlyError };
    }
  }

  /**
   * Handles the OAuth callback in the browser (called from AuthCallbackComponent)
   */
  async handleWebOAuthCallback(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.isAuthenticatingSignal.set(true);

      // 1. Check if session was already established
      const { data: currentSessionData } = await this.supabase.auth.getSession();
      if (currentSessionData?.session) {
        this.isAuthenticatingSignal.set(false);
        this.applySession(currentSessionData.session);
        this.toastService.success(`Welcome to e-MaziShaala, ${this.userFullName()}!`);
        return { success: true };
      }

      // 2. Exchange authorization code for session
      const { data, error } = await this.supabase.auth.exchangeCodeForSession(code);

      this.isAuthenticatingSignal.set(false);

      if (error || !data.session) {
        // Fallback: check one more time if session was saved
        const { data: retrySession } = await this.supabase.auth.getSession();
        if (retrySession?.session) {
          this.applySession(retrySession.session);
          this.toastService.success(`Welcome to e-MaziShaala, ${this.userFullName()}!`);
          return { success: true };
        }
        return { success: false, error: this.getFriendlyErrorMessage(error) };
      }

      this.applySession(data.session);
      this.toastService.success(`Welcome to e-MaziShaala, ${this.userFullName()}!`);
      return { success: true };
    } catch (err: any) {
      this.isAuthenticatingSignal.set(false);
      // Double check if session got stored despite exception
      const { data: retrySession } = await this.supabase.auth.getSession().catch(() => ({ data: { session: null } }));
      if (retrySession?.session) {
        this.applySession(retrySession.session);
        return { success: true };
      }
      return { success: false, error: this.getFriendlyErrorMessage(err) };
    }
  }

  /**
   * Handles the deep link URL received by the native Android application
   */
  private async handleNativeOAuthUrl(urlStr: string) {
    try {
      this.isAuthenticatingSignal.set(true);

      // Check for OAuth error in the returned URL
      if (urlStr.includes('error=')) {
        const errorDesc = this.extractQueryParam(urlStr, 'error_description') || this.extractQueryParam(urlStr, 'error');
        this.isAuthenticatingSignal.set(false);
        this.toastService.error(this.getFriendlyErrorMessage(errorDesc || 'Google Sign-In was cancelled.'));
        return;
      }

      // Extract authorization code
      const code = this.extractQueryParam(urlStr, 'code');
      if (code) {
        // Exchange code for session using PKCE
        const { data, error } = await this.supabase.auth.exchangeCodeForSession(code);

        this.isAuthenticatingSignal.set(false);

        if (error || !data.session) {
          this.toastService.error(this.getFriendlyErrorMessage(error));
          return;
        }

        this.applySession(data.session);
        this.toastService.success(`Welcome to e-MaziShaala, ${this.userFullName()}!`);
        this.router.navigate(['/home']);
        return;
      }

      // If no code, check for access_token in hash (fallback)
      if (urlStr.includes('access_token=')) {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        this.isAuthenticatingSignal.set(false);
        if (session && !error) {
          this.applySession(session);
          this.router.navigate(['/home']);
        }
      }
    } catch (err: any) {
      this.isAuthenticatingSignal.set(false);
      this.toastService.error(this.getFriendlyErrorMessage(err));
    }
  }

  /**
   * Helper to extract query parameters from standard or custom URL schemes
   */
  private extractQueryParam(urlString: string, param: string): string | null {
    try {
      // Handle standard URLs
      if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
        const parsed = new URL(urlString);
        return parsed.searchParams.get(param) || this.extractFromHash(parsed.hash, param);
      }

      // Handle custom scheme e.g. com.emaazishaala.app://auth/callback?code=xyz
      const queryPart = urlString.includes('?') ? urlString.split('?')[1] : '';
      const params = new URLSearchParams(queryPart.split('#')[0]);
      if (params.has(param)) {
        return params.get(param);
      }

      // Fallback regex matching
      const regex = new RegExp(`[?&#]${param}=([^&#]+)`);
      const match = urlString.match(regex);
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  }

  private extractFromHash(hash: string, param: string): string | null {
    if (!hash) return null;
    const cleanHash = hash.startsWith('#') ? hash.substring(1) : hash;
    const params = new URLSearchParams(cleanHash);
    return params.get(param);
  }

  /**
   * Maps Supabase User and session into application UserProfile
   */
  private applySession(session: Session) {
    this.currentSessionSignal.set(session);
    const profile = this.mapSupabaseUserToProfile(session.user);
    this.currentUserSignal.set(profile);

    // Save user profile locally for offline fallback and fast loading
    localStorage.setItem('emazishaala_user', JSON.stringify(profile));
    this.isAuthenticatingSignal.set(false);

    // Asynchronously synchronize with Supabase public.profiles table
    this.syncRemoteProfile(session.user);
  }

  /**
   * Synchronizes user metadata with the public.profiles database table
   */
  private async syncRemoteProfile(user: User) {
    try {
      let dbProfile = await this.profileService.getProfile(user.id);
      if (!dbProfile) {
        dbProfile = await this.profileService.ensureProfile(
          user.id,
          user.email || null,
          user.user_metadata?.['full_name'] || user.user_metadata?.['name'] || user.email?.split('@')[0] || 'Student',
          user.user_metadata?.['avatar_url'] || user.user_metadata?.['picture'] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
          10,
          '9112445134'
        );
      }

      if (dbProfile) {
        const cur = this.currentUserSignal();
        if (cur && cur.id === user.id) {
          const updated: UserProfile = {
            ...cur,
            fullName: dbProfile.full_name || cur.fullName,
            email: dbProfile.email || cur.email,
            phoneNumber: dbProfile.phone_number || cur.phoneNumber,
            standard: dbProfile.standard || cur.standard,
            schoolName: dbProfile.school_name || cur.schoolName,
            avatar: dbProfile.avatar_url || cur.avatar
          };
          this.currentUserSignal.set(updated);
          localStorage.setItem('emazishaala_user', JSON.stringify(updated));
          this.saveCachedProfile(updated);
        }
      }
    } catch {
      // Graceful offline fallback
    }
  }

  /**
   * Map Supabase User metadata into our app's UserProfile schema
   */
  private mapSupabaseUserToProfile(user: User): UserProfile {
    const meta = user.user_metadata || {};
    const fullName =
      meta['full_name'] ||
      meta['name'] ||
      user.email?.split('@')[0] ||
      'Student';

    const avatar =
      meta['avatar_url'] ||
      meta['picture'] ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80';

    // Retrieve any previously saved customized class / progress for this user id
    const cached = this.getCachedProfile(user.id);

    return {
      id: user.id,
      fullName: fullName,
      email: user.email || '',
      phoneNumber: meta['phone'] || meta['phone_number'] || cached?.phoneNumber || '9112445134',
      standard: cached?.standard || 10,
      schoolName: cached?.schoolName || 'Bal Shivaji Vidyamandir, Pune',
      avatar: avatar,
      joinedDate: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      enrolledCourseIds: cached?.enrolledCourseIds || ['c10-math-mastery', 'c10-science-booster'],
      completedCourseIds: cached?.completedCourseIds || [],
      reminderClassIds: cached?.reminderClassIds || ['up-3'],
      downloadedItemIds: cached?.downloadedItemIds || ['dl-1', 'dl-2', 'dl-5', 'dl-7'],
      progress: cached?.progress || {
        'c10-math-mastery': { percent: 68, completedLessons: 46, lastLessonTitle: 'Quadratic Equations Practice 2.2' },
        'c10-science-booster': { percent: 42, completedLessons: 31, lastLessonTitle: 'Universal Gravitation & Numerical Problems' }
      }
    };
  }

  private getCachedProfile(userId: string): Partial<UserProfile> | null {
    try {
      const data = localStorage.getItem(`emazishaala_profile_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveCachedProfile(profile: UserProfile) {
    try {
      localStorage.setItem(`emazishaala_profile_${profile.id}`, JSON.stringify(profile));
    } catch (e) {
      // storage unavailable
    }
  }

  private checkLocalGuestSession() {
    const saved = localStorage.getItem('emazishaala_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.currentUserSignal.set(user);
      } catch (e) {
        localStorage.removeItem('emazishaala_user');
      }
    }
  }

  /**
   * Safe check and session restore from Supabase or localStorage
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
   * Email/Phone Login with Supabase
   */
  async login(identifier: string, pass: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.isAuthenticatingSignal.set(true);

      const clean = identifier.trim();
      const isPhoneOnly = /^\+?[0-9\s-]{10,15}$/.test(clean) && !clean.includes('@');
      const accountEmail = isPhoneOnly
        ? `${clean.replace(/\D/g, '').slice(-10)}@student.emazishaala.com`
        : clean;

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: accountEmail,
        password: pass
      });

      this.isAuthenticatingSignal.set(false);

      if (error || !data.session) {
        return { success: false, error: this.getFriendlyErrorMessage(error) };
      }

      this.applySession(data.session);
      return { success: true };
    } catch (err: any) {
      this.isAuthenticatingSignal.set(false);
      return { success: false, error: this.getFriendlyErrorMessage(err) };
    }
  }

  /**
   * Email/Mobile Signup with Supabase
   */
  async signup(fullName: string, phone: string, pass: string, email?: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.isAuthenticatingSignal.set(true);

      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const cleanName = fullName.trim();
      const accountEmail = (email && email.includes('@'))
        ? email.trim()
        : `${cleanPhone}@student.emazishaala.com`;

      const { data, error } = await this.supabase.auth.signUp({
        email: accountEmail,
        password: pass,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone
          }
        }
      });

      if (error) {
        // If user already registered, attempt to log them in directly
        if (error.message.toLowerCase().includes('already registered')) {
          const loginRes = await this.login(accountEmail, pass);
          if (loginRes.success) {
            this.isAuthenticatingSignal.set(false);
            return { success: true };
          }
        }
        this.isAuthenticatingSignal.set(false);
        return { success: false, error: this.getFriendlyErrorMessage(error) };
      }

      // Check if session returned directly
      if (data?.session) {
        this.applySession(data.session);
      } else {
        // Try logging in to obtain the active session
        const loginRes = await this.supabase.auth.signInWithPassword({
          email: accountEmail,
          password: pass
        });

        if (loginRes.data?.session) {
          this.applySession(loginRes.data.session);
        } else {
          // Establish authenticated student session with user ID
          const userId = data?.user?.id || 'std-' + cleanPhone;
          const userProfile: UserProfile = {
            id: userId,
            fullName: cleanName,
            email: data?.user?.email || accountEmail,
            phoneNumber: cleanPhone,
            standard: 10,
            schoolName: 'Bal Shivaji Vidyamandir, Pune',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            enrolledCourseIds: ['c10-math-mastery', 'c10-science-booster'],
            completedCourseIds: [],
            reminderClassIds: [],
            downloadedItemIds: ['dl-1', 'dl-2', 'dl-5'],
            progress: {
              'c10-math-mastery': { percent: 0, completedLessons: 0, lastLessonTitle: 'Chapter 1: Linear Equations' }
            }
          };

          this.currentUserSignal.set(userProfile);
          localStorage.setItem('emazishaala_user', JSON.stringify(userProfile));
          this.saveCachedProfile(userProfile);

          // Ensure profile is inserted into public.profiles in database
          this.profileService.ensureProfile(
            userId,
            data?.user?.email || accountEmail,
            cleanName,
            userProfile.avatar,
            10,
            cleanPhone
          ).catch(e => console.warn('Could not insert profile into Supabase:', e));
        }
      }

      this.isAuthenticatingSignal.set(false);
      return { success: true };
    } catch (err: any) {
      this.isAuthenticatingSignal.set(false);
      return { success: false, error: this.getFriendlyErrorMessage(err) };
    }
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
      this.saveCachedProfile(updated);
      this.toastService.success(`Class updated to Standard ${std}`);

      // Sync with Supabase profiles table if authenticated
      if (this.currentSessionSignal()) {
        this.profileService.updateProfile(cur.id, { standard: std }).catch(err => {
          console.warn('Could not sync standard change to Supabase:', err);
        });
      }
    }
  }

  /**
   * Refreshes the user profile from Supabase public.profiles table
   */
  async refreshUserProfile(): Promise<void> {
    const session = this.currentSessionSignal();
    if (!session?.user?.id) return;

    try {
      const dbProfile = await this.profileService.getProfile(session.user.id);
      if (dbProfile) {
        const cur = this.currentUserSignal();
        if (cur) {
          const updated: UserProfile = {
            ...cur,
            fullName: dbProfile.full_name || cur.fullName,
            email: dbProfile.email || cur.email,
            phoneNumber: dbProfile.phone_number || cur.phoneNumber,
            standard: dbProfile.standard || cur.standard,
            schoolName: dbProfile.school_name || cur.schoolName,
            avatar: dbProfile.avatar_url || cur.avatar
          };
          this.currentUserSignal.set(updated);
          localStorage.setItem('emazishaala_user', JSON.stringify(updated));
          this.saveCachedProfile(updated);
        }
      }
    } catch (e) {
      console.warn('Failed to refresh user profile:', e);
    }
  }

  /**
   * Updates profile details in Supabase public.profiles and application state
   */
  async updateUserProfile(updates: {
    fullName?: string;
    standard?: number;
    schoolName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const cur = this.currentUserSignal();
    if (!cur) return { success: false, error: 'No user signed in' };

    const updated: UserProfile = {
      ...cur,
      fullName: updates.fullName ?? cur.fullName,
      standard: updates.standard ?? cur.standard,
      schoolName: updates.schoolName ?? cur.schoolName,
      phoneNumber: updates.phoneNumber ?? cur.phoneNumber,
      avatar: updates.avatarUrl ?? cur.avatar
    };

    this.currentUserSignal.set(updated);
    localStorage.setItem('emazishaala_user', JSON.stringify(updated));
    this.saveCachedProfile(updated);

    if (this.currentSessionSignal()) {
      return await this.profileService.updateProfile(cur.id, updates);
    }

    return { success: true };
  }

  /**
   * Sign out user completely and clear sessions
   */
  async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
    } catch {
      // Ignore network errors during signout
    } finally {
      this.clearSessionState();
      this.toastService.info('You have been logged out.');
      this.router.navigate(['/welcome']);
    }
  }

  private clearSessionState() {
    this.currentSessionSignal.set(null);
    this.currentUserSignal.set(null);
    this.isAuthenticatingSignal.set(false);
    localStorage.removeItem('emazishaala_user');
  }

  /**
   * User-friendly error message parser (avoids raw technical errors while preserving diagnostics)
   */
  private getFriendlyErrorMessage(rawError: any): string {
    const rawMsg = typeof rawError === 'string' ? rawError : (rawError?.message || rawError?.error_description || '');
    const msg = rawMsg.toLowerCase();

    if (msg.includes('user cancelled') || msg.includes('browser closed') || msg.includes('canceled') || msg.includes('cancelled')) {
      return 'Google sign-in was cancelled. Please try again when ready.';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('offline') || msg.includes('failed to fetch')) {
      return 'Network connection problem. Please verify your internet and try again.';
    }
    if (msg.includes('redirect_uri_mismatch') || msg.includes('redirect uri')) {
      return 'OAuth configuration: Redirect URI mismatch. Please add http://localhost:4200/auth/callback to your Google Cloud Console and Supabase Dashboard.';
    }
    if (msg.includes('invalid_grant') || msg.includes('expired') || msg.includes('already been used') || msg.includes('token expired')) {
      return 'The authorization link expired. Please sign in with Google again.';
    }
    if (msg.includes('code_verifier') || msg.includes('verifier') || msg.includes('pkce')) {
      return 'Authentication session code verifier missing or expired. Please click Sign in with Google again.';
    }
    if (msg.includes('unsupported provider') || msg.includes('provider is not enabled') || msg.includes('provider not supported')) {
      return 'Google Sign-In is not enabled yet in your Supabase project. Please enable Google under Authentication -> Providers in Supabase.';
    }
    if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
      return 'Invalid email or password. Please check your credentials.';
    }
    if (msg.includes('user already registered')) {
      return 'An account with this email already exists. Please log in instead.';
    }
    if (msg.includes('password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }

    return rawMsg || 'Unable to complete Google sign-in. Please try again in a moment.';
  }
}
