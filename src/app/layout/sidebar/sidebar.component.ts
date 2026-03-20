import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  expandedSection: 'requests' | 'orders' | 'users' | null = null;

  toggleSection(section: 'requests' | 'orders' | 'users'): void {
    this.expandedSection = this.expandedSection === section ? null : section;
  }
}
