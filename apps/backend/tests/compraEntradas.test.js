import {
  MENSAJES_ERROR,
  generarCorreoConfirmacion,
  generarResumenCompra,
  procesarCompra,
} from '../src/compraEntradas.js';

describe('Pruebas para Correo de Confirmación y Resumen (TC-47 a TC-51)', () => {
  const datosCompraValidos = {
    emailUsuario: 'usuario@example.com',
    fecha: '2026-11-20',
    cantidad: 2,
    pases: [{ edad: 25, tipoPase: 'VIP' }, { edad: 30, tipoPase: 'Regular' }],
    formaPago: 'tarjeta',
    adjunto: 'ticket-123.pdf',
  };

  // [TC-47]
  test('TC-47: debería generar una representación de correo al confirmarse una compra exitosa', () => {
    const correo = generarCorreoConfirmacion(datosCompraValidos);
    expect(correo).toBeDefined();
    expect(correo.destinatario).toBe('usuario@example.com');
  });

  // [TC-48]
  test('TC-48: debería incluir datos representativos de la transacción en el correo', () => {
    const correo = generarCorreoConfirmacion(datosCompraValidos);
    expect(correo.fecha).toBe('2026-11-20');
    expect(correo.cantidad).toBe(2);
    expect(correo.pases).toHaveLength(2);
  });

  // [TC-49]
  test('TC-49: debería adjuntar un archivo al correo simulado de confirmación', () => {
    const correo = generarCorreoConfirmacion(datosCompraValidos);
    expect(correo.adjunto).toBe('ticket-123.pdf');
  });

  // [TC-50]
  test('TC-50: debería mantener confirmada la compra aunque falle el envío de correo', () => {
    const servicioMailSimuladoConError = () => {
      throw new Error('Error en servidor de correo');
    };

    const resultado = procesarCompra(datosCompraValidos, servicioMailSimuladoConError);
    expect(resultado.compraConfirmada).toBe(true);
    expect(resultado.errorCorreo).toBe('Error en servidor de correo');
  });

  // [TC-51]
  test('TC-51: debería informar la cantidad de entradas compradas en el resumen', () => {
    const resumen = generarResumenCompra(datosCompraValidos);
    expect(resumen.cantidadEntradas).toBe(2);
  });
});

describe('Pruebas para Flujo Completo (TC-80 a TC-83)', () => {
  // [TC-80]
  test('TC-80: debería completar la compra con tarjeta aprobada, resumen y correo simulado', () => {
    const compra = {
      emailUsuario: 'usuario@example.com',
      fecha: '2026-11-20', // Viernes (válido)
      cantidad: 1,
      pases: [{ edad: 20, tipoPase: 'VIP' }],
      formaPago: 'tarjeta',
      adjunto: 'ticket-80.pdf',
    };

    const resultado = procesarCompra(compra);
    expect(resultado.compraConfirmada).toBe(true);
    expect(resultado.estadoPago).toBe('aprobado');
    expect(resultado.resumen).toBeDefined();
    expect(resultado.correo).toBeDefined();
  });

  // [TC-81]
  test('TC-81: debería registrar compra en efectivo como pendiente de validación', () => {
    const compraEfectivo = {
      emailUsuario: 'usuario@example.com',
      fecha: '2026-11-20',
      cantidad: 1,
      pases: [{ edad: 20, tipoPase: 'Regular' }],
      formaPago: 'efectivo',
    };

    const resultado = procesarCompra(compraEfectivo);
    expect(resultado.compraConfirmada).toBe(true);
    expect(resultado.estadoPago).toBe('pendiente_validacion');
    expect(resultado.cantidad).toBe(1);
    expect(resultado.fecha).toBe('2026-11-20');
  });

  // [TC-82]
  test('TC-82: debería rechazar la compra si no se selecciona forma de pago', () => {
    const compraSinPago = {
      emailUsuario: 'usuario@example.com',
      fecha: '2026-11-20',
      cantidad: 1,
      pases: [{ edad: 20, tipoPase: 'Regular' }],
      formaPago: null,
    };

    expect(() => {
      procesarCompra(compraSinPago);
    }).toThrow(MENSAJES_ERROR.FORMA_PAGO_REQUERIDA);
  });

  // [TC-83]
  test('TC-83: debería rechazar la compra si la fecha seleccionada corresponde a un lunes', () => {
    const compraLunes = {
      emailUsuario: 'usuario@example.com',
      fecha: '2026-11-23', // Lunes
      cantidad: 1,
      pases: [{ edad: 20, tipoPase: 'Regular' }],
      formaPago: 'tarjeta',
    };

    expect(() => {
      procesarCompra(compraLunes);
    }).toThrow(MENSAJES_ERROR.FECHA_LUNES_BLOQUEADA);
  });
});