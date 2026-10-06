import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stored_Keys } from '../../../core/constants/stored-keys';
import { PostsService } from '../../../core/services/posts/posts.service';

@Component({
  selector: 'app-add-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-posts.component.html',
  styleUrl: './add-posts.component.css',
})
export class AddPostsComponent {
  private postsService = inject(PostsService);
  private cdr = inject(ChangeDetectorRef);

  userData: any = null;
  postContent = '';
  imageFile!: File;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  errorMessage = '';

  constructor() {
    try {
      this.userData = JSON.parse(localStorage.getItem(Stored_Keys.userData)!);
    } catch {}
  }

  onImageChange(event: Event): void {
    const files = (event?.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.imageFile = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  removeImage(): void {
    this.imageFile = null as any;
    this.imagePreviewUrl = null;
  }

  submitPost(): void {
    if (!this.postContent && !this.imageFile) return;

    this.isLoading = true;
    this.errorMessage = '';

    const fd = new FormData();
    if (this.postContent) fd.append('body', this.postContent);
    if (this.imageFile) fd.append('image', this.imageFile);

    this.postsService.addPost(fd).subscribe({
      next: (response: any) => {
        this.postsService.postAdded$.next(response?.data?.post || response?.post || response?.data);
        this.postContent = '';
        this.removeImage();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to create post';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
