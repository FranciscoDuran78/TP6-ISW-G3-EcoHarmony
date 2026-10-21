import { MAXIMO_ENTRADAS_POR_COMPRA, MENSAJES_ERROR } from './mensajesError.js';

const validarCantidadEntradas = (cantidad) => {
  if (!Number.isInteger(cantidad)) {
    throw new Error(MENSAJES_ERROR.CANTIDAD_NO_ENTERA);
  }

  if (cantidad > MAXIMO_ENTRADAS_POR_COMPRA) {
    throw new Error(MENSAJES_ERROR.LIMITE_ENTRADAS_SUPERADO);
  }
  return true;
};

export { MAXIMO_ENTRADAS_POR_COMPRA, validarCantidadEntradas };
