import {
  esTipoPaseValido,
  obtenerPrecioBasePase,
  calcularPrecioVisitante,
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

  describe('TC-64: Permitir pase regular a cualquier edad aplicando descuento por edad', () => {
    it('debe aplicar 50% de descuento en pase regular para un menor de 10 anos', () => {
      const visitante = {
        edad: 10,
        tipoPase: 'regular',
      };

      const precio = calcularPrecioVisitante(visitante);

      expect(precio).toBe(5000);
    });
  });

  describe('TC-65: Permitir pase VIP a cualquier edad aplicando descuento por edad', () => {
    it('debe aplicar 50% de descuento en pase VIP para un visitante de 10 anos', () => {
      const visitante = {
        edad: 10,
        tipoPase: 'VIP',
      };

      const precio = calcularPrecioVisitante(visitante);

      expect(precio).toBe(10000);
    });
  });
});