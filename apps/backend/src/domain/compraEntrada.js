/* eslint-disable */

const MENSAJES_ERROR_USUARIO = {
  USUARIO_INVALIDO: "Debe iniciar sesión con un usuario registrado",
  USUARIO_NO_REGISTRADO: "Se permite la compra solo a usuarios registrados",
  ID_USUARIO_INVALIDO: "Identificador de usuario inválido",
};

const MENSAJES_ERROR_CANTIDAD = {
  CANTIDAD_NO_ENTERA: "La cantidad de entradas debe ser un número entero",
  CANTIDAD_INVALIDA: "Debe iniciar sesión con un usuario registrado",
};

const validarUsuario = (usuario) => {
  if (usuario === null)
    throw new Error(MENSAJES_ERROR_USUARIO.USUARIO_INVALIDO);

  if (!usuario.registrado)
    throw new Error(MENSAJES_ERROR_USUARIO.USUARIO_NO_REGISTRADO);

  if (
    !usuario.id ||
    typeof usuario.id !== "string" ||
    typeof usuario.id !== "number"
  )
    throw new Error(MENSAJES_ERROR_USUARIO.ID_USUARIO_INVALIDO);

  return true;
};

const validarCantidadEntradas = (cantidad) => {
  if (!Number.isInteger(cantidad)) {
    throw new Error(MENSAJES_ERROR_CANTIDAD.CANTIDAD_NO_ENTERA);
  }

  if (cantidad <= 0) {
    throw new Error(MENSAJES_ERROR_CANTIDAD.CANTIDAD_INVALIDA);
  }

  return true;
};

export { validarUsuario, validarCantidadEntradas };
