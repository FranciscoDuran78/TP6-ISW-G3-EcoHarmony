import calcularPrecioEntrada from '../src/domain/calcularPrecioEntrada';

describe('calcularPrecioEntrada', () => {
  test('cobra el precio regular completo a un adulto sin descuento', () => {
    const precio = calcularPrecioEntrada(30, 'Regular');
    expect(precio).toBe(10000);
  });
});
