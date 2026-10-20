function crearCompra({ formaPago, compraValida = true }) {
  return {
    formaPago,
    compraValida,
    estado: "pendiente",
    pagada: false,
  };
}

function confirmarPagoBoleteria(compra, validacion) {
  if (compra.formaPago !== "efectivo") {
    throw new Error("La compra no corresponde a pago en efectivo");
  }

  if (validacion === "aprobada") {
    compra.estado = "validada";
    compra.pagada = true;
  }

  return compra;
}

exports.crearCompra = crearCompra;
exports.confirmarPagoBoleteria = confirmarPagoBoleteria;