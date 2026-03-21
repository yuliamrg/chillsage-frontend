import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleVm } from '../../../core/models/domain.models';
import { RolesService } from '../../../core/services/roles.service';

@Component({
  selector: 'app-users-roles-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-roles-list.component.html',
  styles: ``,
})
export class UsersRolesListComponent implements OnInit {
  private readonly rolesService = inject(RolesService);

  roles: RoleVm[] = [];

  ngOnInit(): void {
    this.rolesService.getAll().subscribe((roles) => (this.roles = roles));
  }
}
