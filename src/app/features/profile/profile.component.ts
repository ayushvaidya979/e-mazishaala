import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f4f8fc]">
      <main class="py-4 px-3 sm:px-4 space-y-4 flex-1">
        @if (authService.currentUser(); as user) {
          <!-- Profile Header Card -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
            <div class="flex items-center gap-3.5">
              <img
                [src]="user.avatar"
                [alt]="user.fullName"
                class="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-500/20" />
              
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <h1 class="text-base font-black text-slate-900 truncate">{{ user.fullName }}</h1>
                </div>
                <p class="text-xs font-bold text-sky-700">Standard {{ user.standard }} Student</p>
                <p class="text-[11px] text-slate-400 truncate">{{ user.schoolName }}</p>
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
              <div class="p-2 rounded-xl bg-sky-50">
                <span class="text-base font-black text-sky-700">{{ user.enrolledCourseIds.length }}</span>
                <p class="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Courses</p>
              </div>
              <div class="p-2 rounded-xl bg-amber-50">
                <span class="text-base font-black text-amber-700">48h</span>
                <p class="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Learned</p>
              </div>
              <div class="p-2 rounded-xl bg-emerald-50">
                <span class="text-base font-black text-emerald-700">{{ user.downloadedItemIds.length }}</span>
                <p class="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Notes</p>
              </div>
            </div>
          </div>

          <!-- Class Selector -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
            <h3 class="text-xs font-black uppercase text-slate-500 tracking-wider">Switch Class (Standard 1–10)</h3>
            <div class="grid grid-cols-5 gap-1.5">
              @for (std of [1,2,3,4,5,6,7,8,9,10]; track std) {
                <button
                  type="button"
                  (click)="changeClass(std)"
                  class="py-2 rounded-xl text-xs font-black transition-all"
                  [ngClass]="user.standard === std ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-sky-50'">
                  Std {{ std }}
                </button>
              }
            </div>
          </div>

          <!-- Account Settings & Logout -->
          <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">Session Active</span>
            <button
              (click)="onLogout()"
              class="btn-secondary !py-1.5 !px-3 text-xs font-bold text-rose-600 hover:!bg-rose-50">
              <app-icon name="log-out" [size]="13" color="#e11d48"></app-icon>
              <span>Log Out</span>
            </button>
          </div>
        } @else {
          <!-- Guest State -->
          <div class="bg-white rounded-2xl text-center py-12 px-4 border space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              <app-icon name="user" [size]="24"></app-icon>
            </div>
            <h3 class="text-sm font-bold text-slate-900">Student Sign In Required</h3>
            <div class="flex items-center justify-center gap-2 pt-2">
              <a routerLink="/login" class="btn-secondary !py-1.5 !px-4 text-xs font-bold">Login</a>
              <button (click)="onEnterDemo()" class="btn-primary !py-1.5 !px-4 text-xs font-bold">
                Guest Mode
              </button>
            </div>
          </div>
        }
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  changeClass(std: number) {
    this.authService.updateStudentStandard(std);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  onEnterDemo() {
    this.authService.enterDemoMode(10);
    this.router.navigate(['/home']);
  }
}
