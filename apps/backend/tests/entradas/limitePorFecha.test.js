import { validarLimiteAcumuladoPorFecha } from '../../src/limitePorFecha.js';

describe("Límite acumulado por fecha", () => {
  test('TC-76: debería aceptar un total de 10 entradas para una fecha entre varias compras', () => {
    const comprasPreviasMismaFecha = 6;
    const compraActual = 4;

    const resultado = validarLimiteAcumuladoPorFecha(
      comprasPreviasMismaFecha,
      compraActual,
    );

    expect(resultado).toBe(true);
  });

  test('TC-77: debería rechazar una compra que eleva el total a 11 entradas para esa fecha', () => {
    const comprasPreviasMismaFecha = 6;
    const compraActual = 5;

    expect(() => {
      validarLimiteAcumuladoPorFecha(comprasPreviasMismaFecha, compraActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });

  test('TC-78: debería rechazar una entrada adicional cuando ya hay 10 compradas para esa fecha', () => {
    const comprasPreviasMismaFecha = 10;
    const compraActual = 1;

    expect(() => {
      validarLimiteAcumuladoPorFecha(comprasPreviasMismaFecha, compraActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });

  test('TC-79: debería permitir 10 entradas en una fecha nueva aunque haya 10 en otra fecha', () => {
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
