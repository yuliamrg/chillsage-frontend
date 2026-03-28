import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { EquipmenListComponent } from './equipment-list.component';

describe('EquipmenListComponent', () => {
  let fixture: any;
  let component: EquipmenListComponent;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess', 'hasRole']);
    authService.canAccess.and.returnValue(true);
    authService.hasRole.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [EquipmenListComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        {
          provide: EquipmentsService,
          useValue: {
            list: () =>
              of({
                items: [
                  {
                    id: 1,
                    name: 'Equipo 1',
                    type: '',
                    location: '',
                    brand: '',
                    model: '',
                    serial: 'SER-1',
                    fixedAssetCode: 'EQ-1',
                    alias: '',
                    clientId: 1,
                    clientName: 'Cliente',
                    observations: '',
                    status: 'active',
                    useStartAt: null,
                    useEndAt: null,
                  },
                ],
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 1,
                  totalPages: 1,
                  returned: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
                sort: null,
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('oculta eliminar cuando el usuario no es admin', () => {
    const deleteButton = fixture.nativeElement.querySelector('button.btn-danger');

    expect(component.canDeleteEquipments()).toBeFalse();
    expect(deleteButton).toBeNull();
  });

  it('muestra eliminar cuando el usuario es admin', () => {
    authService.hasRole.and.returnValue(true);

    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('button.btn-danger');
    expect(component.canDeleteEquipments()).toBeTrue();
    expect(deleteButton?.textContent).toContain('Eliminar');
  });
});
