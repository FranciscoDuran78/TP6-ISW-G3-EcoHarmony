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
        ? [{ numero: 1, estado: "pendiente" }]
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

exports.renderPago = renderPago;

exports.crearCompra = crearCompra;
exports.confirmarPagoBoleteria = confirmarPagoBoleteria;

