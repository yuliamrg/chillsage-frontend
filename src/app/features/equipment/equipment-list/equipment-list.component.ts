import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { createDefaultPagination } from '../../../core/api/pagination.utils';
import { AuthService } from '../../../core/auth/auth.service';
import { EquipmentVm, PaginationVm } from '../../../core/models/domain.models';
import { EquipmentsService } from '../../../core/services/equipments.service';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './equipment-list.component.html',
  styles: ``,
})
export class EquipmenListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly equipmentsService = inject(EquipmentsService);

  equipments: EquipmentVm[] = [];
  pagination: PaginationVm = createDefaultPagination();
  errorMessage = '';
  readonly pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.loadEquipments();
  }

  loadEquipments(): void {
    this.equipmentsService.list({ page: this.pagination.page, limit: this.pagination.limit }).subscribe({
      next: (response) => {
        this.equipments = response.items;
        this.pagination = response.pagination;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar equipos.';
      },
    });
  }

  removeEquipment(id: number): void {
    if (!this.canDeleteEquipments()) {
      return;
    }

    if (!window.confirm('Eliminar equipo?')) {
      return;
    }

    this.equipmentsService.remove(id).subscribe({
      next: () => this.loadEquipments(),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible eliminar el equipo.';
      },
    });
  }

  canCreateEquipments(): boolean {
    return this.authService.canAccess('equipments', 'create');
  }

  canUpdateEquipments(): boolean {
    return this.authService.canAccess('equipments', 'update');
  }

  canDeleteEquipments(): boolean {
    return this.authService.hasRole(['admin_plataforma', 'admin_cliente']) && this.authService.canAccess('equipments', 'delete');
  }

  onPageSizeChange(): void {
    this.pagination = { ...this.pagination, page: 1 };
    this.loadEquipments();
  }

  goToPreviousPage(): void {
    if (!this.pagination.hasPreviousPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page - 1 };
    this.loadEquipments();
  }

  goToNextPage(): void {
    if (!this.pagination.hasNextPage) {
      return;
    }

    this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
    this.loadEquipments();
  }
}
