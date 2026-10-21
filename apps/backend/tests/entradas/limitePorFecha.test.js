import { validarLimitePorTransaccion } from '../../src/domain/entradas/limitePorFecha.js';

describe('Límite de entradas por transacción', () => {
  // [TC-76] - ETAPA REFACTOR
  test('TC-76: debería permitir una segunda transacción de 4 entradas tras haber comprado 6 para la misma fecha', () => {
    const comprasPreviasMismaFecha = 6;
    const compraActual = 4;

    // El historial solo documenta el contexto; la validación mira la transacción actual.
    expect(comprasPreviasMismaFecha).toBe(6);

    const resultado = validarLimitePorTransaccion(compraActual);

    expect(resultado).toBe(true);
  });

  // [TC-77] - ETAPA REFACTOR
  test('TC-77: debería permitir una transacción de 5 entradas aunque el acumulado de la fecha llegue a 11', () => {
    const comprasPreviasMismaFecha = 6;
    const compraActual = 5;

    expect(comprasPreviasMismaFecha + compraActual).toBe(11);

    const resultado = validarLimitePorTransaccion(compraActual);

    expect(resultado).toBe(true);
  });

  // [TC-78] - ETAPA RED
  test('TC-78: debería rechazar una transacción de 11 entradas', () => {
    expect(() => {
      validarLimitePorTransaccion(11);
    }).toThrow('Supera el límite de 10 entradas permitidas por transacción');
  });
});
