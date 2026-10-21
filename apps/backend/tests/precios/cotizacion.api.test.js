import { adulto, nino, bebe, levantar, pedir } from '../helpers/api.js';

describe('POST /api/compras/cotizacion', () => {
  beforeEach(() => levantar());

  test('TC-63: calcula subtotal, descuentos y total de edades distintas', async () => {
    const { status, body } = await pedir('POST', '/api/compras/cotizacion', {
      visitantes: [adulto, nino, bebe],
    });

    expect(status).toBe(200);
    expect(body.visitantes.map((v) => v.precio)).toEqual([20000, 5000, 0]);
    expect(body).toMatchObject({ subtotal: 20000, descuentos: 5000, total: 25000 });
  });

  test('una fila incompleta no tiene precio y no rompe la cotización', async () => {
    const { status, body } = await pedir('POST', '/api/compras/cotizacion', {
      visitantes: [adulto, { edad: '', tipoPase: 'Regular' }],
    });

    expect(status).toBe(200);
    expect(body.visitantes[1].precio).toBeNull();
    expect(body.total).toBe(20000);
  });
});
