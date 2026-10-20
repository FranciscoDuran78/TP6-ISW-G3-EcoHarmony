const MENSAJES_ERROR = {
  LIMITE_ACUMULADO_FECHA: 'Supera el límite de 10 entradas permitidas por fecha',
};

const validarLimiteAcumuladoPorFecha = (previas, cantidadActual) => {
  const total = previas + cantidadActual;

  if (total > 10) {
    throw new Error(MENSAJES_ERROR.LIMITE_ACUMULADO_FECHA);
  }

  return true;
};

export {
  MENSAJES_ERROR,
  validarLimiteAcumuladoPorFecha,
};
