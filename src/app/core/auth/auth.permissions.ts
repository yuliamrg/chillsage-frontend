import { AppAction, AppResource, AppRole } from './auth.models';

type ResourcePermissions = Partial<Record<AppResource, AppAction[]>>;

const fullCrud: AppAction[] = ['read', 'create', 'update', 'delete'];
const createUpdateRead: AppAction[] = ['read', 'create', 'update'];
const readOnly: AppAction[] = ['read'];
const requestCreateRead: AppAction[] = ['read', 'create'];
const requestManagement: AppAction[] = ['read', 'create', 'update', 'approve', 'cancel'];
const orderManagement: AppAction[] = ['read', 'create', 'update', 'assign', 'cancel'];
const scheduleManagement: AppAction[] = ['read', 'create', 'update', 'open', 'close'];
const fullRequests: AppAction[] = [...requestManagement, 'delete'];
const fullOrders: AppAction[] = [...orderManagement, 'start', 'complete', 'delete'];
const fullSchedules: AppAction[] = [...scheduleManagement, 'delete'];
const technicianOrders: AppAction[] = ['read', 'start', 'complete'];

const rolePermissions: Record<AppRole, ResourcePermissions> = {
  admin_plataforma: {
    users: fullCrud,
    roles: fullCrud,
    profiles: fullCrud,
    clients: fullCrud,
    equipments: fullCrud,
    requests: fullRequests,
    orders: fullOrders,
    schedules: fullSchedules,
  },
  admin_cliente: {
    users: fullCrud,
    roles: readOnly,
    profiles: readOnly,
    clients: createUpdateRead,
    equipments: fullCrud,
    requests: fullRequests,
    orders: fullOrders,
    schedules: fullSchedules,
  },
  planeador: {
    users: readOnly,
    roles: readOnly,
    profiles: readOnly,
    clients: createUpdateRead,
    equipments: createUpdateRead,
    requests: requestManagement,
    orders: [...orderManagement, 'start', 'complete'],
    schedules: scheduleManagement,
  },
  tecnico: {
    clients: readOnly,
    equipments: readOnly,
    requests: readOnly,
    orders: technicianOrders,
    schedules: readOnly,
  },
  solicitante: {
    requests: requestCreateRead,
    orders: readOnly,
  },
};

const roleIds: Record<number, AppRole> = {
  1: 'admin_plataforma',
  2: 'solicitante',
  3: 'planeador',
  4: 'tecnico',
  5: 'admin_cliente',
};

export const resolveRole = (roleId: number | null, roleName: string | null): AppRole | null => {
  if (roleId && roleIds[roleId]) {
    return roleIds[roleId];
  }

  const normalizedRoleName = roleName?.trim().toLowerCase() as AppRole | undefined;
  if (normalizedRoleName && normalizedRoleName in rolePermissions) {
    return normalizedRoleName;
  }

  return null;
};

export const hasPermission = (
  role: AppRole | null,
  resource: AppResource,
  action: AppAction
): boolean => {
  if (!role) {
    return false;
  }

  return rolePermissions[role]?.[resource]?.includes(action) ?? false;
};
