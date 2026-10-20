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
});
