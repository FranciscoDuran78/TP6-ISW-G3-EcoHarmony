import { validarLimitePorTransaccion } from '../../src/domain/entradas/limitePorFecha.js';

describe('Límite de entradas por transacción', () => {
  // [TC-76] - ETAPA GREEN
  test('TC-76: debería permitir una segunda transacción de 4 entradas tras haber comprado 6 para la misma fecha', () => {
    const comprasPreviasMismaFecha = 6;
    const compraActual = 4;

    // El historial solo documenta el contexto; la validación mira la transacción actual.
    expect(comprasPreviasMismaFecha).toBe(6);

    const resultado = validarLimitePorTransaccion(compraActual);

    expect(resultado).toBe(true);
  });
});
