const ESTADOS = Object.freeze({
  PENDIENTE: "pendiente",
  VALIDADA: "validada",
  PAGADA: "pagada",
  RECHAZADA: "rechazada",
  CANCELADA: "cancelada",
});
const ESTADO_POR_RESULTADO = Object.freeze({
  aprobada: ESTADOS.PAGADA,
  rechazada: ESTADOS.RECHAZADA,
  cancelada: ESTADOS.CANCELADA,
});
const MENSAJE_POR_ESTADO = Object.freeze({
  [ESTADOS.PAGADA]: "Transacción aprobada",
  [ESTADOS.RECHAZADA]: "Transacción rechazada",
  [ESTADOS.CANCELADA]: "Transacción cancelada",
});

const FORMAS_DE_PAGO = ["tarjeta", "efectivo"];
const MENSAJES = Object.freeze({
  FORMA_PAGO_REQUERIDA:
    "Debe seleccionar una forma de pago: efectivo en boletería o tarjeta",
  FORMA_PAGO_INVALIDA: "La forma de pago no es válida",
});

function validarFormaPago(formaPago) {
  if (!formaPago) {
    throw new Error(MENSAJES.FORMA_PAGO_REQUERIDA);
  }

  const normalizada = String(formaPago).toLowerCase();

  if (!FORMAS_DE_PAGO.includes(normalizada)) {
    throw new Error(MENSAJES.FORMA_PAGO_INVALIDA);
  }

  return normalizada;
}

function crearCompra({ formaPago, compraValida = true }) {
  const formaPagoValida = validarFormaPago(formaPago);

  return {
    formaPago: formaPagoValida,
    compraValida,
    estado: ESTADOS.PENDIENTE,
    pagada: false,
    intentos:
      formaPagoValida === "tarjeta" && compraValida
        ? [crearIntento(1)]
        : [],
  };
}

function confirmarPagoBoleteria(compra, validacion) {
  if (compra.formaPago !== "efectivo") {
    throw new Error("La compra no corresponde a pago en efectivo");
  }

  if (validacion === "aprobada") {
    compra.estado = ESTADOS.VALIDADA;
    compra.pagada = true;
  }

  return compra;
}

function renderPago(compra) {
  if (compra.formaPago !== "tarjeta" || !compra.compraValida) {
    return "";
  }

  const mensaje = MENSAJE_POR_ESTADO[compra.estado];

  if (mensaje) {
    return `<p role="status">${mensaje}</p>`;
  }

  return `
    <section aria-label="Mercado Pago simulado">
      <h2>Mercado Pago — Simulación</h2>
      <p>Intento ${compra.intentos.length}</p>

      <form>
        <label>
          Número de tarjeta
          <input name="tarjeta" autocomplete="off">
        </label>

        <button type="submit">Confirmar pago</button>
      </form>
    </section>
  `;
}

function crearIntento(numero) {
  return {
    numero,
    estado: ESTADOS.PENDIENTE,
  };
}

function resolverTransaccion(compra, resultado) {
  if (!Object.hasOwn(ESTADO_POR_RESULTADO, resultado)) {
    throw new Error("Resultado no soportado");
  }

  return registrarResultado(
    compra,
    resultado,
    ESTADO_POR_RESULTADO[resultado]
  );
}

function registrarResultado(compra, resultado, estadoCompra) {
  const intento = compra.intentos.at(-1);

  intento.estado = resultado;
  compra.estado = estadoCompra;
  compra.pagada = estadoCompra === ESTADOS.PAGADA;

  return compra;
}

function reintentarPago(compra) {
  if (!puedeReintentar(compra)) {
    throw new Error("No se puede reintentar esta compra");
  }

  const numero = compra.intentos.length + 1;

  compra.intentos.push(crearIntento(numero));
  compra.estado = ESTADOS.PENDIENTE;
  compra.pagada = false;

  return compra;
}
function puedeReintentar(compra) {
  const estadoReintentable = [
    ESTADOS.RECHAZADA,
    ESTADOS.CANCELADA,
  ].includes(compra.estado);

  return (
    compra.formaPago === "tarjeta" &&
    compra.compraValida &&
    !compra.pagada &&
    estadoReintentable
  );
}
exports.reintentarPago = reintentarPago;

exports.resolverTransaccion = resolverTransaccion;

exports.renderPago = renderPago;

exports.crearCompra = crearCompra;
exports.validarFormaPago = validarFormaPago;
exports.confirmarPagoBoleteria = confirmarPagoBoleteria;

