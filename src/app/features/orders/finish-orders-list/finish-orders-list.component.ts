import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createDefaultPagination } from '../../../core/api/pagination.utils';
import { OrderVm, PaginationVm } from '../../../core/models/domain.models';
import { OrdersService } from '../../../core/services/orders.service';

@Component({
  selector: 'app-finished-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finish-orders-list.component.html',
  styles: ``,
})
export class FinishedOrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);

  orders: OrderVm[] = [];
  pagination: PaginationVm = createDefaultPagination();
  readonly pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.list({ status: 'completed', page: this.pagination.page, limit: this.pagination.limit }).subscribe((response) => {
      this.orders = response.items;
      this.pagination = response.pagination;
    });
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
}
