import { UserVm } from '../models/domain.models';

export type AppRole = 'admin' | 'planeador' | 'tecnico' | 'solicitante';

export type AppResource =
  | 'users'
  | 'roles'
  | 'profiles'
  | 'clients'
  | 'equipments'
  | 'requests'
  | 'orders'
  | 'schedules';

export type AppAction = 'read' | 'create' | 'update' | 'delete';

export interface AuthUser extends UserVm {}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
}

export interface LoginPayload {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  msg: string;
  access_token: string;
  token_type: string;
  expires_in: string;
  user: unknown;
}

export interface RoutePermission {
  resource: AppResource;
  action: AppAction;
}
