import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', icon?: string, duration: number = 3200) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, text, type, icon, duration };

    this.toasts.update(list => [...list, toast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(text: string, icon: string = 'check-circle') {
    this.show(text, 'success', icon);
  }

  info(text: string, icon: string = 'info') {
    this.show(text, 'info', icon);
  }

  warning(text: string, icon: string = 'alert-circle') {
    this.show(text, 'warning', icon);
  }

  error(text: string, icon: string = 'alert-circle') {
    this.show(text, 'error', icon);
  }

  remove(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}

