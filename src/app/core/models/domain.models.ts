export interface RoleVm {
  id: number;
  description: string;
}

export interface PaginationVm {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  returned: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SortVm {
  field: string | null;
  direction: string | null;
}

export interface PaginatedVm<T> {
  items: T[];
  pagination: PaginationVm;
  sort: SortVm | null;
}

export interface ClientVm {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  status: string;
}

export interface UserVm {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  clientId: number | null;
  clientName: string | null;
  roleId: number | null;
  roleName: string | null;
  status: string;
}

export interface EquipmentVm {
  id: number;
  name: string;
  type: string;
  location: string;
  brand: string;
  model: string;
  serial: string;
  fixedAssetCode: string;
  alias: string;
  clientId: number | null;
  clientName: string | null;
  observations: string;
  status: string;
  useStartAt: string | null;
  useEndAt: string | null;
}

export interface RequestVm {
  id: number;
  clientId: number | null;
  clientName: string | null;
  requesterUserId: number | null;
  requesterName: string | null;
  equipmentId: number | null;
  equipmentName: string | null;
  equipmentCode: string | null;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  requestedAt: string | null;
  reviewedAt: string | null;
  reviewedByUserId: number | null;
  reviewNotes: string | null;
  cancelReason: string | null;
  orderId: number | null;
  orderStatus: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface OrderVm {
  id: number;
  requestId: number | null;
  requestStatus: string | null;
  clientId: number | null;
  clientName: string | null;
  equipmentId: number | null;
  equipmentName: string | null;
  equipmentCode: string | null;
  assignedUserId: number | null;
  assignedUserName: string | null;
  type: string;
  status: string;
  plannedStartAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  diagnosis: string | null;
  workDescription: string | null;
  closureNotes: string | null;
  cancelReason: string | null;
  receivedSatisfaction: boolean | null;
  workedHours: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  requestSummary: string | null;
}

export interface ScheduleEquipmentVm {
  id: number;
  name: string;
  code: string | null;
}

export interface ScheduleVm {
  id: number;
  clientId: number | null;
  clientName: string | null;
  name: string;
  type: string;
  scheduledDate: string | null;
  description: string;
  status: string;
  equipmentIds: number[];
  equipments: ScheduleEquipmentVm[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserFormValue {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  clientId: number | null;
  roleId: number | null;
  status: string;
  password?: string;
}

export interface ClientFormValue {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  status: string;
}

export interface EquipmentFormValue {
  name: string;
  type: string;
  location: string;
  brand: string;
  model: string;
  serial: string;
  fixedAssetCode: string;
  alias: string;
  clientId: number | null;
  observations: string;
  status: string;
  useStartAt: string | null;
  useEndAt: string | null;
}

export interface RequestFormValue {
  clientId: number | null;
  requesterUserId: number | null;
  equipmentId: number | null;
  type: string;
  title: string;
  description: string;
  priority: string;
}

export interface OrderFormValue {
  requestId: number | null;
  assignedUserId: number | null;
  plannedStartAt: string | null;
  diagnosis: string;
  closureNotes: string;
  receivedSatisfaction: boolean | null;
}

export interface ScheduleFormValue {
  clientId: number | null;
  name: string;
  type: string;
  scheduledDate: string | null;
  description: string;
  equipmentIds: number[];
}

export interface RequestApprovalFormValue {
  reviewNotes: string;
}

export interface RequestCancelFormValue {
  cancelReason: string;
  reviewNotes: string;
}

export interface OrderAssignFormValue {
  assignedUserId: number | null;
  plannedStartAt: string | null;
}

export interface OrderStartFormValue {
  startedAt: string | null;
}

export interface OrderCompleteFormValue {
  finishedAt: string | null;
  workedHours: number | null;
  workDescription: string;
  closureNotes: string;
  diagnosis: string;
  receivedSatisfaction: boolean | null;
}

export interface OrderCancelFormValue {
  cancelReason: string;
}

export interface ScheduleOpenFormValue {}

export interface ScheduleCloseFormValue {}

export interface CollectionQuery {
  page?: number | null;
  limit?: number | null;
  sort?: string | null;
}

export interface RequestFilters {
  clientId?: number | null;
  requesterUserId?: number | null;
  equipmentId?: number | null;
  status?: string | null;
  type?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface OrderFilters {
  clientId?: number | null;
  equipmentId?: number | null;
  assignedUserId?: number | null;
  status?: string | null;
  type?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface ScheduleFilters {
  clientId?: number | null;
  status?: string | null;
  type?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}
