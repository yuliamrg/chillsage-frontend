import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserVm } from '../../../core/models/domain.models';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-detail.component.html',
  styles: ``,
})
export class UsersDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);

  user: UserVm | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.usersService.getById(userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el usuario.';
      },
    });
  }
}
