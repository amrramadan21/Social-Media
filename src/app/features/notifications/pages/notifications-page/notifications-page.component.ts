import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../services/notifications.service';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, LoadingSkeletonComponent],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css',
})
export class NotificationsPageComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  private readonly cdr = inject(ChangeDetectorRef);

  notifications: any[] = [];
  isLoading = true;
  activeTab: 'all' | 'unread' = 'all';
  hasError = false;

  ngOnInit() {
    this.loadNotifications();
    // Mark all as read when user opens page
    this.notificationsService.markAllAsRead().subscribe();
  }

  loadNotifications() {
    this.isLoading = true;
    this.hasError = false;

    this.notificationsService.getAll().subscribe({
      next: (res: any) => {
        this.notifications = res?.data?.notifications || res?.notifications || res?.data || [];
        if (!Array.isArray(this.notifications)) this.notifications = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get filteredNotifications() {
    if (this.activeTab === 'unread') {
      return this.notifications.filter((n: any) => !n.read);
    }
    return this.notifications;
  }

  setTab(tab: 'all' | 'unread') {
    this.activeTab = tab;
  }

  getNotificationIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'like': 'fa-solid fa-heart',
      'comment': 'fa-regular fa-comment',
      'follow': 'fa-solid fa-user-plus',
      'share': 'fa-solid fa-share',
      'reply': 'fa-solid fa-reply',
    };
    return iconMap[type] || 'fa-solid fa-bell';
  }

  getNotificationColor(type: string): string {
    const colorMap: Record<string, string> = {
      'like': '#ef4444',
      'comment': '#3b82f6',
      'follow': '#8b5cf6',
      'share': '#10b981',
      'reply': '#f59e0b',
    };
    return colorMap[type] || '#6b7280';
  }

  getNotificationBg(type: string): string {
    const bgMap: Record<string, string> = {
      'like': '#fef2f2',
      'comment': '#eff6ff',
      'follow': '#f5f3ff',
      'share': '#ecfdf5',
      'reply': '#fffbeb',
    };
    return bgMap[type] || '#f9fafb';
  }
}
