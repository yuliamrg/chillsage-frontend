import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RequestVm } from '../../../core/models/domain.models';
import { RequestsService } from '../../../core/services/requests.service';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-requests-list.component.html',
  styles: ``,
})
export class AllRequestsComponent implements OnInit {
  private readonly requestsService = inject(RequestsService);

  requests: RequestVm[] = [];

  ngOnInit(): void {
    this.requestsService.getAll().subscribe((requests) => (this.requests = requests));
  }
}
