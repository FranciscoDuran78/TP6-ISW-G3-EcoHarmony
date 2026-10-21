import { validarFechaVisita } from '../../src/validarFecha';

describe("Días abiertos y cierres del parque", () => {
  test('TC-26: permitir seleccionar un martes ordinario, sin feriado de cierre', () => {
    const fechaMartes = new Date();
    fechaMartes.setDate(fechaMartes.getDate() + ((2 + 7 - fechaMartes.getDay()) % 7 || 7));
    const fechaStr = fechaMartes.toISOString().split('T')[0];

    const resultado = validarFechaVisita(fechaStr, null, true, []);
    expect(resultado).toBe(true);
  });

  test('TC-27: deshabilitar los lunes en el calendario', () => {
    const fechaLunes = new Date();
    fechaLunes.setDate(fechaLunes.getDate() + ((1 + 7 - fechaLunes.getDay()) % 7 || 7));
    const fechaStr = fechaLunes.toISOString().split('T')[0];

    expect(() => {
      validarFechaVisita(fechaStr);
    }).toThrow('El parque se encuentra cerrado los días lunes');
  });

  test('TC-28: deshabilitar el 25 de diciembre por feriado de cierre', () => {
    const anioActual = new Date().getFullYear();
    const fechaNavidad = `${anioActual}-12-25`;

    expect(() => {
      validarFechaVisita(fechaNavidad);
    }).toThrow('El parque se encuentra cerrado por día feriado');
  });

  test('TC-29: deshabilitar el 1 de enero por feriado de año nuevo', () => {
    const anioActual = new Date().getFullYear();
    const fechaAnioNuevo = `${anioActual + 1}-01-01`;

    expect(() => {
      validarFechaVisita(fechaAnioNuevo);
    }).toThrow('El parque se encuentra cerrado por día feriado');
  });

  test('TC-30: rechazar una fecha de visita cerrada aunque sea futura (lunes futuro)', () => {
    const fechaLunesFuturo = new Date();
    fechaLunesFuturo.setDate(fechaLunesFuturo.getDate() + 14);
    const diaSemana = fechaLunesFuturo.getDay();
    const diasHastaLunes = (1 + 7 - diaSemana) % 7 || 7;
    fechaLunesFuturo.setDate(fechaLunesFuturo.getDate() + (diasHastaLunes === 7 ? 0 : diasHastaLunes));

    const fechaStr = fechaLunesFuturo.toISOString().split('T')[0];

    expect(() => {
      validarFechaVisita(fechaStr);
    }).toThrow('El parque se encuentra cerrado los días lunes');
  });
});
