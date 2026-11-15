import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../models/course.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ToastService } from '../../../core/services/toast.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f4f8fc]">
      @if (course(); as c) {
        <!-- Top Video / Thumbnail Area -->
        <div class="relative w-full aspect-video bg-black overflow-hidden">
          <img [src]="c.thumbnail" [alt]="c.title" class="w-full h-full object-cover opacity-85" />
          <button
            (click)="isPlayingTrailer.set(true)"
            class="absolute inset-0 m-auto w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <app-icon name="play" [size]="20" color="#ffffff" extraClass="ml-0.5"></app-icon>
          </button>
          <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
            Free Preview
          </span>
        </div>

        <main class="py-4 px-3 sm:px-4 space-y-4 flex-1">
          <!-- Course Title & Badges -->
          <div class="space-y-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-sky-600 text-white">
                Std {{ c.standard }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-800 border">
                {{ c.subject }}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {{ c.language }}
              </span>
            </div>

            <h1 class="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {{ c.title }}
            </h1>

            <p class="text-xs text-slate-500 leading-relaxed font-medium">
              {{ c.subtitle }}
            </p>

            <div class="flex items-center gap-3 text-xs text-slate-600 pt-1">
              <div class="flex items-center gap-1 font-bold text-amber-600">
                <app-icon name="star" [size]="13" color="#d97706"></app-icon>
                <span>{{ c.rating }}</span>
                <span class="text-slate-400 font-normal">({{ c.reviewCount }})</span>
              </div>
              <span>•</span>
              <span>{{ c.lessonsCount }} Lessons</span>
              <span>•</span>
              <span>{{ c.duration }}</span>
            </div>
          </div>

          <!-- Sticky / Fixed Bottom Enrollment Bar for Mobile -->
          <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3">
            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-lg font-black text-slate-900">₹{{ c.discountedPrice }}</span>
                <span class="text-xs text-slate-400 line-through">₹{{ c.price }}</span>
              </div>
              <span class="text-[9px] font-bold text-emerald-600 uppercase">Save {{ Math.round(((c.price - c.discountedPrice) / c.price) * 100) }}%</span>
            </div>

            <button
              (click)="enrollNow(c)"
              class="btn-primary !py-2.5 !px-5 text-xs font-black shadow-md shadow-sky-600/20">
              {{ c.isEnrolled ? 'Go to My Courses' : 'Enroll Now' }}
            </button>
          </div>

          <!-- Instructor Profile -->
          <div class="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
            <img [src]="c.instructor.avatar" [alt]="c.instructor.name" class="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/30" />
            <div class="min-w-0">
              <h4 class="text-xs font-bold text-slate-900">{{ c.instructor.name }}</h4>
              <p class="text-[10px] text-slate-500 truncate">{{ c.instructor.title }} • {{ c.instructor.experienceYears }}+ Yrs</p>
            </div>
          </div>

          <!-- Syllabus Chapters -->
          <div class="space-y-2 pt-2">
            <h3 class="text-xs font-black uppercase text-slate-500 tracking-wider">
              Course Syllabus ({{ c.curriculum.length }} Chapters)
            </h3>

            @for (chap of c.curriculum; track chap.id; let i = $index) {
              <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span class="w-4.5 h-4.5 rounded bg-sky-100 text-sky-800 text-[10px] flex items-center justify-center font-black">
                    {{ i + 1 }}
                  </span>
                  {{ chap.title }}
                </h4>

                <div class="space-y-1 pl-6">
                  @for (lesson of chap.lessons; track lesson.id) {
                    <div class="flex items-center justify-between text-[11px] py-1 text-slate-600">
                      <div class="flex items-center gap-1.5 min-w-0">
                        <app-icon name="play" [size]="11" color="#0284c7"></app-icon>
                        <span class="truncate">{{ lesson.title }}</span>
                      </div>
                      <span class="text-[10px] text-slate-400 flex-shrink-0">{{ lesson.duration }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </main>
      }

      <!-- Trailer Modal -->
      @if (isPlayingTrailer()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-xs">
          <div class="bg-white rounded-2xl overflow-hidden w-full max-w-sm">
            <div class="p-2.5 bg-slate-900 text-white flex items-center justify-between">
              <span class="text-xs font-bold">Class Preview</span>
              <button (click)="isPlayingTrailer.set(false)" class="text-slate-300">
                <app-icon name="x" [size]="16"></app-icon>
              </button>
            </div>
            <div class="aspect-video bg-black">
              <video controls autoplay class="w-full h-full object-contain" src="https://www.w3schools.com/html/mov_bbb.mp4"></video>
            </div>
          </div>
        </div>
      }

      <app-footer></app-footer>
    </div>
  `
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  protected readonly Math = Math;

  course = signal<Course | undefined>(undefined);
  isPlayingTrailer = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.course.set(this.courseService.getCourseById(id));
      }
    });
  }

  enrollNow(c: Course) {
    if (c.isEnrolled) {
      this.router.navigate(['/my-courses']);
      return;
    }
    this.courseService.enrollInCourse(c.id);
    this.toastService.success(`Enrolled in ${c.title}!`);
    this.router.navigate(['/my-courses']);
  }
}
