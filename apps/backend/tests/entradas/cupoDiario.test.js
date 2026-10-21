import {
  validarCompraSinCupoDiario,
  validarCupoDiarioGlobal,
  validarLimitePorTransaccion,
} from '../../src/domain/entradas/limitePorFecha.js';

describe('Cupo diario del parque', () => {
  // [TC-80] - ETAPA RED
  test('TC-80: debería permitir comprar 10 entradas aunque ya existan 150 vendidas ese día', () => {
    const visitantesTotalesParqueFecha = 150;
    const cupoDiarioConfigurado = null;
    const compraActual = 10;

    expect(validarCupoDiarioGlobal(
      visitantesTotalesParqueFecha,
      cupoDiarioConfigurado,
    )).toBe(true);
    expect(validarLimitePorTransaccion(compraActual)).toBe(true);

    const totalTrasCompra = validarCompraSinCupoDiario(
      visitantesTotalesParqueFecha,
      compraActual,
      cupoDiarioConfigurado,
    );

    expect(totalTrasCompra).toBe(160);
  });
});
