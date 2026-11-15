import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-center py-6 px-3 sm:px-6 bg-gradient-to-b from-sky-50 via-slate-50 to-sky-100/30">
      <div class="w-full max-w-sm mx-auto space-y-4">
        <!-- Logo & Title with Image -->
        <a routerLink="/" class="flex items-center justify-center gap-2.5 group">
          <div class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center p-1 shadow-xs border border-slate-200/80 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="e-MaziShaala Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <span class="text-xl font-black text-slate-900 tracking-tight">e-Mazi<span class="text-sky-600">Shaala</span></span>
            <span class="brand-marathi text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 ml-1">
              ई-माझीशाळा
            </span>
          </div>
        </a>

        <div class="text-center">
          <h2 class="text-lg font-black text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p class="text-[11px] text-slate-500 font-medium mt-0.5">
            Join 50,000+ students across Maharashtra
          </p>
        </div>

        <div class="bg-white py-6 px-4 sm:px-6 rounded-2xl shadow-sm border border-slate-200/90 relative space-y-3.5">
          <!-- Backend Alert -->
          @if (errorMessage()) {
            <div class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
              <app-icon name="alert-circle" [size]="15" color="#e11d48" extraClass="mt-0.5 flex-shrink-0"></app-icon>
              <div class="text-[11px] leading-tight space-y-0.5">
                <p class="font-bold">Notice</p>
                <p>{{ errorMessage() }}</p>
              </div>
            </div>
          }

          <!-- Google OAuth Button -->
          <button
            type="button"
            (click)="onGoogleLogin()"
            [disabled]="isLoading()"
            class="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all active:scale-95">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div class="relative my-2">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-[10px] uppercase">
              <span class="bg-white px-2 text-slate-400 font-bold">Or Mobile</span>
            </div>
          </div>

          <!-- Sign Up Form -->
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                formControlName="fullName"
                placeholder="Student Name"
                class="w-full px-3 py-2 rounded-xl border text-xs text-slate-900 bg-slate-50/50 outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                formControlName="phoneNumber"
                placeholder="10-digit mobile"
                maxlength="10"
                class="w-full px-3 py-2 rounded-xl border text-xs text-slate-900 bg-slate-50/50 outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Password
              </label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Min 6 characters"
                  class="w-full pl-3 pr-8 py-2 rounded-xl border text-xs text-slate-900 bg-slate-50/50 outline-none" />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400">
                  <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="14"></app-icon>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Re-enter password"
                class="w-full px-3 py-2 rounded-xl border text-xs text-slate-900 bg-slate-50/50 outline-none" />
            </div>

            <button
              type="submit"
              [disabled]="isLoading()"
              class="w-full btn-primary !py-2.5 !rounded-xl text-xs font-bold shadow-xs">
              <span>Create Account</span>
            </button>
          </form>

          <div class="pt-2 border-t border-slate-100">
            <button
              type="button"
              (click)="onEnterDemo()"
              class="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 transition-all">
              <app-icon name="sparkles" [size]="13"></app-icon>
              <span>Instant Guest Mode (Std 10)</span>
            </button>
          </div>

          <div class="text-center text-[11px] text-slate-500 pt-1">
            Already have an account?
            <a routerLink="/login" class="font-bold text-sky-600 ml-1">Login</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  submitted = false;

  signupForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  async onSubmit() {
    this.submitted = true;
    this.errorMessage.set('');

    if (this.signupForm.invalid) return;

    this.isLoading.set(true);
    const { fullName, phoneNumber, password } = this.signupForm.value;
    const result = await this.authService.signup(fullName, phoneNumber, password);
    this.isLoading.set(false);

    if (result.success) {
      this.toastService.success('Account created!');
      this.router.navigate(['/home']);
    } else {
      this.errorMessage.set(result.error || 'Registration failed.');
    }
  }

  async onGoogleLogin() {
    this.isLoading.set(true);
    const res = await this.authService.loginWithGoogle();
    this.isLoading.set(false);
    if (!res.success) {
      this.errorMessage.set(res.error || 'Google Sign-In failed.');
    } else {
      this.router.navigate(['/home']);
    }
  }

  onEnterDemo() {
    this.authService.enterDemoMode(10);
    this.router.navigate(['/home']);
  }
}
