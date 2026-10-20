const PRECIOS_BASE = {
  regular: 10000,
  VIP: 20000,
};

const PASES_PERMITIDOS = Object.keys(PRECIOS_BASE);

export const esTipoPaseValido = (tipoPase) => PASES_PERMITIDOS.includes(tipoPase);

export const obtenerPrecioBasePase = (tipoPase) => PRECIOS_BASE[tipoPase];