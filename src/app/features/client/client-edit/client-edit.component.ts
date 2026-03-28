import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { CLIENT_STATUS_OPTIONS, normalizeClientForm, validateClientForm } from '../client-form.utils';

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
  private readonly authService = inject(AuthService);
  private readonly clientsService = inject(ClientsService);

  clientId = 0;
  errorMessage = '';
  isSaving = false;
  readonly statusOptions = CLIENT_STATUS_OPTIONS;
  form: ClientFormValue = {
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    status: 'active',
  };

  get isPlanner(): boolean {
    return this.authService.role() === 'planeador';
  }

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
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.form = normalizeClientForm(this.form);
    const validationError = validateClientForm(this.form, { allowMasterFieldsEdit: !this.isPlanner });
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    const payload = this.isPlanner
      ? {
          address: this.form.address,
          phone: this.form.phone,
          description: this.form.description,
          status: this.form.status,
        }
      : this.form;

    this.isSaving = true;
    this.clientsService.update(this.clientId, payload).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.router.navigate(['/client/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar el cliente.';
      },
    });
  }
}
