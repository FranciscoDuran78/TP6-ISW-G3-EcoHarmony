import { levantar, pedir } from '../helpers/api.js';

describe('GET /api/horario', () => {
  beforeEach(() => levantar());

  test('TC-35: informa que el parque abre de 08:30 a 19:00', async () => {
    const { status, body } = await pedir('GET', '/api/horario');

    expect(status).toBe(200);
    expect(body).toEqual({ apertura: '08:30', cierre: '19:00' });
  });
});
