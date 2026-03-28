import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { createDefaultPagination } from '../../../core/api/pagination.utils';
import { PaginationVm, RequestVm } from '../../../core/models/domain.models';
import { RequestsService } from '../../../core/services/requests.service';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-requests-list.component.html',
  styles: ``,
})
export class AllRequestsComponent implements OnInit {
  private readonly requestsService = inject(RequestsService);

  requests: RequestVm[] = [];
  pagination: PaginationVm = createDefaultPagination();
  readonly pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestsService.list({ page: this.pagination.page, limit: this.pagination.limit }).subscribe((response) => {
      this.requests = response.items;
      this.pagination = response.pagination;
    });
  }

  onPageSizeChange(): void {
    this.pagination = { ...this.pagination, page: 1 };
    this.loadRequests();
  }

  goToPreviousPage(): void {
    if (!this.pagination.hasPreviousPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page - 1 };
    this.loadRequests();
  }

  goToNextPage(): void {
    if (!this.pagination.hasNextPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
    this.loadRequests();
  }
}
