const MENSAJES_ERROR_FECHA = {
  HORA_LIMITE_SUPERADA: 'No se pueden realizar compras para el mismo día después de las 17:30',
  HORIZONTE_SUPERADO: 'La fecha supera el horizonte máximo de compra permitido (1 mes)',
  FECHA_PASADA: 'La fecha de visita no puede ser anterior a la actual',
  FECHA_OBLIGATORIA: 'La fecha de visita es obligatoria',
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

const parsearFechaLocal = (fechaStr) => {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
};

const validarRangoFechaVisita = (fechaVisita) => {
  if (!fechaVisita || typeof fechaVisita !== 'string' || fechaVisita.trim() === '') {
    throw new Error(MENSAJES_ERROR_FECHA.FECHA_OBLIGATORIA);
  }

  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const fechaObj = parsearFechaLocal(fechaVisita);

  if (fechaObj < hoy) {
    throw new Error(MENSAJES_ERROR_FECHA.FECHA_PASADA);
  }
    
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

  validarRangoFechaVisita(fechaVisita);
  validarHoraCompraMismoDia(horaCompraActual);

  return true;
};

export { MENSAJES_ERROR_FECHA, validarFechaVisita };