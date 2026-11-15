import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../models/course.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ToastService } from '../../core/services/toast.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f4f8fc]">
      <!-- Mobile Page Header -->
      <section class="bg-white border-b border-slate-200/80 px-3 sm:px-4 py-3.5">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                My Learning Courses
              </h1>
              <p class="text-[11px] text-slate-500 font-medium">
                Track your syllabus progress & lessons
              </p>
            </div>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              {{ enrolledCourses().length }} Enrolled
            </span>
          </div>

          <!-- Micro Tab Filters -->
          <div class="flex p-0.5 rounded-xl bg-slate-100 text-xs font-bold w-full">
            <button
              (click)="activeTab.set('all')"
              class="flex-1 py-1.5 rounded-lg transition-all text-center text-[11px]"
              [ngClass]="activeTab() === 'all' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'">
              All ({{ enrolledCourses().length }})
            </button>
            <button
              (click)="activeTab.set('ongoing')"
              class="flex-1 py-1.5 rounded-lg transition-all text-center text-[11px]"
              [ngClass]="activeTab() === 'ongoing' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'">
              Ongoing ({{ ongoingCourses().length }})
            </button>
            <button
              (click)="activeTab.set('completed')"
              class="flex-1 py-1.5 rounded-lg transition-all text-center text-[11px]"
              [ngClass]="activeTab() === 'completed' ? 'bg-white text-sky-700 shadow-2xs font-black' : 'text-slate-600'">
              Completed ({{ completedCourses().length }})
            </button>
          </div>
        </div>
      </section>

      <!-- Main Course Cards List -->
      <main class="py-4 px-3 sm:px-4 flex-1 space-y-3">
        @if (displayedCourses().length > 0) {
          @for (course of displayedCourses(); track course.id) {
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden group">
              <!-- Compact 16:9 Thumbnail -->
              <div class="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  [src]="course.thumbnail"
                  [alt]="course.title"
                  class="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-300" />
                
                <div class="absolute top-2 left-2 flex items-center gap-1">
                  <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-black/75 text-white">
                    Std {{ course.standard }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-white text-slate-800">
                    {{ course.subject }}
                  </span>
                </div>

                <!-- Play Button Center Overlay -->
                <button
                  (click)="openPlayer(course)"
                  class="absolute inset-0 m-auto w-10 h-10 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
                  <app-icon name="play" [size]="16" color="#ffffff" extraClass="ml-0.5"></app-icon>
                </button>
              </div>

              <!-- Content Info -->
              <div class="p-3.5 space-y-3">
                <div>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    <a [routerLink]="['/courses', course.id]">{{ course.title }}</a>
                  </h3>
                  <div class="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
                    <img [src]="course.instructor.avatar" [alt]="course.instructor.name" class="w-4 h-4 rounded-full object-cover" />
                    <span class="truncate">{{ course.instructor.name }}</span>
                  </div>
                </div>

                <!-- Compact Progress -->
                <div class="space-y-1 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100/80">
                  <div class="flex items-center justify-between text-[11px] font-extrabold">
                    <span class="text-slate-600">Progress</span>
                    <span class="text-sky-700">{{ course.progressPercent || 0 }}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-sky-600 rounded-full transition-all duration-300"
                      [style.width]="(course.progressPercent || 0) + '%'"></div>
                  </div>
                  <div class="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>{{ course.lessonsCount }} Lessons</span>
                    <span>{{ Math.round((course.lessonsCount * (course.progressPercent || 0)) / 100) }} Completed</span>
                  </div>
                </div>

                <!-- Action CTA -->
                <div class="flex items-center justify-between pt-1 border-t border-slate-100">
                  <a [routerLink]="['/courses', course.id]" class="text-xs font-bold text-slate-500 hover:text-sky-600">
                    Syllabus
                  </a>
                  <button
                    (click)="openPlayer(course)"
                    class="btn-primary !py-1.5 !px-3.5 text-xs font-bold">
                    <app-icon name="play" [size]="13" color="#ffffff"></app-icon>
                    <span>Resume Lesson</span>
                  </button>
                </div>
              </div>
            </div>
          }
        } @else {
          <!-- Empty State -->
          <div class="bg-white rounded-2xl border border-slate-200 text-center py-12 px-4 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              <app-icon name="book-open" [size]="24"></app-icon>
            </div>
            <h3 class="text-sm font-bold text-slate-900">No Courses Here</h3>
            <p class="text-xs text-slate-500">Explore standard 1 to 10 courses and start learning today!</p>
            <div class="pt-2">
              <a routerLink="/" class="btn-primary !py-2 !px-4 text-xs font-bold">
                Browse Courses
              </a>
            </div>
          </div>
        }
      </main>

      <!-- Video Player Modal -->
      @if (activePlayingCourse(); as course) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md border border-slate-200">
            <div class="p-3 bg-slate-900 text-white flex items-center justify-between">
              <h3 class="text-xs font-bold truncate max-w-[240px]">{{ course.title }}</h3>
              <button (click)="activePlayingCourse.set(null)" class="text-slate-300">
                <app-icon name="x" [size]="18"></app-icon>
              </button>
            </div>
            <div class="aspect-video bg-black">
              <video controls autoplay class="w-full h-full object-contain" src="https://www.w3schools.com/html/mov_bbb.mp4"></video>
            </div>
            <div class="p-3 bg-slate-50 border-t flex items-center justify-between">
              <button (click)="markLessonComplete(course)" class="btn-secondary !py-1 !px-2.5 text-xs font-bold">
                <app-icon name="check" [size]="12" color="#10b981"></app-icon>
                <span>Mark Done</span>
              </button>
              <button (click)="activePlayingCourse.set(null)" class="btn-primary !py-1 !px-3 text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      }

      <app-footer></app-footer>
    </div>
  `
})
export class MyCoursesComponent {
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  protected readonly Math = Math;

  activeTab = signal<'all' | 'ongoing' | 'completed'>('all');
  activePlayingCourse = signal<Course | null>(null);

  enrolledCourses = computed(() => this.courseService.enrolledCourses());

  ongoingCourses = computed(() =>
    this.enrolledCourses().filter(c => (c.progressPercent || 0) < 100)
  );

  completedCourses = computed(() =>
    this.enrolledCourses().filter(c => (c.progressPercent || 0) >= 100)
  );

  displayedCourses = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ongoing') return this.ongoingCourses();
    if (tab === 'completed') return this.completedCourses();
    return this.enrolledCourses();
  });

  openPlayer(course: Course) {
    this.activePlayingCourse.set(course);
  }

  markLessonComplete(course: Course) {
    this.toastService.success(`Lesson marked completed!`);
  }
}
