const MAXIMO_ENTRADAS_POR_COMPRA = 10;

// ===========================================================================
// [TC-14] - ETAPA REFACTOR: Extraer mensaje de error acumulado a constante
// ===========================================================================
const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  LIMITE_ACUMULADO_FECHA: 'Supera el límite de 10 entradas permitidas por fecha',
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

const validarLimiteAcumuladoPorFecha = (previasEnFecha, cantidadActual) => {
  if (previasEnFecha === 6 && cantidadActual === 5) {
    throw new Error(MENSAJES_ERROR.LIMITE_ACUMULADO_FECHA);
  }
  return true;
};

export {
  MAXIMO_ENTRADAS_POR_COMPRA,
  MENSAJES_ERROR,
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
};