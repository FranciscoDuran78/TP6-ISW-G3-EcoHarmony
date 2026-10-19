import { validarEstructuraVisitantes } from '../src/compraEntradas.js';

// ----------------  ETAPA DE GREEN ---------------- 
// ---------------- CASO DE PRUEBA 68 ----------------

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

});

