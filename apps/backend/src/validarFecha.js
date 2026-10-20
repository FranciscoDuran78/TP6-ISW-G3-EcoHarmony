const validarLimiteAcumuladoPorFecha = (previas, cantidadActual) => {
  const total = previas + cantidadActual;
  return total <= 10;
};

export {
  validarLimiteAcumuladoPorFecha,
};
