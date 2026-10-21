import { validarCompraSinCupoDiario } from '../../src/domain/entradas/limitePorFecha.js';

describe('Cupo diario del parque', () => {
  // [TC-80] - ETAPA REFACTOR
  test('TC-80: debería permitir comprar 10 entradas aunque ya existan 150 vendidas ese día', () => {
    const visitantesTotalesParqueFecha = 150;
    const compraActual = 10;

    const totalTrasCompra = validarCompraSinCupoDiario(
      visitantesTotalesParqueFecha,
      compraActual,
      null,
    );

    expect(totalTrasCompra).toBe(160);
  });
});
