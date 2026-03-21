import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-create.component.html',
  styles: ``,
})
export class ClientCreateComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly router = inject(Router);

  form: ClientFormValue = {
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    status: 'active',
  };
  errorMessage = '';

  submit(): void {
    this.clientsService.create(this.form).subscribe({
      next: () => this.router.navigate(['/client/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear el cliente.';
      },
    });
  }
}
