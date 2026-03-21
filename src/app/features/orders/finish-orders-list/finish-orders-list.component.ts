import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { OrderVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';

@Component({
  selector: 'app-finished-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finish-orders-list.component.html',
  styles: ``,
})
export class FinishedOrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);

  orders: OrderVm[] = [];

  ngOnInit(): void {
    this.ordersService.getAll().subscribe((orders) => {
      this.orders = orders.filter((order) => order.status?.toLowerCase() === 'terminada');
    });
  }
}
