import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
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
  private readonly authService = inject(AuthService);
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
    primaryClientId: null,
    clientIds: [],
    allClients: false,
    roleId: null,
    roleName: null,
    status: 'active',
  };

  get showCoverageFields(): boolean {
    return this.form.roleName !== 'admin_plataforma';
  }

  get canManagePlatformAdmins(): boolean {
    return this.authService.role() === 'admin_plataforma';
  }

  get isEditingSelf(): boolean {
    return this.authService.user()?.id === this.userId;
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientsService.getAll().subscribe((clients) => (this.clients = this.authService.getScopedClients(clients)));
    this.rolesService.getAll().subscribe((roles) => (this.roles = this.getAvailableRoles(roles)));
    this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        this.form = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          primaryClientId: user.primaryClientId,
          clientIds: [...user.clientIds],
          allClients: user.allClients,
          roleId: user.roleId,
          roleName: user.roleName,
          status: user.status || 'active',
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el usuario.';
      },
    });
  }

  toggleClient(clientId: number, checked: boolean): void {
    this.form.clientIds = checked
      ? [...new Set([...this.form.clientIds, clientId])]
      : this.form.clientIds.filter((id) => id !== clientId);

    if (!this.form.clientIds.includes(this.form.primaryClientId ?? -1)) {
      this.form.primaryClientId = this.form.clientIds[0] ?? null;
    }
  }

  onRoleChange(): void {
    const selectedRole = this.roles.find((role) => role.id === this.form.roleId) ?? null;
    this.form.roleName = selectedRole?.name ?? null;

    if (this.form.roleName === 'admin_plataforma') {
      this.form.primaryClientId = null;
      this.form.clientIds = [];
      this.form.allClients = false;
    }
  }

  onAllClientsChange(): void {
    if (this.form.allClients) {
      this.form.clientIds = [];
      return;
    }

    if (this.form.primaryClientId) {
      this.form.clientIds = [this.form.primaryClientId];
    }
  }

  private getAvailableRoles(roles: RoleVm[]): RoleVm[] {
    if (this.canManagePlatformAdmins) {
      return roles;
    }

    return roles.filter((role) => role.name !== 'admin_plataforma');
  }

  private validateForm(): string | null {
    if (!this.form.roleId || !this.form.roleName) {
      return 'Debe seleccionar un rol valido.';
    }

    if (this.form.roleName !== 'admin_plataforma') {
      if (!this.form.primaryClientId) {
        return 'Debe seleccionar un cliente principal.';
      }

      if (!this.form.allClients && !this.form.clientIds.length) {
        return 'Debe asociar al menos un cliente para el usuario.';
      }

      if (!this.form.allClients && !this.form.clientIds.includes(this.form.primaryClientId)) {
        return 'El cliente principal debe pertenecer a la cobertura seleccionada.';
      }
    }

    return null;
  }

  submit(): void {
    const validationError = this.validateForm();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.usersService.update(this.userId, this.form).subscribe({
      next: () => this.router.navigate(['/users/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.error?.message ?? error?.message ?? 'No fue posible actualizar el usuario.';
      },
    });
  }
}
