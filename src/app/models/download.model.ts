export type DownloadCategory = 'pdf_notes' | 'study_material' | 'worksheet' | 'question_paper' | 'book';

export interface DownloadItem {
  id: string;
  fileName: string;
  subject: string;
  standard: number;
  category: DownloadCategory;
  fileType: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  downloadsCount: number;
  uploadedDate: string;
  isDownloaded: boolean;
  downloadProgress?: number; // 0 to 100
  downloadUrl: string;
}

