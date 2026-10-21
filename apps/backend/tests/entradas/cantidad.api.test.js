import { adulto, compraBase, levantar, pedir } from '../helpers/api.js';

describe("Cantidad de entradas al comprar", () => {
  beforeEach(() => levantar());

  test.each([
    ['TC-92: 11 entradas', { visitantes: Array(11).fill(adulto) }, /no puede ser mayor a 10/],
    ['TC-05: cantidad 0', { cantidad: 0, visitantes: [] }, /al menos 1/],
    ['TC-06: cantidad negativa', { cantidad: -3 }, /al menos 1/],
  ])('%s se rechaza con 400', async (_nombre, cambio, mensaje) => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase(cambio));

    expect(status).toBe(400);
    expect(body.error).toMatch(mensaje);
  });
});
