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

exports.crearCompra = crearCompra;
exports.confirmarPagoBoleteria = confirmarPagoBoleteria;