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

const toApiDateTime = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const parsedValue = new Date(value);
  return Number.isNaN(parsedValue.getTime()) ? value : parsedValue.toISOString();
};

export const mapRole = (role: any): RoleVm => ({
  id: Number(role?.id ?? 0),
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
  firstName: user?.name ?? '',
  lastName: user?.last_name ?? '',
  email: user?.email ?? '',
  clientId: toNumber(user?.client_id ?? user?.client),
  clientName: user?.client_name ?? null,
  roleId: toNumber(user?.role_id ?? user?.role),
  roleName: user?.role_name ?? null,
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
  client: value.clientId,
  role: value.roleId,
  status: value.status,
  ...(value.password ? { password: value.password } : {}),
});

export const mapClientFormToApi = (value: ClientFormValue) => ({
  name: value.name,
  address: value.address,
  phone: value.phone,
  email: value.email,
  description: value.description,
  status: value.status,
});

export const mapEquipmentFormToApi = (value: EquipmentFormValue) => ({
  name: value.name,
  type: value.type,
  location: value.location,
  brand: value.brand,
  model: value.model,
  serial: value.serial,
  code: value.fixedAssetCode,
  alias: value.alias,
  client: value.clientId,
  description: value.observations,
  status: value.status,
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
