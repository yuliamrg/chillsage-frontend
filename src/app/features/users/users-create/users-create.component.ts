import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
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
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly clientsService = inject(ClientsService);
  private readonly rolesService = inject(RolesService);

  clients: ClientVm[] = [];
  roles: RoleVm[] = [];
  errorMessage = '';
  isSaving = false;
  form: UserFormValue = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    primaryClientId: null,
    clientIds: [],
    allClients: false,
    roleId: 2,
    roleName: null,
    status: 'active',
    password: '',
  };

  ngOnInit(): void {
    this.clientsService.getAll().subscribe((clients) => {
      this.clients = this.authService.getScopedClients(clients);
      this.applyCoverageDefaults();
    });
    this.rolesService.getAll().subscribe((roles) => {
      this.roles = this.getAvailableRoles(roles);
      this.syncRoleSelection();
    });
  }

  get showCoverageFields(): boolean {
    return this.form.roleName !== 'admin_plataforma';
  }

  get canManagePlatformAdmins(): boolean {
    return this.authService.role() === 'admin_plataforma';
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
    this.syncRoleSelection();
    this.applyCoverageDefaults();
  }

  onAllClientsChange(): void {
    if (this.form.allClients) {
      this.form.clientIds = [];
      if (!this.form.primaryClientId) {
        this.form.primaryClientId = this.clients[0]?.id ?? this.authService.getPreferredClientId();
      }
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

  private syncRoleSelection(): void {
    const selectedRole = this.roles.find((role) => role.id === this.form.roleId) ?? null;
    this.form.roleName = selectedRole?.name ?? null;
  }

  private applyCoverageDefaults(): void {
    if (this.form.roleName === 'admin_plataforma') {
      this.form.primaryClientId = null;
      this.form.clientIds = [];
      this.form.allClients = false;
      return;
    }

    const preferredClientId = this.authService.canAccess('users', 'create')
      ? this.authService.getPreferredClientId()
      : null;

    if (!this.form.primaryClientId) {
      this.form.primaryClientId = preferredClientId ?? this.clients[0]?.id ?? null;
    }

    if (!this.form.allClients && this.form.primaryClientId && !this.form.clientIds.length) {
      this.form.clientIds = [this.form.primaryClientId];
    }
  }

  private validateForm(): string | null {
    this.syncRoleSelection();

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
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    const validationError = this.validateForm();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }
    this.isSaving = true;

    this.usersService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/users/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.error?.message ?? error?.message ?? 'No fue posible crear el usuario.';
      },
    });
  }
}
