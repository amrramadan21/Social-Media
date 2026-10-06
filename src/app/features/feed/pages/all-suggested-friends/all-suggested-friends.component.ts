import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-all-suggested-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-suggested-friends.component.html',
  styleUrl: './all-suggested-friends.component.css'
})
export class AllSuggestedFriendsComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  suggestedUsers: any[] = [];
  isLoading = false;
  
  currentPage = 1;
  hasMoreUsers = true;
  totalUsers = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    if (this.isLoading || !this.hasMoreUsers) return;
    this.isLoading = true;

    this.usersService.getSuggestions(20, this.currentPage).subscribe({
      next: (response: any) => {
        let users = response?.data?.suggestions || response?.suggestions || [];
        this.suggestedUsers = [...this.suggestedUsers, ...users];
        
        // Check pagination metadata if available
        const meta = response?.meta?.pagination;
        if (meta) {
          this.totalUsers = meta.total || this.suggestedUsers.length;
          this.hasMoreUsers = this.currentPage < meta.numberOfPages;
        } else {
          // Fallback if no meta
          this.totalUsers = this.suggestedUsers.length;
          this.hasMoreUsers = users.length === 20;
        }

        if (this.hasMoreUsers) {
          this.currentPage++;
        }
        
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

  goBack() {
    this.router.navigate(['/feed']);
  }
}
