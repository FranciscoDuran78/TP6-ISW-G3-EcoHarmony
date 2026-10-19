const MAXIMO_ENTRADAS_POR_COMPRA = 10;

const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  LIMITE_ENTRADAS_SUPERADO: `La cantidad de entradas no puede ser mayor a ${MAXIMO_ENTRADAS_POR_COMPRA}`,
};

const validarCantidadEntradas = (cantidad) => {
  if (!Number.isInteger(cantidad)) {
    throw new Error(MENSAJES_ERROR.CANTIDAD_NO_ENTERA);
  }

  if (cantidad > MAXIMO_ENTRADAS_POR_COMPRA) {
    throw new Error(MENSAJES_ERROR.LIMITE_ENTRADAS_SUPERADO);
  }
  return true;
};

// ===========================================================================
// [TC-13] - ETAPA REFACTOR: Definir firma semántica de parámetros (Airbnb)
// ===========================================================================
const validarLimiteAcumuladoPorFecha = (previasEnFecha, cantidadActual) => {
  const totalAcumulado = previasEnFecha + cantidadActual;
  return totalAcumulado <= MAXIMO_ENTRADAS_POR_COMPRA;
};

export {
  MAXIMO_ENTRADAS_POR_COMPRA,
  MENSAJES_ERROR,
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
};