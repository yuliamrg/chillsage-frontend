import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  readonly authService = inject(AuthService);

  expandedSection: 'requests' | 'orders' | 'users' | null = null;

  toggleSection(section: 'requests' | 'orders' | 'users'): void {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  canRead(resource: Parameters<AuthService['canAccess']>[0]): boolean {
    return this.authService.canAccess(resource, 'read');
  }
}
