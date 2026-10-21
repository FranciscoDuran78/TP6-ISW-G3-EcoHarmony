import { validarCantidadEntradas } from '../../src/domain/entradas/validarCantidadEntradas.js';

describe("Cantidad de entradas por compra", () => {
  test('TC-10: debería lanzar un error cuando la cantidad de entradas es 11', () => {
    const cantidadSolicitada = 11;

    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });

  test('TC-11: debería lanzar un error cuando la cantidad supera ampliamente el máximo (25)', () => {
    const cantidadSolicitada = 25;

    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });

  test('TC-12: debería lanzar un error cuando la cantidad de entradas no es un número entero', () => {
    const cantidadDecimal = 2.5;

    expect(() => {
      validarCantidadEntradas(cantidadDecimal);
    }).toThrow('La cantidad de entradas debe ser un número entero');
  });
});
