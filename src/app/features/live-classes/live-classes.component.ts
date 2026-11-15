import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveClassService } from '../../core/services/live-class.service';
import { LiveClass } from '../../models/live-class.model';
import { LiveClassCardComponent } from '../../shared/components/live-class-card/live-class-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-live-classes',
  standalone: true,
  imports: [CommonModule, LiveClassCardComponent, IconComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50/50">
      <!-- Top Header -->
      <section class="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div class="app-container">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="live-dot"></span>
                <span class="text-xs font-bold text-red-600 uppercase tracking-wider">Live & Interactive</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Live Classes & Recorded Lectures
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Join ongoing live masterclasses or watch high-definition recordings of past sessions.
              </p>
            </div>

            <!-- Tab Filters: 1. Live Now, 2. Upcoming Classes, 3. Previous Classes -->
            <div class="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold self-start sm:self-auto">
              <button
                (click)="activeTab.set('live')"
                class="px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                [ngClass]="activeTab() === 'live' ? 'bg-red-600 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'">
                <span class="w-2 h-2 rounded-full" [ngClass]="activeTab() === 'live' ? 'bg-white' : 'bg-red-500'"></span>
                Live Now ({{ liveClassService.liveNowClasses().length }})
              </button>
              <button
                (click)="activeTab.set('upcoming')"
                class="px-3.5 py-2 rounded-xl transition-all"
                [ngClass]="activeTab() === 'upcoming' ? 'bg-sky-600 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'">
                Upcoming ({{ liveClassService.upcomingClasses().length }})
              </button>
              <button
                (click)="activeTab.set('completed')"
                class="px-3.5 py-2 rounded-xl transition-all"
                [ngClass]="activeTab() === 'completed' ? 'bg-slate-800 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'">
                Previous ({{ liveClassService.previousClasses().length }})
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="app-container py-8 flex-1 space-y-6">
        @if (displayedClasses().length > 0) {
          <div class="space-y-4">
            @for (c of displayedClasses(); track c.id) {
              <app-live-class-card
                [liveClass]="c"
                (joinLive)="onJoinLiveSession($event)"
                (watchRecording)="onOpenRecordingModal($event)">
              </app-live-class-card>
            }
          </div>
        } @else {
          <div class="card-base text-center py-16 px-6 max-w-md mx-auto space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <app-icon name="video" [size]="28"></app-icon>
            </div>
            <h3 class="text-base font-bold text-slate-800">No classes in this category</h3>
            <p class="text-xs text-slate-500">Check upcoming batches or watch past recorded sessions.</p>
          </div>
        }
      </main>

      <!-- Simulated Live Session / Video Player Modal -->
      @if (selectedClass(); as activeClass) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div class="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full border border-slate-200 flex flex-col">
            <!-- Modal Bar -->
            <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div class="flex items-center gap-2">
                @if (activeClass.status === 'live') {
                  <span class="live-dot"></span>
                  <span class="text-xs font-black uppercase text-red-400">LIVE CLASSROOM</span>
                } @else {
                  <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-700">RECORDED SESSION</span>
                }
                <span class="text-xs text-slate-400">|</span>
                <h3 class="text-xs sm:text-sm font-bold truncate max-w-sm sm:max-w-lg">{{ activeClass.title }}</h3>
              </div>
              <button (click)="selectedClass.set(null)" class="text-slate-300 hover:text-white">
                <app-icon name="x" [size]="20"></app-icon>
              </button>
            </div>

            <!-- Video Player -->
            <div class="aspect-video bg-black flex items-center justify-center relative">
              <video
                controls
                autoplay
                class="w-full h-full object-contain"
                src="https://www.w3schools.com/html/mov_bbb.mp4">
              </video>
            </div>

            <!-- Live Details & Teacher Bar -->
            <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img [src]="activeClass.teacherAvatar" [alt]="activeClass.teacherName" class="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900">{{ activeClass.teacherName }}</h4>
                  <p class="text-[11px] text-slate-500">{{ activeClass.teacherTitle }}</p>
                </div>
              </div>
              <button (click)="selectedClass.set(null)" class="btn-primary !py-1.5 !px-4 text-xs font-bold">
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      }

      <app-footer></app-footer>
    </div>
  `
})
export class LiveClassesComponent {
  liveClassService = inject(LiveClassService);

  activeTab = signal<'live' | 'upcoming' | 'completed'>('live');
  selectedClass = signal<LiveClass | null>(null);

  displayedClasses = computed(() => {
    const tab = this.activeTab();
    if (tab === 'live') return this.liveClassService.liveNowClasses();
    if (tab === 'upcoming') return this.liveClassService.upcomingClasses();
    return this.liveClassService.previousClasses();
  });

  onJoinLiveSession(c: LiveClass) {
    this.selectedClass.set(c);
  }

  onOpenRecordingModal(c: LiveClass) {
    this.selectedClass.set(c);
  }
}

