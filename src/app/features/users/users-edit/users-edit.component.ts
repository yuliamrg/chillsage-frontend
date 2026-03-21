import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientVm, RoleVm, UserFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { RolesService } from '../../../core/services/roles.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users-edit.component.html',
  styles: ``,
})
export class UsersEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly clientsService = inject(ClientsService);
  private readonly rolesService = inject(RolesService);

  userId = 0;
  clients: ClientVm[] = [];
  roles: RoleVm[] = [];
  errorMessage = '';
  form: UserFormValue = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    clientId: null,
    roleId: null,
    status: 'active',
  };

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientsService.getAll().subscribe((clients) => (this.clients = clients));
    this.rolesService.getAll().subscribe((roles) => (this.roles = roles));
    this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        this.form = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          clientId: user.clientId,
          roleId: user.roleId,
          status: user.status || 'active',
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el usuario.';
      },
    });
  }

  submit(): void {
    this.usersService.update(this.userId, this.form).subscribe({
      next: () => this.router.navigate(['/users/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.error?.message ?? error?.message ?? 'No fue posible actualizar el usuario.';
      },
    });
  }
}
