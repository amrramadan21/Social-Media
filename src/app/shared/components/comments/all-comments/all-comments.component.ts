import { Component, Input, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../../../features/feed/services/comments.service';
import { TimeAgoPipe } from '../../../pipes/time-ago.pipe';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Stored_Keys } from '../../../../core/constants/stored-keys';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-comments',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, AddCommentComponent],
  templateUrl: './all-comments.component.html',
  styleUrl: './all-comments.component.css'
})
export class AllCommentsComponent implements OnInit, OnDestroy {
  @Input() postId!: string;
  private readonly commentsService = inject(CommentsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private commentAddedSub!: Subscription;

  comments: any[] = [];
  isLoading = false;
  currentPage = 1;
  hasMore = true;
  currentUserId = '';

  // Track which comment is in reply mode
  replyingTo: string | null = null;

  constructor() {
    try {
      const data = localStorage.getItem(Stored_Keys.userData);
      if (data) {
        const parsed = JSON.parse(data);
        this.currentUserId = parsed?._id || parsed?.id || '';
      }
    } catch {}
  }

  ngOnInit() {
    this.loadComments();

    // Subscribe to new comment events from add-comment
    this.commentAddedSub = this.commentsService.commentAdded$.subscribe((postId) => {
      if (postId === this.postId) {
        this.refreshComments();
      }
    });
  }

  ngOnDestroy() {
    this.commentAddedSub?.unsubscribe();
  }

  loadComments() {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;

    this.commentsService.getAllComments(this.postId, this.currentPage).subscribe({
      next: (res: any) => {
        const fetchedComments = res?.comments || res?.data?.comments || [];
        if (fetchedComments.length < 10) {
          this.hasMore = false;
        }

        const currentIds = new Set(this.comments.map(c => c._id));
        const newComments = fetchedComments.filter((c: any) => !currentIds.has(c._id));

        this.comments = [...this.comments, ...newComments];
        this.currentPage++;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  /** Called when add-comment emits a new comment — refresh the entire list */
  refreshComments() {
    this.comments = [];
    this.currentPage = 1;
    this.hasMore = true;
    this.loadComments();
  }

  // ── Like comment ──
  likeComment(comment: any) {
    comment.isLiked = !comment.isLiked;
    comment.likesCount = (comment.likesCount || 0) + (comment.isLiked ? 1 : -1);
    this.cdr.markForCheck();

    this.commentsService.likeComment(this.postId, comment._id).subscribe({
      error: () => {
        comment.isLiked = !comment.isLiked;
        comment.likesCount = (comment.likesCount || 0) + (comment.isLiked ? 1 : -1);
        this.cdr.markForCheck();
      }
    });
  }

  // ── Delete comment ──
  deleteComment(comment: any) {
    this.commentsService.deleteComment(this.postId, comment._id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c._id !== comment._id);
        this.cdr.markForCheck();
      }
    });
  }

  // ── Reply toggle ──
  toggleReply(commentId: string) {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
  }

  isCommentOwner(comment: any): boolean {
    return this.currentUserId === (comment?.commentCreator?._id || comment?.user?._id || '');
  }
}
