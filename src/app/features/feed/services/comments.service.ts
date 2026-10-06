import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly http = inject(HttpClient);

  /** Emits postId when a new comment is added to refresh the list */
  public commentAdded$ = new Subject<string>();

  // ── READ ──
  getAllComments(postId: string, pageNumber = 1) {
    return this.http.get(`${App_Apis.comments.get(postId)}?page=${pageNumber}&limit=10`);
  }

  // ── CREATE ──
  addComment(commentData: FormData | object, postId: string) {
    return this.http.post(App_Apis.comments.add(postId), commentData);
  }

  // ── UPDATE ──
  updateComment(postId: string, commentId: string, data: { content: string }) {
    return this.http.put(App_Apis.comments.update(postId, commentId), data);
  }

  // ── DELETE ──
  deleteComment(postId: string, commentId: string) {
    return this.http.delete(App_Apis.comments.delete(postId, commentId));
  }

  // ── LIKE ──
  likeComment(postId: string, commentId: string) {
    return this.http.put(App_Apis.comments.like(postId, commentId), {});
  }

  // ── REPLIES ──
  getReplies(postId: string, commentId: string) {
    return this.http.get(App_Apis.comments.replies(postId, commentId));
  }

  addReply(postId: string, commentId: string, data: FormData | object) {
    return this.http.post(App_Apis.comments.addReply(postId, commentId), data);
  }
}
