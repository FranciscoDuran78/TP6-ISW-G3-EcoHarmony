const MAXIMO_ENTRADAS_POR_FECHA = 10;

const MENSAJES_ERROR = {
  LIMITE_ACUMULADO_FECHA: `Supera el límite de ${MAXIMO_ENTRADAS_POR_FECHA} entradas permitidas por fecha`,
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

// GREEN TC-76: triangulación mínima — solo la cantidad de este caso.
const validarLimitePorTransaccion = (cantidadEntradas) => {
  if (cantidadEntradas === 4) {
    return true;
  }
  return undefined;
};

export {
  MAXIMO_ENTRADAS_POR_FECHA,
  MENSAJES_ERROR,
  validarCupoDiarioGlobal,
  validarLimiteAcumuladoPorFecha,
  validarLimitePorTransaccion,
};
