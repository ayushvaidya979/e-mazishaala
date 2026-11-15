import { Injectable, signal, computed } from '@angular/core';
import { DownloadItem, DownloadCategory } from '../../models/download.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private toastService: ToastService) {}

  private readonly downloadsData: DownloadItem[] = [
    {
      id: 'dl-1',
      fileName: 'Class 10 Maths: Linear Equations Handwritten Formula Sheet & PYQs.pdf',
      subject: 'Mathematics',
      standard: 10,
      category: 'pdf_notes',
      fileType: 'PDF',
      fileSize: '4.8 MB',
      downloadsCount: 12400,
      uploadedDate: '02 Nov 2026',
      isDownloaded: true,
      downloadUrl: '#'
    },
    {
      id: 'dl-2',
      fileName: 'Class 10 Science 1: Gravitation & Periodic Classification Mind Maps.pdf',
      subject: 'Science',
      standard: 10,
      category: 'study_material',
      fileType: 'PDF',
      fileSize: '8.2 MB',
      downloadsCount: 9800,
      uploadedDate: '28 Oct 2026',
      isDownloaded: true,
      downloadUrl: '#'
    },
    {
      id: 'dl-3',
      fileName: 'इयत्ता १० वी मराठी: सर्व कवितांचे रसग्रहण व उपयोजित लेखन नमुना.pdf',
      subject: 'Marathi',
      standard: 10,
      category: 'pdf_notes',
      fileType: 'PDF',
      fileSize: '5.1 MB',
      downloadsCount: 8200,
      uploadedDate: '24 Oct 2026',
      isDownloaded: false,
      downloadUrl: '#'
    },
    {
      id: 'dl-4',
      fileName: 'Class 10 Board Exam: 2025 & 2024 Solved Mathematics Papers.pdf',
      subject: 'Mathematics',
      standard: 10,
      category: 'question_paper',
      fileType: 'PDF',
      fileSize: '12.4 MB',
      downloadsCount: 16500,
      uploadedDate: '15 Oct 2026',
      isDownloaded: false,
      downloadUrl: '#'
    },
    {
      id: 'dl-5',
      fileName: 'Class 9 Science: Laws of Motion & Work-Energy Practice Worksheet.docx',
      subject: 'Science',
      standard: 9,
      category: 'worksheet',
      fileType: 'DOCX',
      fileSize: '2.3 MB',
      downloadsCount: 4200,
      uploadedDate: '01 Nov 2026',
      isDownloaded: true,
      downloadUrl: '#'
    },
    {
      id: 'dl-6',
      fileName: 'English Grammar Master Rulebook: Tenses, Voice & Clauses.pdf',
      subject: 'English',
      standard: 8,
      category: 'study_material',
      fileType: 'PDF',
      fileSize: '6.7 MB',
      downloadsCount: 7100,
      uploadedDate: '20 Oct 2026',
      isDownloaded: false,
      downloadUrl: '#'
    },
    {
      id: 'dl-7',
      fileName: 'Sample Preview Chapters: गणित प्रकाश इयत्ता १० वी (e-MaziShaala Edition).pdf',
      subject: 'Mathematics',
      standard: 10,
      category: 'book',
      fileType: 'PDF',
      fileSize: '15.6 MB',
      downloadsCount: 18900,
      uploadedDate: '05 Nov 2026',
      isDownloaded: true,
      downloadUrl: '#'
    }
  ];

  private itemsSignal = signal<DownloadItem[]>(this.downloadsData);
  private selectedCategorySignal = signal<DownloadCategory | 'all'>('all');

  readonly items = this.itemsSignal.asReadonly();
  readonly selectedCategory = this.selectedCategorySignal.asReadonly();

  readonly filteredItems = computed(() => {
    const cat = this.selectedCategorySignal();
    if (cat === 'all') return this.itemsSignal();
    return this.itemsSignal().filter(i => i.category === cat);
  });

  readonly downloadedCount = computed(() =>
    this.itemsSignal().filter(i => i.isDownloaded).length
  );

  setCategory(cat: DownloadCategory | 'all') {
    this.selectedCategorySignal.set(cat);
  }

  startDownload(id: string) {
    const item = this.itemsSignal().find(i => i.id === id);
    if (!item) return;

    if (item.isDownloaded) {
      this.toastService.info(`Opening ${item.fileName}...`);
      return;
    }

    this.toastService.show(`Starting download: ${item.fileName}`, 'info', 'download', 2000);

    // Simulate progress
    let progress = 10;
    this.itemsSignal.update(items =>
      items.map(i => (i.id === id ? { ...i, downloadProgress: progress } : i))
    );

    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        this.itemsSignal.update(items =>
          items.map(i =>
            i.id === id
              ? { ...i, isDownloaded: true, downloadProgress: undefined }
              : i
          )
        );
        this.toastService.success(`Downloaded: ${item.fileName}`);
      } else {
        this.itemsSignal.update(items =>
          items.map(i => (i.id === id ? { ...i, downloadProgress: progress } : i))
        );
      }
    }, 300);
  }

  deleteDownload(id: string) {
    this.itemsSignal.update(items =>
      items.map(i => (i.id === id ? { ...i, isDownloaded: false } : i))
    );
    this.toastService.info('Download removed from local storage');
  }
}

