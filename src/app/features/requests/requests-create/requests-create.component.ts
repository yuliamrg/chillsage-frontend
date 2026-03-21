import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  form: RequestFormValue = {
    description: '',
    status: 'Pendiente',
  };

  submit(): void {
    this.requestsService.create(this.form).subscribe({
      next: () => this.router.navigate(['/requests/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear la solicitud.';
      },
    });
  }
}
