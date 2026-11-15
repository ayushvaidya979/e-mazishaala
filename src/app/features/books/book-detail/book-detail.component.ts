import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../models/book.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ToastService } from '../../../core/services/toast.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f4f8fc]">
      @if (book(); as b) {
        <main class="py-4 px-3 sm:px-4 space-y-4 flex-1">
          <!-- Back Link -->
          <div class="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <a routerLink="/" class="flex items-center gap-1 text-sky-600">
              <app-icon name="arrow-right" [size]="12" extraClass="rotate-180"></app-icon>
              <span>Back to Home</span>
            </a>
          </div>

          <!-- Book Cover & Badges Center -->
          <div class="flex flex-col items-center text-center space-y-3">
            <div class="relative w-36 h-48 rounded-r-xl rounded-l-xs overflow-hidden shadow-xl border border-slate-200">
              <img [src]="b.coverImage" [alt]="b.title" class="w-full h-full object-cover" />
              <div class="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 to-transparent"></div>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-sky-100 text-sky-800">
                Std {{ b.standard }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-800 border">
                {{ b.subject }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {{ b.publicationStatus === 'published' ? 'In Print' : 'Coming Soon' }}
              </span>
            </div>

            <h1 class="text-base sm:text-lg font-black text-slate-900 leading-snug max-w-sm">
              {{ b.title }}
            </h1>

            <p class="text-xs text-slate-500 max-w-sm leading-relaxed">
              {{ b.subtitle }}
            </p>
          </div>

          <!-- Price & Buy Box -->
          <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-xl font-black text-slate-900">₹{{ b.price }}</span>
                @if (b.originalPrice > b.price) {
                  <span class="text-xs text-slate-400 line-through">₹{{ b.originalPrice }}</span>
                }
              </div>
              <span class="text-[9px] font-bold text-emerald-600">Free delivery across MH</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                (click)="showSampleModal.set(true)"
                class="btn-secondary !py-2 !px-2.5 text-xs font-bold">
                Sample
              </button>
              @if (b.publicationStatus === 'published') {
                <button
                  (click)="onBuyBook(b)"
                  class="btn-accent !py-2 !px-4 text-xs font-black">
                  Buy Now
                </button>
              } @else {
                <button
                  (click)="onPreOrderBook(b)"
                  class="btn-primary !py-2 !px-3.5 text-xs font-bold">
                  Pre-Order
                </button>
              }
            </div>
          </div>

          <!-- Metadata -->
          <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs">
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block">Author</span>
              <span class="font-bold text-slate-800 truncate block">{{ b.author }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block">Publisher</span>
              <span class="font-bold text-slate-800 truncate block">{{ b.publisher }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block">Pages</span>
              <span class="font-bold text-slate-800">{{ b.pages }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block">ISBN</span>
              <span class="font-bold text-slate-800">{{ b.isbn }}</span>
            </div>
          </div>

          <!-- Table of contents -->
          <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
            <h3 class="text-xs font-black uppercase text-slate-500 tracking-wider">Chapters & Content</h3>
            <ul class="space-y-1.5 text-xs text-slate-700">
              @for (chap of b.tableOfContents; track chap; let idx = $index) {
                <li class="flex items-start gap-2">
                  <span class="w-4 h-4 rounded-full bg-sky-100 text-sky-800 font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {{ idx + 1 }}
                  </span>
                  <span>{{ chap }}</span>
                </li>
              }
            </ul>
          </div>
        </main>
      }

      <!-- Sample PDF Modal -->
      @if (showSampleModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
          <div class="bg-white rounded-2xl p-4 max-w-xs w-full shadow-2xl space-y-3">
            <div class="flex items-center justify-between pb-2 border-b">
              <span class="text-xs font-bold">Sample Preview</span>
              <button (click)="showSampleModal.set(false)" class="text-slate-400">
                <app-icon name="x" [size]="16"></app-icon>
              </button>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl text-center space-y-1.5 border">
              <app-icon name="book-open" [size]="32" color="#0284c7"></app-icon>
              <p class="text-xs font-bold text-slate-800">Chapter 1 Free Sample</p>
              <p class="text-[10px] text-slate-500">Available for instant mobile reading.</p>
            </div>
            <button (click)="onDownloadSample()" class="w-full btn-primary !py-2 text-xs font-bold">
              Download Sample PDF
            </button>
          </div>
        </div>
      }

      <app-footer></app-footer>
    </div>
  `
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private toastService = inject(ToastService);

  book = signal<Book | undefined>(undefined);
  showSampleModal = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.book.set(this.bookService.getBookById(id));
      }
    });
  }

  onBuyBook(b: Book) {
    this.toastService.success(`Added "${b.title}" to orders!`);
  }

  onPreOrderBook(b: Book) {
    this.toastService.success(`Pre-order registered for "${b.title}"!`);
  }

  onDownloadSample() {
    this.showSampleModal.set(false);
    this.toastService.success('Sample preview chapter downloaded!');
  }
}
