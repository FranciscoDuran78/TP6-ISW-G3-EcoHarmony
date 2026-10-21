import calcularPrecioEntrada from './domain/calcularPrecioEntrada.js';
import {
  calcularPreciosVisitantes,
  generarCorreoConfirmacion,
  generarResumenCompra,
  validarCantidadEntradas,
  validarEstructuraVisitantes,
} from './compraEntradas.js';
import { calcularTotalCompra } from './comprarEntradas.js';
import pagos from './pagos.cjs';
import { validarFechaVisita } from './validarFecha.js';

const FORMAS_DE_PAGO = ['tarjeta', 'efectivo'];
const RESULTADOS_DE_PAGO = ['aprobada', 'rechazada', 'cancelada'];
const VALIDACIONES_BOLETERIA = ['aprobada', 'rechazada'];

// Hoy y los 30 días siguientes: el horizonte de compra que valida validarFechaVisita.
const DIAS_DEL_CALENDARIO = 31;
const DIAS_DE_LA_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const MENSAJES = {
  FORMA_PAGO_REQUERIDA: 'Debe seleccionar una forma de pago: efectivo en boletería o tarjeta',
  FORMA_PAGO_INVALIDA: 'La forma de pago no es válida',
  CANTIDAD_MINIMA: 'La cantidad de entradas debe ser al menos 1',
  COMPRA_INEXISTENTE: 'La compra no existe',
  RESULTADO_INVALIDO: 'Resultado no soportado',
  VALIDACION_INVALIDA: 'Validación no soportada',
  NO_ES_TARJETA: 'La compra no es con tarjeta',
  PAGO_YA_RESUELTO: 'La transacción de esta compra ya tiene un resultado',
  NO_ES_EFECTIVO: 'La compra no corresponde a pago en efectivo',
  VALIDACION_YA_RESUELTA: 'El pago en boletería de esta compra ya fue resuelto',
};

// Los validadores lanzan Error comunes: acá los volvemos respuestas HTTP.
export class ErrorCompra extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

const comoRechazo = (fn) => {
  try {
    return fn();
  } catch (error) {
    throw new ErrorCompra(400, error.message);
  }
};

const dos = (n) => String(n).padStart(2, '0');
const fechaLocal = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
const horaLocal = (d) => `${dos(d.getHours())}:${dos(d.getMinutes())}`;

// Los inputs del formulario llegan como texto: "" es "sin edad" y "28" es 28.
const normalizarEdad = (edad) => {
  if (typeof edad !== 'string') {
    return edad;
  }

  return edad.trim() === '' ? null : Number(edad);
};

const normalizarVisitante = (visitante) => {
  const { edad, tipoPase } = visitante ?? {};

  return {
    edad: normalizarEdad(edad),
    tipoPase: typeof tipoPase === 'string' ? tipoPase.trim() : undefined,
  };
};

const normalizarVisitantes = (visitantes) => (
  Array.isArray(visitantes) ? visitantes.map(normalizarVisitante) : visitantes
);

const validarFormaPago = (formaPago) => {
  if (!formaPago) {
    throw new Error(MENSAJES.FORMA_PAGO_REQUERIDA);
  }

  const normalizada = String(formaPago).toLowerCase();

  if (!FORMAS_DE_PAGO.includes(normalizada)) {
    throw new Error(MENSAJES.FORMA_PAGO_INVALIDA);
  }

  return normalizada;
};

const precioOError = (visitante) => {
  try {
    return { ...visitante, precio: calcularPrecioEntrada(visitante.edad, visitante.tipoPase) };
  } catch (error) {
    return { ...visitante, precio: null, error: error.message };
  }
};

