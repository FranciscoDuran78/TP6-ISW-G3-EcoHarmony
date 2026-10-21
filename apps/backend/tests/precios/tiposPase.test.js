import { esTipoPaseValido, obtenerPrecioBasePase, calcularPrecioVisitante } from '../../src/domain/precios/comprarEntradas.js';

describe("Elegibilidad y precio por tipo de pase", () => {
  it("TC-64: permite pase regular a los 10 años aplicando el descuento por edad", () => {
    const visitante = {
      edad: 10,
      tipoPase: 'regular',
    };

    const precio = calcularPrecioVisitante(visitante);

    expect(precio).toBe(5000);
  });

  it("TC-65: permite pase VIP a los 10 años aplicando el descuento por edad", () => {
    const visitante = {
      edad: 10,
      tipoPase: 'VIP',
    };

    const precio = calcularPrecioVisitante(visitante);

    expect(precio).toBe(10000);
  });

  it("TC-66: diferencia VIP y regular por precio sin restricciones adicionales", () => {
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
