import { compraBase, levantar, pedir } from '../helpers/api.js';

describe('efectivo en boletería', () => {
  beforeEach(() => levantar());

  test('TC-41: la validación en boletería deja la compra validada', async () => {
    const { body: compra } = await pedir('POST', '/api/compras', compraBase({ formaPago: 'efectivo' }));
    const { status, body } = await pedir('POST', `/api/compras/${compra.id}/validacion-boleteria`, { validacion: 'aprobada' });

    expect(status).toBe(200);
    expect(body).toMatchObject({ estado: 'validada', pagada: true });
    expect(body.correo).not.toBeNull();
  });

  test('una compra con tarjeta no se valida en boletería', async () => {
    const { body: compra } = await pedir('POST', '/api/compras', compraBase());

    expect((await pedir('POST', `/api/compras/${compra.id}/validacion-boleteria`, { validacion: 'aprobada' })).status).toBe(409);
  });
});
