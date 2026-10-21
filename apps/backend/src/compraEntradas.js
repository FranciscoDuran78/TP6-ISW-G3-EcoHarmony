import calcularPrecioEntrada from './domain/calcularPrecioEntrada.js';
import {
  MAXIMO_ENTRADAS_POR_FECHA,
  MENSAJES_ERROR as MENSAJES_ERROR_LIMITE,
  validarLimiteAcumuladoPorFecha,
} from './limitePorFecha.js';

const MAXIMO_ENTRADAS_POR_COMPRA = 10;

const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  DISCREPANCIA_VISITANTES: 'La cantidad de entradas no coincide con los visitantes ingresados',
  ...MENSAJES_ERROR_LIMITE,
  EDAD_NO_VALIDA: 'La edad no es válida',
  ENTRADAS_VACIAS: 'La compra debe incluir entradas',
  FECHA_UNICA_REQUERIDA: 'Todas las entradas deben tener la misma fecha de visita',
  LIMITE_ENTRADAS_SUPERADO: `La cantidad de entradas no puede ser mayor a ${MAXIMO_ENTRADAS_POR_COMPRA}`,
  VISITANTE_SIN_EDAD: 'Cada visitante debe indicar su edad',
  VISITANTE_SIN_PASE: 'Cada visitante debe indicar tipo de pase VIP o Regular',
  VISITANTES_VACIOS: 'Debe detallar la edad y tipo de pase de cada visitante',
  FORMA_PAGO_REQUERIDA: 'Debe seleccionar una forma de pago válida',
  FECHA_LUNES_BLOQUEADA: 'El parque se encuentra cerrado los días lunes',
};

const validarCantidadEntradas = (cantidad) => {
  if (!Number.isInteger(cantidad)) {
    throw new Error(MENSAJES_ERROR.CANTIDAD_NO_ENTERA);
  }

  if (cantidad > MAXIMO_ENTRADAS_POR_COMPRA) {
    throw new Error(MENSAJES_ERROR.LIMITE_ENTRADAS_SUPERADO);
  }
  return true;
};

const validarDatosIndividualesVisitante = (visitante) => {
  if (visitante.edad === null || visitante.edad === undefined) {
    throw new Error(MENSAJES_ERROR.VISITANTE_SIN_EDAD);
  }

  if (visitante.edad < 0) {
    throw new Error(MENSAJES_ERROR.EDAD_NO_VALIDA);
  }

  if (!visitante.tipoPase || visitante.tipoPase.trim() === '') {
    throw new Error(MENSAJES_ERROR.VISITANTE_SIN_PASE);
  }
};

const validarEstructuraVisitantes = (cantidad, visitantes) => {
  if (!Array.isArray(visitantes) || visitantes.length === 0) {
    throw new Error(MENSAJES_ERROR.VISITANTES_VACIOS);
  }

  if (visitantes.length !== cantidad) {
    throw new Error(MENSAJES_ERROR.DISCREPANCIA_VISITANTES);
  }

  visitantes.forEach(validarDatosIndividualesVisitante);

  return true;
};

const calcularPreciosVisitantes = (visitantes) => visitantes.map((visitante) => ({
  ...visitante,
  precio: calcularPrecioEntrada(visitante.edad, visitante.tipoPase),
}));

const validarFechaUnica = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    throw new Error(MENSAJES_ERROR.ENTRADAS_VACIAS);
  }

  const [{ fechaVisita }] = entradas;
  const todasCoinciden = entradas.every((entrada) => entrada.fechaVisita === fechaVisita);

  if (!fechaVisita || !todasCoinciden) {
    throw new Error(MENSAJES_ERROR.FECHA_UNICA_REQUERIDA);
  }

  return true;
};

const esLunes = (fechaStr) => {
  const fecha = new Date(`${fechaStr}T00:00:00`);
  return fecha.getDay() === 1;
};

const generarCorreoConfirmacion = (datos) => ({
  destinatario: datos.emailUsuario,
  fecha: datos.fecha,
  cantidad: datos.cantidad,
  pases: datos.pases,
  adjunto: datos.adjunto || null,
});

const generarResumenCompra = (datos) => ({
  cantidadEntradas: datos.cantidad,
  fecha: datos.fecha,
  totalPases: datos.pases ? datos.pases.length : 0,
});

const procesarCompra = (datosCompra, servicioMail = null) => {
  const { formaPago, fecha, cantidad, pases } = datosCompra;

  if (!formaPago) {
    throw new Error(MENSAJES_ERROR.FORMA_PAGO_REQUERIDA);
  }

  if (esLunes(fecha)) {
    throw new Error(MENSAJES_ERROR.FECHA_LUNES_BLOQUEADA);
  }

  validarCantidadEntradas(cantidad);
  validarEstructuraVisitantes(cantidad, pases);

  const estadoPago = formaPago === 'tarjeta' ? 'aprobado' : 'pendiente_validacion';
  const resumen = generarResumenCompra(datosCompra);
  let correo = null;
  let errorCorreo = null;

  try {
    if (servicioMail) {
      servicioMail(datosCompra);
    }
    correo = generarCorreoConfirmacion(datosCompra);
  } catch (err) {
    errorCorreo = err.message;
  }

  return {
    compraConfirmada: true,
    estadoPago,
    cantidad,
    fecha,
    resumen,
    correo,
    errorCorreo,
  };
};

export {
  MAXIMO_ENTRADAS_POR_COMPRA,
  MAXIMO_ENTRADAS_POR_FECHA,
  MENSAJES_ERROR,
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
  validarEstructuraVisitantes,
  calcularPreciosVisitantes,
  validarFechaUnica,
  generarCorreoConfirmacion,
  generarResumenCompra,
  procesarCompra,
};
