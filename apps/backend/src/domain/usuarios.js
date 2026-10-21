const MENSAJES_ERROR_USUARIO = {
  USUARIO_INVALIDO: "Debe iniciar sesión con un usuario registrado",
  USUARIO_NO_REGISTRADO: "Se permite la compra solo a usuarios registrados",
  ID_USUARIO_INVALIDO: "Identificador de usuario inválido",
};

const validarUsuario = (usuario) => {
  if (usuario === null)
    throw new Error(MENSAJES_ERROR_USUARIO.USUARIO_INVALIDO);

  if (!usuario.registrado)
    throw new Error(MENSAJES_ERROR_USUARIO.USUARIO_NO_REGISTRADO);

  if (
    !usuario.id ||
    (typeof usuario.id !== "string" && typeof usuario.id !== "number")
  )
    throw new Error(MENSAJES_ERROR_USUARIO.ID_USUARIO_INVALIDO);

  return true;
};

export { validarUsuario };
