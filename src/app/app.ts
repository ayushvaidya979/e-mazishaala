import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';
import { ToastContainerComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    BottomNavComponent,
    ToastContainerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);
  authService = inject(AuthService);

  readonly currentUrl = signal<string>(this.router.url || '');

  constructor() {
    // Ensure session is recognized from local storage on app initialization
    this.authService.checkAndRestoreSession();

    // Listen to route changes reactively using signal
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const activeUrl = event.urlAfterRedirects || event.url;
      this.currentUrl.set(activeUrl);
    });
  }

  readonly isAuthOrWelcomePage = computed(() => {
    const url = this.currentUrl();
    return (
      !url ||
      url === '/' ||
      url.startsWith('/welcome') ||
      url.startsWith('/login') ||
      url.startsWith('/signup') ||
      url.startsWith('/auth')
    );
  });

  readonly showNavigation = computed(() => {
    return this.authService.isLoggedIn() && !this.isAuthOrWelcomePage();
  });
}
