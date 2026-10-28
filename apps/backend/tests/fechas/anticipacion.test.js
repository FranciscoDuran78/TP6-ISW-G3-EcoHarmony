import { jest } from '@jest/globals';
import { validarFechaVisita } from '../../src/domain/fechas/validarFecha.js';

describe("Anticipación de la compra", () => {
  beforeEach(() => jest.useFakeTimers({ now: new Date(2026, 9, 28, 10, 0) })); // miércoles 28/10/2026
  afterEach(() => jest.useRealTimers());

  test("TC-31: permitir una visita exactamente a un mes calendario", () => {
    expect(validarFechaVisita('2026-11-28')).toBe(true);
  });

  test("TC-32: rechazar una visita a un mes y un día", () => {
    expect(() => {
      validarFechaVisita('2026-11-29');
    }).toThrow('La fecha supera el horizonte máximo de compra permitido (1 mes)');
  });

  test("TC-33: permitir comprar para hoy a las 17:30", () => {
    expect(validarFechaVisita('2026-10-28', '17:30')).toBe(true);
  });

  test("TC-34: rechazar comprar para hoy a las 17:31", () => {
    expect(() => {
      validarFechaVisita('2026-10-28', '17:31');
    }).toThrow('No se pueden realizar compras para el mismo día después de las 17:30');
  });
});
