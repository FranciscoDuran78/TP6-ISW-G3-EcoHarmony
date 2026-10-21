const PRECIOS_BASE = {
  Regular: 10000,
  VIP: 20000,
};

const calcularPrecioEntrada = (edad, tipoPase) => {
  if (!Number.isFinite(edad) || edad < 0) {
    throw new RangeError('La edad debe ser un número no negativo.');
  }

  const precioBase = PRECIOS_BASE[tipoPase];

  if (precioBase === undefined) {
    throw new RangeError('El tipo de pase debe ser Regular o VIP.');
  }

  if (edad <= 3) {
    return 0;
  }

  if (edad <= 15 || edad >= 60) {
    return precioBase * 0.5;
  }

  return precioBase;
};

export default calcularPrecioEntrada;
