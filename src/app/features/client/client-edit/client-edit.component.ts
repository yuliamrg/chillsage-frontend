import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-edit.component.html',
  styles: ``,
})
export class ClientEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);

  clientId = 0;
  errorMessage = '';
  form: ClientFormValue = {
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    status: 'active',
  };

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientsService.getById(this.clientId).subscribe({
      next: (client) => {
        this.form = {
          name: client.name,
          address: client.address,
          phone: client.phone,
          email: client.email,
          description: client.description,
          status: client.status || 'active',
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el cliente.';
      },
    });
  }

  submit(): void {
    this.clientsService.update(this.clientId, this.form).subscribe({
      next: () => this.router.navigate(['/client/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar el cliente.';
      },
    });
  }
}
