import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { AppNotification } from '../../models/notification.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50/50">
      <main class="app-container py-8 sm:py-12 flex-1 max-w-3xl space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Notifications & Alerts</h1>
            <p class="text-xs text-slate-500">Live class reminders, announcements, and exam schedules</p>
          </div>
          @if (notificationService.unreadCount() > 0) {
            <button
              (click)="notificationService.markAllAsRead()"
              class="text-xs font-bold text-sky-600 hover:text-sky-800">
              Mark all as read
            </button>
          }
        </div>

        @if (notificationService.notifications().length > 0) {
          <div class="space-y-3">
            @for (n of notificationService.notifications(); track n.id) {
              <div
                (click)="notificationService.markAsRead(n.id)"
                class="card-base p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-all"
                [ngClass]="n.isRead ? 'bg-white opacity-85' : 'bg-sky-50/60 border-sky-300 ring-1 ring-sky-200'">
                <div class="flex items-start gap-3.5">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    [ngClass]="{
                      'bg-red-100 text-red-600': n.type === 'live',
                      'bg-amber-100 text-amber-700': n.type === 'book',
                      'bg-sky-100 text-sky-700': n.type === 'course',
                      'bg-purple-100 text-purple-700': n.type === 'exam',
                      'bg-slate-100 text-slate-600': n.type === 'general'
                    }">
                    <app-icon
                      [name]="n.type === 'live' ? 'video' : (n.type === 'book' ? 'book-open' : 'bell')"
                      [size]="18">
                    </app-icon>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <h3 class="text-sm font-bold text-slate-900">{{ n.title }}</h3>
                      @if (!n.isRead) {
                        <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                      }
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">{{ n.message }}</p>
                    <p class="text-[10px] text-slate-400 font-medium">{{ n.timestamp }}</p>
                  </div>
                </div>

                @if (n.actionUrl) {
                  <a
                    [routerLink]="n.actionUrl"
                    class="btn-secondary !py-1 !px-2.5 text-xs font-bold flex-shrink-0 self-center">
                    View
                  </a>
                }
              </div>
            }
          </div>
        } @else {
          <div class="card-base text-center py-16 px-6 max-w-md mx-auto space-y-3">
            <app-icon name="bell" [size]="32" color="#94a3b8"></app-icon>
            <h3 class="text-base font-bold text-slate-800">No new notifications</h3>
            <p class="text-xs text-slate-500">You're all caught up with your study schedules!</p>
          </div>
        }
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);
}

