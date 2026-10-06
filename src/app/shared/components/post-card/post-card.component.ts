import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../../features/feed/interfaces/IAllPostsResponse';
import { PostsService } from '../../../core/services/posts/posts.service';
import { AllCommentsComponent } from '../comments/all-comments/all-comments.component';
import { AddCommentComponent } from '../comments/add-comment/add-comment.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { Stored_Keys } from '../../../core/constants/stored-keys';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule, RouterLink, TimeAgoPipe,
    AllCommentsComponent, AddCommentComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() postDeleted = new EventEmitter<string>();
  @Output() postUpdated = new EventEmitter<any>();

  private readonly postsService = inject(PostsService);
  private readonly cdr = inject(ChangeDetectorRef);

  showComments = false;
  showPostMenu = false;
  showEditModal = false;
  showDeleteDialog = false;
  isDeleteLoading = false;
  editBody = '';

  // Edit modal state
  editImagePreview: string | null = null;
  editImageFile: File | null = null;
  isEditLoading = false;

  currentUserId: string = '';

  constructor() {
    try {
      const data = localStorage.getItem(Stored_Keys.userData);
      if (data) {
        const parsed = JSON.parse(data);
        this.currentUserId = parsed?._id || parsed?.id || '';
      }
    } catch {}
  }

  get isOwner(): boolean {
    return this.currentUserId === (this.post?.user?._id || '');
  }

  get isLiked(): boolean {
    return this.post?.likes?.includes(this.currentUserId) ?? false;
  }

  // ── Like Toggle ──
  toggleLike(): void {
    // Save state before toggle for revert
    const wasLiked = this.isLiked;

    // Optimistic update
    if (wasLiked) {
      this.post.likes = this.post.likes.filter(id => id !== this.currentUserId);
      this.post.likesCount = Math.max(0, (this.post.likesCount || 0) - 1);
    } else {
      this.post.likes = [...(this.post.likes || []), this.currentUserId];
      this.post.likesCount = (this.post.likesCount || 0) + 1;
    }
    this.cdr.markForCheck();

    const postId = this.post.id || this.post._id;
    this.postsService.likePost(postId).subscribe({
      error: () => {
        // Revert: undo exactly what we did
        if (wasLiked) {
          // We removed — add back
          this.post.likes = [...(this.post.likes || []), this.currentUserId];
          this.post.likesCount = (this.post.likesCount || 0) + 1;
        } else {
          // We added — remove
          this.post.likes = this.post.likes.filter(id => id !== this.currentUserId);
          this.post.likesCount = Math.max(0, (this.post.likesCount || 0) - 1);
        }
        this.cdr.markForCheck();
      }
    });
  }

  // ── Bookmark Toggle ──
  toggleBookmark(): void {
    this.post.bookmarked = !this.post.bookmarked;
    this.cdr.markForCheck();

    const postId = this.post.id || this.post._id;
    this.postsService.bookmarkPost(postId).subscribe({
      error: () => {
        this.post.bookmarked = !this.post.bookmarked;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Share ──
  sharePost(): void {
    const postId = this.post.id || this.post._id;
    this.post.sharesCount = (this.post.sharesCount || 0) + 1;
    this.cdr.markForCheck();

    this.postsService.sharePost(postId).subscribe({
      error: () => {
        this.post.sharesCount = Math.max(0, (this.post.sharesCount || 0) - 1);
        this.cdr.markForCheck();
      }
    });
  }

  // ── Comments Toggle ──
  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  // ── Post Menu ──
  togglePostMenu(): void {
    this.showPostMenu = !this.showPostMenu;
  }

  closePostMenu(): void {
    this.showPostMenu = false;
  }

  // ── Edit ──
  openEdit(): void {
    this.editBody = this.post.body || '';
    this.editImagePreview = this.post.image || null;
    this.editImageFile = null;
    this.showEditModal = true;
    this.showPostMenu = false;
  }

  onEditImageChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.editImageFile = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.editImagePreview = reader.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(files[0]);
    }
  }

  removeEditImage(): void {
    this.editImageFile = null;
    this.editImagePreview = null;
  }

  submitEdit(): void {
    if (!this.editBody && !this.editImagePreview) return;
    this.isEditLoading = true;

    const fd = new FormData();
    if (this.editBody) fd.append('body', this.editBody);
    if (this.editImageFile) fd.append('image', this.editImageFile);

    const postId = this.post.id || this.post._id;
    this.postsService.updatePost(postId, fd).subscribe({
      next: (res: any) => {
        this.post.body = this.editBody;
        if (this.editImagePreview) this.post.image = this.editImagePreview;
        this.showEditModal = false;
        this.isEditLoading = false;
        this.postsService.postUpdated$.next(this.post);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isEditLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Delete ──
  openDelete(): void {
    this.showDeleteDialog = true;
    this.showPostMenu = false;
  }

  confirmDelete(): void {
    this.isDeleteLoading = true;
    const postId = this.post.id || this.post._id;
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.showDeleteDialog = false;
        this.isDeleteLoading = false;
        this.postDeleted.emit(postId);
        this.postsService.postDeleted$.next(postId);
      },
      error: () => {
        this.isDeleteLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.isDeleteLoading = false;
  }
}
