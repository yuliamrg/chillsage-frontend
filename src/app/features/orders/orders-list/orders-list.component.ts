import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';

@Component({
  selector: 'app-pending-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-list.component.html',
  styles: ``,
})
export class OrdersListComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);

  orders: OrderVm[] = [];

  ngOnInit(): void {
    this.ordersService.getAll().subscribe((orders) => (this.orders = orders));
  }
}
