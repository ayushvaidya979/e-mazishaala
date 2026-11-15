import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center py-8 px-4 bg-gradient-to-b from-sky-100/60 via-white to-sky-50 animate-fadeIn">
      <div class="w-full max-w-md mx-auto text-center space-y-6">
        
        <!-- App Logo (Prominent with squircle card & shadow) -->
        <div class="relative inline-block mx-auto">
          <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-3 shadow-xl border border-sky-100 mx-auto flex items-center justify-center transform transition-transform hover:scale-105">
            <img src="/logo.png" alt="e-MaziShaala Official Logo" class="w-full h-full object-contain" />
          </div>
          <span class="absolute -bottom-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs border border-white">
            Std 1–10
          </span>
        </div>

        <!-- App Title & Tagline -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-center gap-2">
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              e-Mazi<span class="text-sky-600">Shaala</span>
            </h1>
            <span class="brand-marathi text-xs sm:text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              ई-माझीशाळा
            </span>
          </div>

          <p class="text-xs sm:text-sm font-extrabold text-sky-800">
            आपली शाळा, आपले भविष्य! • Online Learning Portal
          </p>

          <p class="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Welcome to Maharashtra's premier learning platform for school students from Standard 1 to Standard 10.
          </p>
        </div>

        <!-- 4 Educational Value Cards -->
        <div class="grid grid-cols-2 gap-2.5 text-left pt-2">
          <div class="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span class="text-lg">🎒</span>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-800 leading-tight">Std 1 to 10</p>
              <p class="text-[10px] text-slate-400">Complete Syllabus</p>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span class="text-lg">🔴</span>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-800 leading-tight">Live Classes</p>
              <p class="text-[10px] text-slate-400">Daily Masterclasses</p>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span class="text-lg">📚</span>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-800 leading-tight">Our Books</p>
              <p class="text-[10px] text-slate-400">Official Publications</p>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <span class="text-lg">📝</span>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-800 leading-tight">Board PYQs</p>
              <p class="text-[10px] text-slate-400">10-Yr Solved Papers</p>
            </div>
          </div>
        </div>

        <!-- AUTH ACTION BUTTONS: SIGN IN & LOGIN -->
        <div class="pt-3 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <!-- Log In Button -->
            <a
              routerLink="/login"
              class="btn-primary !py-3.5 !rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2">
              <app-icon name="user" [size]="16" color="#ffffff"></app-icon>
              <span>Log In</span>
            </a>

            <!-- Sign Up Button -->
            <a
              routerLink="/signup"
              class="btn-accent !py-3.5 !rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-amber-950/15 flex items-center justify-center gap-2">
              <app-icon name="sparkles" [size]="16" color="#451a03"></app-icon>
              <span>Sign Up Free</span>
            </a>
          </div>

          <!-- Instant Student Demo Login CTA -->
          <div class="pt-1">
            <button
              type="button"
              (click)="onQuickAccess()"
              class="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-xs border border-sky-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95">
              <span>Quick Student Login (Aarav, Std 10)</span>
              <app-icon name="arrow-right" [size]="13" color="#0284c7"></app-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WelcomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onQuickAccess() {
    this.authService.enterDemoMode(10);
    this.router.navigate(['/home']);
  }
}

