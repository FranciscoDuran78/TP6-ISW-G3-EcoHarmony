import { validarFechaVisita } from '../src/validarFecha';

describe('Validación de Fecha de Visita y Calendario', () => {
  test('TC-21: permitir seleccionar el día actual si el parque está abierto y se compra antes de las 17:30', () => {
    const hoyStr = new Date().toISOString().split('T')[0];
    const horaCompra = '17:29';
    const parqueAbierto = true;

    const resultado = validarFechaVisita(hoyStr, horaCompra, parqueAbierto);
    expect(resultado).toBe(true);
  });

  test('TC-22 (Rechazo): rechazar una fecha que supera el horizonte de 1 mes', () => {
    const fechaLejana = new Date();
    fechaLejana.setDate(fechaLejana.getDate() + 35); 
    const fechaStr = fechaLejana.toISOString().split('T')[0];

    expect(() => {
      validarFechaVisita(fechaStr);
    }).toThrow('La fecha supera el horizonte máximo de compra permitido (1 mes)');
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

