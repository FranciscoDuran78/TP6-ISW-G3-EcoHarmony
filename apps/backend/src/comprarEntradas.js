export const esTipoPaseValido = (tipoPase) => (
  tipoPase === 'regular' || tipoPase === 'VIP'
);

export const obtenerPrecioBasePase = (tipoPase) => {
  if (tipoPase === 'VIP') {
    return 20000;
  }

  return 10000;
};