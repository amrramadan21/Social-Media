import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { App_Apis } from '../../constants/app-apis';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);

  // ── Suggestions ──
  getSuggestions(limit: number = 10, page: number = 1): Observable<any> {
    return this.http.get<any>(`${App_Apis.users.suggestions}?limit=${limit}&page=${page}`);
  }

  // ── Follow / Unfollow ──
  followUser(userId: string): Observable<any> {
    return this.http.put<any>(App_Apis.users.follow(userId), {});
  }

  // ── Profile Data (my own profile) ──
  getMyProfile(): Observable<any> {
    return this.http.get<any>(App_Apis.auth.profileData);
  }

  // ── Other user's profile ──
  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(App_Apis.users.profile(userId));
  }

  // ── Other user's posts ──
  getUserPosts(userId: string, page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${App_Apis.users.posts(userId)}?page=${page}&limit=${limit}`);
  }

  // ── Bookmarked posts ──
  getBookmarks(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get<any>(`${App_Apis.users.bookmarks}?page=${page}&limit=${limit}`);
  }

  // ── Change Password ──
  changePassword(data: { password: string; newPassword: string }): Observable<any> {
    return this.http.patch<any>(App_Apis.auth.changePassword, data);
  }

  // ── Upload Profile Photo ──
  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.put<any>(App_Apis.auth.uploadPhoto, formData);
  }
}
