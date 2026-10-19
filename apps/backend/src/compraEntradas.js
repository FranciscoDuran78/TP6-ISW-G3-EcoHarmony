// ----------------  ETAPA DE REFACTORY ---------------- 
// ---------------- CASO DE PRUEBA 71 ----------------

const MENSAJES_ERROR = {
  DISCREPANCIA_VISITANTES:
    'La cantidad de entradas no coincide con los visitantes ingresados',
  EDAD_NO_VALIDA: 'La edad no es válida',
  VISITANTE_SIN_EDAD: 'Cada visitante debe indicar su edad',
  VISITANTE_SIN_PASE: 'Cada visitante debe indicar tipo de pase VIP o Regular',
  ENTRADAS_VACIAS: 'La compra debe incluir entradas',
  FECHA_UNICA_REQUERIDA: 'Todas las entradas deben tener la misma fecha de visita'
};

const validarDatosIndividualesVisitante = (visitante) => {
  if (visitante.edad === null || visitante.edad === undefined) {
    throw new Error(MENSAJES_ERROR.VISITANTE_SIN_EDAD);
  }

  if (visitante.edad < 0) {
    throw new Error(MENSAJES_ERROR.EDAD_NO_VALIDA);
  }

  if (!visitante.tipoPase || visitante.tipoPase.trim() === '') {
    throw new Error(MENSAJES_ERROR.VISITANTE_SIN_PASE);
}

};

const validarEstructuraVisitantes = (cantidad, visitantes) => {
  if (!Array.isArray(visitantes) || visitantes.length !== cantidad) {
    throw new Error(MENSAJES_ERROR.DISCREPANCIA_VISITANTES);
  }

  visitantes.forEach(validarDatosIndividualesVisitante);

  return true;
};

const PRECIOS_PASE = {
  VIP: 20000,
  REGULAR: 10000,
};
const EDAD_GRATIS_MAXIMA = 3;
const EDAD_DESCUENTO_MAXIMA = 15;
const EDAD_DESCUENTO_MINIMA = 60;
const PORCENTAJE_DESCUENTO = 0.5;

const obtenerPrecioBase = (tipoPase) => (
  tipoPase === 'VIP' ? PRECIOS_PASE.VIP : PRECIOS_PASE.REGULAR
);

const calcularPrecioConDescuentoEdad = (precioBase, edad) => {
  if (edad <= EDAD_GRATIS_MAXIMA) {
    return 0;
  }

  if (edad <= EDAD_DESCUENTO_MAXIMA || edad >= EDAD_DESCUENTO_MINIMA) {
    return precioBase * PORCENTAJE_DESCUENTO;
  }

  return precioBase;
};

const calcularPreciosVisitantes = (visitantes) => visitantes.map((visitante) => ({
  ...visitante,
  precio: calcularPrecioConDescuentoEdad(
    obtenerPrecioBase(visitante.tipoPase),
    visitante.edad,
  ),
}));

const validarFechaUnica = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    throw new Error(MENSAJES_ERROR.ENTRADAS_VACIAS);
  }

  const [primeraEntrada] = entradas;
  const primeraFecha = primeraEntrada.fechaVisita;
  const todasCoinciden = entradas.every(
    (entrada) => entrada.fechaVisita === primeraFecha,
  );

  if (!primeraFecha || !todasCoinciden) {
    throw new Error(MENSAJES_ERROR.FECHA_UNICA_REQUERIDA);
  }

  return true;
};

export { MENSAJES_ERROR, validarEstructuraVisitantes, calcularPreciosVisitantes, validarFechaUnica };


