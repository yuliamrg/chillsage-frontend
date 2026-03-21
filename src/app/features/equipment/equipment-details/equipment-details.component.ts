import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EquipmentVm } from '../../../core/models/domain.models';
import { EquipmentsService } from '../../../core/services/equipments.service';

@Component({
  selector: 'app-equipment-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipment-details.component.html',
  styles: ``,
})
export class EquipmentDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly equipmentsService = inject(EquipmentsService);

  equipment: EquipmentVm | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const equipmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.equipmentsService.getById(equipmentId).subscribe({
      next: (equipment) => {
        this.equipment = equipment;
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el equipo.';
      },
    });
  }
}
