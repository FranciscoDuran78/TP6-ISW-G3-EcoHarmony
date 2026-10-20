import Database from 'better-sqlite3';
// Jest en modo ESM necesita la extensión del archivo para resolver estos imports.
// eslint-disable-next-line import/extensions
import { crearApp } from '../src/app.js';
// eslint-disable-next-line import/extensions
import { crearPersistenciaCompras } from '../src/persistenciaCompras.js';

describe('API de compras', () => {
  let database;
  let persistencia;
  let servidor;
  let baseUrl;

  beforeEach(async () => {
    database = new Database(':memory:');
    persistencia = crearPersistenciaCompras(database);
    const app = crearApp({
      persistencia,
      opcionesCompra: {
        ahora: new Date('2026-10-20T15:00:00.000Z'),
        procesarPago: async ({ total }) => ({
          estado: 'APROBADA',
          codigo: 'TX-API',
          monto: total,
        }),
        enviarCorreo: async (correo) => ({ estado: 'ENVIADO', ...correo }),
      },
    });
    servidor = app.listen(0);
    await new Promise((resolve) => {
      servidor.once('listening', resolve);
    });
    baseUrl = `http://127.0.0.1:${servidor.address().port}`;
  });

  afterEach(async () => {
    await new Promise((resolve) => {
      servidor.close(resolve);
    });
    database.close();
  });

  test('crea y consulta una compra confirmada persistida', async () => {
    const respuesta = await fetch(`${baseUrl}/api/compras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fechaVisita: '2026-10-24',
        formaPago: 'TARJETA',
        visitantes: [{ edad: 30, tipoPase: 'VIP' }],
      }),
    });
    const { compra } = await respuesta.json();

    expect(respuesta.status).toBe(201);
    expect(compra.estado).toBe('CONFIRMADA');
    expect(compra.correo.estado).toBe('ENVIADO');

    const respuestaConsulta = await fetch(`${baseUrl}/api/compras/${compra.id}`);
    const compraConsultada = await respuestaConsulta.json();
    expect(compraConsultada.compra).toEqual(compra);
  });

  test('devuelve el rechazo de tarjeta y no registra una compra pagada', async () => {
    const app = crearApp({
      persistencia,
      opcionesCompra: {
        ahora: new Date('2026-10-20T15:00:00.000Z'),
        procesarPago: async () => ({ estado: 'RECHAZADA', codigo: 'CARD_DECLINED' }),
      },
    });
    await new Promise((resolve) => {
      servidor.close(resolve);
    });
    servidor = app.listen(0);
    await new Promise((resolve) => {
      servidor.once('listening', resolve);
    });
    baseUrl = `http://127.0.0.1:${servidor.address().port}`;

    const respuesta = await fetch(`${baseUrl}/api/compras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fechaVisita: '2026-10-24',
        formaPago: 'TARJETA',
        visitantes: [{ edad: 30, tipoPase: 'VIP' }],
      }),
    });
    const { compra } = await respuesta.json();

    expect(respuesta.status).toBe(402);
    expect(compra).toMatchObject({
      estado: 'RECHAZADA',
      pagada: false,
      pago: { estado: 'RECHAZADA', codigo: 'CARD_DECLINED' },
    });
    expect(persistencia.obtenerEntradasPrevias(1, '2026-10-24')).toBe(0);
  });
});
