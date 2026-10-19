// ----------------  ETAPA DE GREEN ---------------- 
// ---------------- CASO DE PRUEBA 67 ----------------

const MENSAJES_ERROR = {
  DISCREPANCIA_VISITANTES:
    'La cantidad de entradas no coincide con los visitantes ingresados',
  EDAD_NO_VALIDA: 'La edad no es válida',
};

const validarEstructuraVisitantes = (cantidad, visitantes) => {
  if (!Array.isArray(visitantes) || visitantes.length !== cantidad) {
    throw new Error(MENSAJES_ERROR.DISCREPANCIA_VISITANTES);
  }

  visitantes.forEach((visitante) => {
    if (visitante.edad < 0) {
      throw new Error(MENSAJES_ERROR.EDAD_NO_VALIDA);
    }
  });

  return true;
};

export { MENSAJES_ERROR, validarEstructuraVisitantes };
