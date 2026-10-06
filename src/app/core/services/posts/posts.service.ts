import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { App_Apis } from '../../constants/app-apis';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);

  /** Emits when a new post is created (from AddPostsComponent) */
  public postAdded$ = new Subject<any>();

  /** Emits when a post is deleted (postId) */
  public postDeleted$ = new Subject<string>();

  /** Emits when a post is updated (the updated post object) */
  public postUpdated$ = new Subject<any>();

  // ── CREATE ──
  addPost(postData: FormData) {
    return this.http.post(App_Apis.posts.add, postData);
  }

  // ── READ ──
  getAllPosts(page: number = 1, limit: number = 10) {
    return this.http.get(`${App_Apis.posts.get}?limit=${limit}&page=${page}`);
  }

  getFeed(page: number = 1, limit: number = 10) {
    return this.http.get(`${App_Apis.posts.feed}?limit=${limit}&page=${page}`);
  }

  getPost(postId: string) {
    return this.http.get(App_Apis.posts.single(postId));
  }

  // ── UPDATE ──
  updatePost(postId: string, postData: FormData) {
    return this.http.put(App_Apis.posts.update(postId), postData);
  }

  // ── DELETE ──
  deletePost(postId: string) {
    return this.http.delete(App_Apis.posts.delete(postId));
  }

  // ── ACTIONS ──
  likePost(postId: string) {
    return this.http.put(App_Apis.posts.like(postId), {});
  }

  bookmarkPost(postId: string) {
    return this.http.put(App_Apis.posts.bookmark(postId), {});
  }

  sharePost(postId: string) {
    return this.http.post(App_Apis.posts.share(postId), { body: "Shared this post" });
  }
}