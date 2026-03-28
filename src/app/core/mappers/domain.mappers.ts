import {
  ClientFormValue,
  ClientVm,
  EquipmentFormValue,
  EquipmentVm,
  OrderAssignFormValue,
  OrderCancelFormValue,
  OrderCompleteFormValue,
  OrderFormValue,
  OrderStartFormValue,
  OrderVm,
  RequestApprovalFormValue,
  RequestCancelFormValue,
  RequestFormValue,
  RequestVm,
  RoleVm,
  ScheduleCloseFormValue,
  ScheduleFormValue,
  ScheduleVm,
  ScheduleOpenFormValue,
  UserFormValue,
  UserVm,
} from '../models/domain.models';

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const toStringArray = (value: unknown): any[] => (Array.isArray(value) ? value : []);
const toNumberArray = (value: unknown): number[] =>
  toStringArray(value)
    .map((item) => Number(item))
    .filter((item) => !Number.isNaN(item));

const normalizeRoleName = (value: unknown): string => {
  const normalizedValue = String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');

  switch (normalizedValue) {
    case 'admin':
    case 'admin_plataforma':
    case 'administrador_plataforma':
      return 'admin_plataforma';
    case 'admin_cliente':
    case 'administrador_cliente':
      return 'admin_cliente';
    case 'planeador':
    case 'planner':
      return 'planeador';
    case 'tecnico':
    case 'tecnica':
    case 'technician':
      return 'tecnico';
    case 'solicitante':
    case 'requester':
      return 'solicitante';
    default:
      return normalizedValue;
  }
};

const toApiDateTime = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const parsedValue = new Date(value);
  return Number.isNaN(parsedValue.getTime()) ? value : parsedValue.toISOString();
};

export const mapRole = (role: any): RoleVm => ({
  id: Number(role?.id ?? 0),
  name: normalizeRoleName(role?.name ?? role?.role_name ?? role?.slug ?? role?.description),
  description: role?.description ?? '',
});

export const mapClient = (client: any): ClientVm => ({
  id: Number(client?.id ?? 0),
  name: client?.name ?? '',
  address: client?.address ?? '',
  phone: client?.phone ?? '',
  email: client?.email ?? '',
  description: client?.description ?? '',
  status: client?.status ?? '',
});

export const mapUser = (user: any): UserVm => ({
  id: Number(user?.id ?? 0),
  username: user?.username ?? '',
  firstName: user?.name ?? user?.firstName ?? '',
  lastName: user?.last_name ?? user?.lastName ?? '',
  email: user?.email ?? '',
  primaryClientId: toNumber(user?.primary_client_id ?? user?.primaryClientId ?? user?.client_id ?? user?.clientId ?? user?.client),
  primaryClientName: user?.primary_client_name ?? user?.primaryClientName ?? user?.client_name ?? user?.clientName ?? null,
  clientIds: toNumberArray(user?.client_ids ?? user?.clientIds),
  allClients: Boolean(user?.all_clients ?? user?.allClients),
  clients: toStringArray(user?.clients).map((client) => ({
    id: Number(client?.id ?? 0),
    name: client?.name ?? '',
  })),
  clientId: toNumber(user?.primary_client_id ?? user?.primaryClientId ?? user?.client_id ?? user?.clientId ?? user?.client),
  clientName: user?.primary_client_name ?? user?.primaryClientName ?? user?.client_name ?? user?.clientName ?? null,
  roleId: toNumber(user?.role_id ?? user?.roleId ?? user?.role),
  roleName: normalizeRoleName(user?.role_name ?? user?.roleName) || null,
  status: user?.status ?? '',
});

export const mapEquipment = (equipment: any): EquipmentVm => ({
  id: Number(equipment?.id ?? 0),
  name: equipment?.name ?? '',
  type: equipment?.type ?? '',
  location: equipment?.location ?? '',
  brand: equipment?.brand ?? '',
  model: equipment?.model ?? '',
  serial: equipment?.serial ?? '',
  fixedAssetCode: equipment?.code ?? equipment?.fixed_asset_code ?? '',
  alias: equipment?.alias ?? '',
  clientId: toNumber(equipment?.client_id ?? equipment?.client),
  clientName: equipment?.client_name ?? null,
  observations: equipment?.description ?? equipment?.observations ?? '',
  status: equipment?.status ?? '',
  useStartAt: equipment?.use_start_at ?? null,
  useEndAt: equipment?.use_end_at ?? null,
});

