const ESTADOS = Object.freeze({
  PENDIENTE: "pendiente",
  VALIDADA: "validada",
  PAGADA: "pagada",
  RECHAZADA: "rechazada",
  CANCELADA: "cancelada",
});

function crearCompra({ formaPago, compraValida = true }) {
  return {
    formaPago,
    compraValida,
    estado: ESTADOS.PENDIENTE,
    pagada: false,
    intentos:
      formaPago === "tarjeta" && compraValida
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

  if (compra.estado === ESTADOS.PAGADA) {
    return '<p role="status">Transacción aprobada</p>';
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
  if (resultado !== "aprobada") {
    throw new Error("Resultado no soportado");
  }

  return registrarResultado(
    compra,
    resultado,
    ESTADOS.PAGADA
  );
}

function registrarResultado(compra, resultado, estadoCompra) {
  const intento = compra.intentos.at(-1);

  intento.estado = resultado;
  compra.estado = estadoCompra;
  compra.pagada = estadoCompra === ESTADOS.PAGADA;

  return compra;
}

exports.resolverTransaccion = resolverTransaccion;

exports.renderPago = renderPago;

exports.crearCompra = crearCompra;
exports.confirmarPagoBoleteria = confirmarPagoBoleteria;

