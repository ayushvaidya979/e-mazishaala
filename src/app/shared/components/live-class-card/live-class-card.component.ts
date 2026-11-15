import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveClass } from '../../../models/live-class.model';
import { IconComponent } from '../icon/icon.component';
import { LiveClassService } from '../../../core/services/live-class.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-live-class-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col group">
      <!-- Thumbnail -->
      <div class="relative w-full aspect-video bg-slate-900 overflow-hidden">
        <img
          [src]="liveClass.thumbnail"
          [alt]="liveClass.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
        
        <!-- Live Status Pill -->
        @if (liveClass.status === 'live') {
          <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            <span class="live-dot !bg-white"></span>
            LIVE
          </div>
          <div class="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold flex items-center gap-1">
            <app-icon name="users" [size]="10" color="#ffffff"></app-icon>
            {{ liveClass.attendeesCount }} watching
          </div>
        } @else if (liveClass.status === 'upcoming') {
          <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold uppercase shadow-sm">
            Upcoming
          </div>
        } @else {
          <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-bold uppercase">
            Recording
          </div>
        }

        <!-- Std Badge -->
        <div class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-black uppercase">
          Std {{ liveClass.standard }}
        </div>
      </div>

      <!-- Info Body -->
      <div class="p-3.5 space-y-2.5">
        <div>
          <!-- Subject & Timing -->
          <div class="flex items-center justify-between text-[11px] mb-1">
            <span class="text-sky-700 font-bold px-1.5 py-0.2 rounded bg-sky-50 border border-sky-100">
              {{ liveClass.subject }}
            </span>
            <span class="text-slate-500 font-medium flex items-center gap-1">
              <app-icon name="clock" [size]="12" color="#64748b"></app-icon>
              {{ liveClass.scheduledTime }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
            {{ liveClass.title }}
          </h3>

          <!-- Teacher Profile -->
          <div class="flex items-center gap-1.5 mt-2">
            <img
              [src]="liveClass.teacherAvatar"
              [alt]="liveClass.teacherName"
              class="w-5 h-5 rounded-full object-cover" />
            <span class="text-[11px] font-semibold text-slate-600 truncate">{{ liveClass.teacherName }}</span>
          </div>
        </div>

        <!-- Action Row -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span class="text-[10px] text-slate-400 font-medium">Duration: {{ liveClass.duration }}</span>

          <div>
            @if (liveClass.status === 'live') {
              <button
                (click)="onJoinLive()"
                class="btn-primary !bg-red-600 hover:!bg-red-700 !py-1.5 !px-3.5 text-xs font-bold shadow-xs">
                <app-icon name="video" [size]="14" color="#ffffff"></app-icon>
                Join Live
              </button>
            } @else if (liveClass.status === 'upcoming') {
              <button
                (click)="onToggleReminder()"
                class="btn-secondary !py-1.5 !px-3 text-xs font-bold"
                [ngClass]="liveClass.isReminderSet ? '!bg-amber-50 !border-amber-300 !text-amber-800' : ''">
                <app-icon [name]="liveClass.isReminderSet ? 'check' : 'bell'" [size]="13"></app-icon>
                {{ liveClass.isReminderSet ? 'Reminded' : 'Remind' }}
              </button>
            } @else {
              <button
                (click)="onWatchRecording()"
                class="btn-primary !py-1.5 !px-3.5 text-xs font-bold">
                <app-icon name="play" [size]="12" color="#ffffff"></app-icon>
                Watch
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class LiveClassCardComponent {
  @Input({ required: true }) liveClass!: LiveClass;
  @Output() watchRecording = new EventEmitter<LiveClass>();
  @Output() joinLive = new EventEmitter<LiveClass>();

  private liveClassService = inject(LiveClassService);
  private toastService = inject(ToastService);

  onToggleReminder() {
    this.liveClassService.toggleReminder(this.liveClass.id);
  }

  onJoinLive() {
    this.joinLive.emit(this.liveClass);
    this.toastService.info(`Joining live session: ${this.liveClass.title}`);
  }

  onWatchRecording() {
    this.watchRecording.emit(this.liveClass);
  }
}
