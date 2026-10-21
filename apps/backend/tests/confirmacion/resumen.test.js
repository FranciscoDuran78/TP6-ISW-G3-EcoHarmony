import { generarResumenCompra } from '../../src/domain/confirmacion/confirmacion.js';

import { datosCompraValidos } from '../helpers/datosCompra.js';

describe("Resumen de compra", () => {
  test('TC-51: debería informar la cantidad de entradas compradas en el resumen', () => {
    const resumen = generarResumenCompra(datosCompraValidos);
    expect(resumen.cantidadEntradas).toBe(2);
  });
});
