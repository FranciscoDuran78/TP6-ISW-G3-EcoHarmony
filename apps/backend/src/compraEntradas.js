// ----------------  ETAPA DE GREEN ---------------- 
// ---------------- CASO DE PRUEBA 69 ----------------

const MENSAJES_ERROR = {
  DISCREPANCIA_VISITANTES:
    'La cantidad de entradas no coincide con los visitantes ingresados',
  EDAD_NO_VALIDA: 'La edad no es válida',
  VISITANTE_SIN_EDAD: 'Cada visitante debe indicar su edad'
};

const validarEdadNoNegativa = (visitante) => {
  if (visitante.edad === null || visitante.edad === undefined) {
    throw new Error(MENSAJES_ERROR.VISITANTE_SIN_EDAD);
  }

  if (visitante.edad < 0) {
    throw new Error(MENSAJES_ERROR.EDAD_NO_VALIDA);
  }
};

const validarEstructuraVisitantes = (cantidad, visitantes) => {
  if (!Array.isArray(visitantes) || visitantes.length !== cantidad) {
    throw new Error(MENSAJES_ERROR.DISCREPANCIA_VISITANTES);
  }

  visitantes.forEach(validarEdadNoNegativa);

  return true;
};

const calcularPreciosVisitantes = (visitantes) => visitantes.map((visitante) => {
  const precioBase = visitante.tipoPase === 'VIP' ? 20000 : 10000;
  let precio = precioBase;
  if (visitante.edad <= 3) {
    precio = 0;
  } else if (visitante.edad <= 15 || visitante.edad >= 60) {
    precio = precioBase * 0.5;
  }
  return { ...visitante, precio };
});

export { MENSAJES_ERROR, validarEstructuraVisitantes, calcularPreciosVisitantes};


