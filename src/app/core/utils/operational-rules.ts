import { AuthUser } from '../auth/auth.models';
import { OrderVm, RequestVm, ScheduleVm } from '../models/domain.models';

export const isEditableRequest = (request: Pick<RequestVm, 'status'> | null | undefined): boolean =>
  request?.status === 'pending';

export const canApproveRequest = (request: Pick<RequestVm, 'status'> | null | undefined): boolean =>
  request?.status === 'pending';

export const canCancelRequest = (request: Pick<RequestVm, 'status' | 'orderId'> | null | undefined): boolean =>
  request?.status === 'pending' && !request?.orderId;

export const canCreateOrderFromRequest = (request: Pick<RequestVm, 'status' | 'orderId'> | null | undefined): boolean =>
  request?.status === 'approved' && !request?.orderId;

export const isEditableOrder = (order: Pick<OrderVm, 'status'> | null | undefined): boolean =>
  order?.status === 'assigned' || order?.status === 'in_progress';

export const canAssignOrder = (order: Pick<OrderVm, 'status'> | null | undefined): boolean =>
  order?.status === 'assigned';

export const canCancelOrder = (order: Pick<OrderVm, 'status'> | null | undefined): boolean =>
  order?.status === 'assigned' || order?.status === 'in_progress';

export const isAssignedToCurrentTechnician = (
  order: Pick<OrderVm, 'assignedUserId'> | null | undefined,
  user: Pick<AuthUser, 'id'> | null | undefined
): boolean => !!order?.assignedUserId && !!user?.id && order.assignedUserId === user.id;

export const canStartOrder = (
  order: Pick<OrderVm, 'status' | 'assignedUserId'> | null | undefined,
  user: Pick<AuthUser, 'id' | 'roleId' | 'roleName'> | null | undefined,
  isTechnician: boolean
): boolean => {
  if (order?.status !== 'assigned' || !order.assignedUserId) {
    return false;
  }

  return !isTechnician || isAssignedToCurrentTechnician(order, user);
};

export const canCompleteOrder = (
  order: Pick<OrderVm, 'status' | 'assignedUserId'> | null | undefined,
  user: Pick<AuthUser, 'id' | 'roleId' | 'roleName'> | null | undefined,
  isTechnician: boolean
): boolean => {
  if (order?.status !== 'in_progress') {
    return false;
  }

  return !isTechnician || isAssignedToCurrentTechnician(order, user);
};

export const isEditableSchedule = (schedule: Pick<ScheduleVm, 'status'> | null | undefined): boolean =>
  schedule?.status !== 'closed';

export const canOpenSchedule = (schedule: Pick<ScheduleVm, 'status'> | null | undefined): boolean =>
  schedule?.status === 'unassigned';

export const canCloseSchedule = (schedule: Pick<ScheduleVm, 'status'> | null | undefined): boolean =>
  schedule?.status === 'open';
