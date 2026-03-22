import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { OrderFormValue, RequestVm, UserVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-orders-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-create.component.html',
  styles: ``,
})
export class OrdersCreateComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly requestsService = inject(RequestsService);
  private readonly usersService = inject(UsersService);

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
    const requestId = Number(this.route.snapshot.queryParamMap.get('requestId'));

    forkJoin({
      requests: this.requestsService.getAll({ status: 'approved' }),
      users: this.usersService.getAll(),
    }).subscribe({
      next: ({ requests, users }) => {
        this.requests = requests.filter((request) => !request.orderId);
        this.technicians = users.filter((user) => (user.roleName ?? '').toLowerCase() === 'tecnico' || user.roleId === 4);
        if (requestId) {
          this.form.requestId = requestId;
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar los datos de la orden.';
      },
    });
  }

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;
    this.ordersService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/orders/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear la orden.';
      },
    });
  }
}
