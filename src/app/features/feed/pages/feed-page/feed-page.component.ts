import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddPostsComponent } from '../../../../shared/components/add-posts/add-posts.component';
import { FeedService } from '../../services/feed.service';
import { Post } from '../../interfaces/IAllPostsResponse';
import { PostCardComponent } from '../../../../shared/components/post-card/post-card.component';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { CommonModule } from '@angular/common';
import { FeedSuggestedFriendsComponent } from '../../components/feed-suggested-friends/feed-suggested-friends.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [
    AddPostsComponent,
    PostCardComponent,
    SidebarComponent,
    FeedSuggestedFriendsComponent,
    LoadingSkeletonComponent,
    CommonModule,
  ],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.css',
})
export class FeedPageComponent implements OnInit, OnDestroy {
  private readonly feedService = inject(FeedService);
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private subs: Subscription[] = [];

  allPosts: Post[] = [];
  isLoading = false;
  isInitialLoad = true;
  hasError = false;

  // Pagination
  currentPage = 1;
  hasMorePosts = true;

  activeTab: 'feed' | 'community' = 'feed';

  ngOnInit(): void {
    // Determine tab based on route
    this.subs.push(
      this.route.url.subscribe(segments => {
        const path = segments.length > 0 ? segments[0].path : 'feed';
        this.activeTab = path === 'community' ? 'community' : 'feed';

        // Reset state and reload
        this.currentPage = 1;
        this.hasMorePosts = true;
        this.allPosts = [];
        this.isInitialLoad = true;
        this.isLoading = false; // Reset so loadPosts guard doesn't block
        this.loadPosts();
      })
    );

    // Listen for new posts
    this.subs.push(
      this.postsService.postAdded$.subscribe((newPost) => {
        if (newPost && !this.allPosts.find(p => (p.id || p._id) === (newPost.id || newPost._id))) {
          this.allPosts = [newPost, ...this.allPosts];
          this.cdr.markForCheck();
        }
      })
    );

    // Listen for deleted posts
    this.subs.push(
      this.postsService.postDeleted$.subscribe((postId) => {
        this.allPosts = this.allPosts.filter(p => (p.id || p._id) !== postId);
        this.cdr.markForCheck();
      })
    );

    // Listen for updated posts
    this.subs.push(
      this.postsService.postUpdated$.subscribe((updatedPost) => {
        const index = this.allPosts.findIndex(p => (p.id || p._id) === (updatedPost.id || updatedPost._id));
        if (index !== -1) {
          this.allPosts[index] = { ...this.allPosts[index], ...updatedPost };
          this.allPosts = [...this.allPosts]; // trigger change detection
          this.cdr.markForCheck();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  setTab(tab: 'feed' | 'community'): void {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.currentPage = 1;
    this.hasMorePosts = true;
    this.allPosts = [];
    this.isInitialLoad = true;
    this.isLoading = false;
    this.loadPosts();
  }

  loadPosts(): void {
    if (this.isLoading || !this.hasMorePosts) return;

    // Set loading synchronously — no Promise.resolve() hack
    this.isLoading = true;
    this.hasError = false;

    // Global Feed = all posts (/posts), Community = personalized feed (/posts/feed)
    const request = this.activeTab === 'community'
      ? this.feedService.getFeed(this.currentPage, 10)
      : this.feedService.getAllPosts(this.currentPage, 10);

    request.subscribe({
      next: (response: any) => {
        const posts = response?.data?.posts || response?.posts || [];

        if (posts.length < 10) {
          this.hasMorePosts = false;
        }

        const currentIds = new Set(this.allPosts.map(p => p.id || p._id));
        const newPosts = posts.filter((p: any) => !currentIds.has(p.id || p._id));

        this.allPosts = [...this.allPosts, ...newPosts];
        this.currentPage++;
        this.isLoading = false;
        this.isInitialLoad = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        this.isInitialLoad = false;
        this.cdr.markForCheck();
      }
    });
  }

  onScroll(): void {
    this.loadPosts();
  }

  onPostDeleted(postId: string): void {
    this.allPosts = this.allPosts.filter(p => (p.id || p._id) !== postId);
    this.cdr.markForCheck();
  }

  retryLoad(): void {
    this.hasError = false;
    this.isLoading = false;
    this.loadPosts();
  }
}
