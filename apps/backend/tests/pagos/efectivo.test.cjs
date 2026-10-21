const { test } = require("node:test");
const assert = require("node:assert/strict");
const pagos = require("../../src/pagos.cjs");

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
