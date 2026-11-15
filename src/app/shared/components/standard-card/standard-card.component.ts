import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StandardDoodleComponent } from '../standard-doodle/standard-doodle.component';

export interface StandardInfo {
  number: number;
  label: string;
  marathiLabel: string;
  category: 'Primary' | 'Middle' | 'High School';
  themeColor: string;
  iconName: string;
  coursesCount: number;
  booksCount: number;
}

@Component({
  selector: 'app-standard-card',
  standalone: true,
  imports: [CommonModule, StandardDoodleComponent],
  template: `
    <div
      (click)="selectStandard()"
      class="group cursor-pointer select-none rounded-2xl p-2.5 transition-all duration-200 border bg-white flex flex-col items-center justify-between text-center w-[86px] sm:w-[94px] flex-shrink-0 active:scale-95"
      [ngClass]="isSelected ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/60 shadow-xs' : 'border-slate-200/90 hover:border-sky-300 shadow-2xs hover:shadow-xs'">
      
      <!-- Top Colorful Educational Doodle -->
      <app-standard-doodle [standard]="standard.number"></app-standard-doodle>

      <!-- Class Number & Title -->
      <div class="my-1.5">
        <span class="text-sm font-black text-slate-900 block leading-tight group-hover:text-sky-600 transition-colors">
          Std {{ standard.number }}
        </span>
        <span class="brand-marathi text-[10px] font-bold text-slate-500 block truncate max-w-[78px]">
          {{ standard.marathiLabel }}
        </span>
      </div>

      <!-- Action Pill: Direct Entrance to Standard Hub -->
      <span
        class="w-full py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all block"
        [ngClass]="isSelected ? 'bg-sky-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 group-hover:bg-sky-600 group-hover:text-white'">
        Explore
      </span>
    </div>
  `
})
export class StandardCardComponent {
  private router = inject(Router);

  @Input({ required: true }) standard!: StandardInfo;
  @Input() isSelected: boolean = false;
  @Output() selected = new EventEmitter<number>();

  selectStandard() {
    this.selected.emit(this.standard.number);
    this.router.navigate(['/standard', this.standard.number]);
  }
}
