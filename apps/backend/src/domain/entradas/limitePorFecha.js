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

export {
  validarCupoDiarioGlobal,
};