import { adulto, compraBase, levantar, pedir } from '../helpers/api.js';

describe("Estructura y datos de visitantes al comprar", () => {
  beforeEach(() => levantar());

  test.each([
    ['TC-73: cantidad distinta de visitantes', { cantidad: 4 }, /no coincide/],
    ['TC-17: sin visitantes', { cantidad: 2, visitantes: [] }, /detallar la edad y tipo de pase/],
    ['TC-93: visitante sin edad', { visitantes: [adulto, { edad: null, tipoPase: 'VIP' }] }, /indicar su edad/],
    ['TC-94: visitante sin pase', { visitantes: [adulto, { edad: 5, tipoPase: '' }] }, /tipo de pase/],
    ['TC-67: edad negativa', { visitantes: [{ edad: -1, tipoPase: 'VIP' }] }, /edad no es válida/],
    ['pase inexistente', { visitantes: [{ edad: 20, tipoPase: 'Gold' }] }, /Regular o VIP/],
  ])('%s se rechaza con 400', async (_nombre, cambio, mensaje) => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase(cambio));

    expect(status).toBe(400);
    expect(body.error).toMatch(mensaje);
  });
});
