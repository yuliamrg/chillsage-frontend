import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { OrderVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';
import {
  canCancelOrder,
  canCompleteOrder,
  canStartOrder,
  isEditableOrder,
} from '../../../core/utils/operational-rules';

@Component({
  selector: 'app-orders-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-detail.component.html',
  styles: ``,
})
export class OrdersDetailComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);

  order: OrderVm | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.errorMessage = history.state?.errorMessage ?? '';
    this.loadOrder(orderId);
  }

  loadOrder(id: number): void {
    this.ordersService.getById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar la orden.'),
    });
  }

  startOrder(): void {
    if (!this.canStartOrder()) {
      return;
    }

    const order = this.order;
    if (!order) {
      return;
    }

    const startedAt = window.prompt('Fecha y hora de inicio (ISO o vacio para usar backend)', order.startedAt ?? '') || null;
    this.ordersService.start(order.id, { startedAt }).subscribe({
      next: (order) => (this.order = order),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible iniciar la orden.'),
    });
  }

  completeOrder(): void {
    if (!this.canCompleteOrder()) {
      return;
    }

    const order = this.order;
    if (!order) {
      return;
    }

    const workDescription = window.prompt('Descripcion del trabajo realizado');
    const workedHours = Number(window.prompt('Horas trabajadas', order.workedHours?.toString() ?? ''));
    if (!workDescription || Number.isNaN(workedHours)) {
      return;
    }

    const finishedAt = window.prompt('Fecha y hora de finalizacion (ISO o vacio para usar backend)', order.finishedAt ?? '') || null;
    const closureNotes = window.prompt('Notas de cierre', order.closureNotes ?? '') ?? '';
    const diagnosis = window.prompt('Diagnostico final', order.diagnosis ?? '') ?? '';
    const receivedSatisfactionPrompt = window.prompt('Recibida a satisfaccion? si/no', order.receivedSatisfaction === null ? '' : order.receivedSatisfaction ? 'si' : 'no');
    const receivedSatisfaction =
      receivedSatisfactionPrompt === null || receivedSatisfactionPrompt === ''
        ? null
        : receivedSatisfactionPrompt.toLowerCase() === 'si';

    this.ordersService.complete(order.id, {
      finishedAt,
      workedHours,
      workDescription,
      closureNotes,
      diagnosis,
      receivedSatisfaction,
    }).subscribe({
      next: (order) => (this.order = order),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible completar la orden.'),
    });
  }

  cancelOrder(): void {
    if (!this.canCancelOrder()) {
      return;
    }

    const order = this.order;
    if (!order) {
      return;
    }

    const cancelReason = window.prompt('Motivo de anulacion');
    if (!cancelReason) {
      return;
    }

    this.ordersService.cancel(order.id, { cancelReason }).subscribe({
      next: (order) => (this.order = order),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible anular la orden.'),
    });
  }

  private isTechnician(): boolean {
    return this.authService.role() === 'tecnico';
  }

  canEditOrder(): boolean {
    return isEditableOrder(this.order) && this.authService.canAccess('orders', 'update');
  }

  canStartOrder(): boolean {
    return this.authService.canAccess('orders', 'start') && canStartOrder(this.order, this.authService.user(), this.isTechnician());
  }

  canCompleteOrder(): boolean {
    return this.authService.canAccess('orders', 'complete') && canCompleteOrder(this.order, this.authService.user(), this.isTechnician());
  }

  canCancelOrder(): boolean {
    return canCancelOrder(this.order) && this.authService.canAccess('orders', 'cancel');
  }

  formatStatus(status: string | null): string {
    switch (status) {
      case 'assigned':
        return 'Asignada';
      case 'in_progress':
        return 'En ejecucion';
      case 'completed':
        return 'Terminada';
      case 'cancelled':
        return 'Anulada';
      default:
        return status ?? '-';
    }
  }
}
