// ----------------  ETAPA DE REFACTORY ---------------- 
// ---------------- CASO DE PRUEBA 68 ----------------

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

export { MENSAJES_ERROR, validarEstructuraVisitantes };


