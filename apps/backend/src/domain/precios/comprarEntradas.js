import calcularPrecioEntrada, {
  obtenerPrecioBase,
  EDAD_GRATIS_HASTA,
  EDAD_DESCUENTO_HASTA,
  EDAD_DESCUENTO_DESDE,
  FACTOR_DESCUENTO,
} from './calcularPrecioEntrada.js';

export const esTipoPaseValido = (tipoPase) => obtenerPrecioBase(tipoPase) !== undefined;

export const obtenerPrecioBasePase = obtenerPrecioBase;

export const calcularPrecioVisitante = ({ edad, tipoPase }) => calcularPrecioEntrada(edad, tipoPase);

export const calcularTotalCompra = (visitantes) => {
  const subtotal = visitantes
    .filter((visitante) => (
      visitante.edad > EDAD_DESCUENTO_HASTA
      && visitante.edad < EDAD_DESCUENTO_DESDE
    ))
    .reduce((acumulado, visitante) => acumulado + obtenerPrecioBase(visitante.tipoPase), 0);

  const total = visitantes.reduce((acumulado, visitante) => (
    acumulado + calcularPrecioVisitante(visitante)
  ), 0);

  const descuentos = visitantes
    .filter((visitante) => (
      (visitante.edad > EDAD_GRATIS_HASTA && visitante.edad <= EDAD_DESCUENTO_HASTA)
      || visitante.edad >= EDAD_DESCUENTO_DESDE
    ))
    .reduce((acumulado, visitante) => (
      acumulado + (obtenerPrecioBase(visitante.tipoPase) * FACTOR_DESCUENTO)
    ), 0);

  return {
    subtotal,
    descuentos,
    total,
  };
};
