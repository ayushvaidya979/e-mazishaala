import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-50 via-white to-sky-100/30">
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 max-w-sm w-full text-center space-y-4 animate-fadeIn">
        
        <!-- App Logo -->
        <div class="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 mx-auto shadow-sm flex items-center justify-center">
          <img src="/logo.png" alt="e-MaziShaala Logo" class="w-full h-full object-contain" />
        </div>

        @if (!errorMessage()) {
          <!-- Loading State -->
          <div class="space-y-3 py-2">
            <div class="w-10 h-10 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 class="text-sm font-black text-slate-900">Completing Google Sign-In</h3>
              <p class="text-xs text-slate-500 mt-1">Connecting to your e-MaziShaala student portal...</p>
            </div>
          </div>
        } @else {
          <!-- Error State -->
          <div class="space-y-3 py-2">
            <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              ✕
            </div>
            <div>
              <h3 class="text-sm font-black text-rose-700">Authentication Issue</h3>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ errorMessage() }}</p>
            </div>
            <button
              type="button"
              (click)="backToLogin()"
              class="w-full btn-primary !py-2.5 text-xs font-bold mt-2">
              Back to Login
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly errorMessage = signal<string>('');

  async ngOnInit() {
    // 0. If user is already authenticated, go directly to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    // 1. Check for query parameters and hash fragments
    const queryParams = this.route.snapshot.queryParams;
    let code: string | null = queryParams['code'] || null;
    let errorDesc: string | null = queryParams['error_description'] || queryParams['error'] || null;

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (!code) {
          code = url.searchParams.get('code');
        }
        if (!errorDesc) {
          errorDesc = url.searchParams.get('error_description') || url.searchParams.get('error');
        }

        // Check hash fragment (e.g. #code=... or #error=...)
        if (!code && url.hash) {
          const hashStr = url.hash.startsWith('#') ? url.hash.substring(1) : url.hash;
          const hashParams = new URLSearchParams(hashStr);
          code = hashParams.get('code');
          if (!errorDesc) {
            errorDesc = hashParams.get('error_description') || hashParams.get('error');
          }
        }
      } catch (e) {
        // Fallback to route queryParams
      }
    }

    if (errorDesc) {
      this.errorMessage.set(errorDesc);
      return;
    }

    if (code) {
      const res = await this.authService.handleWebOAuthCallback(code);
      if (res.success) {
        this.router.navigate(['/home']);
        return;
      }

      // Check if session established despite error response
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/home']);
        return;
      }

      this.errorMessage.set(res.error || 'Unable to complete Google sign-in.');
      return;
    }

    // 2. Fallback: Wait briefly for session restoration
    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage.set('No authorization code was found in the callback URL.');
      }
    }, 1500);
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}

