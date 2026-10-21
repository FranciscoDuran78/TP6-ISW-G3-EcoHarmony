import { fechaLocal, proximoLunes, compraBase, levantar, pedir } from '../helpers/api.js';

describe("Validación de la fecha al comprar", () => {
  beforeEach(() => levantar());

  test.each([
    ['TC-24: sin fecha', { fechaVisita: null }, /fecha de visita es obligatoria/],
    ['TC-25: fecha inválida', { fechaVisita: '31/99/2026' }, /fecha ingresada no es válida/],
    ['TC-23: fecha pasada', { fechaVisita: '2020-01-07' }, /no puede ser anterior/],
    ['TC-32: más de un mes de anticipación', { fechaVisita: fechaLocal(new Date(Date.now() + 40 * 86400000)) }, /horizonte/],
    ['TC-27: lunes', { fechaVisita: proximoLunes() }, /cerrado/],
  ])('%s se rechaza con 400', async (_nombre, cambio, mensaje) => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase(cambio));

    expect(status).toBe(400);
    expect(body.error).toMatch(mensaje);
  });
});
