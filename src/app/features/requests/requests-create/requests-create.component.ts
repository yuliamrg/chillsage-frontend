import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientVm, EquipmentVm, RequestFormValue, UserVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-requests-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './requests-create.component.html',
  styles: ``,
})
export class RequestsCreateComponent implements OnInit {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService, { optional: true });
  private readonly requestsService = inject(RequestsService);
  private readonly clientsService = inject(ClientsService);
  private readonly usersService = inject(UsersService);
  private readonly equipmentsService = inject(EquipmentsService);

  clients: ClientVm[] = [];
  requesters: UserVm[] = [];
  equipments: EquipmentVm[] = [];
  errorMessage = '';
  isSaving = false;
  form: RequestFormValue = {
    clientId: null,
    requesterUserId: null,
    equipmentId: null,
    type: 'corrective',
    title: '',
    description: '',
    priority: 'medium',
  };

  ngOnInit(): void {
    forkJoin({
      clients: this.clientsService.getAll(),
      users: this.usersService.getAll(),
      equipments: this.equipmentsService.getAll(),
    }).subscribe({
      next: ({ clients, users, equipments }) => {
        this.clients =
          typeof this.authService?.getScopedClients === 'function'
            ? this.authService.getScopedClients(clients)
            : clients;
        this.requesters = users.filter((user) => user.status === 'active' || user.status === 'activo');
        this.equipments = equipments;
        this.form.clientId =
          typeof this.authService?.getPreferredClientId === 'function'
            ? this.authService.getPreferredClientId()
            : this.form.clientId;
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar los datos del formulario.';
      },
    });
  }

  get showClientSelector(): boolean {
    return typeof this.authService?.buildClientScopeOptions === 'function'
      ? this.authService.buildClientScopeOptions(this.clients).showSelector
      : true;
  }

  get filteredEquipments(): EquipmentVm[] {
    if (!this.form.clientId) {
      return this.equipments;
    }

    return this.equipments.filter((equipment) => equipment.clientId === this.form.clientId);
  }

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;

    this.requestsService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/requests/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear la solicitud.';
      },
    });
  }
}
