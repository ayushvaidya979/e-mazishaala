import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-3 sm:px-4 py-2.5">
      <div class="flex items-center justify-between gap-3">
        <!-- Official Logo & Brand -->
        <a routerLink="/home" class="flex items-center gap-2.5 group flex-shrink-0">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center p-1 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="e-MaziShaala Logo" class="w-full h-full object-contain" />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                e-Mazi<span class="text-sky-600">Shaala</span>
              </span>
              <span class="brand-marathi text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/80">
                ई-माझीशाळा
              </span>
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Std 1–10 Learning Portal
            </span>
          </div>
        </a>

        <!-- Right: Notification Bell & Profile Circle Photo (Only photo, no text) -->
        <div class="flex items-center gap-2 sm:gap-2.5">
          <!-- Notification Bell -->
          <a
            routerLink="/notifications"
            class="relative p-2 rounded-full text-slate-500 hover:text-sky-600 hover:bg-slate-100 transition-colors"
            title="Notifications">
            <app-icon name="bell" [size]="20"></app-icon>
            @if (notificationService.unreadCount() > 0) {
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            }
          </a>

          <!-- Profile: Only Photo in Circle (No Text) -->
          <a
            routerLink="/profile"
            class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-sky-100 ring-2 ring-sky-500/40 hover:ring-sky-500 shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Student Profile">
            @if (currentUser(); as user) {
              <img
                [src]="user.avatar"
                [alt]="user.fullName"
                class="w-full h-full object-cover" />
            } @else {
              <div class="w-full h-full bg-sky-600 text-white flex items-center justify-center">
                <app-icon name="user" [size]="20" color="#ffffff"></app-icon>
              </div>
            }
            <!-- Online Status Indicator -->
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </a>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);

  readonly currentUser = computed(() => this.authService.currentUser());
}
