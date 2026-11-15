import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { BookService } from '../../../core/services/book.service';
import { DownloadService } from '../../../core/services/download.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="relative w-full">
      <!-- Clean Mobile-sized Input Box without quick chips -->
      <div class="relative flex items-center bg-white rounded-xl shadow-xs border border-slate-200 hover:border-sky-400 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all h-10 sm:h-11">
        <div class="pl-3 pr-2 text-slate-400 flex items-center">
          <app-icon name="search" [size]="17" color="#0284c7"></app-icon>
        </div>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearchInput()"
          (focus)="isFocused.set(true)"
          placeholder="Search courses, subjects, books..."
          class="w-full py-2 pr-8 text-xs sm:text-sm bg-transparent text-slate-800 placeholder-slate-400 outline-none font-medium" />
        
        @if (searchQuery) {
          <button
            (click)="clearSearch()"
            class="pr-3 text-slate-400 hover:text-slate-600 transition-colors">
            <app-icon name="x" [size]="15"></app-icon>
          </button>
        }
      </div>

      <!-- Instant Search Results Dropdown -->
      @if (isFocused() && searchQuery.trim().length > 1) {
        <div (click)="isFocused.set(false)" class="fixed inset-0 z-30 bg-transparent"></div>

        <div class="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
          <!-- Courses -->
          @if (matchingCourses().length > 0) {
            <div class="px-3 py-1.5 bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <app-icon name="book-open" [size]="12" color="#0284c7"></app-icon>
              Courses
            </div>
            <div class="p-1 space-y-0.5">
              @for (c of matchingCourses(); track c.id) {
                <a
                  [routerLink]="['/courses', c.id]"
                  (click)="isFocused.set(false)"
                  class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 transition-colors">
                  <img [src]="c.thumbnail" [alt]="c.title" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">{{ c.title }}</p>
                    <p class="text-[10px] text-slate-500">Std {{ c.standard }} • {{ c.instructor.name }}</p>
                  </div>
                  <span class="text-xs font-black text-sky-700 flex-shrink-0">₹{{ c.discountedPrice }}</span>
                </a>
              }
            </div>
          }

          <!-- Books -->
          @if (matchingBooks().length > 0) {
            <div class="px-3 py-1.5 bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <app-icon name="file-text" [size]="12" color="#d97706"></app-icon>
              Publications
            </div>
            <div class="p-1 space-y-0.5">
              @for (b of matchingBooks(); track b.id) {
                <a
                  [routerLink]="['/books', b.id]"
                  (click)="isFocused.set(false)"
                  class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50 transition-colors">
                  <img [src]="b.coverImage" [alt]="b.title" class="w-8 h-10 rounded-md object-cover flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">{{ b.title }}</p>
                    <p class="text-[10px] text-slate-500">Std {{ b.standard }} • {{ b.publisher }}</p>
                  </div>
                  <span class="text-xs font-bold text-slate-800 flex-shrink-0">₹{{ b.price }}</span>
                </a>
              }
            </div>
          }

          <!-- Downloads -->
          @if (matchingDownloads().length > 0) {
            <div class="px-3 py-1.5 bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <app-icon name="download" [size]="12" color="#059669"></app-icon>
              Study Notes
            </div>
            <div class="p-1 space-y-0.5">
              @for (d of matchingDownloads(); track d.id) {
                <a
                  routerLink="/downloads"
                  (click)="isFocused.set(false)"
                  class="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 transition-colors">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-6 h-6 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                      {{ d.fileType }}
                    </span>
                    <p class="text-xs font-semibold text-slate-800 truncate">{{ d.fileName }}</p>
                  </div>
                  <app-icon name="arrow-right" [size]="12" color="#059669"></app-icon>
                </a>
              }
            </div>
          }

          @if (matchingCourses().length === 0 && matchingBooks().length === 0 && matchingDownloads().length === 0) {
            <div class="p-6 text-center text-xs text-slate-500">
              No matching content found for "{{ searchQuery }}"
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SearchBarComponent {
  private courseService = inject(CourseService);
  private bookService = inject(BookService);
  private downloadService = inject(DownloadService);

  searchQuery: string = '';
  isFocused = signal<boolean>(false);

  matchingCourses = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.courseService.courses().filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q)
    ).slice(0, 3);
  });

  matchingBooks = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.bookService.books().filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q)
    ).slice(0, 3);
  });

  matchingDownloads = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.downloadService.items().filter(d =>
      d.fileName.toLowerCase().includes(q)
    ).slice(0, 3);
  });

  onSearchInput() {
    this.courseService.setSearchQuery(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.courseService.setSearchQuery('');
  }
}
