import { mapUser } from '../mappers/domain.mappers';
import { AuthSession, LoginResponse } from './auth.models';

export const mapLoginResponseToSession = (response: LoginResponse): AuthSession => ({
  accessToken: response.access_token,
  tokenType: response.token_type ?? 'Bearer',
  expiresIn: response.expires_in ?? '',
  user: mapUser(response.user),
});
