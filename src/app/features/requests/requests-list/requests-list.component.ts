import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { RequestVm } from '../../../core/models/domain.models';
import { RequestsService } from '../../../core/services/requests.service';

@Component({
  selector: 'app-open-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './requests-list.component.html',
  styles: ``,
})
export class RequestsListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly requestsService = inject(RequestsService);

  requests: RequestVm[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestsService.getAll().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar solicitudes.';
      },
    });
  }

  removeRequest(id: number): void {
    if (!this.canDeleteRequests()) {
      return;
    }

    if (!window.confirm('Eliminar solicitud?')) {
      return;
    }

    this.requestsService.remove(id).subscribe({
      next: () => this.loadRequests(),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible eliminar la solicitud.';
      },
    });
  }

  canCreateRequests(): boolean {
    return this.authService.canAccess('requests', 'create');
  }

  canUpdateRequests(): boolean {
    return this.authService.canAccess('requests', 'update');
  }

  canDeleteRequests(): boolean {
    return this.authService.canAccess('requests', 'delete');
  }
}
