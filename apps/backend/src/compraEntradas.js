const MAXIMO_ENTRADAS_POR_COMPRA = 10;

const MENSAJES_ERROR = {
  LIMITE_ENTRADAS_SUPERADO: `La cantidad de entradas no puede ser mayor a ${MAXIMO_ENTRADAS_POR_COMPRA}`,
};

const validarCantidadEntradas = (cantidad) => {
  // =========================================================================
  // [TC-12] - ETAPA GREEN: Código mínimo para validar que sea entero
  // =========================================================================
  if (!Number.isInteger(cantidad)) {
    throw new Error('La cantidad de entradas debe ser un número entero');
  }

  // [TC-10 y TC-11] - Validación de límite superior
  if (cantidad > MAXIMO_ENTRADAS_POR_COMPRA) {
    throw new Error(MENSAJES_ERROR.LIMITE_ENTRADAS_SUPERADO);
  }

  return true;
};

// ===========================================================================
// [TC-13] - ETAPA GREEN: Código mínimo para que el caso válido devuelva true
// ===========================================================================
const validarLimiteAcumuladoPorFecha = () => true;

export {
  MAXIMO_ENTRADAS_POR_COMPRA,
  MENSAJES_ERROR,
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
};