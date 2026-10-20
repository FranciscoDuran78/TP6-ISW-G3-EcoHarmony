/* eslint-disable */

const validarUsuario = (usuario) => {
  if (usuario === null)
    throw new Error("Debe iniciar sesión con un usuario registrado");
};

export { validarUsuario };
