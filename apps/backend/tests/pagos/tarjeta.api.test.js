import { FECHA, compraBase, levantar, pedir } from '../helpers/api.js';

describe("Pago con tarjeta", () => {
  beforeEach(() => levantar());

  const crear = async (extra) => (await pedir('POST', '/api/compras', compraBase(extra))).body;

  test('TC-43: aprobar paga la compra y muestra el mail con adjunto', async () => {
    const { id } = await crear();
    const { status, body } = await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' });

    expect(status).toBe(200);
    expect(body).toMatchObject({ estado: 'pagada', pagada: true });
    expect(body.correo).toMatchObject({ cantidad: 3, fecha: FECHA });
    expect(body.correo.adjunto).toMatch(/\.pdf$/);
  });

  test.each(['rechazada'])('TC-44: %s no marca la compra como pagada', async (resultado) => {
    const { id } = await crear();
    const { body } = await pedir('POST', `/api/compras/${id}/pago`, { resultado });

    expect(body).toMatchObject({ estado: resultado, pagada: false, correo: null });
  });

  test.each(['cancelada'])('TC-45: %s no marca la compra como pagada', async (resultado) => {
    const { id } = await crear();
    const { body } = await pedir('POST', `/api/compras/${id}/pago`, { resultado });

    expect(body).toMatchObject({ estado: resultado, pagada: false, correo: null });
  });

  test('TC-46: reintenta tras un rechazo sin duplicar el pago aprobado', async () => {
    const { id } = await crear();
    await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'rechazada' });

    const reintento = await pedir('POST', `/api/compras/${id}/reintento`);
    expect(reintento.body).toMatchObject({ estado: 'pendiente' });
    expect(reintento.body.intentos).toHaveLength(2);

    await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' });
    const otro = await pedir('POST', `/api/compras/${id}/reintento`);
    expect(otro.status).toBe(409);
  });

  test('un resultado desconocido es 400 y una compra ya resuelta es 409', async () => {
    const { id } = await crear();

    expect((await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'quizas' })).status).toBe(400);
    await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' });
    expect((await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'rechazada' })).status).toBe(409);
  });

  test('una compra en efectivo no tiene pago con tarjeta', async () => {
    const { id } = await crear({ formaPago: 'efectivo' });

    expect((await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' })).status).toBe(409);
  });
});
