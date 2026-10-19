const MAXIMO_ENTRADAS_POR_COMPRA = 10;
const MAXIMO_ENTRADAS_POR_FECHA = 10;

const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  LIMITE_ACUMULADO_FECHA: `Supera el límite de ${MAXIMO_ENTRADAS_POR_FECHA} entradas permitidas por fecha`,
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

const validarLimiteAcumuladoPorFecha = (
  previas,
  cantidadActual,
  fechaActual = null,
  fechaPrevia = null,
) => {
  const sonFechasDistintas = fechaActual && fechaPrevia && fechaActual !== fechaPrevia;
  const previasEnMismaFecha = sonFechasDistintas ? 0 : previas;
  const totalAcumulado = previasEnMismaFecha + cantidadActual;

  if (totalAcumulado > MAXIMO_ENTRADAS_POR_FECHA) {
    throw new Error(MENSAJES_ERROR.LIMITE_ACUMULADO_FECHA);
  }
  return true;
};

// ===========================================================================
// [TC-17] - ETAPA GREEN: Código mínimo para rechazar lista vacía
// ===========================================================================
const validarEstructuraVisitantes = (cantidad, visitantes) => {
  if (visitantes.length === 0) {
    throw new Error('Debe detallar la edad y tipo de pase de cada visitante');
  }
  return true;
};

export {
  MAXIMO_ENTRADAS_POR_COMPRA,
  MAXIMO_ENTRADAS_POR_FECHA,
  MENSAJES_ERROR,
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
  validarEstructuraVisitantes,
};