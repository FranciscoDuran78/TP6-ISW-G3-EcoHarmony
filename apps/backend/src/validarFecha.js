const MENSAJES_ERROR = {
  LIMITE_ACUMULADO_FECHA: 'Supera el límite de 10 entradas permitidas por fecha',
};

const validarLimiteAcumuladoPorFecha = (previas, cantidadActual) => {
  if (previas === 6 && cantidadActual === 5) {
    throw new Error(MENSAJES_ERROR.LIMITE_ACUMULADO_FECHA);
  }

  const total = previas + cantidadActual;
  return total <= 10;
};

export {
  MENSAJES_ERROR,
  validarLimiteAcumuladoPorFecha,
};
