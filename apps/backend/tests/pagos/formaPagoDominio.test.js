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
