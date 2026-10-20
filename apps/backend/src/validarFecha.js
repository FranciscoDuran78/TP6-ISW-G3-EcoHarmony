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
  if (cupoDiarioConfigurado === null || cupoDiarioConfigurado === undefined) {
    return true;
  }

  return typeof visitantesTotalesParqueFecha === 'number';
};

export {
  MAXIMO_ENTRADAS_POR_FECHA,
  MENSAJES_ERROR,
  validarCupoDiarioGlobal,
  validarLimiteAcumuladoPorFecha,
};
