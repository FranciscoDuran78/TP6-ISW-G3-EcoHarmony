const MAXIMO_ENTRADAS_POR_COMPRA = 10;

const MENSAJES_ERROR = {
  LIMITE_ENTRADAS_SUPERADO: `La cantidad de entradas no puede ser mayor a ${MAXIMO_ENTRADAS_POR_COMPRA}`,
};

const validarCantidadEntradas = (cantidad) => {
  if (cantidad > MAXIMO_ENTRADAS_POR_COMPRA) {
    throw new Error(MENSAJES_ERROR.LIMITE_ENTRADAS_SUPERADO);
  }
  return true;
};

export {
  MAXIMO_ENTRADAS_POR_COMPRA,
  MENSAJES_ERROR,
  validarCantidadEntradas,
};