import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-feed-suggested-friends',
  imports: [CommonModule],
  templateUrl: './feed-suggested-friends.component.html',
  styleUrl: './feed-suggested-friends.component.css',
})
export class FeedSuggestedFriendsComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  suggestedUsers: any[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.getSuggestions();
  }

  getSuggestions() {
    this.isLoading = true;
    this.usersService.getSuggestions(10).subscribe({
      next: (response: any) => {
        let users = response?.data?.suggestions || response?.suggestions || [];
        this.suggestedUsers = Array.isArray(users) ? users.slice(0, 5) : [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load suggestions:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  followUser(user: any) {
    if (user.isLoadingFollow) return;
    user.isLoadingFollow = true;

    this.usersService.followUser(user._id).subscribe({
      next: (res) => {
        user.isLoadingFollow = false;
        user.isFollowed = !user.isFollowed;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Follow failed', err);
        user.isLoadingFollow = false;
        this.cdr.markForCheck();
      }
    });
  }

  viewAll() {
    this.router.navigate(['/feed/suggested-friends']);
  }
}
