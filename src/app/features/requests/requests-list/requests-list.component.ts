import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientVm, EquipmentVm, RequestFilters, RequestVm, UserVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';
import {
  canApproveRequest,
  canCancelRequest,
  canCreateOrderFromRequest,
  isEditableRequest,
} from '../../../core/utils/operational-rules';

@Component({
  selector: 'app-open-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './requests-list.component.html',
  styles: ``,
})
export class RequestsListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly requestsService = inject(RequestsService);
  private readonly clientsService = inject(ClientsService);
  private readonly usersService = inject(UsersService);
  private readonly equipmentsService = inject(EquipmentsService);

  requests: RequestVm[] = [];
  clients: ClientVm[] = [];
  requesters: UserVm[] = [];
  equipments: EquipmentVm[] = [];
  errorMessage = '';
  filters: RequestFilters = {
    clientId: null,
    requesterUserId: null,
    equipmentId: null,
    status: null,
    type: null,
    dateFrom: null,
    dateTo: null,
  };

  ngOnInit(): void {
    forkJoin({
      clients: this.clientsService.getAll(),
      users: this.usersService.getAll(),
      equipments: this.equipmentsService.getAll(),
    }).subscribe({
      next: ({ clients, users, equipments }) => {
        this.clients = clients;
        this.requesters = users;
        this.equipments = equipments;
      },
    });

    this.loadRequests();
  }

  loadRequests(): void {
    this.requestsService.getAll(this.filters).subscribe({
      next: (requests) => {
        this.requests = requests;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar solicitudes.';
      },
    });
  }

  clearFilters(): void {
    this.filters = {
      clientId: null,
      requesterUserId: null,
      equipmentId: null,
      status: null,
      type: null,
      dateFrom: null,
      dateTo: null,
    };
    this.loadRequests();
  }

  approveRequest(request: RequestVm): void {
    const reviewNotes = window.prompt('Notas de aprobacion', request.reviewNotes ?? '') ?? '';
    this.requestsService.approve(request.id, { reviewNotes }).subscribe({
      next: () => this.loadRequests(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible aprobar la solicitud.'),
    });
  }

  cancelRequest(request: RequestVm): void {
    const cancelReason = window.prompt('Motivo de anulacion');
    if (!cancelReason) {
      return;
    }

    const reviewNotes = window.prompt('Notas de revision', request.reviewNotes ?? '') ?? '';
    this.requestsService.cancel(request.id, { cancelReason, reviewNotes }).subscribe({
      next: () => this.loadRequests(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible anular la solicitud.'),
    });
  }

  removeRequest(id: number): void {
    if (!this.canDeleteRequests() || !window.confirm('Eliminar solicitud?')) {
      return;
    }

    this.requestsService.remove(id).subscribe({
      next: () => this.loadRequests(),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible eliminar la solicitud.';
      },
    });
  }

  canCreateRequests(): boolean {
    return this.authService.canAccess('requests', 'create');
  }

  canUpdateRequests(): boolean {
    return this.authService.canAccess('requests', 'update');
  }

  canApproveRequests(): boolean {
    return this.authService.canAccess('requests', 'approve');
  }

  canCancelRequests(): boolean {
    return this.authService.canAccess('requests', 'cancel');
  }

  canDeleteRequests(): boolean {
    return this.authService.canAccess('requests', 'delete');
  }

  canEditRequest(request: RequestVm): boolean {
    return isEditableRequest(request) && this.canUpdateRequests();
  }

  canApproveRequest(request: RequestVm): boolean {
    return canApproveRequest(request) && this.canApproveRequests();
  }

  canCancelRequest(request: RequestVm): boolean {
    return canCancelRequest(request) && this.canCancelRequests();
  }

  canCreateOrder(request: RequestVm): boolean {
    return canCreateOrderFromRequest(request) && this.authService.canAccess('orders', 'create');
  }

  formatStatus(status: string | null): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'cancelled':
        return 'Anulada';
      case 'assigned':
        return 'Asignada';
      case 'in_progress':
        return 'En ejecucion';
      case 'completed':
        return 'Terminada';
      default:
        return status ?? '-';
    }
  }
}
