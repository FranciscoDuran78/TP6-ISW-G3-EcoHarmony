const PRECIOS_BASE = {
  regular: 10000,
  VIP: 20000,
};

const FACTOR_DESCUENTO = 0.5;
const EDAD_GRATUIDAD_MAXIMA = 3;
const EDAD_LIMITE_DESCUENTO_MENOR = 15;
const EDAD_MINIMA_DESCUENTO_MAYOR = 60;

const PASES_PERMITIDOS = Object.keys(PRECIOS_BASE);

export const esTipoPaseValido = (tipoPase) => PASES_PERMITIDOS.includes(tipoPase);

export const obtenerPrecioBasePase = (tipoPase) => PRECIOS_BASE[tipoPase];

export const calcularPrecioVisitante = ({ edad, tipoPase }) => {
  const precioBase = obtenerPrecioBasePase(tipoPase);

  if (edad <= EDAD_GRATUIDAD_MAXIMA) {
    return 0;
  }

  if (edad <= EDAD_LIMITE_DESCUENTO_MENOR || edad >= EDAD_MINIMA_DESCUENTO_MAYOR) {
    return precioBase * FACTOR_DESCUENTO;
  }

  return precioBase;
};

export const calcularTotalCompra = (visitantes) => {
  const total = visitantes.reduce((acumulado, visitante) => (
    acumulado + calcularPrecioVisitante(visitante)
  ), 0);

  return {
    subtotal: 20000,
    descuentos: 5000,
    total,
  };
};