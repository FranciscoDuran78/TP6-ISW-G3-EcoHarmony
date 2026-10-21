import { fechaLocal, compraBase, levantar, pedir } from '../helpers/api.js';

describe('compra para hoy', () => {
  const hoy = new Date();
  const hoyAbierto = hoy.getDay() !== 1 && !['12-25', '01-01'].includes(fechaLocal(hoy).slice(5));
  const conHora = (h, m) => () => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  // Si hoy está cerrado, el rechazo sería por otro motivo y el caso no aplica.
  const casoDeHoy = hoyAbierto ? test : test.skip;

  casoDeHoy('TC-33: se acepta comprar para hoy a las 17:30', async () => {
    await levantar({ ahora: conHora(17, 30) });

    const { status } = await pedir('POST', '/api/compras', compraBase({ fechaVisita: fechaLocal(hoy) }));
    expect(status).toBe(201);
  });

  casoDeHoy('TC-34: se rechaza comprar para hoy a las 17:31', async () => {
    await levantar({ ahora: conHora(17, 31) });

    const { status, body } = await pedir('POST', '/api/compras', compraBase({ fechaVisita: fechaLocal(hoy) }));
    expect(status).toBe(400);
    expect(body.error).toMatch(/17:30/);
  });

  test('TC-22: una fecha futura se acepta aunque sean más de las 17:30', async () => {
    await levantar({ ahora: conHora(18, 0) });

    expect((await pedir('POST', '/api/compras', compraBase())).status).toBe(201);
  });
});
