import { validarFechaVisita } from '../../src/domain/fechas/validarFecha.js';

describe("Fecha de visita obligatoria y válida", () => {
  test('TC-21: permitir seleccionar el día actual si el parque está abierto y se compra antes de las 17:30', () => {
    const hoyStr = new Date().toISOString().split('T')[0];
    const horaCompra = '17:29';
    const parqueAbierto = true;

    const resultado = validarFechaVisita(hoyStr, horaCompra, parqueAbierto);
    expect(resultado).toBe(true);
  });

  test('TC-23: rechazar la compra si la fecha de visita es anterior al día actual', () => {
    const fechaPasada = new Date();
    fechaPasada.setDate(fechaPasada.getDate() - 2); // 2 días en el pasado
    const fechaStr = fechaPasada.toISOString().split('T')[0];

    expect(() => {
      validarFechaVisita(fechaStr);
    }).toThrow('La fecha de visita no puede ser anterior a la actual');
  });

  test('TC-24: rechazar la compra si la fecha de visita es nula o vacía', () => {
    expect(() => {
      validarFechaVisita(null);
    }).toThrow('La fecha de visita es obligatoria');

    expect(() => {
      validarFechaVisita('');
    }).toThrow('La fecha de visita es obligatoria');
  });

  test('TC-25: rechazar una fecha inexistente o con formato inválido', () => {
    expect(() => {
      validarFechaVisita('31/99/2026');
    }).toThrow('La fecha ingresada no es válida');

    expect(() => {
      validarFechaVisita('2026-02-31');
    }).toThrow('La fecha ingresada no es válida');
  });
});
