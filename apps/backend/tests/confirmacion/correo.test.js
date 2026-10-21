import { generarCorreoConfirmacion } from '../../src/domain/confirmacion/confirmacion.js';
import { procesarCompra } from '../../src/domain/compras/procesarCompra.js';

import { datosCompraValidos } from '../helpers/datosCompra.js';

describe("Correo de confirmación", () => {
  test('TC-47: debería generar una representación de correo al confirmarse una compra exitosa', () => {
    const correo = generarCorreoConfirmacion(datosCompraValidos);
    expect(correo).toBeDefined();
    expect(correo.destinatario).toBe('usuario@example.com');
  });

  test('TC-48: debería incluir datos representativos de la transacción en el correo', () => {
    const correo = generarCorreoConfirmacion(datosCompraValidos);
    expect(correo.fecha).toBe('2026-11-20');
    expect(correo.cantidad).toBe(2);
    expect(correo.pases).toHaveLength(2);
  });

  test('TC-49: debería adjuntar un archivo al correo simulado de confirmación', () => {
    const correo = generarCorreoConfirmacion(datosCompraValidos);
    expect(correo.adjunto).toBe('ticket-123.pdf');
  });

  test('TC-50: debería mantener confirmada la compra aunque falle el envío de correo', () => {
    const servicioMailSimuladoConError = () => {
      throw new Error('Error en servidor de correo');
    };

    const resultado = procesarCompra(datosCompraValidos, servicioMailSimuladoConError);
    expect(resultado.compraConfirmada).toBe(true);
    expect(resultado.errorCorreo).toBe('Error en servidor de correo');
  });
});
