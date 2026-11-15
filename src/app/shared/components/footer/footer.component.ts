import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <footer class="bg-slate-900 text-slate-400 pt-8 pb-10 px-4 mt-6 border-t border-slate-800 text-xs">
      <div class="space-y-5">
        <!-- Logo & Contact Helpline -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-0.5 shadow-xs">
              <img src="/logo.png" alt="e-MaziShaala" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-sm font-black text-white">e-Mazi<span class="text-sky-400">Shaala</span></span>
              <span class="brand-marathi text-[9px] font-bold text-amber-400 ml-1">ई-माझीशाळा</span>
            </div>
          </div>
          <span class="text-[10px] text-slate-500 font-semibold">Std 1 to 10</span>
        </div>

        <p class="text-[11px] text-slate-400 leading-relaxed">
          Empowering Maharashtra school students with accessible, high-yield digital education and publication guides.
        </p>

        <!-- Helpline Card (Tap to Call) -->
        <a
          href="tel:9112445134"
          class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300 hover:text-white transition-colors group block">
          <div class="flex items-center gap-2">
            <app-icon name="phone" [size]="13" color="#38bdf8"></app-icon>
            <span class="font-bold">Helpline: +91 91124 45134</span>
          </div>
          <span class="text-amber-400 text-[10px] font-bold group-hover:underline">Call (9 AM - 7 PM)</span>
        </a>

        <!-- Quick Links Grid -->
        <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
          <a routerLink="/home" class="hover:text-white">Home Dashboard</a>
          <a routerLink="/my-courses" class="hover:text-white">My Courses</a>
          <a routerLink="/live-classes" class="hover:text-white">Live Classes</a>
          <a routerLink="/downloads" class="hover:text-white">Study Materials</a>
          <a routerLink="/login" class="hover:text-white">Student Login</a>
          <a routerLink="/profile" class="hover:text-white">Account Settings</a>
        </div>

        <!-- Copyright -->
        <div class="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500 space-y-1">
          <p>© 2026-27 e-MaziShaala Educational Technologies</p>
          <div class="flex items-center justify-center gap-3 text-slate-400">
            <span>Terms</span>
            <span>•</span>
            <span>Privacy</span>
            <span>•</span>
            <span>Help Center</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
