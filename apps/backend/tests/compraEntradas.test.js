import { validarCantidadEntradas } from '../src/compraEntradas.js';

describe('Validación de cantidad de entradas', () => {
  // [TC-10] - Ciclo TDD completado
  test('TC-10: debería lanzar un error cuando la cantidad de entradas es mayor a 10', () => {
    const cantidadSolicitada = 11;

    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });

  // [TC-11] - Ciclo TDD completado
  test('TC-11: debería lanzar un error cuando la cantidad supera ampliamente el máximo (25)', () => {
    const cantidadSolicitada = 25;

    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });

  // =========================================================================
  // [TC-12] - ETAPA RED: Escribir una prueba que falle con número decimal (2.5)
  // =========================================================================
  test('TC-12: debería lanzar un error cuando la cantidad de entradas no es un número entero', () => {
    // Arrange
    const cantidadDecimal = 2.5;

    // Act & Assert
    expect(() => {
      validarCantidadEntradas(cantidadDecimal);
    }).toThrow('La cantidad de entradas debe ser un número entero');
  });
});