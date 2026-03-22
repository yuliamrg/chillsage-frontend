import { AppAction, AppResource, AppRole } from './auth.models';

type ResourcePermissions = Partial<Record<AppResource, AppAction[]>>;

const fullCrud: AppAction[] = ['read', 'create', 'update', 'delete'];
const readOnly: AppAction[] = ['read'];
const requestCreateRead: AppAction[] = ['read', 'create'];

const rolePermissions: Record<AppRole, ResourcePermissions> = {
  admin: {
    users: fullCrud,
    roles: fullCrud,
    profiles: fullCrud,
    clients: fullCrud,
    equipments: fullCrud,
    requests: fullCrud,
    orders: fullCrud,
    schedules: fullCrud,
  },
  planeador: {
    users: readOnly,
    roles: readOnly,
    profiles: readOnly,
    clients: fullCrud,
    equipments: fullCrud,
    requests: fullCrud,
    orders: fullCrud,
    schedules: fullCrud,
  },
  tecnico: {
    clients: readOnly,
    equipments: readOnly,
    requests: readOnly,
    orders: readOnly,
    schedules: readOnly,
  },
  solicitante: {
    requests: requestCreateRead,
    orders: readOnly,
  },
};

const roleIds: Record<number, AppRole> = {
  1: 'admin',
  2: 'solicitante',
  3: 'planeador',
  4: 'tecnico',
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
