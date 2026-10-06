import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommentsService } from '../../../../features/feed/services/comments.service';
import { FormsModule } from '@angular/forms';
import { Stored_Keys } from '../../../../core/constants/stored-keys';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent {
  @Input() postId!: string;
  @Input() replyToCommentId: string | null = null;
  @Input() placeholder = 'Write a comment...';
  @Output() commentPosted = new EventEmitter<any>();

  private commentsService = inject(CommentsService);
  private cdr = inject(ChangeDetectorRef);

  userData: any = null;
  commentContent = '';
  imageFile!: File;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  isLoading = false;

  constructor() {
    try {
      this.userData = JSON.parse(localStorage.getItem(Stored_Keys.userData)!);
    } catch {}
  }

  onImageChange(event: Event): void {
    const files = (event?.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.imageFile = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  removeImage(): void {
    this.imageFile = null as any;
    this.imagePreviewUrl = null;
  }

  submitComment(): void {
    if (!this.commentContent && !this.imageFile) return;
    this.isLoading = true;

    let commentData: object | FormData;

    if (this.imageFile) {
      const fd = new FormData();
      if (this.commentContent) fd.append('content', this.commentContent);
      fd.append('image', this.imageFile);
      commentData = fd;
    } else {
      commentData = { content: this.commentContent };
    }

    const request$ = this.replyToCommentId
      ? this.commentsService.addReply(this.postId, this.replyToCommentId, commentData)
      : this.commentsService.addComment(commentData, this.postId);

    request$.subscribe({
      next: (response: any) => {
        this.commentContent = '';
        this.removeImage();
        this.isLoading = false;
        this.commentPosted.emit(response);
        // Also broadcast via service for the all-comments component
        this.commentsService.commentAdded$.next(this.postId);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to add comment', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
