const MENSAJES_ERROR_FECHA = {
  HORA_LIMITE_SUPERADA: 'No se pueden realizar compras para el mismo día después de las 17:30',
  HORIZONTE_SUPERADO: 'La fecha supera el horizonte máximo de compra permitido (1 mes)',
  FECHA_PASADA: 'La fecha de visita no puede ser anterior a la actual',
  FECHA_OBLIGATORIA: 'La fecha de visita es obligatoria',
  FECHA_INVALIDA: 'La fecha ingresada no es válida',
  PARQUE_CERRADO_LUNES: 'El parque se encuentra cerrado los días lunes',
  PARQUE_CERRADO_FERIADO: 'El parque se encuentra cerrado por día feriado',
};

const LUNES = 1;
const LIMITE_MINUTOS_17_30 = 17 * 60 + 30;
const FERIADOS_PARQUE = ['2026-12-25']

const convertirHoraAMinutos = (horaStr) => {
  const [horas, minutos] = horaStr.split(':').map(Number);
  return horas * 60 + minutos;
};

const parsearFechaLocal = (fechaStr) => {
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
  if (!regexFecha.test(fechaStr)) {
    throw new Error(MENSAJES_ERROR_FECHA.FECHA_INVALIDA);
  }

  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  const fechaObj = new Date(anio, mes - 1, dia);

  if (
    fechaObj.getFullYear() !== anio ||
    fechaObj.getMonth() !== mes - 1 ||
    fechaObj.getDate() !== dia
  ) {
    throw new Error(MENSAJES_ERROR_FECHA.FECHA_INVALIDA);
  }

  return fechaObj;
};

const validarPresenciaFecha = (fechaVisita) => {
  if (!fechaVisita || typeof fechaVisita !== 'string' || fechaVisita.trim() === '') {
    throw new Error(MENSAJES_ERROR_FECHA.FECHA_OBLIGATORIA);
  }
};

const validarHoraCompraMismoDia = (horaCompraActual) => {
  if (!horaCompraActual) return;
  
  const minutosTotales = convertirHoraAMinutos(horaCompraActual);

  if (minutosTotales > LIMITE_MINUTOS_17_30) {
    throw new Error(MENSAJES_ERROR_FECHA.HORA_LIMITE_SUPERADA);
  }
};

const validarDiaLaborable = (fechaObj) => {
  if (fechaObj.getDay() === LUNES) {
    throw new Error(MENSAJES_ERROR_FECHA.PARQUE_CERRADO_LUNES);
  }
};

const validarFeriado = (fechaVisita, feriados = FERIADOS_PARQUE) => {
  const listaFeriados = Array.isArray(feriados) ? feriados : [];
  if (listaFeriados.some(f => fechaVisita.endsWith(f.slice(4)))) { 
    throw new Error(MENSAJES_ERROR_FECHA.PARQUE_CERRADO_FERIADO);
  }
};

const validarRangoFechaVisita = (fechaObj) => {
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

  if (fechaObj < hoy) {
    throw new Error(MENSAJES_ERROR_FECHA.FECHA_PASADA);
  }
    
  const limiteMaximo = new Date(hoy);
  limiteMaximo.setDate(limiteMaximo.getDate() + 30);
  
  if (fechaObj > limiteMaximo) {
    throw new Error(MENSAJES_ERROR_FECHA.HORIZONTE_SUPERADO);
  }
};

const validarFechaVisita = (fechaVisita, horaCompraActual = null, parqueAbierto = true, feriados = FERIADOS_PARQUE) => {
  if (!parqueAbierto) {
    return false;
  }

  validarPresenciaFecha(fechaVisita);
  
  const fechaObj = parsearFechaLocal(fechaVisita);

  validarFeriado(fechaVisita, feriados);
  validarDiaLaborable(fechaObj);

  validarRangoFechaVisita(fechaObj);
  validarHoraCompraMismoDia(horaCompraActual);

  return true;
};

export { MENSAJES_ERROR_FECHA, validarFechaVisita };