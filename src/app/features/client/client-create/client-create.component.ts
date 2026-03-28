import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ClientFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { CLIENT_STATUS_OPTIONS, normalizeClientForm, validateClientForm } from '../client-form.utils';

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

  readonly statusOptions = CLIENT_STATUS_OPTIONS;
  form: ClientFormValue = {
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    status: 'active',
  };
  errorMessage = '';
  isSaving = false;

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.form = normalizeClientForm(this.form);
    const validationError = validateClientForm(this.form, { allowMasterFieldsEdit: true });
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.isSaving = true;

    this.clientsService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/client/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear el cliente.';
      },
    });
  }
}
