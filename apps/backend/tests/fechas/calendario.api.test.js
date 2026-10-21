import { fechaLocal, adulto, compraBase, levantar, pedir } from '../helpers/api.js';

describe('GET /api/calendario', () => {
  const conHora = (h, m) => () => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };
  const [anio, mes, dia] = fechaLocal(new Date()).split('-').map(Number);

  test('muestra desde hoy hasta un mes adelante, con lunes y feriados cerrados', async () => {
    await levantar({ ahora: conHora(10, 0) });
    const { status, body } = await pedir('GET', '/api/calendario');

    expect(status).toBe(200);
    expect(body).toHaveLength(31);
    expect(body[0].fechaIso).toBe(fechaLocal(new Date()));
    expect(body[30].fechaIso).toBe(fechaLocal(new Date(anio, mes - 1, dia + 30)));

    body.forEach((item) => {
      const [a, m, d] = item.fechaIso.split('-').map(Number);
      const cierra = new Date(a, m - 1, d).getDay() === 1 || ['12-25', '01-01'].includes(item.fechaIso.slice(5));
      expect(item.cerrado).toBe(cierra);
      expect(item.numero).toBe(d);
      expect(Boolean(item.motivo)).toBe(cierra);
    });
  });

  test('un día abierto del calendario siempre se puede comprar', async () => {
    await levantar({ ahora: conHora(10, 0) });
    const { body: calendario } = await pedir('GET', '/api/calendario');

    const respuestas = await Promise.all(calendario
      .filter((item) => !item.cerrado)
      .map((item) => pedir('POST', '/api/compras', compraBase({ fechaVisita: item.fechaIso, visitantes: [adulto] }))));

    respuestas.forEach((respuesta) => expect(respuesta.status).toBe(201));
  });

  test('TC-34: hoy se cierra después de las 17:30', async () => {
    await levantar({ ahora: conHora(17, 31) });
    const { body } = await pedir('GET', '/api/calendario');
    const hoy = body[0];

    // Si hoy ya es lunes o feriado, el motivo es otro y el caso no aplica.
    if (new Date().getDay() !== 1 && !['12-25', '01-01'].includes(hoy.fechaIso.slice(5))) {
      expect(hoy.cerrado).toBe(true);
      expect(hoy.motivo).toMatch(/17:30/);
    }
  });
});
