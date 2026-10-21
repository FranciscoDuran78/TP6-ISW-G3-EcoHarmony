import { MENSAJES_ERROR } from '../entradas/mensajesError.js';

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
  if (!Array.isArray(visitantes) || visitantes.length === 0) {
    throw new Error(MENSAJES_ERROR.VISITANTES_VACIOS);
  }

  if (visitantes.length !== cantidad) {
    throw new Error(MENSAJES_ERROR.DISCREPANCIA_VISITANTES);
  }

  visitantes.forEach(validarDatosIndividualesVisitante);

  return true;
};

export { validarEstructuraVisitantes };
