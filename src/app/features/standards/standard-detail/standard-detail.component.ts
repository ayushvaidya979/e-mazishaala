import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { StandardService } from '../../../core/services/standard.service';
import { ToastService } from '../../../core/services/toast.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { StandardDetail, SubjectSyllabus, StandardRecordedLecture, StandardLiveLecture, StandardNote, StandardTest, QuizQuestion } from '../../../models/standard.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { StandardDoodleComponent } from '../../../shared/components/standard-doodle/standard-doodle.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-standard-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, StandardDoodleComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f4f8fc]">
      <!-- Top Standard Header Banner -->
      <section class="bg-gradient-to-b from-sky-100/80 via-white to-transparent pt-3 pb-2 px-3 sm:px-4 border-b border-slate-200/60">
        <div class="space-y-3">
          <!-- Back Button & Quick Class Switcher -->
          <div class="flex items-center justify-between gap-2">
            <button
              type="button"
              (click)="goBack()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs active:scale-95 transition-all">
              <app-icon name="arrow-left" [size]="14"></app-icon>
              <span>Back</span>
            </button>

            <!-- Standards Fast Switcher Pill Scroll -->
            <div class="flex items-center gap-1 overflow-x-auto hide-scrollbar max-w-[240px] sm:max-w-xs py-0.5">
              @for (n of [1,2,3,4,5,6,7,8,9,10]; track n) {
                <button
                  type="button"
                  (click)="switchStandard(n)"
                  class="px-2 py-0.5 rounded-lg text-[10px] font-black transition-all flex-shrink-0"
                  [ngClass]="stdNumber() === n ? 'bg-sky-600 text-white shadow-xs scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'">
                  Std {{ n }}
                </button>
              }
            </div>
          </div>

          <!-- Hero Standard Card -->
          <div class="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <!-- Doodle Icon -->
              <div class="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center p-1 flex-shrink-0 shadow-2xs">
                <app-standard-doodle [standard]="stdNumber()"></app-standard-doodle>
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 class="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    Standard {{ detail().standard }}
                  </h1>
                  <span class="brand-marathi text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {{ detail().marathiLabel }}
                  </span>
                  <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {{ detail().category }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  {{ detail().tagline }}
                </p>
                <p class="text-[10px] text-sky-700 font-bold mt-0.5">
                  ✨ {{ detail().quote }}
                </p>
              </div>
            </div>
          </div>

          <!-- Section Switcher Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
            <button
              type="button"
              (click)="activeSection.set('syllabus')"
              class="section-tab-btn"
              [class.active]="activeSection() === 'syllabus'">
              <app-icon name="list" [size]="14"></app-icon>
              <span>Syllabus</span>
              <span class="count-badge">{{ detail().subjects.length }}</span>
            </button>

            <button
              type="button"
              (click)="activeSection.set('recorded')"
              class="section-tab-btn"
              [class.active]="activeSection() === 'recorded'">
              <app-icon name="video" [size]="14"></app-icon>
              <span>Recorded</span>
              <span class="count-badge">{{ detail().recordedLectures.length }}</span>
            </button>

            <button
              type="button"
              (click)="activeSection.set('live')"
              class="section-tab-btn"
              [class.active]="activeSection() === 'live'">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Live Classes</span>
              <span class="count-badge">{{ detail().liveLectures.length }}</span>
            </button>

            <button
              type="button"
              (click)="activeSection.set('notes')"
              class="section-tab-btn"
              [class.active]="activeSection() === 'notes'">
              <app-icon name="file-text" [size]="14"></app-icon>
              <span>Notes</span>
              <span class="count-badge">{{ detail().notes.length }}</span>
            </button>

            <button
              type="button"
              (click)="activeSection.set('tests')"
              class="section-tab-btn"
              [class.active]="activeSection() === 'tests'">
              <app-icon name="clipboard-check" [size]="14"></app-icon>
              <span>Tests</span>
              <span class="count-badge">{{ detail().tests.length }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Main Section Contents -->
      <main class="py-3 px-3 sm:px-4 flex-1 space-y-4">

        <!-- ==========================================
             1. SYLLABUS SECTION
             ========================================== -->
        @if (activeSection() === 'syllabus') {
          <div class="space-y-3 animate-fadeIn">
            <!-- Subject Filter Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
              <button
                type="button"
                (click)="selectedSubjectId.set('all')"
                class="px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                [ngClass]="selectedSubjectId() === 'all' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'">
                All Subjects ({{ detail().subjects.length }})
              </button>
              @for (sub of detail().subjects; track sub.id) {
                <button
                  type="button"
                  (click)="selectedSubjectId.set(sub.id)"
                  class="px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1"
                  [ngClass]="selectedSubjectId() === sub.id ? 'bg-sky-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'">
                  <span>{{ sub.name }}</span>
                </button>
              }
            </div>

            <!-- Subject Cards & Chapters Breakdown -->
            @for (sub of filteredSubjects(); track sub.id) {
              <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div class="flex items-center justify-between border-b pb-2.5">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full" [style.backgroundColor]="sub.color"></span>
                    <h3 class="text-sm font-black text-slate-900">{{ sub.name }}</h3>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {{ sub.totalHours }} • {{ sub.chapters.length }} Chapters
                  </span>
                </div>

                <!-- Chapters List Accordion/Cards -->
                <div class="space-y-2">
                  @for (chap of sub.chapters; track chap.id) {
                    <div class="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-sky-300 transition-colors">
                      <div class="flex items-start justify-between gap-2">
                        <div class="space-y-1">
                          <div class="flex items-center gap-2">
                            <span class="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-sky-700">
                              {{ chap.number }}
                            </span>
                            <h4 class="text-xs font-bold text-slate-900 leading-snug">
                              {{ chap.title }}
                            </h4>
                          </div>
                          <p class="text-[11px] text-slate-500 leading-relaxed pl-7">
                            {{ chap.description }}
                          </p>
                        </div>
                        @if (chap.weightage) {
                          <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap flex-shrink-0">
                            {{ chap.weightage }}
                          </span>
                        }
                      </div>

                      <!-- Key Topics Chips -->
                      <div class="flex items-center gap-1.5 flex-wrap pl-7 pt-2">
                        @for (topic of chap.topics; track topic) {
                          <span class="text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            • {{ topic }}
                          </span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- ==========================================
             2. RECORDED LECTURES SECTION
             ========================================== -->
        @if (activeSection() === 'recorded') {
          <div class="space-y-3 animate-fadeIn">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xs font-black text-slate-900 tracking-tight">Recorded Video Lessons</h2>
                <p class="text-[10px] text-slate-400">High-definition lectures tailored for Standard {{ detail().standard }}</p>
              </div>
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                {{ detail().recordedLectures.length }} Available
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              @for (lecture of detail().recordedLectures; track lecture.id) {
                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden group">
                  <!-- Video Thumbnail with Play Button -->
                  <div class="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      [src]="lecture.thumbnail"
                      [alt]="lecture.title"
                      class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" />
                    
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/75 text-white">
                      {{ lecture.subject }}
                    </span>
                    <span class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-white">
                      {{ lecture.duration }}
                    </span>

                    <button
                      type="button"
                      (click)="openLecturePlayer(lecture)"
                      class="absolute inset-0 m-auto w-11 h-11 rounded-full bg-sky-500/90 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                      <app-icon name="play" [size]="18" color="#ffffff" extraClass="ml-0.5"></app-icon>
                    </button>
                  </div>

                  <!-- Details -->
                  <div class="p-3 space-y-2">
                    <h3 class="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {{ lecture.title }}
                    </h3>
                    
                    <div class="flex items-center justify-between text-[11px] text-slate-500">
                      <div class="flex items-center gap-1.5 min-w-0">
                        <img [src]="lecture.teacherAvatar" [alt]="lecture.teacherName" class="w-4 h-4 rounded-full object-cover" />
                        <span class="truncate">{{ lecture.teacherName }}</span>
                      </div>
                      <span class="text-[10px] text-slate-400 font-medium">{{ lecture.viewsCount }} views</span>
                    </div>

                    <button
                      type="button"
                      (click)="openLecturePlayer(lecture)"
                      class="w-full btn-primary !py-1.5 text-xs font-bold flex items-center justify-center gap-1.5 mt-1">
                      <app-icon name="play" [size]="13" color="#ffffff"></app-icon>
                      <span>Watch Lecture</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ==========================================
             3. LIVE LECTURES SECTION
             ========================================== -->
        @if (activeSection() === 'live') {
          <div class="space-y-3 animate-fadeIn">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>Daily Live Interactive Classrooms</span>
                </h2>
                <p class="text-[10px] text-slate-400">Ask questions directly to expert faculty in real time</p>
              </div>
            </div>

            <div class="space-y-3">
              @for (live of detail().liveLectures; track live.id) {
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        @if (live.status === 'live') {
                          <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                            LIVE NOW
                          </span>
                        } @else {
                          <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                            UPCOMING
                          </span>
                        }
                        <span class="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                          {{ live.subject }}
                        </span>
                      </div>

                      <h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {{ live.title }}
                      </h3>
                    </div>

                    <span class="text-[10px] font-medium text-slate-500 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-lg border">
                      {{ live.duration }}
                    </span>
                  </div>

                  <!-- Teacher Info & Join Button -->
                  <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div class="flex items-center gap-2.5">
                      <img [src]="live.teacherAvatar" [alt]="live.teacherName" class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <p class="text-xs font-bold text-slate-800 leading-tight">{{ live.teacherName }}</p>
                        <p class="text-[10px] text-slate-400 leading-tight">{{ live.scheduledTime }}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      (click)="openLiveClassroom(live)"
                      class="btn-primary !py-2 !px-4 text-xs font-extrabold flex items-center gap-1.5"
                      [ngClass]="live.status === 'live' ? '!bg-red-600 hover:!bg-red-700' : ''">
                      <app-icon name="video" [size]="14" color="#ffffff"></app-icon>
                      <span>{{ live.status === 'live' ? 'Join Live' : 'View Session' }}</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ==========================================
             4. NOTES & STUDY MATERIAL SECTION
             ========================================== -->
        @if (activeSection() === 'notes') {
          <div class="space-y-3 animate-fadeIn">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xs font-black text-slate-900 tracking-tight">Offline Revision Notes & Worksheets</h2>
                <p class="text-[10px] text-slate-400">Concise formula sheets, mind maps & solved board papers</p>
              </div>
            </div>

            <div class="space-y-2.5">
              @for (note of detail().notes; track note.id) {
                <div class="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                  <div class="flex items-start gap-2.5 min-w-0">
                    <span class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black text-[11px] flex-shrink-0">
                      {{ note.fileType }}
                    </span>

                    <div class="min-w-0 space-y-0.5">
                      <h3 class="text-xs font-bold text-slate-900 leading-snug truncate">
                        {{ note.title }}
                      </h3>
                      <p class="text-[10px] text-slate-500 line-clamp-1">
                        {{ note.summary }}
                      </p>
                      <div class="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                        <span class="font-bold text-sky-800 bg-sky-50 px-1 rounded">{{ note.subject }}</span>
                        <span>•</span>
                        <span>{{ note.pagesCount }} Pages</span>
                        <span>•</span>
                        <span>{{ note.fileSize }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      (click)="openNoteViewer(note)"
                      class="btn-primary !py-1.5 !px-3 text-[11px] font-bold">
                      Open
                    </button>
                    <button
                      type="button"
                      (click)="downloadNote(note)"
                      class="btn-secondary !py-1.5 !px-2.5 text-[11px] font-bold"
                      title="Download">
                      <app-icon name="download" [size]="13"></app-icon>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ==========================================
             5. TESTS & QUIZZES SECTION
             ========================================== -->
        @if (activeSection() === 'tests') {
          <div class="space-y-3 animate-fadeIn">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xs font-black text-slate-900 tracking-tight">Chapter Tests & Interactive Quizzes</h2>
                <p class="text-[10px] text-slate-400">Instant score evaluation with answer keys & explanations</p>
              </div>
            </div>

            <div class="space-y-3">
              @for (test of detail().tests; track test.id) {
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase"
                          [ngClass]="{
                            'bg-emerald-100 text-emerald-800': test.difficulty === 'Easy',
                            'bg-amber-100 text-amber-800': test.difficulty === 'Medium',
                            'bg-rose-100 text-rose-800': test.difficulty === 'Hard'
                          }">
                          {{ test.difficulty }}
                        </span>
                        <span class="text-[10px] font-bold text-slate-500">
                          {{ test.subject }}
                        </span>
                      </div>

                      <h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {{ test.title }}
                      </h3>
                    </div>

                    <div class="text-right flex-shrink-0">
                      <span class="text-xs font-black text-sky-700 block">{{ test.maxMarks }} Marks</span>
                      <span class="text-[10px] text-slate-400">{{ test.durationMinutes }} Mins</span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div class="flex items-center gap-3">
                      <span>📝 {{ test.totalQuestions }} Questions</span>
                      <span>👥 {{ test.attemptsCount }} Attempts</span>
                    </div>

                    <button
                      type="button"
                      (click)="startTest(test)"
                      class="btn-primary !py-1.5 !px-4 text-xs font-black flex items-center gap-1.5 active:scale-95">
                      <app-icon name="clipboard-check" [size]="14" color="#ffffff"></app-icon>
                      <span>Start Test</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

      </main>

      <!-- ==========================================
           INTERACTIVE MODALS
           ========================================== -->

      <!-- 1. Video Player Modal -->
      @if (activePlayingLecture(); as lecture) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg border border-slate-200">
            <div class="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <span class="text-[9px] font-bold text-sky-400 uppercase">Std {{ detail().standard }} • {{ lecture.subject }}</span>
                <h3 class="text-xs font-bold truncate">{{ lecture.title }}</h3>
              </div>
              <button type="button" (click)="activePlayingLecture.set(null)" class="text-slate-300 hover:text-white p-1">
                <app-icon name="x" [size]="18"></app-icon>
              </button>
            </div>

            <div class="aspect-video bg-black flex items-center justify-center">
              <video controls autoplay class="w-full h-full object-contain" [src]="lecture.videoUrl"></video>
            </div>

            <div class="p-3 bg-slate-50 border-t flex items-center justify-between">
              <div class="flex items-center gap-2">
                <img [src]="lecture.teacherAvatar" [alt]="lecture.teacherName" class="w-6 h-6 rounded-full object-cover" />
                <span class="text-xs font-bold text-slate-800">{{ lecture.teacherName }}</span>
              </div>
              <button type="button" (click)="activePlayingLecture.set(null)" class="btn-primary !py-1 !px-3 text-xs font-bold">
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 2. Live Classroom Modal -->
      @if (activeLiveClass(); as live) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg border border-slate-200">
            <div class="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span class="text-xs font-black uppercase text-red-400">LIVE CLASSROOM</span>
                <span class="text-slate-500">|</span>
                <span class="text-xs font-bold truncate max-w-[200px]">{{ live.title }}</span>
              </div>
              <button type="button" (click)="activeLiveClass.set(null)" class="text-slate-300 hover:text-white">
                <app-icon name="x" [size]="18"></app-icon>
              </button>
            </div>

            <div class="aspect-video bg-black flex items-center justify-center relative">
              <video controls autoplay class="w-full h-full object-contain" src="https://www.w3schools.com/html/mov_bbb.mp4"></video>
              <div class="absolute top-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{{ live.attendeesCount }} Students Online</span>
              </div>
            </div>

            <div class="p-3 bg-slate-50 border-t flex items-center justify-between">
              <div class="flex items-center gap-2">
                <img [src]="live.teacherAvatar" [alt]="live.teacherName" class="w-7 h-7 rounded-full object-cover" />
                <div>
                  <p class="text-xs font-bold text-slate-800 leading-tight">{{ live.teacherName }}</p>
                  <p class="text-[10px] text-slate-500 leading-tight">{{ live.teacherTitle }}</p>
                </div>
              </div>
              <button type="button" (click)="activeLiveClass.set(null)" class="btn-primary !py-1 !px-3 text-xs font-bold">
                Exit Class
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 3. Notes Preview Modal -->
      @if (activeNote(); as note) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3 border border-slate-200">
            <div class="flex items-center justify-between pb-2 border-b">
              <span class="text-xs font-bold truncate max-w-[220px]">{{ note.title }}</span>
              <button type="button" (click)="activeNote.set(null)" class="text-slate-400 hover:text-slate-700">
                <app-icon name="x" [size]="16"></app-icon>
              </button>
            </div>

            <div class="p-4 bg-slate-50 rounded-xl text-center space-y-2 border">
              <app-icon name="file-text" [size]="36" color="#0284c7"></app-icon>
              <h4 class="text-xs font-bold text-slate-800">{{ note.title }}</h4>
              <p class="text-[11px] text-slate-500 leading-relaxed">{{ note.summary }}</p>
              <div class="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold pt-1">
                <span>Std {{ detail().standard }}</span>
                <span>•</span>
                <span>{{ note.pagesCount }} Pages</span>
                <span>•</span>
                <span>{{ note.fileSize }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button type="button" (click)="downloadNote(note)" class="flex-1 btn-secondary !py-2 text-xs font-bold flex items-center justify-center gap-1.5">
                <app-icon name="download" [size]="13"></app-icon>
                <span>Download PDF</span>
              </button>
              <button type="button" (click)="activeNote.set(null)" class="flex-1 btn-primary !py-2 text-xs font-bold">
                Done Reading
              </button>
            </div>
          </div>
        </div>
      }

      <!-- 4. Interactive Test Taking & Quiz Evaluation Modal -->
      @if (activeTest(); as test) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <!-- Quiz Modal Top Bar -->
            <div class="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <span class="text-[9px] font-bold text-amber-400 uppercase">Std {{ detail().standard }} • Test Series</span>
                <h3 class="text-xs font-bold truncate">{{ test.title }}</h3>
              </div>
              <button type="button" (click)="closeTestModal()" class="text-slate-300 hover:text-white p-1">
                <app-icon name="x" [size]="18"></app-icon>
              </button>
            </div>

            <!-- Quiz Body: Questions vs Results -->
            <div class="p-4 overflow-y-auto flex-1 space-y-4">
              @if (!isTestSubmitted()) {
                <!-- Active Question Screen -->
                <div class="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b">
                  <span>Question {{ currentQuestionIndex() + 1 }} of {{ test.questions.length }}</span>
                  <span class="text-sky-600 font-extrabold flex items-center gap-1">
                    <app-icon name="clock" [size]="13"></app-icon>
                    <span>{{ test.durationMinutes }} Mins Test</span>
                  </span>
                </div>

                @if (test.questions[currentQuestionIndex()]; as q) {
                  <div class="space-y-3">
                    <h4 class="text-sm font-extrabold text-slate-900 leading-snug">
                      {{ q.id }}. {{ q.question }}
                    </h4>

                    <!-- Options list -->
                    <div class="space-y-2">
                      @for (opt of q.options; track $index) {
                        <button
                          type="button"
                          (click)="selectAnswer(q.id, $index)"
                          class="w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between"
                          [ngClass]="userAnswers()[q.id] === $index ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs' : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'">
                          <span>{{ opt }}</span>
                          @if (userAnswers()[q.id] === $index) {
                            <span class="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">✓</span>
                          }
                        </button>
                      }
                    </div>
                  </div>
                }

                <!-- Navigation between questions -->
                <div class="flex items-center justify-between pt-3 border-t">
                  <button
                    type="button"
                    (click)="prevQuestion()"
                    [disabled]="currentQuestionIndex() === 0"
                    class="btn-secondary !py-1.5 !px-3 text-xs font-bold disabled:opacity-40">
                    Previous
                  </button>

                  @if (currentQuestionIndex() < test.questions.length - 1) {
                    <button
                      type="button"
                      (click)="nextQuestion()"
                      class="btn-primary !py-1.5 !px-4 text-xs font-bold">
                      Next
                    </button>
                  } @else {
                    <button
                      type="button"
                      (click)="submitTest()"
                      class="btn-primary !py-1.5 !px-5 text-xs font-black !bg-emerald-600 hover:!bg-emerald-700">
                      Submit Test
                    </button>
                  }
                </div>
              } @else {
                <!-- Test Results & Review Screen -->
                <div class="text-center py-2 space-y-3">
                  <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs text-2xl">
                    🏆
                  </div>
                  <div>
                    <h3 class="text-base font-black text-slate-900">Test Completed!</h3>
                    <p class="text-xs text-slate-500">Standard {{ detail().standard }} • {{ test.title }}</p>
                  </div>

                  <!-- Score Card Pill -->
                  <div class="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-around">
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 block uppercase">Score</span>
                      <span class="text-lg font-black text-sky-700">{{ testScore() }} / {{ test.questions.length }}</span>
                    </div>
                    <div class="w-px h-8 bg-sky-200"></div>
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 block uppercase">Accuracy</span>
                      <span class="text-lg font-black text-emerald-700">{{ testAccuracy() }}%</span>
                    </div>
                    <div class="w-px h-8 bg-sky-200"></div>
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 block uppercase">Result</span>
                      <span class="text-xs font-black text-emerald-600 block mt-1">PASSED</span>
                    </div>
                  </div>

                  <!-- Detailed Answer Review Accordion -->
                  <div class="text-left space-y-2.5 pt-2">
                    <h4 class="text-xs font-black text-slate-800">Answer Key & Explanations:</h4>
                    @for (q of test.questions; track q.id) {
                      <div class="p-3 rounded-xl border text-xs space-y-1"
                        [ngClass]="userAnswers()[q.id] === q.correctOptionIndex ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'">
                        <p class="font-bold text-slate-900">{{ q.id }}. {{ q.question }}</p>
                        <p class="text-[11px] font-extrabold text-emerald-800">
                          ✓ Correct Answer: {{ q.options[q.correctOptionIndex] }}
                        </p>
                        <p class="text-[10px] text-slate-600 leading-relaxed italic">
                          💡 {{ q.explanation }}
                        </p>
                      </div>
                    }
                  </div>

                  <div class="pt-3 flex gap-2">
                    <button
                      type="button"
                      (click)="restartTest()"
                      class="flex-1 btn-secondary !py-2 text-xs font-bold">
                      Re-attempt Test
                    </button>
                    <button
                      type="button"
                      (click)="closeTestModal()"
                      class="flex-1 btn-primary !py-2 text-xs font-bold">
                      Done
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .section-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      background-color: #ffffff;
      color: #64748b;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
      transition: all 0.15s ease;
      cursor: pointer;
    }

    .section-tab-btn:hover {
      background-color: #f8fafc;
      color: #0f172a;
    }

    .section-tab-btn.active {
      background-color: #0284c7;
      color: #ffffff;
      border-color: #0284c7;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);
    }

    .count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 9999px;
      font-size: 9px;
      font-weight: 800;
      background-color: rgba(0, 0, 0, 0.08);
      color: inherit;
    }

    .section-tab-btn.active .count-badge {
      background-color: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
  `]
})
export class StandardDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private standardService = inject(StandardService);
  private toastService = inject(ToastService);
  private supabaseService = inject(SupabaseService);

  readonly stdNumber = signal<number>(1);
  readonly activeSection = signal<'syllabus' | 'recorded' | 'live' | 'notes' | 'tests'>('syllabus');
  readonly selectedSubjectId = signal<string>('all');

  // Modals state
  readonly activePlayingLecture = signal<StandardRecordedLecture | null>(null);
  readonly activeLiveClass = signal<StandardLiveLecture | null>(null);
  readonly activeNote = signal<StandardNote | null>(null);
  readonly activeTest = signal<StandardTest | null>(null);

  // Test taking state
  readonly currentQuestionIndex = signal<number>(0);
  readonly userAnswers = signal<Record<number, number>>({});
  readonly isTestSubmitted = signal<boolean>(false);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const num = parseInt(idParam || '1', 10);
      const safeNum = isNaN(num) ? 1 : Math.max(1, Math.min(10, num));
      this.stdNumber.set(safeNum);
    });
  }

  readonly detail = computed<StandardDetail>(() => {
    return this.standardService.getStandardDetail(this.stdNumber());
  });

  readonly filteredSubjects = computed<SubjectSyllabus[]>(() => {
    const subId = this.selectedSubjectId();
    const list = this.detail().subjects;
    if (subId === 'all') return list;
    return list.filter(s => s.id === subId);
  });

  goBack() {
    this.router.navigate(['/home']);
  }

  switchStandard(std: number) {
    this.router.navigate(['/standard', std]);
    this.stdNumber.set(std);
    this.selectedSubjectId.set('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openLecturePlayer(lecture: StandardRecordedLecture) {
    this.activePlayingLecture.set(lecture);
  }

  openLiveClassroom(live: StandardLiveLecture) {
    this.activeLiveClass.set(live);
  }

  openNoteViewer(note: StandardNote) {
    this.activeNote.set(note);
  }

  downloadNote(note: StandardNote) {
    this.toastService.success(`Downloaded: ${note.title}`);
  }

  startTest(test: StandardTest) {
    this.activeTest.set(test);
    this.currentQuestionIndex.set(0);
    this.userAnswers.set({});
    this.isTestSubmitted.set(false);
  }

  selectAnswer(questionId: number, optionIndex: number) {
    this.userAnswers.update(ans => ({ ...ans, [questionId]: optionIndex }));
  }

  nextQuestion() {
    const test = this.activeTest();
    if (!test) return;
    if (this.currentQuestionIndex() < test.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  submitTest() {
    this.isTestSubmitted.set(true);
    this.toastService.success('Test Submitted Successfully!');

    const test = this.activeTest();
    if (!test) return;

    this.supabaseService.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        const score = this.testScore();
        const total = test.questions.length;
        this.supabaseService.supabase.from('test_attempts').insert({
          user_id: session.user.id,
          test_id: test.id,
          score: score,
          total_marks: test.maxMarks,
          correct_answers: score,
          wrong_answers: total - score,
          user_answers: this.userAnswers()
        }).then(({ error }) => {
          if (error) {
            console.warn('Could not record test attempt in Supabase:', error.message);
          }
        });
      }
    });
  }

  readonly testScore = computed(() => {
    const test = this.activeTest();
    if (!test) return 0;
    const answers = this.userAnswers();
    let correct = 0;
    for (const q of test.questions) {
      if (answers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    }
    return correct;
  });

  readonly testAccuracy = computed(() => {
    const test = this.activeTest();
    if (!test || test.questions.length === 0) return 0;
    return Math.round((this.testScore() / test.questions.length) * 100);
  });

  restartTest() {
    this.currentQuestionIndex.set(0);
    this.userAnswers.set({});
    this.isTestSubmitted.set(false);
  }

  closeTestModal() {
    this.activeTest.set(null);
  }
}

