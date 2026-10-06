import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" *ngIf="type === 'post'">
      <div class="skeleton-card">
        <div class="skeleton-header">
          <div class="skeleton-avatar pulse"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line w-40 pulse"></div>
            <div class="skeleton-line w-24 pulse"></div>
          </div>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-line w-full pulse"></div>
          <div class="skeleton-line w-3/4 pulse"></div>
        </div>
        <div class="skeleton-image pulse"></div>
        <div class="skeleton-actions">
          <div class="skeleton-btn pulse"></div>
          <div class="skeleton-btn pulse"></div>
          <div class="skeleton-btn pulse"></div>
        </div>
      </div>
    </div>

    <div class="skeleton-wrapper" *ngIf="type === 'notification'">
      <div class="skeleton-notif" *ngFor="let i of [1,2,3,4,5]">
        <div class="skeleton-avatar-sm pulse"></div>
        <div class="skeleton-lines flex-1">
          <div class="skeleton-line w-3/4 pulse"></div>
          <div class="skeleton-line w-1/2 pulse"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper { animation: fadeIn 0.3s ease; }
    .skeleton-card {
      background: #fff; border-radius: 16px; padding: 20px;
      border: 1px solid #e5e7eb; margin-bottom: 16px;
    }
    .skeleton-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .skeleton-avatar { width: 44px; height: 44px; border-radius: 50%; background: #e5e7eb; }
    .skeleton-avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: #e5e7eb; flex-shrink: 0; }
    .skeleton-lines { display: flex; flex-direction: column; gap: 8px; }
    .skeleton-line { height: 12px; border-radius: 6px; background: #e5e7eb; }
    .skeleton-body { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
    .skeleton-image { width: 100%; height: 200px; border-radius: 12px; background: #e5e7eb; margin-bottom: 16px; }
    .skeleton-actions { display: flex; gap: 12px; }
    .skeleton-btn { height: 36px; flex: 1; border-radius: 8px; background: #e5e7eb; }
    .skeleton-notif {
      display: flex; align-items: center; gap: 12px; padding: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .w-full { width: 100%; }
    .w-3\\/4 { width: 75%; }
    .w-1\\/2 { width: 50%; }
    .w-40 { width: 160px; }
    .w-24 { width: 96px; }
    .flex-1 { flex: 1; }
    .pulse { animation: pulse 1.5s ease-in-out infinite; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class LoadingSkeletonComponent {
  @Input() type: 'post' | 'notification' | 'profile' = 'post';
  @Input() count: number = 1;
}
