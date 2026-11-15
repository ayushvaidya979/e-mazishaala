import { Component, signal, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';

export interface PromoBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  doodleSvg: string;
  discountBadge?: string;
}

@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="relative w-full overflow-hidden rounded-2xl shadow-xs border border-sky-100/80 group">
      <!-- Carousel Track -->
      <div
        class="flex transition-transform duration-500 ease-out"
        [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'">
        @for (b of banners; track b.id; let idx = $index) {
          <div class="w-full flex-shrink-0 relative overflow-hidden" [ngClass]="b.bgGradient">
            <div class="p-3.5 sm:p-4 flex items-center justify-between gap-3 relative z-10 min-h-[135px]">
              
              <!-- Vibrant Visual Doodle Illustration (Left / Side) -->
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30 backdrop-blur-md shadow-inner p-1.5"
                [innerHTML]="getSafeHtml(b.doodleSvg)">
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 text-white space-y-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                    {{ b.tag }}
                  </span>
                  @if (b.discountBadge) {
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">
                      {{ b.discountBadge }}
                    </span>
                  }
                </div>

                <h3 class="text-xs sm:text-sm font-extrabold tracking-tight leading-snug text-white line-clamp-1">
                  {{ b.title }}
                </h3>

                <p class="text-[10px] text-sky-100 leading-tight line-clamp-2">
                  {{ b.subtitle }}
                </p>

                <div class="pt-0.5">
                  <a
                    [routerLink]="b.ctaLink"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[10px] shadow-xs active:scale-95 transition-all">
                    <span>{{ b.ctaText }}</span>
                    <app-icon name="arrow-right" [size]="10" color="#090d16"></app-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Dots Indicators -->
      <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        @for (b of banners; track b.id; let idx = $index) {
          <button
            (click)="goTo(idx)"
            class="h-1.5 rounded-full transition-all duration-300"
            [ngClass]="currentIndex() === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/50'">
          </button>
        }
      </div>
    </div>
  `
})
export class BannerCarouselComponent implements OnInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  readonly banners: PromoBanner[] = [
    {
      id: 'b1',
      tag: 'Admissions Open',
      title: 'Class 10 & 9 Board Toppers Batch',
      subtitle: 'Complete syllabus with 10-Year Solved PYQs in Marathi & English.',
      discountBadge: '60% OFF',
      ctaText: 'Explore Batch',
      ctaLink: '/courses/c10-math-mastery',
      bgGradient: 'bg-gradient-to-r from-sky-700 via-sky-600 to-blue-800',
      doodleSvg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#facc15" fill-opacity="0.25"/>
        <path d="M24 8L6 18l18 10 18-10-18-10z" fill="#fef08a" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M14 22.5v10c0 4 4.5 7 10 7s10-3 10-7v-10" stroke="#ffffff" stroke-width="2.5" fill="none"/>
        <line x1="42" y1="18" x2="42" y2="30" stroke="#fef08a" stroke-width="2.5"/>
        <circle cx="42" cy="32" r="3" fill="#f59e0b"/>
      </svg>`
    },
    {
      id: 'b2',
      tag: 'New Publications',
      title: 'e-MaziShaala Educational Books',
      subtitle: 'Color guides with QR code video solutions for Class 1 to 10.',
      discountBadge: 'JUST OUT',
      ctaText: 'View Books',
      ctaLink: '/books/bk-std10-ganit-prakash',
      bgGradient: 'bg-gradient-to-r from-teal-700 via-sky-700 to-blue-900',
      doodleSvg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none">
        <path d="M6 10c6-3 12-3 18 2 6-5 12-5 18-2v24c-6-3-12-3-18 2-6-5-12-5-18-2V10z" fill="#38bdf8" fill-opacity="0.4" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
        <line x1="24" y1="12" x2="24" y2="36" stroke="#ffffff" stroke-width="2.5"/>
        <path d="M12 18h6M12 24h6M30 18h6M30 24h6" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'b3',
      tag: 'Free Notes',
      title: 'Download Board Question Papers',
      subtitle: 'Chapter formulas, mind maps, and past board question papers.',
      discountBadge: '100% FREE',
      ctaText: 'Download',
      ctaLink: '/downloads',
      bgGradient: 'bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800',
      doodleSvg: `<svg width="42" height="42" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="6" width="28" height="36" rx="4" fill="#4ade80" fill-opacity="0.3" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="24" cy="22" r="8" fill="#ffffff" fill-opacity="0.3"/>
        <path d="M24 16v12M19 23l5 5 5-5" stroke="#fef08a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="16" y1="34" x2="32" y2="34" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`
    }
  ];

  currentIndex = signal<number>(0);
  private autoSlideTimer: any;

  ngOnInit() {
    this.autoSlideTimer = setInterval(() => {
      this.currentIndex.update(i => (i + 1) % this.banners.length);
    }, 5000);
  }

  ngOnDestroy() {
    if (this.autoSlideTimer) clearInterval(this.autoSlideTimer);
  }

  goTo(idx: number) {
    this.currentIndex.set(idx);
  }

  getSafeHtml(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }
}
