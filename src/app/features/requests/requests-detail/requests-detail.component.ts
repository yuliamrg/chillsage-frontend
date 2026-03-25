import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { RequestVm } from '../../../core/models/domain.models';
import { RequestsService } from '../../../core/services/requests.service';
import {
  canApproveRequest,
  canCancelRequest,
  canCreateOrderFromRequest,
  isEditableRequest,
} from '../../../core/utils/operational-rules';

@Component({
  selector: 'app-requests-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './requests-detail.component.html',
  styles: ``,
})
export class RequestsDetailComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly requestsService = inject(RequestsService);

  request: RequestVm | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.errorMessage = history.state?.errorMessage ?? '';
    this.loadRequest(requestId);
  }

  loadRequest(id: number): void {
    this.requestsService.getById(id).subscribe({
      next: (request) => {
        this.request = request;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar la solicitud.';
      },
    });
  }

  approveRequest(): void {
    if (!this.canApproveRequest()) {
      return;
    }

    const request = this.request;
    if (!request) {
      return;
    }

    const reviewNotes = window.prompt('Notas de aprobacion', request.reviewNotes ?? '') ?? '';
    this.requestsService.approve(request.id, { reviewNotes }).subscribe({
      next: (request) => (this.request = request),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible aprobar la solicitud.'),
    });
  }

  cancelRequest(): void {
    if (!this.canCancelRequest()) {
      return;
    }

    const request = this.request;
    if (!request) {
      return;
    }

    const cancelReason = window.prompt('Motivo de anulacion');
    if (!cancelReason) {
      return;
    }

    const reviewNotes = window.prompt('Notas de revision', request.reviewNotes ?? '') ?? '';
    this.requestsService.cancel(request.id, { cancelReason, reviewNotes }).subscribe({
      next: (request) => (this.request = request),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible anular la solicitud.'),
    });
  }

  canEditRequest(): boolean {
    return isEditableRequest(this.request) && this.authService.canAccess('requests', 'update');
  }

  canApproveRequest(): boolean {
    return canApproveRequest(this.request) && this.authService.canAccess('requests', 'approve');
  }

  canCancelRequest(): boolean {
    return canCancelRequest(this.request) && this.authService.canAccess('requests', 'cancel');
  }

  canCreateOrder(): boolean {
    return canCreateOrderFromRequest(this.request) && this.authService.canAccess('orders', 'create');
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
