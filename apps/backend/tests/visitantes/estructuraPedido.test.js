import { validarEstructuraVisitantes } from '../../src/compraEntradas.js';

describe("Correspondencia entre visitantes y entradas", () => {
  test('TC-17: debería lanzar un error si no se envía el listado de visitantes', () => {
    const cantidad = 2;
    const visitantes = [];

    expect(() => {
      validarEstructuraVisitantes(cantidad, visitantes);
    }).toThrow('Debe detallar la edad y tipo de pase de cada visitante');
  });

  test('TC-18: debería lanzar un error si la cantidad declarada no coincide con el tamaño de la lista de visitantes', () => {
    const cantidad = 3;
    const visitantes = [
      { edad: 25, tipoPase: 'VIP' },
      { edad: 30, tipoPase: 'Regular' },
    ];

    expect(() => {
      validarEstructuraVisitantes(cantidad, visitantes);
    }).toThrow('La cantidad de entradas no coincide con los visitantes ingresados');
  });

  test('TC-72: acepta visitantes con edad y tipo de pase informados', () => {
    const visitantes = [
      { edad: 25, tipoPase: 'Regular' },
      { edad: 35, tipoPase: 'VIP' },
    ];

    expect(validarEstructuraVisitantes(2, visitantes)).toBe(true);
  });

  test('TC-73: rechaza menos visitantes que entradas', () => {
    const visitantes = [
      { edad: 25, tipoPase: 'Regular' },
      { edad: 35, tipoPase: 'VIP' },
    ];

    expect(() => validarEstructuraVisitantes(3, visitantes))
      .toThrow('La cantidad de entradas no coincide con los visitantes ingresados');
  });

  test('TC-74: rechaza más visitantes que entradas', () => {
    const visitantes = [
      { edad: 25, tipoPase: 'Regular' },
      { edad: 35, tipoPase: 'VIP' },
    ];

    expect(() => validarEstructuraVisitantes(1, visitantes))
      .toThrow('La cantidad de entradas no coincide con los visitantes ingresados');
  });
});
