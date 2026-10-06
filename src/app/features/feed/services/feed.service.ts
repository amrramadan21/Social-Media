import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';
import { AllPostsResponse } from '../interfaces/IAllPostsResponse';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private readonly http = inject(HttpClient);

  getAllPosts(page: number = 1, limit: number = 10) {
    return this.http.get<AllPostsResponse>(`${App_Apis.posts.get}?limit=${limit}&page=${page}`);
  }

  /** Use the personalized feed endpoint */
  getFeed(page: number = 1, limit: number = 10) {
    return this.http.get<AllPostsResponse>(`${App_Apis.posts.feed}?limit=${limit}&page=${page}`);
  }
}
