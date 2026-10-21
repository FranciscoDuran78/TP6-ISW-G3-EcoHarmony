import { validarEstructuraVisitantes } from '../../src/domain/visitantes/validarEstructuraVisitantes.js';

describe("Edad y tipo de pase de los visitantes", () => {
  test('TC-19: debería lanzar un error si a un visitante le falta indicar la edad', () => {
    const cantidad = 1;
    const visitantes = [{ edad: null, tipoPase: 'VIP' }];

    expect(() => {
      validarEstructuraVisitantes(cantidad, visitantes);
    }).toThrow('Cada visitante debe indicar su edad');
  });

  test('TC-20: debería lanzar un error si a un visitante le falta indicar el tipo de pase', () => {
    const cantidad = 1;
    const visitantes = [{ edad: 25, tipoPase: '' }];

    expect(() => {
      validarEstructuraVisitantes(cantidad, visitantes);
    }).toThrow('Cada visitante debe indicar tipo de pase VIP o Regular');
  });

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

  test('TC-70: rechaza un visitante sin tipo de pase', () => {
    const visitantes = [
      { edad: 25, tipoPase: 'Regular' },
      { edad: 35, tipoPase: '' },
    ];

    expect(() => validarEstructuraVisitantes(2, visitantes))
      .toThrow('Cada visitante debe indicar tipo de pase VIP o Regular');
  });
});
