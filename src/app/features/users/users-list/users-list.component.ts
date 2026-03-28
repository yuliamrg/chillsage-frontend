import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { createDefaultPagination } from '../../../core/api/pagination.utils';
import { AuthService } from '../../../core/auth/auth.service';
import { PaginationVm, UserVm } from '../../../core/models/domain.models';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users-list.component.html',
  styles: ``,
})
export class UsersListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);

  users: UserVm[] = [];
  pagination: PaginationVm = createDefaultPagination();
  errorMessage = '';
  readonly pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.list({ page: this.pagination.page, limit: this.pagination.limit }).subscribe({
      next: (response) => {
        this.users = response.items;
        this.pagination = response.pagination;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar usuarios.';
      },
    });
  }

  removeUser(id: number): void {
    if (!this.canDeleteUsers()) {
      return;
    }

    if (!window.confirm('Eliminar usuario?')) {
      return;
    }

    this.usersService.remove(id).subscribe({
      next: () => this.loadUsers(),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible eliminar el usuario.';
      },
    });
  }

  canCreateUsers(): boolean {
    return this.authService.canAccess('users', 'create');
  }

  canUpdateUsers(): boolean {
    return this.authService.canAccess('users', 'update');
  }

  canDeleteUsers(): boolean {
    return this.authService.canAccess('users', 'delete');
  }

  onPageSizeChange(): void {
    this.pagination = { ...this.pagination, page: 1 };
    this.loadUsers();
  }

  goToPreviousPage(): void {
    if (!this.pagination.hasPreviousPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page - 1 };
    this.loadUsers();
  }

  goToNextPage(): void {
    if (!this.pagination.hasNextPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
    this.loadUsers();
  }
}
