// Jest en modo ESM necesita la extensión del archivo para resolver este import.
// eslint-disable-next-line import/extensions
import { calcularTotalCompra, procesarCompra, validarFechaVisita } from '../src/procesarCompra.js';

const AHORA = new Date('2026-10-20T15:00:00.000Z');

const crearSolicitud = (overrides = {}) => ({
  fechaVisita: '2026-10-24',
  visitantes: [{ edad: 30, tipoPase: 'VIP' }],
  formaPago: 'TARJETA',
  ...overrides,
});

describe('Validación de fechas de visita', () => {
  test.each([
    ['2026-12-25', new Date('2026-12-01T15:00:00.000Z')],
    ['2027-01-01', new Date('2026-12-01T15:00:00.000Z')],
  ])('TC-88/89: bloquea el %s', (fechaVisita, ahora) => {
    expect(() => validarFechaVisita(fechaVisita, ahora)).toThrow('El parque permanece cerrado');
  });

  test('TC-90: rechaza fechas posteriores al mes calendario permitido', () => {
    expect(() => validarFechaVisita('2026-11-21', AHORA)).toThrow(
      'La fecha de visita no puede superar un mes de anticipación',
    );
  });

  test('TC-91: rechaza la compra de hoy después de las 17:30 en Argentina', () => {
    const despuesDelCierre = new Date('2026-10-20T20:31:00.000Z');

    expect(() => validarFechaVisita('2026-10-20', despuesDelCierre)).toThrow(
      'Las compras para hoy están habilitadas hasta las 17:30',
    );
  });
});

describe('Procesamiento de compras', () => {
  test('TC-92: rechaza 11 entradas antes de procesar el pago', async () => {
    let pagoInvocado = false;
    const procesarPago = async () => { pagoInvocado = true; };

    await expect(procesarCompra(crearSolicitud({
      visitantes: Array.from({ length: 11 }, () => ({ edad: 30, tipoPase: 'VIP' })),
    }), { ahora: AHORA, procesarPago })).rejects.toThrow('La cantidad de entradas no puede ser mayor a 10');
    expect(pagoInvocado).toBe(false);
  });

  test('TC-93: rechaza visitantes sin edad', async () => {
    await expect(procesarCompra(crearSolicitud({
      visitantes: [{ tipoPase: 'VIP' }],
    }), { ahora: AHORA })).rejects.toThrow('Cada visitante debe indicar su edad');
  });

  test('TC-94: rechaza visitantes sin un pase VIP o Regular válido', async () => {
    await expect(procesarCompra(crearSolicitud({
      visitantes: [{ edad: 30, tipoPase: '' }],
    }), { ahora: AHORA })).rejects.toThrow('Cada visitante debe indicar tipo de pase VIP o Regular');
  });

  test('TC-95: calcula $25.000 para un adulto VIP y un menor Regular', () => {
    expect(calcularTotalCompra([
      { edad: 30, tipoPase: 'VIP' },
      { edad: 10, tipoPase: 'Regular' },
    ])).toBe(25000);
  });

  test('TC-96: registra el efectivo como pendiente de validación', async () => {
    const compra = await procesarCompra(crearSolicitud({ formaPago: 'EFECTIVO' }), {
      ahora: AHORA,
    });

    expect(compra.estado).toBe('PENDIENTE_DE_VALIDACION');
    expect(compra.pago.estado).toBe('PENDIENTE');
    expect(compra.pagada).toBe(false);
  });

  test('TC-97: una tarjeta rechazada no confirma ni persiste como pagada', async () => {
    let compraGuardada = false;
    const guardarCompra = async () => { compraGuardada = true; };
    const compra = await procesarCompra(crearSolicitud(), {
      ahora: AHORA,
      procesarPago: async () => ({ estado: 'RECHAZADA', codigo: 'CARD_DECLINED' }),
      guardarCompra,
    });

    expect(compra.estado).toBe('RECHAZADA');
    expect(compra.pagada).toBe(false);
    expect(compra.pago).toEqual({ estado: 'RECHAZADA', codigo: 'CARD_DECLINED' });
    expect(compraGuardada).toBe(false);
  });

  test('TC-98: conserva la compra confirmada si falla el correo simulado', async () => {
    const compra = await procesarCompra(crearSolicitud(), {
      ahora: AHORA,
      enviarCorreo: async () => { throw new Error('correo no disponible'); },
    });

    expect(compra.estado).toBe('CONFIRMADA');
    expect(compra.correo.estado).toBe('FALLIDO');
    expect(compra.correo.error).toBe('correo no disponible');
  });

  test('TC-99/100: incluye cantidad, fecha, transacción y adjunto simulado', async () => {
    const compra = await procesarCompra(crearSolicitud({
      visitantes: [{ edad: 30, tipoPase: 'VIP' }],
    }), {
      ahora: AHORA,
      procesarPago: async () => ({ estado: 'APROBADA', codigo: 'TX-123' }),
    });

    expect(compra).toMatchObject({
      cantidad: 1,
      fechaVisita: '2026-10-24',
      estado: 'CONFIRMADA',
      pagada: true,
      pago: { estado: 'APROBADA', codigo: 'TX-123' },
      correo: { estado: 'ENVIADO' },
      usuario: { id: 1, registrado: true },
    });
    expect(compra.correo.adjunto).toMatchObject({
      nombre: 'comprobante-entradas.json',
      tipo: 'application/json',
    });
    expect(compra.correo.contenido).toMatchObject({
      cantidad: 1,
      fechaVisita: '2026-10-24',
      transaccion: { codigo: 'TX-123' },
    });
  });
});
