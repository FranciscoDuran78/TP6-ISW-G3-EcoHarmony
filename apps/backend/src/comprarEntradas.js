const PRECIOS_BASE = {
  regular: 10000,
  VIP: 20000,
};

const PASES_PERMITIDOS = Object.keys(PRECIOS_BASE);

export const esTipoPaseValido = (tipoPase) => PASES_PERMITIDOS.includes(tipoPase);

export const obtenerPrecioBasePase = (tipoPase) => PRECIOS_BASE[tipoPase];

export const calcularPrecioVisitante = ({ edad, tipoPase }) => {
  const precioBase = PRECIOS_BASE[tipoPase];

  if (edad <= 15) {
    return precioBase * 0.5;
  }

  return precioBase;
};