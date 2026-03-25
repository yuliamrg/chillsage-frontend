import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { OrderFormValue, RequestVm, UserVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';
import { isEditableOrder } from '../../../core/utils/operational-rules';

@Component({
  selector: 'app-orders-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-edit.component.html',
  styles: ``,
})
export class OrdersEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly usersService = inject(UsersService);
  private readonly requestsService = inject(RequestsService);

  orderId = 0;
  requests: RequestVm[] = [];
  technicians: UserVm[] = [];
  errorMessage = '';
  isSaving = false;
  form: OrderFormValue = {
    requestId: null,
    assignedUserId: null,
    plannedStartAt: null,
    diagnosis: '',
    closureNotes: '',
    receivedSatisfaction: null,
  };

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      order: this.ordersService.getById(this.orderId),
      requests: this.requestsService.getAll({ status: 'approved' }),
      users: this.usersService.getAll(),
    }).subscribe({
      next: ({ order, requests, users }) => {
        if (!isEditableOrder(order)) {
          void this.router.navigate(['/orders/detail', this.orderId], {
            state: { errorMessage: 'La orden ya no se puede editar porque su estado actual es solo lectura.' },
          });
          return;
        }

        this.requests = requests;
        this.technicians = users.filter((user) => (user.roleName ?? '').toLowerCase() === 'tecnico' || user.roleId === 4);
        this.form = {
          requestId: order.requestId,
          assignedUserId: order.assignedUserId,
          plannedStartAt: order.plannedStartAt,
          diagnosis: order.diagnosis ?? '',
          closureNotes: order.closureNotes ?? '',
          receivedSatisfaction: order.receivedSatisfaction,
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar la orden.';
      },
    });
  }

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;
    this.ordersService.update(this.orderId, this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/orders/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar la orden.';
      },
    });
  }
}
