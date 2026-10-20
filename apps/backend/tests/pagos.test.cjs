const { test } = require("node:test");
const assert = require("node:assert/strict");
const pagos = require("./pagos.cjs");

test("TC-41: valida la compra en efectivo al confirmar boletería", () => {
  const compra = pagos.crearCompra({
    formaPago: "efectivo",
  });

  assert.equal(compra.estado, "pendiente");
  assert.equal(compra.pagada, false);

  pagos.confirmarPagoBoleteria(compra, "aprobada");

  assert.equal(compra.estado, "validada");
  assert.equal(compra.pagada, true);
});

test("TC-42: muestra Mercado Pago simulado para una compra válida", () => {
  const compra = pagos.crearCompra({
    formaPago: "tarjeta",
    compraValida: true,
  });

  const html = pagos.renderPago(compra);

  assert.match(html, /Mercado Pago/);
  assert.match(html, /Simulación/);
  assert.match(html, /<form/);
  assert.match(html, /Confirmar pago/);
  assert.match(html, /Intento 1/);

  assert.equal(compra.estado, "pendiente");
  assert.equal(compra.pagada, false);
});

test("TC-43: registra y muestra una transacción aprobada", () => {
  const compra = pagos.crearCompra({
    formaPago: "tarjeta",
  });

  pagos.resolverTransaccion(compra, "aprobada");

  assert.equal(compra.estado, "pagada");
  assert.equal(compra.pagada, true);
  assert.equal(compra.intentos[0].estado, "aprobada");

  const html = pagos.renderPago(compra);

  assert.match(html, /Transacción aprobada/);
  assert.doesNotMatch(html, /<form/);
});

test("TC-44: muestra el rechazo y no marca la compra como pagada", () => {
  const compra = pagos.crearCompra({
    formaPago: "tarjeta",
  });

  pagos.resolverTransaccion(compra, "rechazada");

  assert.equal(compra.estado, "rechazada");
  assert.equal(compra.pagada, false);
  assert.equal(compra.intentos[0].estado, "rechazada");

  const html = pagos.renderPago(compra);

  assert.match(html, /Transacción rechazada/);
  assert.doesNotMatch(html, /Transacción aprobada/);
  assert.doesNotMatch(html, /<form/);
});