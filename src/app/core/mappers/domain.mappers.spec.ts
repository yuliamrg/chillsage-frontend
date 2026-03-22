import {
  mapSchedule,
  mapScheduleCloseFormToApi,
  mapScheduleFormToApi,
  mapScheduleOpenFormToApi,
} from './domain.mappers';

describe('domain schedule mappers', () => {
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
