import { MENSAJES_ERROR } from '../entradas/mensajesError.js';

const validarFechaUnica = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    throw new Error(MENSAJES_ERROR.ENTRADAS_VACIAS);
  }

  const [{ fechaVisita }] = entradas;
  const todasCoinciden = entradas.every((entrada) => entrada.fechaVisita === fechaVisita);

  if (!fechaVisita || !todasCoinciden) {
    throw new Error(MENSAJES_ERROR.FECHA_UNICA_REQUERIDA);
  }

  return true;
};

export { validarFechaUnica };
