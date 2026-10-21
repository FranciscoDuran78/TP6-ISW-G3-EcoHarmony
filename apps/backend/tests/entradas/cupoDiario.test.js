import { validarCupoDiarioGlobal, validarLimiteAcumuladoPorFecha } from '../../src/limitePorFecha.js';

describe("Cupo diario del parque", () => {
  test('TC-80: debería aceptar una compra válida cuando no hay cupo diario configurado', () => {
    const visitantesTotalesParqueFecha = 500;
    const cupoDiarioConfigurado = null;
    const compraValida = validarLimiteAcumuladoPorFecha(0, 4);

    const resultado = validarCupoDiarioGlobal(
      visitantesTotalesParqueFecha,
      cupoDiarioConfigurado,
    );

    expect(compraValida).toBe(true);
    expect(resultado).toBe(true);
  });
});
