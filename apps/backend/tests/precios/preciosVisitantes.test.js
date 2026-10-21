import { calcularPreciosVisitantes } from '../../src/domain/precios/preciosVisitantes.js';

describe("Precios según las edades de los visitantes", () => {
  test('TC-69: conserva las edades y aplica el precio correspondiente', () => {
    const visitantes = [
      { edad: 8, tipoPase: 'Regular' },
      { edad: 35, tipoPase: 'Regular' },
      { edad: 62, tipoPase: 'Regular' },
    ];

    expect(calcularPreciosVisitantes(visitantes)).toEqual([
      { edad: 8, tipoPase: 'Regular', precio: 5000 },
      { edad: 35, tipoPase: 'Regular', precio: 10000 },
      { edad: 62, tipoPase: 'Regular', precio: 5000 },
    ]);
  });
});
