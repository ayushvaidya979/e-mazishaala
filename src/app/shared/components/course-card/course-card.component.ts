import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Course } from '../../../models/course.model';
import { IconComponent } from '../icon/icon.component';
import { ToastService } from '../../../core/services/toast.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between overflow-hidden group w-[240px] sm:w-[260px] flex-shrink-0">
      <!-- Thumbnail -->
      <div class="relative w-full aspect-video bg-slate-900 overflow-hidden flex-shrink-0">
        <img
          [src]="course.thumbnail"
          [alt]="course.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95" />
        
        <!-- Standard & Subject Badge -->
        <div class="absolute top-2 left-2 flex items-center gap-1">
          <span class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-slate-950/80 text-white backdrop-blur-xs">
            Std {{ course.standard }}
          </span>
          <span class="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-white/95 text-slate-800 backdrop-blur-xs shadow-2xs">
            {{ course.subject }}
          </span>
        </div>

        <!-- Rating Badge -->
        <div class="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-amber-300 text-[10px] font-bold backdrop-blur-xs">
          <app-icon name="star" [size]="10" color="#fcd34d"></app-icon>
          <span>{{ course.rating }}</span>
        </div>

        @if (course.isUpcoming) {
          <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold uppercase">
            Upcoming
          </div>
        }
      </div>

      <!-- Card Body -->
      <div class="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          <!-- Title -->
          <h4 class="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
            <a [routerLink]="['/courses', course.id]">{{ course.title }}</a>
          </h4>

          <!-- Instructor Info -->
          <div class="flex items-center gap-1.5 mt-2">
            <img
              [src]="course.instructor.avatar"
              [alt]="course.instructor.name"
              class="w-5 h-5 rounded-full object-cover" />
            <span class="text-[11px] font-medium text-slate-500 truncate">
              {{ course.instructor.name }}
            </span>
          </div>

          <!-- Metadata -->
          <div class="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
            <span>{{ course.lessonsCount }} Lessons</span>
            <span>•</span>
            <span>{{ course.duration }}</span>
          </div>
        </div>

        <!-- Price & Action -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 mt-auto">
          <div>
            <div class="flex items-baseline gap-1">
              <span class="text-sm font-black text-slate-900">₹{{ course.discountedPrice }}</span>
              @if (course.price > course.discountedPrice) {
                <span class="text-[10px] text-slate-400 line-through">₹{{ course.price }}</span>
              }
            </div>
            <span class="text-[9px] font-bold text-emerald-600 uppercase">Save {{ calculateDiscount() }}%</span>
          </div>

          <div class="flex items-center gap-1">
            <a
              [routerLink]="['/courses', course.id]"
              class="btn-secondary !py-1 !px-2 text-[10px] font-bold">
              Details
            </a>
            <button
              (click)="onEnroll($event)"
              [disabled]="course.isEnrolled"
              class="btn-primary !py-1 !px-2.5 text-[10px] font-bold"
              [ngClass]="course.isEnrolled ? '!bg-slate-200 !text-slate-600 !shadow-none' : ''">
              {{ course.isEnrolled ? 'Enrolled' : 'Enroll' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;
  private toastService = inject(ToastService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  calculateDiscount(): number {
    if (!this.course.price || !this.course.discountedPrice) return 0;
    return Math.round(((this.course.price - this.course.discountedPrice) / this.course.price) * 100);
  }

  onEnroll(event: Event) {
    event.stopPropagation();
    if (this.course.isEnrolled) {
      this.router.navigate(['/my-courses']);
      return;
    }
    this.courseService.enrollInCourse(this.course.id);
    this.toastService.success(`Enrolled in: ${this.course.title}!`);
  }
}
