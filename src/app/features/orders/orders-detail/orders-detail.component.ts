import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);

  order: OrderVm | null = null;

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.ordersService.getById(orderId).subscribe((order) => (this.order = order));
  }
}
