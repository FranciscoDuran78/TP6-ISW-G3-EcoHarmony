import {
  esTipoPaseValido,
  obtenerPrecioBasePase,
} from '../src/comprarEntradas.js';

describe('Casos TC-63 al TC-66: Precios y tipos de pase', () => {
  describe('TC-63: Verificar que VIP y regular se diferencien por precio y no por restricciones adicionales', () => {
    it('debe permitir pase regular y VIP para cualquier edad y diferenciarlos por precio base', () => {
      const edadVisitante = 30;

      const esRegularValido = esTipoPaseValido('regular', edadVisitante);
      const esVipValido = esTipoPaseValido('VIP', edadVisitante);

      const precioBaseRegular = obtenerPrecioBasePase('regular');
      const precioBaseVip = obtenerPrecioBasePase('VIP');

      expect(esRegularValido).toBe(true);
      expect(esVipValido).toBe(true);
      expect(precioBaseRegular).toBe(10000);
      expect(precioBaseVip).toBe(20000);
      expect(precioBaseVip).toBeGreaterThan(precioBaseRegular);
    });
  });
});