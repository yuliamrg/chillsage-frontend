import {
  ClientFormValue,
  ClientVm,
  EquipmentFormValue,
  EquipmentVm,
  OrderFormValue,
  OrderVm,
  RequestFormValue,
  RequestVm,
  RoleVm,
  ScheduleFormValue,
  ScheduleVm,
  UserFormValue,
  UserVm,
} from '../models/domain.models';

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
  clientId: user?.client ?? null,
  clientName: user?.client_name ?? null,
  roleId: user?.role ?? null,
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
  fixedAssetCode: equipment?.code ?? '',
  alias: equipment?.alias ?? '',
  clientId: equipment?.client ?? null,
  clientName: equipment?.client_name ?? null,
  observations: equipment?.description ?? '',
  status: equipment?.status ?? '',
});

export const mapRequest = (request: any): RequestVm => ({
  id: Number(request?.id ?? 0),
  description: request?.description ?? '',
  status: request?.status ?? '',
  createdAt: request?.created_at ?? null,
});

export const mapOrder = (order: any): OrderVm => ({
  id: Number(order?.id ?? 0),
  requestId: order?.request_id ?? null,
  responsibleUserId: order?.user_assigned_id ?? null,
  responsibleName: order?.assigned_user_name ?? null,
  status: order?.status ?? '',
  createdAt: order?.created_at ?? null,
  description: order?.description ?? '',
  hours: order?.hours ?? null,
  requestSummary: order?.request_summary ?? null,
});

export const mapSchedule = (schedule: any): ScheduleVm => ({
  id: Number(schedule?.id ?? 0),
  name: schedule?.name ?? '',
  description: schedule?.description ?? '',
  status: schedule?.status ?? '',
  createdAt: schedule?.created_at ?? null,
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
  description: value.description,
  status: value.status,
});

export const mapOrderFormToApi = (value: OrderFormValue) => ({
  request_id: value.requestId,
  user_assigned_id: value.responsibleUserId,
  status: value.status,
  description: value.description,
  hours: value.hours,
});

export const mapScheduleFormToApi = (value: ScheduleFormValue) => ({
  name: value.name,
  description: value.description,
  status: value.status,
});
