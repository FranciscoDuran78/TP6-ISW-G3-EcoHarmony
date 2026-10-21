import { MENSAJES_ERROR, procesarCompra } from '../../src/compraEntradas.js';

describe("Flujo completo de compra", () => {
  test("TC-84: debería completar la compra con tarjeta aprobada, resumen y correo simulado", () => {
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

  test("TC-85: debería registrar compra en efectivo como pendiente de validación", () => {
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

  test("TC-86: debería rechazar la compra si no se selecciona forma de pago", () => {
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

  test("TC-87: debería rechazar la compra si la fecha seleccionada corresponde a un lunes", () => {
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
