import { validarLimiteAcumuladoPorFecha } from '../../src/compraEntradas.js';

describe("Límite acumulado en la validación de compra", () => {
  test('TC-13: debería permitir comprar 4 entradas si el usuario ya compró 6 para esa misma fecha (Total = 10)', () => {
    const previasEnFecha = 6;
    const cantidadActual = 4;

    const resultado = validarLimiteAcumuladoPorFecha(previasEnFecha, cantidadActual);

    expect(resultado).toBe(true);
  });

  test('TC-14: debería lanzar un error al intentar comprar 5 entradas si ya compró 6 para esa misma fecha (Total = 11)', () => {
    const previasEnFecha = 6;
    const cantidadActual = 5;

    expect(() => {
      validarLimiteAcumuladoPorFecha(previasEnFecha, cantidadActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });

  test('TC-15: debería lanzar un error al intentar comprar 1 entrada si el usuario ya tiene 10 compradas para esa fecha', () => {
    const previasEnFecha = 10;
    const cantidadActual = 1;

    expect(() => {
      validarLimiteAcumuladoPorFecha(previasEnFecha, cantidadActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });

  test('TC-16: debería permitir comprar 10 entradas en una fecha nueva aunque tenga 10 en otra fecha distinta', () => {
    const entradasPrevias = 10;
    const cantidadActual = 10;
    const fechaNueva = '2026-11-20';
    const fechaPreviaDistinta = '2026-11-10';

    const resultado = validarLimiteAcumuladoPorFecha(
      entradasPrevias,
      cantidadActual,
      fechaNueva,
      fechaPreviaDistinta,
    );

    expect(resultado).toBe(true);
  });
});
