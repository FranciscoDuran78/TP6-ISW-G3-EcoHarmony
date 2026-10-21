const PRECIOS_BASE = {
  Regular: 10000,
  VIP: 20000,
};

const obtenerMultiplicadorPorEdad = (edad) => {
  if (edad <= 3) {
    return 0;
  }

  if (edad <= 15 || edad >= 60) {
    return 0.5;
  }

  return 1;
};

const calcularPrecioEntrada = (edad, tipoPase) => {
  if (!Number.isFinite(edad) || edad < 0) {
    throw new RangeError("La edad debe ser un número no negativo.");
  }

  const precioBase = PRECIOS_BASE[tipoPase];

  if (precioBase === undefined) {
    throw new RangeError("El tipo de pase debe ser Regular o VIP.");
  }

  return precioBase * obtenerMultiplicadorPorEdad(edad);
};

export default calcularPrecioEntrada;
