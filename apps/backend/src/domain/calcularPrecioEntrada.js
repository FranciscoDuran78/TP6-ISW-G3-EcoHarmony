// Fuente unica de precios y descuentos por edad (VIP $20.000, regular $10.000).
export const PRECIOS_BASE = { regular: 10000, vip: 20000 };

export const EDAD_GRATIS_HASTA = 3;
export const EDAD_DESCUENTO_HASTA = 15;
export const EDAD_DESCUENTO_DESDE = 60;
export const FACTOR_DESCUENTO = 0.5;

// "Regular", "regular" y "REGULAR" son el mismo pase.
export const obtenerPrecioBase = (tipoPase) => PRECIOS_BASE[String(tipoPase).toLowerCase()];

const obtenerMultiplicadorPorEdad = (edad) => {
  if (edad <= EDAD_GRATIS_HASTA) {
    return 0;
  }

  if (edad <= EDAD_DESCUENTO_HASTA || edad >= EDAD_DESCUENTO_DESDE) {
    return FACTOR_DESCUENTO;
  }

  return 1;
};

const calcularPrecioEntrada = (edad, tipoPase) => {
  if (!Number.isFinite(edad) || edad < 0) {
    throw new RangeError('La edad debe ser un número no negativo.');
  }

  const precioBase = obtenerPrecioBase(tipoPase);

  if (precioBase === undefined) {
    throw new RangeError('El tipo de pase debe ser Regular o VIP.');
  }

  return precioBase * obtenerMultiplicadorPorEdad(edad);
};

export default calcularPrecioEntrada;
