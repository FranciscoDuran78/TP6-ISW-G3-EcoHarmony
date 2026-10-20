const MAXIMO_ENTRADAS_POR_COMPRA = 10;
const MAXIMO_ENTRADAS_POR_FECHA = 10;

// ===========================================================================
// [TC-20] - ETAPA REFACTOR: Diccionario completo y validación limpia (Airbnb)
// ===========================================================================
const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  DISCREPANCIA_VISITANTES: 'La cantidad de entradas no coincide con los visitantes ingresados',
  LIMITE_ACUMULADO_FECHA: `Supera el límite de ${MAXIMO_ENTRADAS_POR_FECHA} entradas permitidas por fecha`,
  LIMITE_ENTRADAS_SUPERADO: `La cantidad de entradas no puede ser mayor a ${MAXIMO_ENTRADAS_POR_COMPRA}`,
  VISITANTE_SIN_EDAD: 'Cada visitante debe indicar su edad',
  VISITANTE_SIN_PASE: 'Cada visitante debe indicar tipo de pase VIP o Regular',
  VISITANTES_VACIOS: 'Debe detallar la edad y tipo de pase de cada visitante',
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

const validarDatosIndividualesVisitante = (visitante) => {
  if (!visitante || visitante.edad === null || visitante.edad === undefined
    || visitante.edad === '' || !Number.isFinite(Number(visitante.edad))
    || Number(visitante.edad) < 0) {
    throw new Error(MENSAJES_ERROR.VISITANTE_SIN_EDAD);
  }

  if (!['VIP', 'Regular'].includes(visitante.tipoPase)) {
    throw new Error(MENSAJES_ERROR.VISITANTE_SIN_PASE);
  }
};

const validarEstructuraVisitantes = (cantidad, visitantes) => {
  if (!Array.isArray(visitantes) || visitantes.length === 0) {
    throw new Error(MENSAJES_ERROR.VISITANTES_VACIOS);
  }

  if (visitantes.length !== cantidad) {
    throw new Error(MENSAJES_ERROR.DISCREPANCIA_VISITANTES);
  }

  visitantes.forEach(validarDatosIndividualesVisitante);

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
