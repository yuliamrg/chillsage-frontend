import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientVm, RoleVm, UserFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { RolesService } from '../../../core/services/roles.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-users-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users-create.component.html',
  styles: ``,
})
export class UsersCreateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly clientsService = inject(ClientsService);
  private readonly rolesService = inject(RolesService);

  clients: ClientVm[] = [];
  roles: RoleVm[] = [];
  errorMessage = '';
  form: UserFormValue = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    clientId: null,
    roleId: 2,
    status: 'active',
    password: '',
  };

  ngOnInit(): void {
    this.clientsService.getAll().subscribe((clients) => (this.clients = clients));
    this.rolesService.getAll().subscribe((roles) => (this.roles = roles));
  }

  submit(): void {
    this.usersService.create(this.form).subscribe({
      next: () => this.router.navigate(['/users/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.error?.message ?? error?.message ?? 'No fue posible crear el usuario.';
      },
    });
  }
}
