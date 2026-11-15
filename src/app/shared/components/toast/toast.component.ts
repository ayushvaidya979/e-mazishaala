import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl text-sm font-semibold shadow-xl border animate-slide-in backdrop-blur-md transition-all"
          [ngClass]="{
            'bg-emerald-900/90 text-white border-emerald-500/40': toast.type === 'success',
            'bg-sky-950/90 text-white border-sky-500/40': toast.type === 'info',
            'bg-amber-950/90 text-amber-100 border-amber-500/40': toast.type === 'warning',
            'bg-rose-950/90 text-white border-rose-500/40': toast.type === 'error'
          }">
          <app-icon
            [name]="toast.icon || (toast.type === 'success' ? 'check-circle' : 'info')"
            [size]="18"
            [color]="toast.type === 'success' ? '#34d399' : (toast.type === 'warning' ? '#fbbf24' : '#38bdf8')">
          </app-icon>
          <span class="flex-1 text-xs sm:text-sm font-medium">{{ toast.text }}</span>
          <button
            (click)="toastService.remove(toast.id)"
            class="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            <app-icon name="x" [size]="14"></app-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-12px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .animate-slide-in {
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}

