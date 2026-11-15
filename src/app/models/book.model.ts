export interface Book {
  id: string;
  title: string;
  subtitle: string;
  standard: number; // 1 to 10
  subject: string;
  author: string;
  publisher: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  publicationStatus: 'published' | 'coming_soon';
  releaseDate?: string;
  pages: number;
  edition: string;
  isbn: string;
  description: string;
  tableOfContents: string[];
  highlights: string[];
  isBestseller?: boolean;
}

