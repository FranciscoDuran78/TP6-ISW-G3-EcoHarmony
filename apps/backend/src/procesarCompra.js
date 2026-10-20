import {
  MAXIMO_ENTRADAS_POR_FECHA,
  validarCantidadEntradas,
  validarEstructuraVisitantes,
  validarLimiteAcumuladoPorFecha,
} from './compraEntradas.js';

const PRECIOS_BASE = {
  Regular: 10000,
  VIP: 20000,
};

const OBTENER_PARTES_FECHA = (fecha) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
}).formatToParts(fecha).reduce((partes, parte) => ({
  ...partes,
  [parte.type]: parte.value,
}), {});

const sumarMesCalendario = (fechaIso) => {
  const [anio, mes, dia] = fechaIso.split('-').map(Number);
  const ultimoDiaDelMes = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const mesObjetivo = mes === 12 ? 1 : mes + 1;
  const anioObjetivo = mes === 12 ? anio + 1 : anio;
  const diaObjetivo = Math.min(dia, ultimoDiaDelMes);

  return [anioObjetivo, String(mesObjetivo).padStart(2, '0'), String(diaObjetivo).padStart(2, '0')]
    .join('-');
};

const validarFechaVisita = (fechaVisita, ahora = new Date()) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaVisita || '')) {
    throw new Error('Debe seleccionar una fecha de visita válida');
  }

  const fecha = new Date(`${fechaVisita}T12:00:00.000Z`);
  if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== fechaVisita) {
    throw new Error('Debe seleccionar una fecha de visita válida');
  }

  const partesAhora = OBTENER_PARTES_FECHA(ahora);
  const hoy = `${partesAhora.year}-${partesAhora.month}-${partesAhora.day}`;
  const fechaMaxima = sumarMesCalendario(hoy);
  if (fechaVisita < hoy || fechaVisita > fechaMaxima) {
    throw new Error('La fecha de visita no puede superar un mes de anticipación');
  }

  const fechaDate = new Date(`${fechaVisita}T12:00:00.000Z`);
  const esLunes = fechaDate.getUTCDay() === 1;
  const esFeriado = fechaVisita.endsWith('-12-25') || fechaVisita.endsWith('-01-01');
  if (esLunes || esFeriado) {
    throw new Error('El parque permanece cerrado los lunes, el 25 de diciembre y el 1 de enero');
  }

  if (fechaVisita === hoy && (Number(partesAhora.hour) > 17
    || (Number(partesAhora.hour) === 17 && Number(partesAhora.minute) > 30))) {
    throw new Error('Las compras para hoy están habilitadas hasta las 17:30');
  }

  return true;
};

const calcularPrecioVisitante = ({ edad, tipoPase }) => {
  const precioBase = PRECIOS_BASE[tipoPase];

  if (edad <= 3) return 0;
  if (edad <= 15 || edad >= 60) return precioBase / 2;
  return precioBase;
};

const calcularTotalCompra = (visitantes) => visitantes.reduce(
  (total, visitante) => total + calcularPrecioVisitante(visitante),
  0,
);

const procesarPagoSimulado = async ({ formaPago, total }) => {
  if (formaPago === 'EFECTIVO') return { estado: 'PENDIENTE' };

  const rechazada = process.env.FAKE_CARD_OUTCOME === 'rejected';
  return {
    estado: rechazada ? 'RECHAZADA' : 'APROBADA',
    codigo: rechazada ? 'CARD_DECLINED' : `SIM-${Date.now()}`,
    monto: total,
    proveedor: 'Mercado Pago (simulado)',
  };
};

const enviarCorreoSimulado = async ({
  destinatario,
  asunto,
  contenido,
  adjunto,
}) => {
  console.log(`Correo simulado enviado a ${destinatario}: ${asunto}`);
  return {
    estado: 'ENVIADO',
    destinatario,
    asunto,
    contenido,
    adjunto,
  };
};

const procesarCompra = async (solicitud, opciones = {}) => {
  const {
    ahora = new Date(),
    procesarPago = procesarPagoSimulado,
    enviarCorreo = enviarCorreoSimulado,
    guardarCompra = async (compra) => compra,
    actualizarCompra = async (compra) => compra,
    obtenerEntradasPrevias = async () => 0,
    usuario = {
      id: 1,
      registrado: true,
      email: 'visitante@ecoharmony.com.ar',
    },
  } = opciones;
  const { fechaVisita, visitantes, formaPago } = solicitud;

  validarFechaVisita(fechaVisita, ahora);
  const cantidad = Array.isArray(visitantes) ? visitantes.length : 0;
  validarCantidadEntradas(cantidad);
  validarEstructuraVisitantes(cantidad, visitantes);

  if (!['EFECTIVO', 'TARJETA'].includes(formaPago)) {
    throw new Error('Debe seleccionar una forma de pago (Efectivo o Tarjeta)');
  }

  const previas = await obtenerEntradasPrevias(usuario.id, fechaVisita);
  validarLimiteAcumuladoPorFecha(previas, cantidad);

  const total = calcularTotalCompra(visitantes);
  const pago = await procesarPago({
    formaPago,
    total,
    usuario,
    fechaVisita,
    cantidad,
  });
  const esEfectivo = formaPago === 'EFECTIVO';
  const aprobada = esEfectivo || pago.estado === 'APROBADA';
  const compra = {
    id: null,
    usuario,
    cantidad,
    fechaVisita,
    visitantes,
    total,
    formaPago,
    estado: 'RECHAZADA',
    pagada: !esEfectivo && aprobada,
    pago,
  };

  if (aprobada) {
    compra.estado = esEfectivo ? 'PENDIENTE_DE_VALIDACION' : 'CONFIRMADA';
  }

  if (!aprobada) return compra;

  const compraGuardada = await guardarCompra(compra);
  const contenido = {
    compraId: compraGuardada.id,
    cantidad,
    fechaVisita,
    total,
    visitantes,
    transaccion: pago,
  };
  const adjunto = {
    nombre: 'comprobante-entradas.json',
    tipo: 'application/json',
    contenido: JSON.stringify(contenido),
  };

  try {
    compraGuardada.correo = await enviarCorreo({
      destinatario: usuario.email,
      asunto: `Confirmación de compra de entradas - Visita ${fechaVisita}`,
      contenido,
      adjunto,
    });
  } catch (error) {
    compraGuardada.correo = { estado: 'FALLIDO', error: error.message };
  }

  if (!compraGuardada.correo) compraGuardada.correo = { estado: 'ENVIADO', adjunto, contenido };
  return actualizarCompra(compraGuardada);
};

export {
  MAXIMO_ENTRADAS_POR_FECHA,
  calcularTotalCompra,
  procesarCompra,
  validarFechaVisita,
};
