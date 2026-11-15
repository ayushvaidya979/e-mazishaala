import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { LiveClassService } from '../../../core/services/live-class.service';
import { DownloadService } from '../../../core/services/download.service';

export interface BottomTab {
  id: 'home' | 'my-courses' | 'live-classes' | 'downloads';
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <!-- High-ZIndex Fixed Bottom Navigation Bar Optimized for Mobile & Desktop -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pointer-events-auto touch-manipulation select-none"
      role="navigation"
      aria-label="Main Navigation">
      <div class="max-w-[600px] lg:max-w-[768px] mx-auto grid grid-cols-4 px-2 py-1.5 pb-[max(8px,env(safe-area-inset-bottom,10px))]">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="goToTab(tab.route)"
            class="nav-tab group"
            [class.active]="isTabActive(tab.route)"
            [attr.aria-label]="tab.label"
            [attr.aria-current]="isTabActive(tab.route) ? 'page' : null">
            
            <div class="icon-wrap relative pointer-events-none">
              <app-icon [name]="tab.icon" [size]="22"></app-icon>

              <!-- Live Class Pulse Dot Badge -->
              @if (tab.id === 'live-classes' && liveClassService.liveNowClasses().length > 0) {
                <span class="absolute top-0.5 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span class="absolute top-0.5 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
              }

              <!-- Offline Downloads Count Badge -->
              @if (tab.id === 'downloads' && downloadService.downloadedCount() > 0) {
                <span class="absolute -top-1 -right-1 px-1 min-w-[16px] h-3.5 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center leading-none shadow-xs border border-white">
                  {{ downloadService.downloadedCount() }}
                </span>
              }
            </div>

            <span class="label pointer-events-none flex items-center gap-1">
              {{ tab.label }}
              @if (tab.id === 'live-classes' && liveClassService.liveNowClasses().length > 0) {
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              }
            </span>
          </button>
        }
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }

    .nav-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 4px 4px 4px;
      min-height: 52px;
      color: #64748b;
      cursor: pointer;
      border-radius: 14px;
      touch-action: manipulation;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      outline: none;
      background: transparent;
      border: none;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav-tab:active {
      transform: scale(0.92);
      background-color: #f1f5f9;
    }

    .icon-wrap {
      padding: 4px 14px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .label {
      font-size: 11px;
      font-weight: 700;
      margin-top: 2px;
      letter-spacing: -0.15px;
      transition: color 0.15s ease, font-weight 0.15s ease;
      line-height: 1.1;
    }

    .nav-tab:hover {
      color: #0284c7;
    }

    .nav-tab.active {
      color: #0284c7;
    }

    .nav-tab.active .icon-wrap {
      background-color: #e0f2fe;
      color: #0284c7;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.18);
    }

    .nav-tab.active .label {
      color: #0284c7;
      font-weight: 800;
    }
  `]
})
export class BottomNavComponent {
  private router = inject(Router);
  liveClassService = inject(LiveClassService);
  downloadService = inject(DownloadService);

  readonly currentUrl = signal<string>(this.router.url || '');

  readonly tabs: BottomTab[] = [
    { id: 'home', label: 'Home', route: '/home', icon: 'home' },
    { id: 'my-courses', label: 'My Courses', route: '/my-courses', icon: 'book-open' },
    { id: 'live-classes', label: 'Live', route: '/live-classes', icon: 'video' },
    { id: 'downloads', label: 'Downloads', route: '/downloads', icon: 'download' }
  ];

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.currentUrl.set(e.urlAfterRedirects || e.url);
    });
  }

  isTabActive(route: string): boolean {
    const url = this.currentUrl();
    if (route === '/home') {
      return url === '/home' || url === '/' || url === '';
    }
    if (route === '/my-courses') {
      return url.startsWith('/my-courses') || url.startsWith('/courses');
    }
    if (route === '/live-classes') {
      return url.startsWith('/live-classes');
    }
    if (route === '/downloads') {
      return url.startsWith('/downloads');
    }
    return false;
  }

  goToTab(route: string) {
    const current = this.router.url;
    
    // If already on this tab's base route, scroll smoothly to the top
    if (current === route || (route === '/home' && (current === '/' || current === ''))) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    // Navigate immediately to the target tab
    this.router.navigateByUrl(route).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }
}
