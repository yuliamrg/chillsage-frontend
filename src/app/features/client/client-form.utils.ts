import { ClientFormValue } from '../../core/models/domain.models';

export const CLIENT_STATUS_OPTIONS: readonly string[] = ['active', 'inactive'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_PATTERN = /^[+()\-\s\d]+$/;

const hasAtLeastSevenDigits = (value: string): boolean => value.replace(/\D/g, '').length >= 7;

export const normalizeClientForm = (form: ClientFormValue): ClientFormValue => ({
  ...form,
  name: form.name.trim(),
  address: form.address.trim(),
  phone: form.phone.trim(),
  email: form.email.trim(),
  description: form.description.trim(),
  status: form.status.trim().toLowerCase(),
});

export const validateClientForm = (
  form: ClientFormValue,
  options: { allowMasterFieldsEdit: boolean }
): string | null => {
  if (options.allowMasterFieldsEdit) {
    if (!form.name.trim()) {
      return 'Debe ingresar el nombre del cliente.';
    }

    if (!form.email.trim()) {
      return 'Debe ingresar el correo del cliente.';
    }
  }

  if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) {
    return 'Debe ingresar un correo valido.';
  }

  if (form.phone.trim()) {
    if (!PHONE_ALLOWED_PATTERN.test(form.phone.trim()) || !hasAtLeastSevenDigits(form.phone)) {
      return 'Debe ingresar un telefono valido con al menos 7 digitos.';
    }
  }

  if (!CLIENT_STATUS_OPTIONS.includes(form.status.trim().toLowerCase())) {
    return 'Debe seleccionar un estado valido.';
  }

  return null;
};
