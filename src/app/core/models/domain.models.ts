export interface RoleVm {
  id: number;
  description: string;
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
}

export interface RequestVm {
  id: number;
  description: string;
  status: string;
  createdAt: string | null;
}

export interface OrderVm {
  id: number;
  requestId: number | null;
  responsibleUserId: number | null;
  responsibleName: string | null;
  status: string;
  createdAt: string | null;
  description: string;
  hours: number | null;
  requestSummary: string | null;
}

export interface ScheduleVm {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string | null;
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
}

export interface RequestFormValue {
  description: string;
  status: string;
}

export interface OrderFormValue {
  requestId: number | null;
  responsibleUserId: number | null;
  status: string;
  description: string;
  hours: number | null;
}

export interface ScheduleFormValue {
  name: string;
  description: string;
  status: string;
}
