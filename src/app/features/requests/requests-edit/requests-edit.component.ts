import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RequestFormValue } from '../../../core/models/domain.models';
import { RequestsService } from '../../../core/services/requests.service';

@Component({
  selector: 'app-requests-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './requests-edit.component.html',
  styles: ``,
})
export class RequestsEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly requestsService = inject(RequestsService);

  requestId = 0;
  errorMessage = '';
  form: RequestFormValue = {
    description: '',
    status: 'Pendiente',
  };

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.requestsService.getById(this.requestId).subscribe({
      next: (request) => {
        this.form = {
          description: request.description,
          status: request.status,
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar la solicitud.';
      },
    });
  }

  submit(): void {
    this.requestsService.update(this.requestId, this.form).subscribe({
      next: () => this.router.navigate(['/requests/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar la solicitud.';
      },
    });
  }
}
