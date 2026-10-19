// import {
//   validarCantidadEntradas,
//   validarLimiteAcumuladoPorFecha,
// } from '../src/compraEntradas.js';
import {
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
  validarEstructuraVisitantes,
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
  // [TC-13] - Completado
  test('TC-13: debería permitir comprar 4 entradas si el usuario ya compró 6 para esa misma fecha (Total = 10)', () => {
    const previasEnFecha = 6;
    const cantidadActual = 4;

    const resultado = validarLimiteAcumuladoPorFecha(previasEnFecha, cantidadActual);

    expect(resultado).toBe(true);
  });

  // [TC-14] - Completado
  test('TC-14: debería lanzar un error al intentar comprar 5 entradas si ya compró 6 para esa misma fecha (Total = 11)', () => {
    const previasEnFecha = 6;
    const cantidadActual = 5;

    expect(() => {
      validarLimiteAcumuladoPorFecha(previasEnFecha, cantidadActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });

  // [TC-15] - Completado
  test('TC-15: debería lanzar un error al intentar comprar 1 entrada si el usuario ya tiene 10 compradas para esa fecha', () => {
    const previasEnFecha = 10;
    const cantidadActual = 1;

    expect(() => {
      validarLimiteAcumuladoPorFecha(previasEnFecha, cantidadActual);
    }).toThrow('Supera el límite de 10 entradas permitidas por fecha');
  });

  // [TC-16] - Completado
  test('TC-16: debería permitir comprar 10 entradas en una fecha nueva aunque tenga 10 en otra fecha distinta', () => {
    const entradasPrevias = 10;
    const cantidadActual = 10;
    const fechaNueva = '2026-11-20';
    const fechaPreviaDistinta = '2026-11-10';

    const resultado = validarLimiteAcumuladoPorFecha(
      entradasPrevias,
      cantidadActual,
      fechaNueva,
      fechaPreviaDistinta,
    );

    expect(resultado).toBe(true);
  });
});

describe('Validación de estructura de visitantes en el pedido', () => {
  // [TC-17] - Completado
  test('TC-17: debería lanzar un error si no se envía el listado de visitantes', () => {
    const cantidad = 2;
    const visitantes = [];

    expect(() => {
      validarEstructuraVisitantes(cantidad, visitantes);
    }).toThrow('Debe detallar la edad y tipo de pase de cada visitante');
  });

  // [TC-18] - Completado
  test('TC-18: debería lanzar un error si la cantidad declarada no coincide con el tamaño de la lista de visitantes', () => {
    const cantidad = 3;
    const visitantes = [
      { edad: 25, tipoPase: 'VIP' },
      { edad: 30, tipoPase: 'Regular' },
    ];

    expect(() => {
      validarEstructuraVisitantes(cantidad, visitantes);
    }).toThrow('La cantidad de entradas no coincide con los visitantes ingresados');
  });

  // =========================================================================
  // [TC-19] - ETAPA RED: Rechazar si a un visitante le falta indicar la edad
  // =========================================================================
  test('TC-19: debería lanzar un error si a un visitante le falta indicar la edad', () => {
    const cantidad = 1;
    const visitantes = [{ edad: null, tipoPase: 'VIP' }];

    expect(() => {
      validarEstructuraVisitantes(cantidad, visitantes);
    }).toThrow('Cada visitante debe indicar su edad');
  });
});