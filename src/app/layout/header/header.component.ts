import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
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
}
