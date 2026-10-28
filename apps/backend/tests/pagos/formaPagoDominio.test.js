import pagos from '../../src/domain/pagos/pagos.cjs';

describe('Forma de pago en el dominio de pagos', () => {
  test('TC-36: rechaza una compra sin forma de pago seleccionada', () => {
    expect(() => pagos.crearCompra({ formaPago: null })).toThrow(
      'Debe seleccionar una forma de pago: efectivo en boletería o tarjeta',
    );
  });

  test('TC-39: rechaza una forma de pago que el parque no ofrece', () => {
    expect(() => pagos.crearCompra({ formaPago: 'transferencia' })).toThrow('La forma de pago no es válida');
  });
});

describe('Compra en efectivo en el dominio de pagos', () => {
  test('TC-37: una compra en efectivo se acepta y queda pendiente hasta validarse', () => {
    const compra = pagos.crearCompra({ formaPago: 'efectivo' });

    expect(compra).toMatchObject({ formaPago: 'efectivo', estado: 'pendiente', pagada: false });
    expect(compra.intentos).toEqual([]);
  });

  test('TC-40: si la boletería rechaza el pago en efectivo, la compra sigue pendiente', () => {
    const compra = pagos.crearCompra({ formaPago: 'efectivo' });

    pagos.confirmarPagoBoleteria(compra, 'rechazada');

    expect(compra).toMatchObject({ estado: 'pendiente', pagada: false });
  });
});

describe('Compra con tarjeta en el dominio de pagos', () => {
  test('TC-38: una compra con tarjeta continúa al flujo simulado de Mercado Pago', () => {
    const compra = pagos.crearCompra({ formaPago: 'tarjeta' });

    expect(compra.intentos).toEqual([{ numero: 1, estado: 'pendiente' }]);
    expect(pagos.renderPago(compra)).toContain('Mercado Pago');
  });
});
