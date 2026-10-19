import { validarEstructuraVisitantes, calcularPreciosVisitantes, validarFechaUnica } from '../src/compraEntradas.js';

// ----------------  ETAPA DE REFACTORY ---------------- 
// ---------------- CASO DE PRUEBA 71 ----------------

describe('Edades', () => {
  test('TC-67: rechaza un visitante con edad negativa', () => {
    const visitantes = [{ edad: -1, tipoPase: 'Regular' }];

    expect(() => validarEstructuraVisitantes(1, visitantes))
      .toThrow('La edad no es válida');
  });

    test('TC-68: rechaza una edad no ingresada', () => {
    const visitantes = [{ edad: null, tipoPase: 'Regular' }];

    expect(() => validarEstructuraVisitantes(1, visitantes))
        .toThrow('Cada visitante debe indicar su edad');
    });

    test('TC-69: conserva las edades y aplica el precio correspondiente', () => {
        const visitantes = [
        { edad: 8, tipoPase: 'Regular' },
        { edad: 35, tipoPase: 'Regular' },
        { edad: 62, tipoPase: 'Regular' },
        ];

        expect(calcularPreciosVisitantes(visitantes)).toEqual([
        { edad: 8, tipoPase: 'Regular', precio: 5000 },
        { edad: 35, tipoPase: 'Regular', precio: 10000 },
        { edad: 62, tipoPase: 'Regular', precio: 5000 },
        ]);
    });
});

describe('Visitantes y entradas', () => {
  test('TC-70: rechaza un visitante sin tipo de pase', () => {
    const visitantes = [
      { edad: 25, tipoPase: 'Regular' },
      { edad: 35, tipoPase: '' },
    ];

    expect(() => validarEstructuraVisitantes(2, visitantes))
      .toThrow('Cada visitante debe indicar tipo de pase VIP o Regular');
  });
});

describe('Fecha única por compra', () => {
  test('TC-71: acepta varias entradas asociadas a la misma fecha válida', () => {
    const entradas = [
      { fechaVisita: '2026-11-20' },
      { fechaVisita: '2026-11-20' },
      { fechaVisita: '2026-11-20' },
    ];

    expect(validarFechaUnica(entradas)).toBe(true);
  });
});
