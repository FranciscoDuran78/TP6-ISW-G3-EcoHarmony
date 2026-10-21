import { MENSAJES_ERROR } from '../entradas/mensajesError.js';
import { validarCantidadEntradas } from '../entradas/validarCantidadEntradas.js';
import { validarEstructuraVisitantes } from '../visitantes/validarEstructuraVisitantes.js';
import { generarCorreoConfirmacion, generarResumenCompra } from '../confirmacion/confirmacion.js';

const esLunes = (fechaStr) => {
  const fecha = new Date(`${fechaStr}T00:00:00`);
  return fecha.getDay() === 1;
};

const procesarCompra = (datosCompra, servicioMail = null) => {
  const { formaPago, fecha, cantidad, pases } = datosCompra;

  if (!formaPago) {
    throw new Error(MENSAJES_ERROR.FORMA_PAGO_REQUERIDA);
  }

  if (esLunes(fecha)) {
    throw new Error(MENSAJES_ERROR.FECHA_LUNES_BLOQUEADA);
  }

  validarCantidadEntradas(cantidad);
  validarEstructuraVisitantes(cantidad, pases);

  const estadoPago = formaPago === 'tarjeta' ? 'aprobado' : 'pendiente_validacion';
  const resumen = generarResumenCompra(datosCompra);
  let correo = null;
  let errorCorreo = null;

  try {
    if (servicioMail) {
      servicioMail(datosCompra);
    }
    correo = generarCorreoConfirmacion(datosCompra);
  } catch (err) {
    errorCorreo = err.message;
  }

  return {
    compraConfirmada: true,
    estadoPago,
    cantidad,
    fecha,
    resumen,
    correo,
    errorCorreo,
  };
};

export { MENSAJES_ERROR, procesarCompra };
