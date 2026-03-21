import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RequestVm } from '../../../core/models/domain.models';
import { RequestsService } from '../../../core/services/requests.service';

@Component({
  selector: 'app-requests-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './requests-detail.component.html',
  styles: ``,
})
export class RequestsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly requestsService = inject(RequestsService);

  request: RequestVm | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.requestsService.getById(requestId).subscribe({
      next: (request) => {
        this.request = request;
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar la solicitud.';
      },
    });
  }
}
