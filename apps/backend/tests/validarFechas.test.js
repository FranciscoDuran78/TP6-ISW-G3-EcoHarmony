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

  test('TC-25: rechazar la compra si la fecha de visita corresponde a un día lunes', () => {
    const fechaLunes = new Date();
    fechaLunes.setDate(fechaLunes.getDate() + ((1 + 7 - fechaLunes.getDay()) % 7 || 7));
    const fechaStr = fechaLunes.toISOString().split('T')[0];

    expect(() => {
      validarFechaVisita(fechaStr);
    }).toThrow('El parque se encuentra cerrado los días lunes');
  });

});

