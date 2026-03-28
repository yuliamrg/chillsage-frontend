import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { createDefaultPagination } from '../../../core/api/pagination.utils';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientVm, PaginationVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-list.component.html',
  styles: ``,
})
export class ClientListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly clientsService = inject(ClientsService);

  clients: ClientVm[] = [];
  pagination: PaginationVm = createDefaultPagination();
  errorMessage = '';
  readonly pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.list({ page: this.pagination.page, limit: this.pagination.limit }).subscribe({
      next: (response) => {
        this.clients = response.items;
        this.pagination = response.pagination;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar clientes.';
      },
    });
  }

  removeClient(id: number): void {
    if (!this.canDeleteClients()) {
      return;
    }

    if (!window.confirm('Eliminar cliente?')) {
      return;
    }

    this.clientsService.remove(id).subscribe({
      next: () => this.loadClients(),
      error: (error) => {
        if (error?.status === 409) {
          this.errorMessage =
            error?.error?.msg ??
            'No se puede eliminar el cliente porque tiene usuarios, equipos, solicitudes, ordenes o cronogramas relacionados.';
          return;
        }

        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible eliminar el cliente.';
      },
    });
  }

  canCreateClients(): boolean {
    return this.authService.canAccess('clients', 'create');
  }

  canUpdateClients(): boolean {
    return this.authService.canAccess('clients', 'update');
  }

  canDeleteClients(): boolean {
    return this.authService.hasRole(['admin']) && this.authService.canAccess('clients', 'delete');
  }

  onPageSizeChange(): void {
    this.pagination = { ...this.pagination, page: 1 };
    this.loadClients();
  }

  goToPreviousPage(): void {
    if (!this.pagination.hasPreviousPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page - 1 };
    this.loadClients();
  }

  goToNextPage(): void {
    if (!this.pagination.hasNextPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
    this.loadClients();
  }
}
