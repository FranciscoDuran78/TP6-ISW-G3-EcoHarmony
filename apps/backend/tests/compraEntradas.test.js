// compraEntradas.test.js
import { validarCantidadEntradas } from '../src/compraEntradas.js';

describe('Validación de cantidad de entradas', () => {
  // [TC-10] - Test previo ya en GREEN
  test('TC-10: debería lanzar un error cuando la cantidad de entradas es mayor a 10', () => {
    const cantidadSolicitada = 11;

    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });

  // =========================================================================
  // [TC-11] - ETAPA RED: Escribir la prueba para partición mayor a 10 (25)
  // =========================================================================
  test('TC-11: debería lanzar un error cuando la cantidad supera ampliamente el máximo (25)', () => {
    // Arrange
    const cantidadSolicitada = 25;

    // Act & Assert
    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });
});