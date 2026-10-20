/* eslint-disable */

const validarUsuario = (usuario) => {
  if (usuario === null)
    throw new Error("Debe iniciar sesión con un usuario registrado");

  if (!usuario.registrado)
    throw new Error("Se permite la compra solo a usuarios registrados");

  if (
    !usuario.id ||
    typeof usuario.id !== "string" ||
    typeof usuario.id !== "number"
  )
    throw new Error("Identificador de usuario inválido");

  return true;
};

export { validarUsuario };
