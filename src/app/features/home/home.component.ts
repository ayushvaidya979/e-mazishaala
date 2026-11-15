import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { BannerCarouselComponent } from '../../shared/components/banner-carousel/banner-carousel.component';
import { StandardCardComponent, StandardInfo } from '../../shared/components/standard-card/standard-card.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchBarComponent,
    BannerCarouselComponent,
    StandardCardComponent,
    CourseCardComponent,
    BookCardComponent,
    IconComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f4f8fc]">
      <!-- Top Search & Greeting Section -->
      <section class="bg-gradient-to-b from-sky-50 via-white to-transparent pt-3.5 pb-2 px-3 sm:px-4">
        <div class="space-y-3">
          <!-- Personalized Greeting -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{{ greeting() }}, {{ studentName() }}!</span>
                <span class="text-base">👋</span>
              </h1>
              <p class="text-[11px] text-slate-500 font-medium">
                Welcome back! What would you like to learn today?
              </p>
            </div>

            <!-- Active Standard Indicator -->
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[11px] font-black text-slate-800">Std {{ activeStandard() }}</span>
            </div>
          </div>

          <!-- Clean Search Bar -->
          <app-search-bar></app-search-bar>
        </div>
      </section>

      <!-- Main Mobile Sections Flow -->
      <main class="space-y-6 py-3 px-3 sm:px-4 flex-1">
        <!-- 5.C. Promotional Banner / Offers Carousel -->
        <section aria-label="Promotional Offers">
          <app-banner-carousel></app-banner-carousel>
        </section>

        <!-- 5.D. Browse by Standard: "Explore Your Class" (Horizontal Snap Scroll) -->
        <section id="classes" class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Explore Your Class</span>
                <span class="brand-marathi text-xs text-sky-600 font-bold">(आपली इयत्ता निवडा)</span>
              </h2>
              <p class="text-[10px] text-slate-400 font-medium">Click Std 1 to 10 for Syllabus, Lectures, Notes & Tests</p>
            </div>
          </div>

          <!-- 10 Standards Horizontal Snap Scroll with Doodles -->
          <div class="snap-scroll-x hide-scrollbar">
            @for (std of standardsList; track std.number) {
              <app-standard-card
                [standard]="std"
                [isSelected]="selectedStdFilter() === std.number"
                (selected)="onStandardSelected($event)">
              </app-standard-card>
            }
          </div>
        </section>

        <!-- Active Filter Alert Bar -->
        @if (selectedStdFilter() !== null) {
          <div class="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
            <span class="font-bold text-sky-900 text-[11px]">
              Showing Standard {{ selectedStdFilter() }} Courses & Books
            </span>
            <button
              (click)="clearStandardFilter()"
              class="text-[10px] font-black text-sky-700 underline">
              Show All
            </button>
          </div>
        }

        <!-- 5.E. Upcoming Courses Section (Horizontal Snap Cards) -->
        <section class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>Upcoming Batches</span>
              </h2>
              <p class="text-[10px] text-slate-400 font-medium">New academic batches starting soon</p>
            </div>
            <a
              routerLink="/my-courses"
              class="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5">
              <span>See All</span>
              <app-icon name="arrow-right" [size]="11"></app-icon>
            </a>
          </div>

          <div class="snap-scroll-x hide-scrollbar">
            @for (course of upcomingCoursesList(); track course.id) {
              <app-course-card [course]="course"></app-course-card>
            }
          </div>
        </section>

        <!-- 5.F. Popular Courses Section (Horizontal Snap Cards) -->
        <section class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Popular Courses</span>
              </h2>
              <p class="text-[10px] text-slate-400 font-medium">Highest rated by school students</p>
            </div>
            <a
              routerLink="/my-courses"
              class="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5">
              <span>View All</span>
              <app-icon name="arrow-right" [size]="11"></app-icon>
            </a>
          </div>

          <div class="snap-scroll-x hide-scrollbar">
            @for (course of popularCoursesList(); track course.id) {
              <app-course-card [course]="course"></app-course-card>
            }
          </div>
        </section>

        <!-- 5.G. Educational Books: "Our Books & Publications" -->
        <section class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Our Publications</span>
              </h2>
              <p class="text-[10px] text-slate-400 font-medium">Official Std 1–10 books & workbooks</p>
            </div>

            <!-- Mini category filter -->
            <div class="inline-flex p-0.5 rounded-lg bg-slate-200/80 text-[10px] font-bold">
              <button
                (click)="bookCategoryFilter.set('all')"
                class="px-2 py-0.5 rounded-md transition-all"
                [ngClass]="bookCategoryFilter() === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'">
                All
              </button>
              <button
                (click)="bookCategoryFilter.set('published')"
                class="px-2 py-0.5 rounded-md transition-all"
                [ngClass]="bookCategoryFilter() === 'published' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'">
                Published
              </button>
              <button
                (click)="bookCategoryFilter.set('coming_soon')"
                class="px-2 py-0.5 rounded-md transition-all"
                [ngClass]="bookCategoryFilter() === 'coming_soon' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'">
                Soon
              </button>
            </div>
          </div>

          <!-- Horizontal Scrolling Book Cards -->
          <div class="snap-scroll-x hide-scrollbar">
            @for (book of displayedBooks(); track book.id) {
              <app-book-card [book]="book"></app-book-card>
            }
          </div>
        </section>

        <!-- 5.H. Why Choose e-MaziShaala? Section -->
        <section class="py-5 px-4 rounded-2xl bg-gradient-to-br from-sky-900 via-sky-800 to-blue-950 text-white shadow-md space-y-4">
          <div class="text-center space-y-1">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/10 text-amber-300 border border-white/20">
              <app-icon name="shield" [size]="11" color="#fef08a"></app-icon>
              Trusted by 50,000+ Students
            </span>
            <h3 class="text-sm sm:text-base font-extrabold tracking-tight">
              Why Choose e-MaziShaala?
            </h3>
            <p class="text-[10px] text-sky-200">
              Concept-first learning designed for school students
            </p>
          </div>

          <div class="grid grid-cols-2 gap-2.5 text-left">
            <div class="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <app-icon name="award" [size]="16" color="#fcd34d"></app-icon>
              <h4 class="text-xs font-bold text-white">Expert Teachers</h4>
              <p class="text-[10px] text-sky-100 leading-tight">State awardee senior faculty</p>
            </div>

            <div class="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <app-icon name="file-text" [size]="16" color="#38bdf8"></app-icon>
              <h4 class="text-xs font-bold text-white">Quality Notes</h4>
              <p class="text-[10px] text-sky-100 leading-tight">10-year solved board PYQs</p>
            </div>

            <div class="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <app-icon name="video" [size]="16" color="#f87171"></app-icon>
              <h4 class="text-xs font-bold text-white">Live Classes</h4>
              <p class="text-[10px] text-sky-100 leading-tight">Interactive doubt solving</p>
            </div>

            <div class="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <app-icon name="play" [size]="16" color="#34d399"></app-icon>
              <h4 class="text-xs font-bold text-white">Recordings</h4>
              <p class="text-[10px] text-sky-100 leading-tight">Watch lectures anytime</p>
            </div>

            <div class="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <app-icon name="sparkles" [size]="16" color="#fbbf24"></app-icon>
              <h4 class="text-xs font-bold text-white">Affordable</h4>
              <p class="text-[10px] text-sky-100 leading-tight">Minimal monthly fee</p>
            </div>

            <div class="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <app-icon name="home" [size]="16" color="#a78bfa"></app-icon>
              <h4 class="text-xs font-bold text-white">Offline Ready</h4>
              <p class="text-[10px] text-sky-100 leading-tight">Download to phone</p>
            </div>
          </div>
        </section>
      </main>

      <!-- 5.I. Compact Mobile Footer -->
      <app-footer></app-footer>
    </div>
  `
})
export class HomeComponent {
  private router = inject(Router);
  private courseService = inject(CourseService);
  private bookService = inject(BookService);
  authService = inject(AuthService);

  readonly standardsList: StandardInfo[] = [
    { number: 1, label: 'Std 1', marathiLabel: 'इयत्ता १ ली', category: 'Primary', themeColor: '#10b981', iconName: 'sparkles', coursesCount: 2, booksCount: 1 },
    { number: 2, label: 'Std 2', marathiLabel: 'इयत्ता २ री', category: 'Primary', themeColor: '#10b981', iconName: 'book-open', coursesCount: 2, booksCount: 1 },
    { number: 3, label: 'Std 3', marathiLabel: 'इयत्ता ३ री', category: 'Primary', themeColor: '#10b981', iconName: 'layers', coursesCount: 3, booksCount: 2 },
    { number: 4, label: 'Std 4', marathiLabel: 'इयत्ता ४ थी', category: 'Primary', themeColor: '#10b981', iconName: 'award', coursesCount: 3, booksCount: 2 },
    { number: 5, label: 'Std 5', marathiLabel: 'इयत्ता ५ वी', category: 'Middle', themeColor: '#f59e0b', iconName: 'graduation-cap', coursesCount: 4, booksCount: 3 },
    { number: 6, label: 'Std 6', marathiLabel: 'इयत्ता ६ वी', category: 'Middle', themeColor: '#f59e0b', iconName: 'video', coursesCount: 4, booksCount: 3 },
    { number: 7, label: 'Std 7', marathiLabel: 'इयत्ता ७ वी', category: 'Middle', themeColor: '#f59e0b', iconName: 'file-text', coursesCount: 5, booksCount: 4 },
    { number: 8, label: 'Std 8', marathiLabel: 'इयत्ता ८ वी', category: 'Middle', themeColor: '#f59e0b', iconName: 'star', coursesCount: 6, booksCount: 4 },
    { number: 9, label: 'Std 9', marathiLabel: 'इयत्ता ९ वी', category: 'High School', themeColor: '#0284c7', iconName: 'award', coursesCount: 8, booksCount: 5 },
    { number: 10, label: 'Std 10', marathiLabel: 'इयत्ता १० वी', category: 'High School', themeColor: '#0284c7', iconName: 'sparkles', coursesCount: 10, booksCount: 6 }
  ];

  selectedStdFilter = signal<number | null>(null);
  bookCategoryFilter = signal<'all' | 'published' | 'coming_soon'>('all');

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  studentName = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.fullName.split(' ')[0] : 'Student';
  });

  activeStandard = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.standard : (this.selectedStdFilter() || 10);
  });

  onStandardSelected(std: number) {
    this.router.navigate(['/standard', std]);
  }

  clearStandardFilter() {
    this.selectedStdFilter.set(null);
    this.courseService.setStandardFilter(null);
    this.bookService.setStandardFilter(null);
  }

  upcomingCoursesList = computed(() => {
    const std = this.selectedStdFilter();
    let list = this.courseService.upcomingCourses();
    if (std !== null) {
      list = list.filter(c => c.standard === std);
    }
    return list.length > 0 ? list : this.courseService.upcomingCourses();
  });

  popularCoursesList = computed(() => {
    const std = this.selectedStdFilter();
    let list = this.courseService.popularCourses();
    if (std !== null) {
      list = list.filter(c => c.standard === std);
    }
    return list.length > 0 ? list : this.courseService.popularCourses();
  });

  displayedBooks = computed(() => {
    let list = this.bookService.filteredBooks();
    const cat = this.bookCategoryFilter();
    if (cat === 'published') {
      list = list.filter(b => b.publicationStatus === 'published');
    } else if (cat === 'coming_soon') {
      list = list.filter(b => b.publicationStatus === 'coming_soon');
    }
    return list;
  });
}
