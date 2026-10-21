import { validarFechaVisita } from '../../src/domain/fechas/validarFecha.js';

describe("Anticipación de la compra", () => {
  test("TC-32: rechazar una fecha que supera el horizonte de 1 mes", () => {
    const fechaLejana = new Date();
    fechaLejana.setDate(fechaLejana.getDate() + 35);
    const fechaStr = fechaLejana.toISOString().split('T')[0];

    expect(() => {
      validarFechaVisita(fechaStr);
    }).toThrow('La fecha supera el horizonte máximo de compra permitido (1 mes)');
  });
});
