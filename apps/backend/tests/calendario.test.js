// Jest en modo ESM necesita la extensión del archivo para resolver este import.
// eslint-disable-next-line import/extensions
import { obtenerCalendarioDisponible } from '../../frontend/src/calendario.js';

describe('Calendario de compra', () => {
  test('TC-88/89: bloquea el 25 de diciembre y el 1 de enero', () => {
    const dias = obtenerCalendarioDisponible(new Date('2026-12-01T15:00:00.000Z'));

    expect(dias.find((dia) => dia.fechaIso === '2026-12-25').cerrado).toBe(true);
    expect(dias.find((dia) => dia.fechaIso === '2027-01-01').cerrado).toBe(true);
  });

  test('TC-90: solo expone fechas hasta un mes calendario hacia adelante', () => {
    const dias = obtenerCalendarioDisponible(new Date('2026-10-20T15:00:00.000Z'));

    expect(dias.at(-1).fechaIso).toBe('2026-11-20');
    expect(dias.some((dia) => dia.fechaIso === '2026-11-21')).toBe(false);
  });

  test('TC-91: deshabilita hoy después de las 17:30 de Argentina', () => {
    const dias = obtenerCalendarioDisponible(new Date('2026-10-20T20:31:00.000Z'));

    expect(dias.find((dia) => dia.fechaIso === '2026-10-20').cerrado).toBe(true);
  });
});
