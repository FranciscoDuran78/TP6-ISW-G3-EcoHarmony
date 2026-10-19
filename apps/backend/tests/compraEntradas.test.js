import { validarEstructuraVisitantes } from '../src/compraEntradas.js';

// ----------------  ETAPA DE RED ---------------- 
// ---------------- CASO DE PRUEBA 67 ----------------

describe('Edades', () => {
  test('TC-67: rechaza un visitante con edad negativa', () => {
    const visitantes = [{ edad: -1, tipoPase: 'Regular' }];

    expect(() => validarEstructuraVisitantes(1, visitantes))
      .toThrow('La edad no es válida');
  });
});
