import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ClientVm, EquipmentVm, RequestFormValue, UserVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-requests-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './requests-edit.component.html',
  styles: ``,
})
export class RequestsEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly requestsService = inject(RequestsService);
  private readonly clientsService = inject(ClientsService);
  private readonly usersService = inject(UsersService);
  private readonly equipmentsService = inject(EquipmentsService);

  requestId = 0;
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
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      request: this.requestsService.getById(this.requestId),
      clients: this.clientsService.getAll(),
      users: this.usersService.getAll(),
      equipments: this.equipmentsService.getAll(),
    }).subscribe({
      next: ({ request, clients, users, equipments }) => {
        this.clients = clients;
        this.requesters = users.filter((user) => user.status === 'active' || user.status === 'activo');
        this.equipments = equipments;
        this.form = {
          clientId: request.clientId,
          requesterUserId: request.requesterUserId,
          equipmentId: request.equipmentId,
          type: request.type || 'corrective',
          title: request.title,
          description: request.description,
          priority: request.priority || 'medium',
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar la solicitud.';
      },
    });
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

    this.requestsService.update(this.requestId, this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/requests/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar la solicitud.';
      },
    });
  }
}
