const MAXIMO_ENTRADAS_POR_TRANSACCION = 10;

const MENSAJES_ERROR = {
  LIMITE_POR_TRANSACCION: `Supera el límite de ${MAXIMO_ENTRADAS_POR_TRANSACCION} entradas permitidas por transacción`,
};

const validarLimitePorTransaccion = (cantidadEntradas) => {
  if (cantidadEntradas > MAXIMO_ENTRADAS_POR_TRANSACCION) {
    throw new Error(MENSAJES_ERROR.LIMITE_POR_TRANSACCION);
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

const validarCompraSinCupoDiario = (
  visitantesTotalesParqueFecha,
  cantidadEntradas,
  cupoDiarioConfigurado = null,
) => {
  const cupoPermite = validarCupoDiarioGlobal(
    visitantesTotalesParqueFecha,
    cupoDiarioConfigurado,
  );
  const transaccionPermite = validarLimitePorTransaccion(cantidadEntradas);

  if (!cupoPermite || !transaccionPermite) {
    return undefined;
  }

  return visitantesTotalesParqueFecha + cantidadEntradas;
};

export {
  MAXIMO_ENTRADAS_POR_TRANSACCION,
  MENSAJES_ERROR,
  validarCompraSinCupoDiario,
  validarCupoDiarioGlobal,
  validarLimitePorTransaccion,
};
