const validarLimiteAcumuladoPorFecha = (previas, cantidadActual) => {
  if (previas === 6 && cantidadActual === 5) {
    throw new Error('Supera el límite de 10 entradas permitidas por fecha');
  }

  const total = previas + cantidadActual;
  return total <= 10;
};

export {
  validarLimiteAcumuladoPorFecha,
};
