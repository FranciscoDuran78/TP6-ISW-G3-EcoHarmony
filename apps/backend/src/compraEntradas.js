// ----------------  ETAPA DE REFACTORY ---------------- 
// ---------------- CASO DE PRUEBA 67 ----------------

const MENSAJES_ERROR = {
  DISCREPANCIA_VISITANTES:
    'La cantidad de entradas no coincide con los visitantes ingresados',
  EDAD_NO_VALIDA: 'La edad no es válida',
};

const validarEdadNoNegativa = (visitante) => {
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


