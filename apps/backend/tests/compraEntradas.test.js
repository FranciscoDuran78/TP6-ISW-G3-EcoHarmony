import { validarEstructuraVisitantes } from '../src/compraEntradas.js';

// ----------------  ETAPA DE RED ---------------- 
// ---------------- CASO DE PRUEBA 69 ----------------

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

    test('conserva las edades y aplica el precio correspondiente', () => {
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


