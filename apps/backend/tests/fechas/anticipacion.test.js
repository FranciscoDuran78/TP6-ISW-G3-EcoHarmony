import { jest } from '@jest/globals';
import { validarFechaVisita } from '../../src/domain/fechas/validarFecha.js';

describe("Anticipación de la compra", () => {
  beforeEach(() => jest.useFakeTimers({ now: new Date(2026, 9, 28, 10, 0) })); // miércoles 28/10/2026
  afterEach(() => jest.useRealTimers());

  test("TC-31: permitir una visita exactamente a un mes calendario", () => {
    expect(validarFechaVisita('2026-11-28')).toBe(true);
  });

  test("TC-32: rechazar una fecha que supera el horizonte de 1 mes", () => {
    const fechaLejana = new Date();
    fechaLejana.setDate(fechaLejana.getDate() + 35);
    const fechaStr = fechaLejana.toISOString().split('T')[0];

    expect(() => {
      validarFechaVisita(fechaStr);
    }).toThrow('La fecha supera el horizonte máximo de compra permitido (1 mes)');
  });
});
