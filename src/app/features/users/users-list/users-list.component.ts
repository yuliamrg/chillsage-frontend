import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserVm } from '../../../core/models/domain.models';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list.component.html',
  styles: ``,
})
export class UsersListComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  users: UserVm[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar usuarios.';
      },
    });
  }

  removeUser(id: number): void {
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
}
