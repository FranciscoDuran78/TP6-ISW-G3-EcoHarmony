import { adulto, compraBase, levantar, pedir } from '../helpers/api.js';

// Estos casos preexistentes siguen la aclaración del profesor sobre el límite por transacción.
// No corresponden a TC-76/77/78 del listado, que especifican un límite acumulado por fecha.

describe("Límite por transacción en compras sucesivas", () => {
  beforeEach(() => levantar());

  test('se pueden comprar más de 10 entradas para una fecha en varias transacciones', async () => {
    const diez = Array(10).fill(adulto);

    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: diez }))).status).toBe(201);
    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: diez }))).status).toBe(201);
    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: [adulto] }))).status).toBe(201);
  });

  test('el máximo de 10 se aplica a cada transacción, no a la suma de la fecha', async () => {
    const seis = Array(6).fill(adulto);
    const cinco = Array(5).fill(adulto);

    await pedir('POST', '/api/compras', compraBase({ visitantes: seis }));
    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: cinco }))).status).toBe(201);

    const { status, body } = await pedir('POST', '/api/compras', compraBase({ visitantes: Array(11).fill(adulto) }));
    expect(status).toBe(400);
    expect(body.error).toMatch(/no puede ser mayor a 10/);
  });
});
