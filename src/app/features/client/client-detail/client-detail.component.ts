import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-detail.component.html',
  styles: ``,
})
export class ClientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientsService = inject(ClientsService);

  client: ClientVm | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientsService.getById(clientId).subscribe({
      next: (client) => {
        this.client = client;
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el cliente.';
      },
    });
  }
}
