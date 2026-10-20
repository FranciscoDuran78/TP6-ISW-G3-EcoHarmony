const MENSAJES_ERROR_FECHA = {
  HORA_LIMITE_SUPERADA: 'No se pueden realizar compras para el mismo día después de las 17:30',
};

const convertirHoraAMinutos = (horaStr) => {
  const [horas, minutos] = horaStr.split(':').map(Number);
  return horas * 60 + minutos;
};

const validarHoraCompraMismoDia = (horaCompraActual) => {
  if (!horaCompraActual) return;
  
  const minutosTotales = convertirHoraAMinutos(horaCompraActual);
  const LIMITE_MINUTOS = 17 * 60 + 30; // 17:30

  if (minutosTotales > LIMITE_MINUTOS) {
    throw new Error(MENSAJES_ERROR_FECHA.HORA_LIMITE_SUPERADA);
  }
};

const validarFechaVisita = (fechaVisita, horaCompraActual = null, parqueAbierto = true) => {
  if (!parqueAbierto) {
    return false;
  }

  validarHoraCompraMismoDia(horaCompraActual);

  return true;
};

export { MENSAJES_ERROR_FECHA, validarFechaVisita };