const { test } = require("node:test");
const assert = require("node:assert/strict");
const pagos = require("../../src/pagos.cjs");

for (const resultadoAnterior of ["rechazada", "cancelada"]) {
  test(`TC-46: permite reintentar después de ${resultadoAnterior}`, () => {
    const compra = pagos.crearCompra({
      formaPago: "tarjeta",
    });

    pagos.resolverTransaccion(compra, resultadoAnterior);
    pagos.reintentarPago(compra);

    assert.equal(compra.estado, "pendiente");
    assert.equal(compra.pagada, false);

    assert.deepEqual(compra.intentos, [
      {
        numero: 1,
        estado: resultadoAnterior,
      },
      {
        numero: 2,
        estado: "pendiente",
      },
    ]);

    assert.match(pagos.renderPago(compra), /<form/);
    assert.match(pagos.renderPago(compra), /Intento 2/);

    pagos.resolverTransaccion(compra, "aprobada");

    assert.equal(compra.estado, "pagada");
    assert.equal(compra.pagada, true);

    const aprobados = compra.intentos.filter(
      (intento) => intento.estado === "aprobada"
    );

    assert.equal(aprobados.length, 1);

    const antesDelReintento = JSON.stringify(compra);

    assert.throws(
      () => pagos.reintentarPago(compra),
      /No se puede reintentar/
    );

    assert.equal(
      JSON.stringify(compra),
      antesDelReintento
    );
  });
}

test("TC-46: impide reintentar una compra aprobada en el primer intento", () => {
  const compra = pagos.crearCompra({
    formaPago: "tarjeta",
  });

  pagos.resolverTransaccion(compra, "aprobada");

  const antesDelReintento = JSON.stringify(compra);

  assert.throws(
    () => pagos.reintentarPago(compra),
    /No se puede reintentar/
  );

  assert.equal(
    JSON.stringify(compra),
    antesDelReintento
  );
});

test("TC-46: impide abrir otro intento mientras hay uno pendiente", () => {
  const compra = pagos.crearCompra({
    formaPago: "tarjeta",
  });

  assert.throws(
    () => pagos.reintentarPago(compra),
    /No se puede reintentar/
  );

  assert.equal(compra.intentos.length, 1);
});