// ponytail: las compras viven en memoria y se pierden al reiniciar; SQLite si el grupo lo pide.
export const crearServicioCompras = ({
  ahora = () => new Date(),
  servicioMail = null,
  usuario = {
    id: 10,
    registrado: true,
    nombre: 'Bruno García',
    email: 'visitante@ecoharmony.com.ar',
  },
} = {}) => {
  const compras = new Map();
  let ultimoId = 0;

  const vista = (compra) => ({
    id: compra.id,
    fechaVisita: compra.fechaVisita,
    cantidad: compra.cantidad,
    visitantes: compra.visitantes,
    subtotal: compra.subtotal,
    descuentos: compra.descuentos,
    total: compra.total,
    formaPago: compra.formaPago,
    estado: compra.estado,
    pagada: compra.pagada,
    intentos: compra.intentos,
    resumen: generarResumenCompra({
      cantidad: compra.cantidad,
      fecha: compra.fechaVisita,
      pases: compra.visitantes,
    }),
    correo: compra.correo ?? null,
    errorCorreo: compra.errorCorreo ?? null,
  });

  const obtener = (id) => {
    const compra = compras.get(Number(id));

    if (!compra) {
      throw new ErrorCompra(404, MENSAJES.COMPRA_INEXISTENTE);
    }

    return compra;
  };

  // Un error de correo no revierte una compra confirmada (TC-50).
  const enviarCorreo = (compra) => {
    const datos = {
      emailUsuario: usuario.email,
      fecha: compra.fechaVisita,
      cantidad: compra.cantidad,
      pases: compra.visitantes,
      adjunto: `Comprobante_Entradas_EcoHarmony_EH${String(compra.id).padStart(4, '0')}.pdf`,
    };

    try {
      if (servicioMail) {
        servicioMail(datos);
      }
      Object.assign(compra, { correo: generarCorreoConfirmacion(datos), errorCorreo: null });
    } catch (error) {
      Object.assign(compra, { correo: null, errorCorreo: error.message });
    }
  };

  // El calendario usa el mismo validador que la compra: lo que muestra abierto, se puede comprar.
  const calendario = () => {
    const momento = ahora();

    return Array.from({ length: DIAS_DEL_CALENDARIO }, (_, i) => {
      const dia = new Date(momento.getFullYear(), momento.getMonth(), momento.getDate() + i);
      const fechaIso = fechaLocal(dia);
      let motivo = null;

      try {
        validarFechaVisita(fechaIso, i === 0 ? horaLocal(momento) : null);
      } catch (error) {
        motivo = error.message;
      }

      return {
        fechaIso,
        diaSemana: DIAS_DE_LA_SEMANA[dia.getDay()],
        numero: dia.getDate(),
        mes: MESES[dia.getMonth()],
        cerrado: motivo !== null,
        motivo,
      };
    });
  };

  const cotizar = (cuerpo) => {
    const visitantes = (Array.isArray(cuerpo?.visitantes) ? cuerpo.visitantes : [])
      .map(normalizarVisitante)
      .map(precioOError);
    const cobrables = visitantes.filter((v) => v.precio !== null);

    return { visitantes, ...calcularTotalCompra(cobrables) };
  };

  const crear = (cuerpo) => {
    const { fechaVisita, formaPago } = cuerpo ?? {};
    const visitantes = normalizarVisitantes(cuerpo?.visitantes);
    const cantidad = cuerpo?.cantidad ?? (Array.isArray(visitantes) ? visitantes.length : 0);
    const momento = ahora();

    const { formaPagoValida, visitantesConPrecio } = comoRechazo(() => {
      validarFechaVisita(fechaVisita, fechaVisita === fechaLocal(momento) ? horaLocal(momento) : null);

      if (cantidad < 1) {
        throw new Error(MENSAJES.CANTIDAD_MINIMA);
      }
      validarCantidadEntradas(cantidad);
      validarEstructuraVisitantes(cantidad, visitantes);

      // El máximo de 10 es por transacción (validarCantidadEntradas): se pueden hacer varias por fecha.
      const conPrecio = calcularPreciosVisitantes(visitantes);

      return { formaPagoValida: validarFormaPago(formaPago), visitantesConPrecio: conPrecio };
    });

    ultimoId += 1;
    const compra = Object.assign(pagos.crearCompra({ formaPago: formaPagoValida }), {
      id: ultimoId,
      usuarioId: usuario.id,
      fechaVisita,
      cantidad,
      visitantes: visitantesConPrecio,
      ...calcularTotalCompra(visitantesConPrecio),
    });
    compras.set(compra.id, compra);

    return vista(compra);
  };

  const resolverPago = (id, resultado) => {
    const compra = obtener(id);

    if (!RESULTADOS_DE_PAGO.includes(resultado)) {
      throw new ErrorCompra(400, MENSAJES.RESULTADO_INVALIDO);
    }
    if (compra.formaPago !== 'tarjeta') {
      throw new ErrorCompra(409, MENSAJES.NO_ES_TARJETA);
    }
    if (compra.estado !== 'pendiente') {
      throw new ErrorCompra(409, MENSAJES.PAGO_YA_RESUELTO);
    }

    pagos.resolverTransaccion(compra, resultado);
    if (compra.pagada) {
      enviarCorreo(compra);
    }

    return vista(compra);
  };

  const reintentarPago = (id) => {
    const compra = obtener(id);

    try {
      pagos.reintentarPago(compra);
    } catch (error) {
      throw new ErrorCompra(409, error.message);
    }

    return vista(compra);
  };

  const validarEnBoleteria = (id, validacion) => {
    const compra = obtener(id);

    if (!VALIDACIONES_BOLETERIA.includes(validacion)) {
      throw new ErrorCompra(400, MENSAJES.VALIDACION_INVALIDA);
    }
    if (compra.formaPago !== 'efectivo') {
      throw new ErrorCompra(409, MENSAJES.NO_ES_EFECTIVO);
    }
    if (compra.estado !== 'pendiente') {
      throw new ErrorCompra(409, MENSAJES.VALIDACION_YA_RESUELTA);
    }

    pagos.confirmarPagoBoleteria(compra, validacion);
    if (compra.pagada) {
      enviarCorreo(compra);
    }

    return vista(compra);
  };

  return {
    calendario,
    cotizar,
    crear,
    obtener: (id) => vista(obtener(id)),
    resolverPago,
    reintentarPago,
    validarEnBoleteria,
  };
};
