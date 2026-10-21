import { calcularTotalCompra } from '../../src/comprarEntradas.js';

describe("Subtotal y total de la compra", () => {
  it("TC-63: calcula subtotal y total de varios pases con edades diferentes", () => {
    const visitantes = [
      { edad: 30, tipoPase: 'VIP' },
      { edad: 10, tipoPase: 'regular' },
      { edad: 3, tipoPase: 'regular' },
    ];

    const resultado = calcularTotalCompra(visitantes);

    expect(resultado).toEqual({
      subtotal: 20000,
      descuentos: 5000,
      total: 25000,
    });
  });
});
