import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderFormValue, RequestVm, UserVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';

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
  users: UserVm[] = [];
  errorMessage = '';
  form: OrderFormValue = {
    requestId: null,
    responsibleUserId: null,
    status: 'Pendiente',
    description: '',
    hours: null,
  };

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.requestsService.getAll().subscribe((requests) => (this.requests = requests));
    this.usersService.getAll().subscribe((users) => (this.users = users));
    this.ordersService.getById(this.orderId).subscribe((order) => {
      this.form = {
        requestId: order.requestId,
        responsibleUserId: order.responsibleUserId,
        status: order.status,
        description: order.description,
        hours: order.hours,
      };
    });
  }

  submit(): void {
    this.ordersService.update(this.orderId, this.form).subscribe({
      next: () => this.router.navigate(['/orders/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar la orden.';
      },
    });
  }
}
