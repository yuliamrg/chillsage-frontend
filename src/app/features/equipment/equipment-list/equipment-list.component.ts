import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipmentVm } from '../../../core/models/domain.models';
import { EquipmentsService } from '../../../core/services/equipments.service';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipment-list.component.html',
  styles: ``,
})
export class EquipmenListComponent implements OnInit {
  private readonly equipmentsService = inject(EquipmentsService);

  equipments: EquipmentVm[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.loadEquipments();
  }

  loadEquipments(): void {
    this.equipmentsService.getAll().subscribe({
      next: (equipments) => {
        this.equipments = equipments;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar equipos.';
      },
    });
  }

  removeEquipment(id: number): void {
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
}
