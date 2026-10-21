const MAXIMO_ENTRADAS_POR_FECHA = 10;
const MAXIMO_ENTRADAS_POR_TRANSACCION = 10;

const MENSAJES_ERROR = {
  LIMITE_ACUMULADO_FECHA: `Supera el límite de ${MAXIMO_ENTRADAS_POR_FECHA} entradas permitidas por fecha`,
  LIMITE_POR_TRANSACCION: `Supera el límite de ${MAXIMO_ENTRADAS_POR_TRANSACCION} entradas permitidas por transacción`,
};

const validarLimiteAcumuladoPorFecha = (
  previas,
  cantidadActual,
  fechaActual = null,
  fechaPrevia = null,
) => {
  const sonFechasDistintas = fechaActual && fechaPrevia && fechaActual !== fechaPrevia;
  const previasEnMismaFecha = sonFechasDistintas ? 0 : previas;
  const total = previasEnMismaFecha + cantidadActual;

  if (total > MAXIMO_ENTRADAS_POR_FECHA) {
    throw new Error(MENSAJES_ERROR.LIMITE_ACUMULADO_FECHA);
  }

  return true;
};

const validarCupoDiarioGlobal = (
  visitantesTotalesParqueFecha,
  cupoDiarioConfigurado = null,
) => {
  const sinCupoConfigurado = cupoDiarioConfigurado === null
    || cupoDiarioConfigurado === undefined;

  if (sinCupoConfigurado) {
    return true;
  }

  return typeof visitantesTotalesParqueFecha === 'number';
};

const validarLimitePorTransaccion = (cantidadEntradas) => {
  if (cantidadEntradas > MAXIMO_ENTRADAS_POR_TRANSACCION) {
    throw new Error(MENSAJES_ERROR.LIMITE_POR_TRANSACCION);
  }

  return true;
};

export {
  MAXIMO_ENTRADAS_POR_FECHA,
  MAXIMO_ENTRADAS_POR_TRANSACCION,
  MENSAJES_ERROR,
  validarCupoDiarioGlobal,
  validarLimiteAcumuladoPorFecha,
  validarLimitePorTransaccion,
};
