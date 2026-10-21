import { compraBase, levantar, pedir } from '../helpers/api.js';

describe("Forma de pago requerida y ofrecida", () => {
  beforeEach(() => levantar());

  test.each([
    ['TC-36: sin forma de pago', { formaPago: null }, /forma de pago/],
    ['TC-39: forma de pago no ofrecida', { formaPago: 'transferencia' }, /forma de pago no es válida/],
  ])('%s se rechaza con 400', async (_nombre, cambio, mensaje) => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase(cambio));

    expect(status).toBe(400);
    expect(body.error).toMatch(mensaje);
  });
});
