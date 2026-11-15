import { Injectable, signal, computed, inject } from '@angular/core';
import { Book } from '../../models/book.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly booksData: Book[] = [
    {
      id: 'bk-std10-ganit-prakash',
      title: 'गणित प्रकाश: Standard 10 Mathematics Comprehensive Guide',
      subtitle: 'Complete Theory, Exemplar Problems, 10-Year Solved Board Papers & Formula Handbook',
      standard: 10,
      subject: 'Mathematics',
      author: 'Prof. Rahul Deshmukh & Expert Faculty',
      publisher: 'e-MaziShaala Publications',
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
      price: 349,
      originalPrice: 499,
      publicationStatus: 'published',
      releaseDate: 'October 2026',
      pages: 420,
      edition: '1st Edition (2026-27)',
      isbn: '978-93-89123-01-4',
      isBestseller: true,
      description: 'An authoritative, student-friendly textbook designed by senior examiners to help Standard 10 students achieve 95%+ in Mathematics. Includes bilingual Marathi-English explanations for complex theorems and 1,500+ solved practice problems.',
      tableOfContents: [
        'Linear Equations in Two Variables (Graphical & Algebraic)',
        'Quadratic Equations & Discriminant Applications',
        'Arithmetic Progression & Financial Mathematics',
        'Similarity of Triangles & Pythagoras Theorem',
        'Coordinate Geometry & Trigonometric Identities',
        'Mensuration, Surface Areas & Volumes',
        'Statistics and Probability with Model Answers'
      ],
      highlights: [
        '100% aligned with latest Maharashtra State Board syllabus',
        'Step-by-step solutions for all Textbook Practice Sets',
        'QR codes for free video solution explanations on mobile',
        'Special section: 50 High-Yield Board Exam Theorem Proofs'
      ]
    },
    {
      id: 'bk-std10-vigyan-setu',
      title: 'विज्ञान सेतू: Standard 10 Science & Technology Hand-Guide',
      subtitle: 'Part 1 & Part 2 with 3D Color Diagrams, Experiment Notes & Answer Blueprints',
      standard: 10,
      subject: 'Science',
      author: 'Dr. Snehal Patil & Team',
      publisher: 'e-MaziShaala Publications',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
      price: 379,
      originalPrice: 520,
      publicationStatus: 'published',
      releaseDate: 'September 2026',
      pages: 460,
      edition: '1st Edition (2026-27)',
      isbn: '978-93-89123-02-1',
      isBestseller: true,
      description: 'Simplifying complex Physics laws, Chemical equations, and Biological cycles. Features crisp memory maps, distinction tables, and practical exam blueprints.',
      tableOfContents: [
        'Part 1: Gravitation & Periodic Classification of Elements',
        'Part 1: Chemical Reactions, Heat & Refraction of Light',
        'Part 1: Lenses, Metallurgy & Carbon Compounds',
        'Part 2: Heredity, Evolution & Life Processes in Living Organisms',
        'Part 2: Environmental Management & Animal Classification',
        'Part 2: Disaster Management & Space Missions'
      ],
      highlights: [
        'Over 300 clean, board-standard labeled diagrams',
        'Model answers written in points format preferred by board checkers',
        'Reaction charts & chemical formula cheatsheet included',
        'Practical journal guidelines and viva questions'
      ]
    },
    {
      id: 'bk-std9-marathi-sahitya',
      title: 'मराठी सुलभभारती संपूर्ण मार्गदर्शिका: इयत्ता ९ वी',
      subtitle: 'गद्य, पद्य, स्थूलवाचन, सविस्तर शब्दार्थ, भावार्थ व उपयोजित व्याकरण',
      standard: 9,
      subject: 'Marathi',
      author: 'Mrs. Anjali Kulkarni',
      publisher: 'e-MaziShaala Publications',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      price: 299,
      originalPrice: 399,
      publicationStatus: 'published',
      releaseDate: 'August 2026',
      pages: 310,
      edition: '1st Edition',
      isbn: '978-93-89123-03-8',
      description: 'इयत्ता ९ वी च्या विद्यार्थ्यांसाठी मराठी भाषेवर प्रभुत्व मिळवून देणारे परिपूर्ण पुस्तक. सर्व धडे व कवितांचा भावार्थ, रसग्रहण, आणि १०० हून अधिक नमुना निबंध व पत्रलेखन.',
      tableOfContents: [
        'गद्य विभाग: सर्व पाठांचा सविस्तर आशय व स्वाध्याय उत्तरे',
        'पद्य विभाग: कवितांचे सोपे भावार्थ व रसग्रहण मुद्दे',
        'स्थूलवाचन: चरित्र व वर्णनात्मक लेखांचा अभ्यास',
        'भाषाभ्यास व व्याकरण: काळ, समास, विरामचिन्हे, वाक्यरूपांतर',
        'उपयोजित लेखन: निबंध, सारांश, जाहिरात व बातमी लेखन'
      ],
      highlights: [
        'सुलभ व रसाळ मराठी भाषेत मांडणी',
        'परीक्षोपयोगी प्रश्नोत्तरांची अचूक रचना',
        'व्याकरणाची सोपी उदाहरणे व सराव संच'
      ]
    },
    {
      id: 'bk-std8-english-spark',
      title: 'English Grammar & Writing Craftsman: Standard 8',
      subtitle: 'Master Vocabulary, Creative Composition, Comprehension & Spoken Idioms',
      standard: 8,
      subject: 'English',
      author: 'Mr. Sachin Shinde',
      publisher: 'e-MaziShaala Publications',
      coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      price: 269,
      originalPrice: 380,
      publicationStatus: 'published',
      releaseDate: 'November 2026',
      pages: 280,
      edition: '1st Edition',
      isbn: '978-93-89123-04-5',
      description: 'Build lifelong confidence in English. Contains real-world comprehension passages, story-building prompts, letter & email drafting frameworks, and rule-based grammar exercises.',
      tableOfContents: [
        'Parts of Speech in Action & Common Sentence Errors',
        'Tenses, Modals and Conditional Clauses',
        'Active & Passive Voice, Reported Speech',
        'Unseen Passage Comprehension Strategies',
        'Creative Writing: Essays, Letters, Diary Entries & Speeches'
      ],
      highlights: [
        'Over 500 interactive grammar practice questions',
        'Visual mind-maps for grammatical tenses',
        'Vocabulary booster: 300 high-frequency words with sentences'
      ]
    },
    {
      id: 'bk-std10-itihaas-sparsh',
      title: 'इतिहास व राज्यशास्त्र: इयत्ता १० वी संक्षिप्त संदर्भग्रंथ',
      subtitle: 'ऐतिहासिक संकल्पना चित्रे, कालरेषा, नकाशे व बोर्ड प्रश्नोत्तरे',
      standard: 10,
      subject: 'Social Science',
      author: 'Prof. Dinkar Sawant',
      publisher: 'e-MaziShaala Publications',
      coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
      price: 280,
      originalPrice: 399,
      publicationStatus: 'coming_soon',
      releaseDate: 'Coming Jan 2027',
      pages: 340,
      edition: 'First Edition (Pre-Order)',
      isbn: '978-93-89123-05-2',
      description: 'इयत्ता १० वीच्या बोर्ड परीक्षेसाठी इतिहास, राज्यशास्त्र आणि भूगोलाची संपूर्ण उजळणी देणारे रंगीत पुस्तक. ऐतिहासिक घटनांची कालरेषा (Timelines) आणि नकाशा वाचनाचे विशेष तंत्र यात समाविष्ट आहे.',
      tableOfContents: [
        'इतिहासलेखन: पाश्चात्त्य आणि भारतीय परंपरा',
        'उपयोजित इतिहास व प्रसारमाध्यमे',
        'मनोरंजनाची माध्यमे आणि क्रीडा',
        'राज्यशास्त्र: संविधानाची वाटचाल व निवडणूक प्रक्रिया',
        'राजकीय पक्ष व सामाजिक चळवळी'
      ],
      highlights: [
        'प्रत्येक पाठाचा १ पानात Quick Revision Chart',
        'नकाशा व कालरेषा स्पष्ट करणारे रंगीत आलेख',
        'बोर्ड परीक्षेसाठी संभाव्य ५०० वस्तुनिष्ठ प्रश्न'
      ]
    },
    {
      id: 'bk-std6-junior-vigyan',
      title: 'Little Scientist Activity Book: Standard 6 & 7',
      subtitle: '50 Safe Home Experiments, Science Puzzles, Crosswords & Fun Projects',
      standard: 6,
      subject: 'Science',
      author: 'Dr. Snehal Patil',
      publisher: 'e-MaziShaala Publications',
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      price: 240,
      originalPrice: 350,
      publicationStatus: 'coming_soon',
      releaseDate: 'Coming Feb 2027',
      pages: 200,
      edition: 'First Edition',
      isbn: '978-93-89123-06-9',
      description: 'Turn everyday objects into exciting scientific instruments! A hands-on activity companion packed with safe home experiments, observation diaries, and science quizzes for middle schoolers.',
      tableOfContents: [
        'Kitchen Chemistry: Acids, Bases & Color Changes',
        'Physics with Toys: Levers, Magnets and Pulleys',
        'Plant World: Seed Germination & Leaf Chromatography',
        'Weather Station at Home: Barometer & Rain Gauges',
        'Fun Science Crosswords and Mind Teasers'
      ],
      highlights: [
        '100% kid-safe home activity guides',
        'Full color illustrations with cartoon mascots',
        'Observation charts and sticker rewards'
      ]
    }
  ];

  private supabaseService = inject(SupabaseService);
  private readonly supabase = this.supabaseService.supabase;

  private booksSignal = signal<Book[]>(this.booksData);
  private selectedStandardSignal = signal<number | null>(null);

  readonly books = this.booksSignal.asReadonly();
  readonly selectedStandard = this.selectedStandardSignal.asReadonly();

  constructor() {
    this.loadBooksFromSupabase();
    this.initRealtimeSubscription();
  }

  private initRealtimeSubscription() {
    try {
      this.supabase
        .channel('user-books-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
          this.loadBooksFromSupabase();
        })
        .subscribe();
    } catch {}
  }

  private async loadBooksFromSupabase() {
    try {
      const { data: dbBooks, error } = await this.supabase
        .from('books')
        .select('*');

      if (!error && dbBooks && dbBooks.length > 0) {
        const mapped: Book[] = dbBooks.map(db => {
          const existing = this.booksData.find(b => b.id === db.id);
          return {
            id: db.id,
            title: db.title,
            subtitle: db.subtitle || existing?.subtitle || '',
            standard: db.standard || 10,
            subject: db.subject || db.category || 'General',
            author: db.author,
            publisher: db.publisher || 'e-MaziShaala Publications',
            coverImage: db.cover_image || db.cover_image_url || existing?.coverImage || '',
            price: Number(db.price) || 0,
            originalPrice: Number(db.original_price) || 0,
            publicationStatus: (db.publication_status || (db.is_published ? 'published' : 'coming_soon')) as 'published' | 'coming_soon',
            releaseDate: db.release_date || existing?.releaseDate,
            pages: db.pages || 100,
            edition: db.edition || '2025 Revised Edition',
            isbn: db.isbn || existing?.isbn || '',
            description: db.description || db.full_description || existing?.description || '',
            tableOfContents: (db.table_of_contents as string[]) || existing?.tableOfContents || [],
            highlights: (db.highlights as string[]) || existing?.highlights || [],
            isBestseller: db.is_bestseller ?? db.is_featured ?? false
          };
        });

        const merged = [...mapped];
        for (const local of this.booksData) {
          if (!merged.find(m => m.id === local.id)) {
            merged.push(local);
          }
        }
        this.booksSignal.set(merged);
      }
    } catch {
      // Offline fallback
    }
  }

  readonly publishedBooks = computed(() =>
    this.booksSignal().filter(b => b.publicationStatus === 'published')
  );

  readonly comingSoonBooks = computed(() =>
    this.booksSignal().filter(b => b.publicationStatus === 'coming_soon')
  );

  readonly filteredBooks = computed(() => {
    const std = this.selectedStandardSignal();
    if (std === null) return this.booksSignal();
    return this.booksSignal().filter(b => b.standard === std);
  });

  setStandardFilter(std: number | null) {
    this.selectedStandardSignal.set(std);
  }

  getBookById(id: string): Book | undefined {
    return this.booksSignal().find(b => b.id === id);
  }
}

