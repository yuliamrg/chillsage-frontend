import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { OrderVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';

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
    if (!this.order) {
      return;
    }

    const startedAt = window.prompt('Fecha y hora de inicio (ISO o vacio para usar backend)', this.order.startedAt ?? '') || null;
    this.ordersService.start(this.order.id, { startedAt }).subscribe({
      next: (order) => (this.order = order),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible iniciar la orden.'),
    });
  }

  completeOrder(): void {
    if (!this.order) {
      return;
    }

    const workDescription = window.prompt('Descripcion del trabajo realizado');
    const workedHours = Number(window.prompt('Horas trabajadas', this.order.workedHours?.toString() ?? ''));
    if (!workDescription || Number.isNaN(workedHours)) {
      return;
    }

    const finishedAt = window.prompt('Fecha y hora de finalizacion (ISO o vacio para usar backend)', this.order.finishedAt ?? '') || null;
    const closureNotes = window.prompt('Notas de cierre', this.order.closureNotes ?? '') ?? '';
    const diagnosis = window.prompt('Diagnostico final', this.order.diagnosis ?? '') ?? '';
    const receivedSatisfactionPrompt = window.prompt('Recibida a satisfaccion? si/no', this.order.receivedSatisfaction === null ? '' : this.order.receivedSatisfaction ? 'si' : 'no');
    const receivedSatisfaction =
      receivedSatisfactionPrompt === null || receivedSatisfactionPrompt === ''
        ? null
        : receivedSatisfactionPrompt.toLowerCase() === 'si';

    this.ordersService.complete(this.order.id, {
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
    if (!this.order) {
      return;
    }

    const cancelReason = window.prompt('Motivo de anulacion');
    if (!cancelReason) {
      return;
    }

    this.ordersService.cancel(this.order.id, { cancelReason }).subscribe({
      next: (order) => (this.order = order),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible anular la orden.'),
    });
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
