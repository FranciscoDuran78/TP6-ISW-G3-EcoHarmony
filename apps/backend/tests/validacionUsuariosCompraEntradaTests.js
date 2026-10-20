/* eslint-disable */

import { validarUsuario } from "../src/compraEntrada";

// | TC-01 | Autenticación | Rechazar compra cuando el usuario no es proporcionado | usuario: null | Falla: Lanza error 'Debe iniciar sesión con un usuario registrado' |
// | TC-02 | Autenticación | Rechazar compra cuando el usuario no está registrado | usuario: { id: 1, registrado: false } | Falla: Lanza error 'Se permite la compra solo a usuarios registrados' |
// | TC-03 | Autenticación | Rechazar compra cuando el usuario registrado no tiene ID válido | usuario: { id: null, registrado: true } | Falla: Lanza error 'Identificador de usuario inválido' |
// | TC-04 | Autenticación | Permitir validación cuando el usuario está registrado y es válido | usuario: { id: 10, registrado: true } | Pasa la validación de usuario |
describe("Validación de usuario para comprar entradas", () => {
  test("TC-01: debería lanzar un error cuando el usuario no es proporcionado", () => {
    const usuario = null;

    expect(() => validarUsuario(usuario)).toThrow(
      "Debe iniciar sesión con un usuario registrado",
    );
  });

  test("TC-02: debería lanzar un error cuando el usuario no esta registrado", () => {
    const usuario = { id: 1, registrado: false };

    expect(() => validarUsuario(usuario)).toThrow(
      "Se permite la compra solo a usuarios registrados",
    );
  });

  test("TC-03: debería lanzar un error cuando el usuario tiene un ID no válido", () => {
    const usuario = { id: null, registrado: true };

    expect(() => validarUsuario(usuario)).toThrow(
      "Identificador de usuario inválido",
    );
  });

  test("TC-04: debería pasar validación de usuario cuando el usuario esta registrado y es válido", () => {
    const usuario = { id: 1, registrado: true };

    const resultado = validarUsuario(usuario);

    expect(resultado).toBe(true);
  });
});
