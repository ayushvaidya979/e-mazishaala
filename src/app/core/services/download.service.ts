import { Injectable, signal, computed, inject } from '@angular/core';
import { DownloadItem, DownloadCategory } from '../../models/download.model';
import { ToastService } from './toast.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private toastService = inject(ToastService);
  private supabaseService = inject(SupabaseService);
  private readonly supabase = this.supabaseService.supabase;

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

  constructor() {
    this.loadMaterialsFromSupabase();
  }

  private async loadMaterialsFromSupabase() {
    try {
      const { data: dbMaterials, error } = await this.supabase
        .from('study_materials')
        .select('*');

      if (!error && dbMaterials && dbMaterials.length > 0) {
        const mapped: DownloadItem[] = dbMaterials.map(db => {
          const existing = this.downloadsData.find(d => d.id === db.id);
          return {
            id: db.id,
            fileName: db.file_name,
            subject: db.subject,
            standard: db.standard,
            category: db.category as DownloadCategory,
            fileType: db.file_type as 'PDF' | 'DOCX' | 'ZIP',
            fileSize: db.file_size || '2.5 MB',
            downloadsCount: db.downloads_count || 100,
            uploadedDate: new Date(db.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            isDownloaded: existing?.isDownloaded || false,
            downloadUrl: db.download_url
          };
        });

        const merged = [...mapped];
        for (const local of this.downloadsData) {
          if (!merged.find(m => m.id === local.id)) {
            merged.push(local);
          }
        }
        this.itemsSignal.set(merged);
      }
    } catch {
      // Offline fallback
    }
  }

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

        // Sync download record to Supabase if logged in
        this.supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            this.supabase.from('user_downloads').upsert(
              { user_id: session.user.id, material_id: id },
              { onConflict: 'user_id,material_id' }
            ).then(
              () => {},
              (err: any) => console.warn('Could not sync download to Supabase:', err)
            );
          }
        });
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

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        this.supabase
          .from('user_downloads')
          .delete()
          .eq('user_id', session.user.id)
          .eq('material_id', id)
          .then(
            () => {},
            (err: any) => console.warn('Could not remove download in Supabase:', err)
          );
      }
    });
  }
}

