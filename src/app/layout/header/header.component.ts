import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly authService = inject(AuthService);

  isSearchOpen = false;
  isSidebarCollapsed = false;

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    document.body.classList.toggle('sidebar-collapse', this.isSidebarCollapsed);
  }

  logout(): void {
    this.authService.logout();
  }
}
