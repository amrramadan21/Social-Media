import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { App_Apis } from '../../../core/constants/app-apis';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly http = inject(HttpClient);

  /** Observable stream for unread notification count — used by navbar badge */
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  // ── Get All Notifications ──
  getAll(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get<any>(`${App_Apis.notifications.getAll}?page=${page}&limit=${limit}`);
  }

  // ── Get Unread Count ──
  fetchUnreadCount(): void {
    this.http.get<any>(App_Apis.notifications.unreadCount).pipe(
      catchError(() => of({ count: 0 }))
    ).subscribe((res: any) => {
      const count = res?.count ?? res?.data?.count ?? 0;
      this.unreadCountSubject.next(count);
    });
  }

  // ── Mark Single Notification As Read ──
  markAsRead(notifId: string): Observable<any> {
    return this.http.patch<any>(App_Apis.notifications.markAsRead(notifId), {}).pipe(
      catchError(() => of({ success: true })) // gracefully handle if endpoint fails
    );
  }

  // ── Mark All Notifications As Read ──
  markAllAsRead(): Observable<any> {
    return this.http.patch<any>(App_Apis.notifications.markAllAsRead, {}).pipe(
      tap(() => this.unreadCountSubject.next(0)),
      catchError(() => {
        // Still reset count locally even if API fails
        this.unreadCountSubject.next(0);
        return of({ success: true });
      })
    );
  }

  /** Update the count locally (e.g. when navigating to notifications page) */
  resetCount(): void {
    this.unreadCountSubject.next(0);
  }
}
