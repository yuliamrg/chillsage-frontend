import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RequestFormValue } from '../../../core/models/domain.models';
import { RequestsService } from '../../../core/services/requests.service';

@Component({
  selector: 'app-requests-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './requests-create.component.html',
  styles: ``,
})
export class RequestsCreateComponent {
  private readonly router = inject(Router);
  private readonly requestsService = inject(RequestsService);

  errorMessage = '';
  isSaving = false;
  form: RequestFormValue = {
    description: '',
    status: 'Pendiente',
  };

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;

    this.requestsService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/requests/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear la solicitud.';
      },
    });
  }
}
