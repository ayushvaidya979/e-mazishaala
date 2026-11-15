import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../core/services/download.service';
import { DownloadItem, DownloadCategory } from '../../models/download.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule, IconComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f4f8fc]">
      <!-- Header -->
      <section class="bg-white border-b border-slate-200/80 px-3 sm:px-4 py-3.5">
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Downloads & Notes
              </h1>
              <p class="text-[11px] text-slate-500 font-medium">
                Offline PDF notes, worksheets & question papers
              </p>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {{ downloadService.downloadedCount() }} Offline
            </span>
          </div>

          <!-- Category Filter Horizontal Chips -->
          <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 text-[11px]">
            <button
              (click)="onSelectCat('all')"
              class="px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap shadow-2xs"
              [ngClass]="downloadService.selectedCategory() === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'">
              All Files
            </button>
            <button
              (click)="onSelectCat('pdf_notes')"
              class="px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap shadow-2xs"
              [ngClass]="downloadService.selectedCategory() === 'pdf_notes' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'">
              📄 PDF Notes
            </button>
            <button
              (click)="onSelectCat('study_material')"
              class="px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap shadow-2xs"
              [ngClass]="downloadService.selectedCategory() === 'study_material' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'">
              📚 Study Material
            </button>
            <button
              (click)="onSelectCat('worksheet')"
              class="px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap shadow-2xs"
              [ngClass]="downloadService.selectedCategory() === 'worksheet' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'">
              ✏️ Worksheets
            </button>
            <button
              (click)="onSelectCat('question_paper')"
              class="px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap shadow-2xs"
              [ngClass]="downloadService.selectedCategory() === 'question_paper' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'">
              📝 PYQ Papers
            </button>
            <button
              (click)="onSelectCat('book')"
              class="px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap shadow-2xs"
              [ngClass]="downloadService.selectedCategory() === 'book' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'">
              📖 Books
            </button>
          </div>
        </div>
      </section>

      <!-- Main Items List -->
      <main class="py-4 px-3 sm:px-4 flex-1 space-y-2.5">
        @if (downloadService.filteredItems().length > 0) {
          @for (item of downloadService.filteredItems(); track item.id) {
            <div class="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-2.5">
              <div class="flex items-center gap-2.5 min-w-0">
                <span
                  class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] flex-shrink-0"
                  [ngClass]="{
                    'bg-red-100 text-red-700': item.fileType === 'PDF',
                    'bg-blue-100 text-blue-700': item.fileType === 'DOCX',
                    'bg-amber-100 text-amber-700': item.fileType === 'ZIP'
                  }">
                  {{ item.fileType }}
                </span>
                <div class="min-w-0">
                  <h3 class="text-xs font-bold text-slate-900 truncate leading-snug">
                    {{ item.fileName }}
                  </h3>
                  <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                    <span class="font-bold text-sky-800 bg-sky-50 px-1 rounded">Std {{ item.standard }}</span>
                    <span>{{ item.subject }}</span>
                    <span>•</span>
                    <span>{{ item.fileSize }}</span>
                  </div>

                  @if (item.downloadProgress !== undefined) {
                    <div class="w-28 h-1 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                      <div class="h-full bg-sky-500 rounded-full" [style.width]="item.downloadProgress + '%'"></div>
                    </div>
                  }
                </div>
              </div>

              <!-- Action Button -->
              <div class="flex items-center gap-1 flex-shrink-0">
                @if (item.isDownloaded) {
                  <button
                    (click)="onOpenPreview(item)"
                    class="btn-primary !py-1 !px-2.5 text-[11px] font-bold !bg-emerald-600 hover:!bg-emerald-700">
                    Open
                  </button>
                  <button
                    (click)="downloadService.deleteDownload(item.id)"
                    class="p-1 text-slate-400 hover:text-rose-600">
                    <app-icon name="x" [size]="14"></app-icon>
                  </button>
                } @else {
                  <button
                    (click)="downloadService.startDownload(item.id)"
                    [disabled]="item.downloadProgress !== undefined"
                    class="btn-secondary !py-1 !px-2.5 text-[11px] font-bold">
                    <app-icon name="download" [size]="12"></app-icon>
                    <span>{{ item.downloadProgress !== undefined ? '...' : 'Get' }}</span>
                  </button>
                }
              </div>
            </div>
          }
        } @else {
          <div class="bg-white rounded-xl text-center py-12 px-4 border text-xs text-slate-500">
            No files in this category.
          </div>
        }
      </main>

      <!-- Document Preview Modal -->
      @if (previewItem(); as p) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <div class="flex items-center justify-between pb-2 border-b">
              <span class="text-xs font-bold truncate max-w-[200px]">{{ p.fileName }}</span>
              <button (click)="previewItem.set(null)" class="text-slate-400">
                <app-icon name="x" [size]="16"></app-icon>
              </button>
            </div>
            <div class="p-5 bg-slate-50 rounded-xl text-center space-y-2 border">
              <app-icon name="file-text" [size]="36" color="#0284c7"></app-icon>
              <p class="text-xs font-bold text-slate-800">Ready for Offline Reading</p>
              <p class="text-[10px] text-slate-500">Standard {{ p.standard }} • {{ p.fileSize }}</p>
            </div>
            <button (click)="previewItem.set(null)" class="w-full btn-primary !py-2 text-xs font-bold">
              Done Reading
            </button>
          </div>
        </div>
      }

      <app-footer></app-footer>
    </div>
  `
})
export class DownloadsComponent {
  downloadService = inject(DownloadService);
  previewItem = signal<DownloadItem | null>(null);

  onSelectCat(cat: DownloadCategory | 'all') {
    this.downloadService.setCategory(cat);
  }

  onOpenPreview(item: DownloadItem) {
    this.previewItem.set(item);
  }
}
