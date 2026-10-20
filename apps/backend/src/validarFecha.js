const MENSAJES_ERROR_FECHA = {
  HORA_LIMITE_SUPERADA: 'No se pueden realizar compras para el mismo día después de las 17:30',
};

const validarFechaVisita = (fechaVisita, horaCompraActual = null, parqueAbierto = true) => {
  if (!parqueAbierto) {
    return false;
  }

  if (horaCompraActual) {
    const [horas, minutos] = horaCompraActual.split(':').map(Number);
    const minutosTotales = horas * 60 + minutos;
    const limiteMinutos = 17 * 60 + 30; // 17:30 en minutos

    if (minutosTotales > limiteMinutos) {
      throw new Error(MENSAJES_ERROR_FECHA.HORA_LIMITE_SUPERADA);
    }
  }

  return true;
};

export { MENSAJES_ERROR_FECHA, validarFechaVisita };