export const mapRequest = (request: any): RequestVm => ({
  id: Number(request?.id ?? 0),
  clientId: toNumber(request?.client_id),
  clientName: request?.client_name ?? null,
  requesterUserId: toNumber(request?.requester_user_id),
  requesterName: request?.requester_name ?? null,
  equipmentId: toNumber(request?.equipment_id),
  equipmentName: request?.equipment_name ?? null,
  equipmentCode: request?.equipment_code ?? null,
  type: request?.type ?? '',
  title: request?.title ?? '',
  description: request?.description ?? '',
  priority: request?.priority ?? '',
  status: request?.status ?? '',
  requestedAt: request?.requested_at ?? null,
  reviewedAt: request?.reviewed_at ?? null,
  reviewedByUserId: toNumber(request?.reviewed_by_user_id),
  reviewNotes: request?.review_notes ?? null,
  cancelReason: request?.cancel_reason ?? null,
  orderId: toNumber(request?.order_id),
  orderStatus: request?.order_status ?? null,
  createdAt: request?.created_at ?? null,
  updatedAt: request?.updated_at ?? null,
});

export const mapOrder = (order: any): OrderVm => ({
  id: Number(order?.id ?? 0),
  requestId: toNumber(order?.request_id),
  requestStatus: order?.request_status ?? null,
  clientId: toNumber(order?.client_id),
  clientName: order?.client_name ?? null,
  equipmentId: toNumber(order?.equipment_id),
  equipmentName: order?.equipment_name ?? null,
  equipmentCode: order?.equipment_code ?? null,
  assignedUserId: toNumber(order?.assigned_user_id),
  assignedUserName: order?.assigned_user_name ?? null,
  type: order?.type ?? '',
  status: order?.status ?? '',
  plannedStartAt: order?.planned_start_at ?? null,
  startedAt: order?.started_at ?? null,
  finishedAt: order?.finished_at ?? null,
  diagnosis: order?.diagnosis ?? null,
  workDescription: order?.work_description ?? null,
  closureNotes: order?.closure_notes ?? null,
  cancelReason: order?.cancel_reason ?? null,
  receivedSatisfaction:
    typeof order?.received_satisfaction === 'boolean' ? order.received_satisfaction : null,
  workedHours: typeof order?.worked_hours === 'number' ? order.worked_hours : toNumber(order?.worked_hours),
  createdAt: order?.created_at ?? null,
  updatedAt: order?.updated_at ?? null,
  requestSummary: order?.request_summary ?? null,
});

export const mapSchedule = (schedule: any): ScheduleVm => ({
  id: Number(schedule?.id ?? 0),
  clientId: toNumber(schedule?.client_id),
  clientName: schedule?.client_name ?? null,
  name: schedule?.name ?? '',
  type: schedule?.type ?? '',
  scheduledDate: schedule?.scheduled_date ?? null,
  description: schedule?.description ?? '',
  status: schedule?.status ?? '',
  equipmentIds: toStringArray(schedule?.equipment_ids).map((equipmentId) => Number(equipmentId)).filter((equipmentId) => !Number.isNaN(equipmentId)),
  equipments: toStringArray(schedule?.equipments).map((equipment) => ({
    id: Number(equipment?.id ?? 0),
    name: equipment?.name ?? '',
    code: equipment?.code ?? equipment?.equipment_code ?? null,
  })),
  createdAt: schedule?.created_at ?? null,
  updatedAt: schedule?.updated_at ?? null,
});

