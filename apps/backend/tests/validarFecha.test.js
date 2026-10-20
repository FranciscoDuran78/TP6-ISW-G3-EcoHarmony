import { validarLimiteAcumuladoPorFecha } from '../src/validarFecha.js';

describe('Validación de límite acumulado por fecha', () => {
  // [TC-76] - Completado
  test('TC-76: debería aceptar un total de 10 entradas para una fecha entre varias compras', () => {
    const comprasPreviasMismaFecha = 6;
    const compraActual = 4;

    const resultado = validarLimiteAcumuladoPorFecha(
      comprasPreviasMismaFecha,
      compraActual,
    );

    expect(resultado).toBe(true);
  });

  // [TC-77] - Completado
  test('TC-77: debería rechazar una compra que eleva el total a 11 entradas para esa fecha', () => {
    const comprasPreviasMismaFecha = 6;
    const compraActual = 5;

    expect(() => {
      validarLimiteAcumuladoPorFecha(comprasPreviasMismaFecha, compraActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });

  // [TC-78] - ETAPA RED
  test('TC-78: debería rechazar una entrada adicional cuando ya hay 10 compradas para esa fecha', () => {
    const comprasPreviasMismaFecha = 10;
    const compraActual = 1;

    expect(() => {
      validarLimiteAcumuladoPorFecha(comprasPreviasMismaFecha, compraActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });
});
