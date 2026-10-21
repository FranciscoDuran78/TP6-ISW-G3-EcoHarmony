import { createApp } from '../src/app.js';

const dos = (n) => String(n).padStart(2, '0');
const fechaLocal = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;

// Fechas relativas a hoy: dentro del mes, ni lunes ni 25/12 ni 1/1.
const diasAbiertos = () => {
  const abiertos = [];
  for (let i = 1; i <= 29; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const f = fechaLocal(d);
    if (d.getDay() !== 1 && !['12-25', '01-01'].includes(f.slice(5))) abiertos.push(f);
  }
  return abiertos;
};
const [FECHA] = diasAbiertos();

const proximoLunes = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  return fechaLocal(d);
};

const adulto = { edad: 30, tipoPase: 'VIP' };
const nino = { edad: 10, tipoPase: 'Regular' };
const bebe = { edad: 3, tipoPase: 'Regular' };
const compraBase = (extra = {}) => ({
  fechaVisita: FECHA,
  visitantes: [adulto, nino, bebe],
  formaPago: 'tarjeta',
  ...extra,
});

let server;
let pedir;

const levantar = async (opciones) => {
  server = createApp(opciones).listen(0);
  await new Promise((resolve) => { server.once('listening', resolve); });
  const base = `http://127.0.0.1:${server.address().port}`;
  pedir = async (metodo, ruta, cuerpo) => {
    const respuesta = await fetch(`${base}${ruta}`, {
      method: metodo,
      headers: { 'content-type': 'application/json' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    return { status: respuesta.status, body: await respuesta.json() };
  };
};

afterEach(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => { server.close(resolve); });
});

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

  test('hoy se cierra después de las 17:30', async () => {
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

describe('POST /api/compras', () => {
  beforeEach(() => levantar());

  test('TC-38: tarjeta válida crea la compra pendiente con su total', async () => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase());

    expect(status).toBe(201);
    expect(body).toMatchObject({
      fechaVisita: FECHA,
      cantidad: 3,
      total: 25000,
      formaPago: 'tarjeta',
      estado: 'pendiente',
      pagada: false,
    });
    expect(body.id).toBeDefined();
    expect(body.intentos).toHaveLength(1);
    expect(body.correo).toBeNull();
  });

  test('TC-37/85: efectivo queda pendiente de validación y sin mail', async () => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase({ formaPago: 'EFECTIVO' }));

    expect(status).toBe(201);
    expect(body).toMatchObject({ formaPago: 'efectivo', estado: 'pendiente', pagada: false });
    expect(body.intentos).toEqual([]);
    expect(body.resumen).toMatchObject({ cantidadEntradas: 3, fecha: FECHA });
    expect(body.correo).toBeNull();
  });

  test.each([
    ['TC-36: sin forma de pago', { formaPago: null }, /forma de pago/],
    ['TC-39: forma de pago no ofrecida', { formaPago: 'transferencia' }, /forma de pago no es válida/],
    ['TC-24: sin fecha', { fechaVisita: null }, /fecha de visita es obligatoria/],
    ['TC-25: fecha inválida', { fechaVisita: '31/99/2026' }, /fecha ingresada no es válida/],
    ['TC-23: fecha pasada', { fechaVisita: '2020-01-07' }, /no puede ser anterior/],
    ['TC-32: más de un mes de anticipación', { fechaVisita: fechaLocal(new Date(Date.now() + 40 * 86400000)) }, /horizonte/],
    ['TC-27: lunes', { fechaVisita: proximoLunes() }, /cerrado/],
    ['TC-92: 11 entradas', { visitantes: Array(11).fill(adulto) }, /no puede ser mayor a 10/],
    ['TC-18/73: cantidad distinta de visitantes', { cantidad: 4 }, /no coincide/],
    ['TC-17: sin visitantes', { cantidad: 2, visitantes: [] }, /detallar la edad y tipo de pase/],
    ['TC-05: cantidad 0', { cantidad: 0, visitantes: [] }, /al menos 1/],
    ['TC-06: cantidad negativa', { cantidad: -3 }, /al menos 1/],
    ['TC-93: visitante sin edad', { visitantes: [adulto, { edad: null, tipoPase: 'VIP' }] }, /indicar su edad/],
    ['TC-94: visitante sin pase', { visitantes: [adulto, { edad: 5, tipoPase: '' }] }, /tipo de pase/],
    ['TC-67: edad negativa', { visitantes: [{ edad: -1, tipoPase: 'VIP' }] }, /edad no es válida/],
    ['pase inexistente', { visitantes: [{ edad: 20, tipoPase: 'Gold' }] }, /Regular o VIP/],
  ])('%s se rechaza con 400', async (_nombre, cambio, mensaje) => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase(cambio));

    expect(status).toBe(400);
    expect(body.error).toMatch(mensaje);
  });

  // Respuesta del profesor: el máximo es de 10 entradas por fecha en una transacción,
  // y se pueden hacer varias transacciones (por ejemplo, 20 entradas).
  test('TC-76: se pueden comprar más de 10 entradas para una fecha en varias transacciones', async () => {
    const diez = Array(10).fill(adulto);

    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: diez }))).status).toBe(201);
    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: diez }))).status).toBe(201);
    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: [adulto] }))).status).toBe(201);
  });

  test('TC-77/78: el máximo de 10 se aplica a cada transacción, no a la suma de la fecha', async () => {
    const seis = Array(6).fill(adulto);
    const cinco = Array(5).fill(adulto);

    await pedir('POST', '/api/compras', compraBase({ visitantes: seis }));
    expect((await pedir('POST', '/api/compras', compraBase({ visitantes: cinco }))).status).toBe(201);

    const { status, body } = await pedir('POST', '/api/compras', compraBase({ visitantes: Array(11).fill(adulto) }));
    expect(status).toBe(400);
    expect(body.error).toMatch(/no puede ser mayor a 10/);
  });
});

