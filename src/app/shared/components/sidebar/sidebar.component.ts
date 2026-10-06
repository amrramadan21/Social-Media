import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  navLinks = [
    { label: 'Global Feed', icon: 'fa-solid fa-home', route: '/feed' },
    { label: 'My Posts', icon: 'fa-solid fa-user', route: '/profile' },
    { label: 'Saved', icon: 'fa-solid fa-bookmark', route: '/profile', queryParams: { tab: 'saved' } },
    { label: 'Community', icon: 'fa-solid fa-users', route: '/feed/community' }
  ];
}
