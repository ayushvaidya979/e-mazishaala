import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Book } from '../../../models/book.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between overflow-hidden group w-[150px] sm:w-[165px] flex-shrink-0">
      <!-- Mini Book Cover -->
      <div class="relative w-full h-36 bg-gradient-to-tr from-slate-100 to-sky-50 flex items-center justify-center p-2.5 overflow-hidden">
        <div class="relative w-22 h-30 rounded-r-md rounded-l-xs overflow-hidden shadow-md group-hover:scale-105 transition-transform">
          <img
            [src]="book.coverImage"
            [alt]="book.title"
            class="w-full h-full object-cover" />
          <div class="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
        </div>

        <!-- Status Badge -->
        <div class="absolute top-1.5 left-1.5">
          @if (book.publicationStatus === 'published') {
            <span class="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-2xs">
              Published
            </span>
          } @else {
            <span class="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-2xs">
              Soon
            </span>
          }
        </div>

        <!-- Std Badge -->
        <div class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-xs">
          Std {{ book.standard }}
        </div>
      </div>

      <!-- Book Body -->
      <div class="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <span class="text-[9px] font-bold text-sky-700 block uppercase">{{ book.subject }}</span>
          <h4 class="text-xs font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors">
            <a [routerLink]="['/books', book.id]">{{ book.title }}</a>
          </h4>
          <p class="text-[9px] text-slate-400 mt-0.5 truncate">{{ book.publisher }}</p>
        </div>

        <!-- Price & Action -->
        <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 mt-auto">
          <div>
            @if (book.publicationStatus === 'published') {
              <div class="flex items-baseline gap-0.5">
                <span class="text-xs font-black text-slate-900">₹{{ book.price }}</span>
                <span class="text-[9px] text-slate-400 line-through">₹{{ book.originalPrice }}</span>
              </div>
            } @else {
              <span class="text-[9px] font-bold text-amber-600">Upcoming</span>
            }
          </div>

          <a
            [routerLink]="['/books', book.id]"
            class="btn-secondary !py-0.8 !px-2 text-[10px] font-bold">
            View
          </a>
        </div>
      </div>
    </div>
  `
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;
  private toastService = inject(ToastService);
  private router = inject(Router);

  onBuyNow(e: Event) {
    e.stopPropagation();
    this.toastService.success(`Added "${this.book.title}" to order basket!`);
    this.router.navigate(['/books', this.book.id]);
  }
}
