//import { validarCantidadEntradas } from '../src/compraEntradas.js';
import {
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
} from '../src/compraEntradas.js';

describe('Validación de cantidad de entradas', () => {
  // [TC-10] - Completado
  test('TC-10: debería lanzar un error cuando la cantidad de entradas es 11', () => {
    const cantidadSolicitada = 11;

    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });

  // [TC-11] - Completado
  test('TC-11: debería lanzar un error cuando la cantidad supera ampliamente el máximo (25)', () => {
    const cantidadSolicitada = 25;

    expect(() => {
      validarCantidadEntradas(cantidadSolicitada);
    }).toThrow('La cantidad de entradas no puede ser mayor a 10');
  });

  // [TC-12] - Completado
  test('TC-12: debería lanzar un error cuando la cantidad de entradas no es un número entero', () => {
    const cantidadDecimal = 2.5;

    expect(() => {
      validarCantidadEntradas(cantidadDecimal);
    }).toThrow('La cantidad de entradas debe ser un número entero');
  });
});

describe('Validación de límite acumulado por fecha', () => {
  // =========================================================================
  // [TC-13] - ETAPA RED: Permitir 4 entradas si ya compró 6 en esa fecha
  // =========================================================================
  test('TC-13: debería permitir comprar 4 entradas si el usuario ya compró 6 para esa misma fecha (Total = 10)', () => {
    const previasEnFecha = 6;
    const cantidadActual = 4;

    const resultado = validarLimiteAcumuladoPorFecha(previasEnFecha, cantidadActual);

    expect(resultado).toBe(true);
  });
});