import { validarFechaUnica } from '../../src/compraEntradas.js';

describe("Fecha única por compra", () => {
  test('TC-71: acepta varias entradas asociadas a la misma fecha válida', () => {
    const entradas = [
      { fechaVisita: '2026-11-20' },
      { fechaVisita: '2026-11-20' },
      { fechaVisita: '2026-11-20' },
    ];

    expect(validarFechaUnica(entradas)).toBe(true);
  });

  test('TC-75: rechaza entradas de una compra con fechas distintas', () => {
    const entradas = [
      { fechaVisita: '2026-11-20' },
      { fechaVisita: '2026-11-21' },
    ];

    expect(() => validarFechaUnica(entradas))
      .toThrow('Todas las entradas deben tener la misma fecha de visita');
  });
});
