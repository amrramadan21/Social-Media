import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" (click)="onCancel()" *ngIf="visible">
      <div class="dialog-card" (click)="$event.stopPropagation()">
        <div class="dialog-icon" [ngClass]="type">
          <i class="fa-solid" [ngClass]="type === 'danger' ? 'fa-trash-can' : 'fa-circle-exclamation'"></i>
        </div>
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button class="btn btn-cancel" (click)="onCancel()">Cancel</button>
          <button class="btn" [ngClass]="type === 'danger' ? 'btn-danger' : 'btn-primary'" (click)="onConfirm()" [disabled]="loading">
            <i *ngIf="loading" class="fa-solid fa-spinner fa-spin mr-1"></i>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.15s ease;
    }
    .dialog-card {
      background: #fff; border-radius: 20px; padding: 32px;
      max-width: 400px; width: 90%; text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      animation: slideUp 0.2s ease;
    }
    .dialog-icon {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; font-size: 24px;
    }
    .dialog-icon.danger { background: #fee2e2; color: #dc2626; }
    .dialog-icon.warning { background: #fef3c7; color: #d97706; }
    .dialog-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
    .dialog-message { font-size: 14px; color: #64748b; margin-bottom: 24px; line-height: 1.5; }
    .dialog-actions { display: flex; gap: 12px; justify-content: center; }
    .btn {
      padding: 10px 24px; border-radius: 12px; font-weight: 600;
      font-size: 14px; cursor: pointer; border: none; transition: all 0.2s;
    }
    .btn-cancel { background: #f1f5f9; color: #475569; }
    .btn-cancel:hover { background: #e2e8f0; }
    .btn-danger { background: #dc2626; color: #fff; }
    .btn-danger:hover { background: #b91c1c; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmText = 'Confirm';
  @Input() type: 'danger' | 'warning' = 'danger';
  @Input() loading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
