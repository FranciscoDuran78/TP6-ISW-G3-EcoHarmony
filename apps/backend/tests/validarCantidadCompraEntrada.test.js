/* eslint-disable */

import { validarCantidadAComprar } from "../src/domain/compraEntrada";

// | **TC-05** | Cantidad (Límite) | Rechazar compra cuando la cantidad de entradas es 0 (Valor límite inferior inválido) | cantidad: 0 | Falla: Lanza error 'La cantidad de entradas debe ser al menos 1' |
// | **TC-06** | Cantidad (Límite) | Rechazar compra cuando la cantidad de entradas es negativa | cantidad: -3 | Falla: Lanza error 'La cantidad de entradas debe ser al menos 1' |
// | **TC-07** | Cantidad (Límite) | Aceptar compra cuando la cantidad de entradas es 1 (Valor límite inferior válido) | cantidad: 1 | Pasa la validación de cantidad |
// | **TC-08** | Cantidad (Nominal) | Aceptar compra con una cantidad intermedia de entradas | cantidad: 5 | Pasa la validación de cantidad |
// | **TC-09** | Cantidad (Límite) | Aceptar compra cuando la cantidad de entradas es exactamente 10 (Valor límite superior válido) | cantidad: 10 | Pasa la validación de cantidad

describe("Validación de cantidad para comprar entradas", () => {
  test("TC-05: debería lanzar un error cuando se compran entradas con cantidad igual a 0", () => {
    const cantidad = 0;

    expect(() => validarCantidadAComprar(cantidad)).toThrow(
      "La cantidad de entradas debe ser al menos 1",
    );
  });

  test("TC-06: debería lanzar un error cuando se compran entradas con cantidad negativa", () => {
    const cantidad = -1;

    expect(() => validarCantidadAComprar(cantidad)).toThrow(
      "La cantidad de entradas debe ser al menos 1",
    );
  });

  test("TC-07: debería pasar validación cuando se compran entradas con cantidad en límite inferior de 1", () => {
    const cantidad = 1;

    const resultado = validarCantidadAComprar(cantidad);

    expect(resultado).toThrow(true);
  });

  test("TC-08: debería pasar validación cuando se compran entradas con cantidad intermedia de entradas", () => {
    const cantidad = 5;

    const resultado = validarCantidadAComprar(cantidad);

    expect(resultado).toThrow(true);
  });

  test("TC-09: debería pasar validación cuando se compran entradas con cantidad en límite superior de 10", () => {
    const cantidad = 10;

    const resultado = validarCantidadAComprar(cantidad);

    expect(resultado).toThrow(true);
  });
});
