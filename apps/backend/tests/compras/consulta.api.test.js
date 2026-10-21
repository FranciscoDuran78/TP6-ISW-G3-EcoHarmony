import { compraBase, levantar, pedir } from '../helpers/api.js';

describe('GET /api/compras/:id', () => {
  beforeEach(() => levantar());

  test('devuelve la compra creada y 404 si no existe', async () => {
    const { body: compra } = await pedir('POST', '/api/compras', compraBase());

    expect((await pedir('GET', `/api/compras/${compra.id}`)).body.id).toBe(compra.id);
    expect((await pedir('GET', '/api/compras/999')).status).toBe(404);
  });
});
