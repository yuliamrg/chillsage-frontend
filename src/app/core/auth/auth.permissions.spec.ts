import { hasPermission, resolveRole } from './auth.permissions';

describe('auth.permissions', () => {
  describe('resolveRole', () => {
    it('prioriza el roleId cuando existe en el mapa', () => {
      expect(resolveRole(1, 'solicitante')).toBe('admin_plataforma');
    });

    it('resuelve por nombre cuando no hay roleId reconocido', () => {
      expect(resolveRole(null, ' Planeador ')).toBe('planeador');
    });

    it('retorna null para roles desconocidos', () => {
      expect(resolveRole(99, 'supervisor')).toBeNull();
    });
  });

  describe('hasPermission', () => {
    it('permite acciones operativas al admin de plataforma', () => {
      expect(hasPermission('admin_plataforma', 'requests', 'approve')).toBeTrue();
      expect(hasPermission('admin_plataforma', 'orders', 'complete')).toBeTrue();
      expect(hasPermission('admin_plataforma', 'schedules', 'close')).toBeTrue();
    });

    it('permite administracion operativa al admin de cliente', () => {
      expect(hasPermission('admin_cliente', 'users', 'delete')).toBeTrue();
      expect(hasPermission('admin_cliente', 'orders', 'assign')).toBeTrue();
      expect(hasPermission('admin_cliente', 'roles', 'update')).toBeFalse();
    });

    it('permite solo las acciones operativas definidas para tecnico', () => {
      expect(hasPermission('tecnico', 'orders', 'start')).toBeTrue();
      expect(hasPermission('tecnico', 'orders', 'complete')).toBeTrue();
      expect(hasPermission('tecnico', 'orders', 'assign')).toBeFalse();
      expect(hasPermission('tecnico', 'schedules', 'open')).toBeFalse();
    });

    it('limita al solicitante a leer y crear requests', () => {
      expect(hasPermission('solicitante', 'requests', 'create')).toBeTrue();
      expect(hasPermission('solicitante', 'requests', 'approve')).toBeFalse();
      expect(hasPermission('solicitante', 'orders', 'read')).toBeTrue();
      expect(hasPermission('solicitante', 'orders', 'cancel')).toBeFalse();
    });

    it('impide que planeador elimine clientes', () => {
      expect(hasPermission('planeador', 'clients', 'read')).toBeTrue();
      expect(hasPermission('planeador', 'clients', 'create')).toBeTrue();
      expect(hasPermission('planeador', 'clients', 'update')).toBeTrue();
      expect(hasPermission('planeador', 'clients', 'delete')).toBeFalse();
    });

    it('niega permisos cuando no hay rol', () => {
      expect(hasPermission(null, 'requests', 'read')).toBeFalse();
    });
  });
});
