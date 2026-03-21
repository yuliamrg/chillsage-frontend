import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-list.component.html',
  styles: ``,
})
export class ClientListComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);

  clients: ClientVm[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar clientes.';
      },
    });
  }

  removeClient(id: number): void {
    if (!window.confirm('Eliminar cliente?')) {
      return;
    }

    this.clientsService.remove(id).subscribe({
      next: () => this.loadClients(),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible eliminar el cliente.';
      },
    });
  }
}
