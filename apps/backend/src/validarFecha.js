const MENSAJES_ERROR_FECHA = {
  HORA_LIMITE_SUPERADA: 'No se pueden realizar compras para el mismo día después de las 17:30',
  HORIZONTE_SUPERADO: 'La fecha supera el horizonte máximo de compra permitido (1 mes)',
};

const convertirHoraAMinutos = (horaStr) => {
  const [horas, minutos] = horaStr.split(':').map(Number);
  return horas * 60 + minutos;
};

const validarHoraCompraMismoDia = (horaCompraActual) => {
  if (!horaCompraActual) return;
  
  const minutosTotales = convertirHoraAMinutos(horaCompraActual);
  const LIMITE_MINUTOS = 17 * 60 + 30; 

  if (minutosTotales > LIMITE_MINUTOS) {
    throw new Error(MENSAJES_ERROR_FECHA.HORA_LIMITE_SUPERADA);
  }
};

const validarHorizonteCompra = (fechaVisita) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaObj = new Date(fechaVisita);
  fechaObj.setHours(0, 0, 0, 0);

  const limiteMaximo = new Date(hoy);
  limiteMaximo.setDate(limiteMaximo.getDate() + 30);

  if (fechaObj > limiteMaximo) {
    throw new Error(MENSAJES_ERROR_FECHA.HORIZONTE_SUPERADO);
  }
};

const validarFechaVisita = (fechaVisita, horaCompraActual = null, parqueAbierto = true) => {
  if (!parqueAbierto) {
    return false;
  }

  validarHorizonteCompra(fechaVisita);
  validarHoraCompraMismoDia(horaCompraActual);

  return true;
};

export { MENSAJES_ERROR_FECHA, validarFechaVisita };