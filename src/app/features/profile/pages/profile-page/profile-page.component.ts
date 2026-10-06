import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { PostCardComponent } from '../../../../shared/components/post-card/post-card.component';
import { Stored_Keys } from '../../../../core/constants/stored-keys';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PostCardComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  user: any = null;
  userPosts: any[] = [];
  savedPosts: any[] = [];
  isLoading = true;
  isPostsLoading = true;
  isSavedLoading = false;
  activeTab = 'posts';
  isOwnProfile = true;
  userId: string | null = null;

  // Change password state
  showPasswordModal = false;
  passwordForm = { password: '', newPassword: '', confirmPassword: '' };
  isPasswordLoading = false;
  passwordError = '';
  passwordSuccess = '';

  // Upload photo
  isUploadingPhoto = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'] || null;
      this.isOwnProfile = !this.userId;
      this.loadProfile();
    });

    // Handle query params for tab switching (e.g. ?tab=saved from sidebar)
    this.route.queryParams.subscribe(qp => {
      if (qp['tab'] === 'saved' && this.isOwnProfile) {
        this.activeTab = 'saved';
        this.loadSavedPosts();
      }
    });

    // Listen for post deletions
    this.postsService.postDeleted$.subscribe((postId) => {
      this.userPosts = this.userPosts.filter(p => (p.id || p._id) !== postId);
      this.savedPosts = this.savedPosts.filter(p => (p.id || p._id) !== postId);
      this.cdr.markForCheck();
    });
  }

  loadProfile() {
    this.isLoading = true;

    if (this.isOwnProfile) {
      this.usersService.getMyProfile().subscribe({
        next: (res: any) => {
          this.user = res?.data?.user || res?.user || res?.data || res;
          this.isLoading = false;
          this.cdr.markForCheck();
          this.loadUserPosts();
        },
        error: () => {
          // Fallback to localStorage data
          try {
            this.user = JSON.parse(localStorage.getItem(Stored_Keys.userData)!);
          } catch {}
          this.isLoading = false;
          this.cdr.markForCheck();
          this.loadUserPosts();
        }
      });
    } else {
      this.usersService.getUserProfile(this.userId!).subscribe({
        next: (res: any) => {
          this.user = res?.data?.user || res?.user || res?.data || res;
          this.isLoading = false;
          this.cdr.markForCheck();
          this.loadUserPosts();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  loadUserPosts() {
    this.isPostsLoading = true;
    const id = this.userId || this.user?._id || this.user?.id;
    if (!id) {
      this.isPostsLoading = false;
      this.cdr.markForCheck();
      return;
    }

    // Use the proper API endpoint: GET /users/:userId/posts
    this.usersService.getUserPosts(id).subscribe({
      next: (res: any) => {
        this.userPosts = res?.data?.posts || res?.posts || [];
        if (!Array.isArray(this.userPosts)) this.userPosts = [];
        this.isPostsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.userPosts = [];
        this.isPostsLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadSavedPosts() {
    if (this.savedPosts.length > 0) return; // already loaded
    this.isSavedLoading = true;

    // Use the proper API endpoint: GET /users/bookmarks
    this.usersService.getBookmarks().subscribe({
      next: (res: any) => {
        this.savedPosts = res?.data?.posts || res?.data?.bookmarks || res?.posts || res?.bookmarks || [];
        if (!Array.isArray(this.savedPosts)) this.savedPosts = [];
        this.isSavedLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.savedPosts = [];
        this.isSavedLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'saved' && this.isOwnProfile) {
      this.loadSavedPosts();
    }
  }

  // ── Photo Upload ──
  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isUploadingPhoto = true;
    const fd = new FormData();
    fd.append('photo', file);

    this.usersService.uploadPhoto(fd).subscribe({
      next: (res: any) => {
        const newPhoto = res?.data?.user?.photo || res?.photo || res?.data?.photo;
        if (newPhoto) {
          this.user.photo = newPhoto;
          // Update localStorage
          try {
            const stored = JSON.parse(localStorage.getItem(Stored_Keys.userData)!);
            stored.photo = newPhoto;
            localStorage.setItem(Stored_Keys.userData, JSON.stringify(stored));
          } catch {}
        }
        this.isUploadingPhoto = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isUploadingPhoto = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Change Password ──
  openPasswordModal() {
    this.showPasswordModal = true;
    this.passwordForm = { password: '', newPassword: '', confirmPassword: '' };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  submitPasswordChange() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }

    this.isPasswordLoading = true;
    this.passwordError = '';

    this.usersService.changePassword({
      password: this.passwordForm.password,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        this.isPasswordLoading = false;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.showPasswordModal = false;
          this.passwordSuccess = '';
          this.cdr.markForCheck();
        }, 1500);
      },
      error: (err) => {
        this.passwordError = err?.error?.message || 'Failed to change password';
        this.isPasswordLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Follow (for other user's profile) ──
  followUser() {
    if (!this.userId) return;
    this.user.isFollowing = !this.user.isFollowing;
    this.cdr.markForCheck();

    this.usersService.followUser(this.userId).subscribe({
      error: () => {
        this.user.isFollowing = !this.user.isFollowing;
        this.cdr.markForCheck();
      }
    });
  }

  onPostDeleted(postId: string) {
    this.userPosts = this.userPosts.filter(p => (p.id || p._id) !== postId);
    this.cdr.markForCheck();
  }
}
