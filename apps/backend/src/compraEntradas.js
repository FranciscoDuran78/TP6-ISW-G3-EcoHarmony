const MAXIMO_ENTRADAS_POR_COMPRA = 10;

// ===========================================================================
// [TC-10, TC-11 y TC-12] - ETAPA REFACTOR: Centralización de mensajes de error
// ===========================================================================
const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  LIMITE_ENTRADAS_SUPERADO: `La cantidad de entradas no puede ser mayor a ${MAXIMO_ENTRADAS_POR_COMPRA}`,
};

const validarCantidadEntradas = (cantidad) => {
  // [TC-12] - ETAPA REFACTOR: Validación de tipo entero usando constante
  if (!Number.isInteger(cantidad)) {
    throw new Error(MENSAJES_ERROR.CANTIDAD_NO_ENTERA);
  }

  // [TC-10 y TC-11] - ETAPA REFACTOR: Validación de límite máximo usando constante
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