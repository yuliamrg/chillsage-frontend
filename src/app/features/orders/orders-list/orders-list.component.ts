import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { createDefaultPagination } from '../../../core/api/pagination.utils';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientVm, EquipmentVm, OrderFilters, OrderVm, PaginationVm, UserVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { OrdersService } from '../../../core/services/orders.service';
import { UsersService } from '../../../core/services/users.service';
import {
  canAssignOrder,
  canCancelOrder,
  canCompleteOrder,
  canStartOrder,
  isEditableOrder,
} from '../../../core/utils/operational-rules';

@Component({
  selector: 'app-pending-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-list.component.html',
  styles: ``,
})
export class OrdersListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly ordersService = inject(OrdersService);
  private readonly clientsService = inject(ClientsService);
  private readonly equipmentsService = inject(EquipmentsService);
  private readonly usersService = inject(UsersService);

  orders: OrderVm[] = [];
  clients: ClientVm[] = [];
  equipments: EquipmentVm[] = [];
  technicians: UserVm[] = [];
  pagination: PaginationVm = createDefaultPagination();
  errorMessage = '';
  readonly pageSizeOptions = [10, 25, 50, 100];
  filters: OrderFilters = {
    clientId: null,
    equipmentId: null,
    assignedUserId: null,
    status: null,
    type: null,
    dateFrom: null,
    dateTo: null,
  };

  ngOnInit(): void {
    forkJoin({
      clients: this.clientsService.getAll(),
      equipments: this.equipmentsService.getAll(),
      users: this.usersService.getAll(),
    }).subscribe({
      next: ({ clients, equipments, users }) => {
        this.clients =
          typeof this.authService.getScopedClients === 'function'
            ? this.authService.getScopedClients(clients)
            : clients;
        this.equipments = equipments;
        this.technicians = users.filter((user) => (user.roleName ?? '').toLowerCase() === 'tecnico' || user.roleId === 4);
      },
    });

    this.loadOrders();
  }

  get showClientFilter(): boolean {
    return typeof this.authService.hasGlobalClientCoverage === 'function'
      ? this.authService.hasGlobalClientCoverage()
      : true;
  }

  loadOrders(): void {
    const ordersService = this.ordersService as any;

    if (typeof ordersService.list === 'function') {
      ordersService.list({ ...this.filters, page: this.pagination.page, limit: this.pagination.limit }).subscribe({
        next: (response: any) => {
          this.orders = response.items;
          this.pagination = response.pagination;
          this.errorMessage = '';
        },
        error: (error: any) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar ordenes.'),
      });
      return;
    }

    this.ordersService.getAll(this.filters).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.pagination = {
          ...this.pagination,
          total: orders.length,
          totalPages: orders.length ? 1 : 0,
          returned: orders.length,
          hasNextPage: false,
          hasPreviousPage: false,
        };
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar ordenes.'),
    });
  }

  clearFilters(): void {
    this.filters = {
      clientId: null,
      equipmentId: null,
      assignedUserId: null,
      status: null,
      type: null,
      dateFrom: null,
      dateTo: null,
    };
    this.pagination = { ...this.pagination, page: 1 };
    this.loadOrders();
  }

  assignOrder(order: OrderVm): void {
    const currentAssigned = order.assignedUserId?.toString() ?? '';
    const assignedUserIdInput = window.prompt('Id del tecnico asignado', currentAssigned);
    if (!assignedUserIdInput) {
      return;
    }

    const assignedUserId = Number(assignedUserIdInput);
    if (Number.isNaN(assignedUserId)) {
      return;
    }

    const plannedStartAt = window.prompt('Fecha y hora planeada (ISO)', order.plannedStartAt ?? '') || null;
    this.ordersService.assign(order.id, { assignedUserId, plannedStartAt }).subscribe({
      next: () => this.loadOrders(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible asignar la orden.'),
    });
  }

  startOrder(order: OrderVm): void {
    const startedAt = window.prompt('Fecha y hora de inicio (ISO o vacio para usar backend)', order.startedAt ?? '') || null;
    this.ordersService.start(order.id, { startedAt }).subscribe({
      next: () => this.loadOrders(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible iniciar la orden.'),
    });
  }

  completeOrder(order: OrderVm): void {
    const workDescription = window.prompt('Descripcion del trabajo realizado');
    const workedHours = Number(window.prompt('Horas trabajadas', order.workedHours?.toString() ?? ''));
    if (!workDescription || Number.isNaN(workedHours)) {
      return;
    }

    const finishedAt = window.prompt('Fecha y hora de finalizacion (ISO o vacio para usar backend)', order.finishedAt ?? '') || null;
    const closureNotes = window.prompt('Notas de cierre', order.closureNotes ?? '') ?? '';
    const diagnosis = window.prompt('Diagnostico final', order.diagnosis ?? '') ?? '';
    const satisfactionAnswer = window.prompt('Recibida a satisfaccion? si/no', order.receivedSatisfaction === null ? '' : order.receivedSatisfaction ? 'si' : 'no');
    const receivedSatisfaction =
      satisfactionAnswer === null || satisfactionAnswer === '' ? null : satisfactionAnswer.toLowerCase() === 'si';

    this.ordersService.complete(order.id, {
      finishedAt,
      workedHours,
      workDescription,
      closureNotes,
      diagnosis,
      receivedSatisfaction,
    }).subscribe({
      next: () => this.loadOrders(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible completar la orden.'),
    });
  }

  cancelOrder(order: OrderVm): void {
    const cancelReason = window.prompt('Motivo de anulacion');
    if (!cancelReason) {
      return;
    }

    this.ordersService.cancel(order.id, { cancelReason }).subscribe({
      next: () => this.loadOrders(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible anular la orden.'),
    });
  }

  private isTechnician(): boolean {
    return this.authService.role() === 'tecnico';
  }

  canEditOrder(order: OrderVm): boolean {
    return isEditableOrder(order) && this.authService.canAccess('orders', 'update');
  }

  canAssignOrder(order: OrderVm): boolean {
    return canAssignOrder(order) && this.authService.canAccess('orders', 'assign');
  }

  canStartOrder(order: OrderVm): boolean {
    return this.authService.canAccess('orders', 'start') && canStartOrder(order, this.authService.user(), this.isTechnician());
  }

  canCompleteOrder(order: OrderVm): boolean {
    return this.authService.canAccess('orders', 'complete') && canCompleteOrder(order, this.authService.user(), this.isTechnician());
  }

  canCancelOrder(order: OrderVm): boolean {
    return canCancelOrder(order) && this.authService.canAccess('orders', 'cancel');
  }

  applyFilters(): void {
    this.pagination = { ...this.pagination, page: 1 };
    this.loadOrders();
  }

  onPageSizeChange(): void {
    this.pagination = { ...this.pagination, page: 1 };
    this.loadOrders();
  }

  goToPreviousPage(): void {
    if (!this.pagination.hasPreviousPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page - 1 };
    this.loadOrders();
  }

  goToNextPage(): void {
    if (!this.pagination.hasNextPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
    this.loadOrders();
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
