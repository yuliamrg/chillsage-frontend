import {
  mapClientFormToApi,
  mapEquipment,
  mapEquipmentFormToApi,
  mapSchedule,
  mapScheduleCloseFormToApi,
  mapScheduleFormToApi,
  mapScheduleOpenFormToApi,
} from './domain.mappers';

describe('domain schedule mappers', () => {
  it('mapea equipments con ventana de uso', () => {
    const equipment = mapEquipment({
      id: 5,
      name: 'Chiller principal',
      type: 'cooling',
      location: 'Cuarto tecnico',
      brand: 'Carrier',
      model: '30XA',
      serial: 'CH-30XA-001',
      code: 'EQ-003',
      alias: 'Principal',
      client: 1,
      client_name: 'Cliente Demo',
      description: 'Equipo principal',
      status: 'maintenance',
      use_start_at: '2026-03-20T08:00:00.000Z',
      use_end_at: '2026-03-30T18:00:00.000Z',
    });

    expect(equipment).toEqual({
      id: 5,
      name: 'Chiller principal',
      type: 'cooling',
      location: 'Cuarto tecnico',
      brand: 'Carrier',
      model: '30XA',
      serial: 'CH-30XA-001',
      fixedAssetCode: 'EQ-003',
      alias: 'Principal',
      clientId: 1,
      clientName: 'Cliente Demo',
      observations: 'Equipo principal',
      status: 'maintenance',
      useStartAt: '2026-03-20T08:00:00.000Z',
      useEndAt: '2026-03-30T18:00:00.000Z',
    });
  });

  it('serializa payload parcial de equipment sin campos de auditoria', () => {
    const payload = mapEquipmentFormToApi({
      alias: 'Equipo patio',
      status: 'retired',
      useStartAt: '2026-03-28T08:30',
      useEndAt: '2026-03-28T10:30',
    });

    expect(payload).toEqual({
      alias: 'Equipo patio',
      status: 'retired',
      use_start_at: new Date('2026-03-28T08:30').toISOString(),
      use_end_at: new Date('2026-03-28T10:30').toISOString(),
    });
    expect(payload).not.toEqual(jasmine.objectContaining({
      user_created_id: jasmine.anything(),
      user_updated_id: jasmine.anything(),
    }));
  });

  it('serializa payload parcial de client sin campos de auditoria', () => {
    const payload = mapClientFormToApi({
      phone: '+57 300 123 4567',
      description: 'Contacto actualizado',
      status: 'inactive',
    });

    expect(payload).toEqual({
      phone: '+57 300 123 4567',
      description: 'Contacto actualizado',
      status: 'inactive',
    });
    expect(payload).not.toEqual(jasmine.objectContaining({
      user_created_id: jasmine.anything(),
      user_updated_id: jasmine.anything(),
    }));
  });

  it('mapea schedules con equipos resumidos y ids asociados', () => {
    const schedule = mapSchedule({
      id: 8,
      client_id: 3,
      client_name: 'Cliente Demo',
      name: 'Preventivo marzo',
      type: 'preventive',
      scheduled_date: '2026-03-28T00:00:00.000Z',
      description: 'Mantenimiento mensual',
      status: 'unassigned',
      equipment_ids: [22, '23'],
      equipments: [
        { id: 22, name: 'Chiller piso 3', code: 'EQ-003', status: 'active' },
        { id: 23, name: 'Bomba norte', equipment_code: 'EQ-004', status: 'active' },
      ],
      created_at: '2026-03-22T10:00:00.000Z',
      updated_at: '2026-03-22T11:00:00.000Z',
    });

    expect(schedule).toEqual({
      id: 8,
      clientId: 3,
      clientName: 'Cliente Demo',
      name: 'Preventivo marzo',
      type: 'preventive',
      scheduledDate: '2026-03-28T00:00:00.000Z',
      description: 'Mantenimiento mensual',
      status: 'unassigned',
      equipmentIds: [22, 23],
      equipments: [
        { id: 22, name: 'Chiller piso 3', code: 'EQ-003' },
        { id: 23, name: 'Bomba norte', code: 'EQ-004' },
      ],
      createdAt: '2026-03-22T10:00:00.000Z',
      updatedAt: '2026-03-22T11:00:00.000Z',
    });
  });

  it('serializa el formulario de schedule con fecha ISO para la API', () => {
    const payload = mapScheduleFormToApi({
      clientId: 3,
      name: 'Preventivo marzo',
      type: 'preventive',
      scheduledDate: '2026-03-28T08:30',
      description: 'Mantenimiento mensual',
      equipmentIds: [22, 23],
    });

    expect(payload).toEqual({
      client_id: 3,
      name: 'Preventivo marzo',
      type: 'preventive',
      scheduled_date: new Date('2026-03-28T08:30').toISOString(),
      description: 'Mantenimiento mensual',
      equipment_ids: [22, 23],
    });
  });

  it('envia body vacio en acciones open y close', () => {
    expect(mapScheduleOpenFormToApi({})).toEqual({});
    expect(mapScheduleCloseFormToApi({})).toEqual({});
  });
});
