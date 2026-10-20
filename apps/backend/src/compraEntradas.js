const MAXIMO_ENTRADAS_POR_COMPRA = 10;
const MAXIMO_ENTRADAS_POR_FECHA = 10;

const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  DISCREPANCIA_VISITANTES: 'La cantidad de entradas no coincide con los visitantes ingresados',
  LIMITE_ACUMULADO_FECHA: `Supera el límite de ${MAXIMO_ENTRADAS_POR_FECHA} entradas permitidas por fecha`,
  LIMITE_ENTRADAS_SUPERADO: `La cantidad de entradas no puede ser mayor a ${MAXIMO_ENTRADAS_POR_COMPRA}`,
  VISITANTE_SIN_EDAD: 'Cada visitante debe indicar su edad',
  VISITANTE_SIN_PASE: 'Cada visitante debe indicar tipo de pase VIP o Regular',
  VISITANTES_VACIOS: 'Debe detallar la edad y tipo de pase de cada visitante',
  FORMA_PAGO_REQUERIDA: 'Debe seleccionar una forma de pago válida',
  FECHA_LUNES_BLOQUEADA: 'El parque se encuentra cerrado los días lunes',
};

const validarCantidadEntradas = () => {};
const validarLimiteAcumuladoPorFecha = () => {};
const validarEstructuraVisitantes = () => {};
const generarCorreoConfirmacion = () => {};
const generarResumenCompra = () => {};
const procesarCompra = () => {};

export {
  MAXIMO_ENTRADAS_POR_COMPRA,
  MAXIMO_ENTRADAS_POR_FECHA,
  MENSAJES_ERROR,
  validarCantidadEntradas,
  validarLimiteAcumuladoPorFecha,
  validarEstructuraVisitantes,
  generarCorreoConfirmacion,
  generarResumenCompra,
  procesarCompra,
};