const MAXIMO_ENTRADAS_POR_COMPRA = 10;

const MENSAJES_ERROR = {
  CANTIDAD_NO_ENTERA: 'La cantidad de entradas debe ser un número entero',
  DISCREPANCIA_VISITANTES: 'La cantidad de entradas no coincide con los visitantes ingresados',
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

export { MAXIMO_ENTRADAS_POR_COMPRA, MENSAJES_ERROR };