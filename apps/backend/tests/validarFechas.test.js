import { validarFechaVisita } from '../src/validarFecha';

describe('Validación de Fecha de Visita y Calendario', () => {
  test('TC-21: permitir seleccionar el día actual si el parque está abierto y se compra antes de las 17:30', () => {
    const hoyStr = new Date().toISOString().split('T')[0];
    const horaCompra = '17:29';
    const parqueAbierto = true;

    const resultado = validarFechaVisita(hoyStr, horaCompra, parqueAbierto);
    expect(resultado).toBe(true);
  });
});

