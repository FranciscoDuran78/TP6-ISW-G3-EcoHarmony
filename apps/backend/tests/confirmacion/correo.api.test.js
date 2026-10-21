import { compraBase, levantar, pedir } from '../helpers/api.js';

describe('correo de confirmación', () => {
  test('TC-98: si el mail falla la compra sigue confirmada y se informa el error', async () => {
    await levantar({ servicioMail: () => { throw new Error('SMTP caído'); } });

    const { body: compra } = await pedir('POST', '/api/compras', compraBase());
    const { body } = await pedir('POST', `/api/compras/${compra.id}/pago`, { resultado: 'aprobada' });

    expect(body).toMatchObject({ estado: 'pagada', pagada: true, correo: null, errorCorreo: 'SMTP caído' });
  });
});
