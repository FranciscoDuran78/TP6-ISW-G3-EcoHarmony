import { validarUsuario } from "../src/domain/usuarios.js";

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