export const mapUserFormToApi = (value: UserFormValue) => ({
  username: value.username,
  name: value.firstName,
  last_name: value.lastName,
  email: value.email,
  role: value.roleId,
  status: value.status,
  ...(value.roleName === 'admin_plataforma'
    ? {}
    : {
        primary_client_id: value.primaryClientId,
        client_ids: value.allClients ? [] : value.clientIds,
        all_clients: value.allClients,
      }),
  ...(value.password ? { password: value.password } : {}),
});

export const mapClientFormToApi = (value: Partial<ClientFormValue>) => ({
  ...(value.name !== undefined ? { name: value.name } : {}),
  ...(value.address !== undefined ? { address: value.address } : {}),
  ...(value.phone !== undefined ? { phone: value.phone } : {}),
  ...(value.email !== undefined ? { email: value.email } : {}),
  ...(value.description !== undefined ? { description: value.description } : {}),
  ...(value.status !== undefined ? { status: value.status } : {}),
});

export const mapEquipmentFormToApi = (value: Partial<EquipmentFormValue>) => ({
  ...(value.name !== undefined ? { name: value.name } : {}),
  ...(value.type !== undefined ? { type: value.type } : {}),
  ...(value.location !== undefined ? { location: value.location } : {}),
  ...(value.brand !== undefined ? { brand: value.brand } : {}),
  ...(value.model !== undefined ? { model: value.model } : {}),
  ...(value.serial !== undefined ? { serial: value.serial } : {}),
  ...(value.fixedAssetCode !== undefined ? { code: value.fixedAssetCode } : {}),
  ...(value.alias !== undefined ? { alias: value.alias } : {}),
  ...(value.clientId !== undefined ? { client: value.clientId } : {}),
  ...(value.observations !== undefined ? { description: value.observations } : {}),
  ...(value.status !== undefined ? { status: value.status } : {}),
  ...(value.useStartAt !== undefined ? { use_start_at: toApiDateTime(value.useStartAt) } : {}),
  ...(value.useEndAt !== undefined ? { use_end_at: toApiDateTime(value.useEndAt) } : {}),
});

export const mapRequestFormToApi = (value: RequestFormValue) => ({
  client_id: value.clientId,
  requester_user_id: value.requesterUserId,
  equipment_id: value.equipmentId,
  type: value.type,
  title: value.title,
  description: value.description,
  priority: value.priority,
});

export const mapRequestApprovalFormToApi = (value: RequestApprovalFormValue) => ({
  review_notes: value.reviewNotes,
});

export const mapRequestCancelFormToApi = (value: RequestCancelFormValue) => ({
  cancel_reason: value.cancelReason,
  review_notes: value.reviewNotes,
});

export const mapOrderFormToApi = (value: OrderFormValue) => ({
  request_id: value.requestId,
  assigned_user_id: value.assignedUserId,
  planned_start_at: value.plannedStartAt,
  diagnosis: value.diagnosis || null,
  closure_notes: value.closureNotes || null,
  received_satisfaction: value.receivedSatisfaction,
});

export const mapOrderAssignFormToApi = (value: OrderAssignFormValue) => ({
  assigned_user_id: value.assignedUserId,
  planned_start_at: value.plannedStartAt,
});

export const mapOrderStartFormToApi = (value: OrderStartFormValue) => ({
  started_at: value.startedAt,
});

export const mapOrderCompleteFormToApi = (value: OrderCompleteFormValue) => ({
  finished_at: value.finishedAt,
  worked_hours: value.workedHours,
  work_description: value.workDescription,
  closure_notes: value.closureNotes || null,
  diagnosis: value.diagnosis || null,
  received_satisfaction: value.receivedSatisfaction,
});

export const mapOrderCancelFormToApi = (value: OrderCancelFormValue) => ({
  cancel_reason: value.cancelReason,
});

export const mapScheduleFormToApi = (value: ScheduleFormValue) => ({
  client_id: value.clientId,
  name: value.name,
  type: value.type,
  scheduled_date: toApiDateTime(value.scheduledDate),
  description: value.description,
  equipment_ids: value.equipmentIds,
});

export const mapScheduleOpenFormToApi = (_value: ScheduleOpenFormValue) => ({});

export const mapScheduleCloseFormToApi = (_value: ScheduleCloseFormValue) => ({});
