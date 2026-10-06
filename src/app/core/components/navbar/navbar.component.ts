import { Component, inject, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Stored_Keys } from '../../constants/stored-keys';
import { NotificationsService } from '../../../features/notifications/services/notifications.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private notificationsService = inject(NotificationsService);
  private cdr = inject(ChangeDetectorRef);
  private pollSub!: Subscription;
  private unreadSub!: Subscription;

  userData: any = null;
  isMenuOpen = false;
  unreadCount = 0;

  constructor() {
    try {
      const data = localStorage.getItem(Stored_Keys.userData);
      if (data) {
        this.userData = JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse user data from local storage', e);
    }
  }

  ngOnInit(): void {
    // Subscribe to unread count
    this.unreadSub = this.notificationsService.unreadCount$.subscribe(
      (count) => {
        this.unreadCount = count;
        this.cdr.markForCheck();
      }
    );

    // Fetch initial unread count
    this.notificationsService.fetchUnreadCount();

    // Poll every 30 seconds
    this.pollSub = interval(30000).subscribe(() => {
      this.notificationsService.fetchUnreadCount();
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    this.unreadSub?.unsubscribe();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logOut(): void {
    localStorage.removeItem(Stored_Keys.TOKEN);
    localStorage.removeItem(Stored_Keys.userData);
    this.router.navigate(['/auth/login']);
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.isMenuOpen = false;
    }
  }
}