describe('pago con tarjeta', () => {
  beforeEach(() => levantar());

  const crear = async (extra) => (await pedir('POST', '/api/compras', compraBase(extra))).body;

  test('TC-43/47/49: aprobar paga la compra y muestra el mail con adjunto', async () => {
    const { id } = await crear();
    const { status, body } = await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' });

    expect(status).toBe(200);
    expect(body).toMatchObject({ estado: 'pagada', pagada: true });
    expect(body.correo).toMatchObject({ cantidad: 3, fecha: FECHA });
    expect(body.correo.adjunto).toMatch(/\.pdf$/);
  });

  test.each(['rechazada', 'cancelada'])('TC-44/45/97: %s no marca la compra como pagada', async (resultado) => {
    const { id } = await crear();
    const { body } = await pedir('POST', `/api/compras/${id}/pago`, { resultado });

    expect(body).toMatchObject({ estado: resultado, pagada: false, correo: null });
  });

  test('TC-46: reintenta tras un rechazo sin duplicar el pago aprobado', async () => {
    const { id } = await crear();
    await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'rechazada' });

    const reintento = await pedir('POST', `/api/compras/${id}/reintento`);
    expect(reintento.body).toMatchObject({ estado: 'pendiente' });
    expect(reintento.body.intentos).toHaveLength(2);

    await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' });
    const otro = await pedir('POST', `/api/compras/${id}/reintento`);
    expect(otro.status).toBe(409);
  });

  test('un resultado desconocido es 400 y una compra ya resuelta es 409', async () => {
    const { id } = await crear();

    expect((await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'quizas' })).status).toBe(400);
    await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' });
    expect((await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'rechazada' })).status).toBe(409);
  });

  test('una compra en efectivo no tiene pago con tarjeta', async () => {
    const { id } = await crear({ formaPago: 'efectivo' });

    expect((await pedir('POST', `/api/compras/${id}/pago`, { resultado: 'aprobada' })).status).toBe(409);
  });
});

describe('efectivo en boletería', () => {
  beforeEach(() => levantar());

  test('TC-41: la validación en boletería deja la compra validada', async () => {
    const { body: compra } = await pedir('POST', '/api/compras', compraBase({ formaPago: 'efectivo' }));
    const { status, body } = await pedir('POST', `/api/compras/${compra.id}/validacion-boleteria`, { validacion: 'aprobada' });

    expect(status).toBe(200);
    expect(body).toMatchObject({ estado: 'validada', pagada: true });
    expect(body.correo).not.toBeNull();
  });

  test('una compra con tarjeta no se valida en boletería', async () => {
    const { body: compra } = await pedir('POST', '/api/compras', compraBase());

    expect((await pedir('POST', `/api/compras/${compra.id}/validacion-boleteria`, { validacion: 'aprobada' })).status).toBe(409);
  });
});

describe('GET /api/compras/:id', () => {
  beforeEach(() => levantar());

  test('devuelve la compra creada y 404 si no existe', async () => {
    const { body: compra } = await pedir('POST', '/api/compras', compraBase());

    expect((await pedir('GET', `/api/compras/${compra.id}`)).body.id).toBe(compra.id);
    expect((await pedir('GET', '/api/compras/999')).status).toBe(404);
  });
});

describe('correo de confirmación', () => {
  test('TC-50/98: si el mail falla la compra sigue confirmada y se informa el error', async () => {
    await levantar({ servicioMail: () => { throw new Error('SMTP caído'); } });

    const { body: compra } = await pedir('POST', '/api/compras', compraBase());
    const { body } = await pedir('POST', `/api/compras/${compra.id}/pago`, { resultado: 'aprobada' });

    expect(body).toMatchObject({ estado: 'pagada', pagada: true, correo: null, errorCorreo: 'SMTP caído' });
  });
});

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

  test('una fecha futura se acepta aunque sean más de las 17:30', async () => {
    await levantar({ ahora: conHora(18, 0) });

    expect((await pedir('POST', '/api/compras', compraBase())).status).toBe(201);
  });
});
