import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-standard-doodle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-8 h-8 rounded-xl flex items-center justify-center p-1 transition-transform group-hover:scale-110 shadow-2xs"
      [style.background]="bgGradient()"
      [innerHTML]="doodleSvg()">
    </div>
  `
})
export class StandardDoodleComponent {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) standard: number = 10;

  bgGradient = computed(() => {
    switch (this.standard) {
      case 1: return 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)';
      case 2: return 'linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)';
      case 3: return 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)';
      case 4: return 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)';
      case 5: return 'linear-gradient(135deg, #bbf7d0 0%, #4ade80 100%)';
      case 6: return 'linear-gradient(135deg, #a5f3fc 0%, #38bdf8 100%)';
      case 7: return 'linear-gradient(135deg, #bae6fd 0%, #60a5fa 100%)';
      case 8: return 'linear-gradient(135deg, #ddd6fe 0%, #818cf8 100%)';
      case 9: return 'linear-gradient(135deg, #c7d2fe 0%, #6366f1 100%)';
      case 10:
      default: return 'linear-gradient(135deg, #fef08a 0%, #f59e0b 100%)';
    }
  });

  doodleSvg = computed<SafeHtml>(() => {
    let svg = '';
    switch (this.standard) {
      case 1:
        // Std 1: Cute School Bag Doodle 🎒
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#854d0e" stroke-width="2" stroke-linecap="round"/>
          <rect x="5" y="8" width="14" height="13" rx="3" fill="#ea580c"/>
          <rect x="8" y="11" width="8" height="6" rx="1.5" fill="#fde047"/>
          <circle cx="12" cy="14" r="1" fill="#854d0e"/>
        </svg>`;
        break;

      case 2:
        // Std 2: Cute Pencil & Sparkle Doodle ✏️
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M18 2l4 4-13 13H5v-4L18 2z" fill="#f59e0b" stroke="#78350f" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M15 5l4 4" stroke="#ffffff" stroke-width="1.5"/>
          <path d="M5 19l4-1-3-3-1 4z" fill="#78350f"/>
          <polygon points="4,4 5,2 6,4 8,5 6,6 5,8 4,6 2,5" fill="#dc2626"/>
        </svg>`;
        break;

      case 3:
        // Std 3: Art Palette Doodle 🎨
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C6.5 3 2 7.2 2 12.5c0 3 1.8 5.5 4.5 5.5 1.5 0 2-.8 2-1.5 0-.7.3-1.5 1.5-1.5H12c4.4 0 8-3.6 8-8S16.4 3 12 3z" fill="#ec4899" stroke="#831843" stroke-width="1.5"/>
          <circle cx="7" cy="8" r="1.5" fill="#facc15"/>
          <circle cx="11" cy="6" r="1.5" fill="#38bdf8"/>
          <circle cx="16" cy="9" r="1.5" fill="#4ade80"/>
          <circle cx="15" cy="14" r="1.5" fill="#ffffff"/>
        </svg>`;
        break;

      case 4:
        // Std 4: Math Abacus / Number Blocks 🧮
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="2" fill="#9333ea" stroke="#581c87" stroke-width="1.5"/>
          <line x1="4" y1="9" x2="20" y2="9" stroke="#ffffff" stroke-width="1.5"/>
          <line x1="4" y1="15" x2="20" y2="15" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="8" cy="9" r="2" fill="#fde047"/>
          <circle cx="14" cy="9" r="2" fill="#38bdf8"/>
          <circle cx="10" cy="15" r="2" fill="#4ade80"/>
          <circle cx="16" cy="15" r="2" fill="#f43f5e"/>
        </svg>`;
        break;

      case 5:
        // Std 5: Seedling & Discovery Doodle 🌱
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 21V11" stroke="#166534" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M12 11c0-4 4-6 7-6 0 4-2 7-7 7z" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>
          <path d="M12 14c0-3-3-5-6-5 0 3 2 6 6 6z" fill="#4ade80" stroke="#14532d" stroke-width="1.5"/>
          <path d="M4 21h16" stroke="#854d0e" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`;
        break;

      case 6:
        // Std 6: Science Flask Doodle 🔬
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M10 2h4" stroke="#0e7490" stroke-width="2" stroke-linecap="round"/>
          <path d="M10 2v5l-5.5 11c-.8 1.6.4 3 2.2 3h10.6c1.8 0 3-1.4 2.2-3L14 7V2" fill="#06b6d4" stroke="#0e7490" stroke-width="1.5"/>
          <path d="M6.5 16h11" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
          <circle cx="10" cy="18" r="1" fill="#fde047"/>
          <circle cx="13" cy="17" r="1.2" fill="#ffffff"/>
        </svg>`;
        break;

      case 7:
        // Std 7: Planet & Solar Orbit Doodle 🌍
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="7" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
          <path d="M8 12c1.5 2 4 2 5-1s3-1 4 1" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#facc15" stroke-width="1.5" transform="rotate(-25 12 12)"/>
        </svg>`;
        break;

      case 8:
        // Std 8: Math Geometry Compass & Triangle 📐
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 19L19 19L19 4L4 19Z" fill="#818cf8" stroke="#4338ca" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M8 19L19 8" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="12" cy="6" r="2" fill="#fde047" stroke="#4338ca" stroke-width="1"/>
          <line x1="12" y1="8" x2="6" y2="19" stroke="#4338ca" stroke-width="1.5"/>
        </svg>`;
        break;

      case 9:
        // Std 9: Atom & Rocket Science Doodle 🚀
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#4f46e5" stroke-width="1.5" transform="rotate(30 12 12)"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#4f46e5" stroke-width="1.5" transform="rotate(-30 12 12)"/>
          <circle cx="12" cy="12" r="3" fill="#f43f5e"/>
          <circle cx="12" cy="12" r="1.5" fill="#fde047"/>
        </svg>`;
        break;

      case 10:
      default:
        // Std 10: Golden Graduation Cap & Board Exam Topper Medal 🎓
        svg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#1e3a8a" stroke="#d97706" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M6 10.5v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" stroke="#1e3a8a" stroke-width="1.5" fill="none"/>
          <line x1="22" y1="8" x2="22" y2="14" stroke="#d97706" stroke-width="1.5"/>
          <circle cx="22" cy="14.5" r="1.5" fill="#d97706"/>
          <circle cx="12" cy="8" r="1" fill="#fde047"/>
        </svg>`;
        break;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}

