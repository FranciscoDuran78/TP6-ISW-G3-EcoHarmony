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

  test('TC-26: rechazar la compra si la fecha de visita corresponde a un día feriado', () => {
    const fechaFeriado = new Date();
    fechaFeriado.setDate(fechaFeriado.getDate() + 10);
    const fechaStr = fechaFeriado.toISOString().split('T')[0];

    const feriados = [fechaStr];

    expect(() => {
      validarFechaVisita(fechaStr, null, true, feriados);
    }).toThrow('El parque se encuentra cerrado por día feriado');
  });

});

