import calcularPrecioEntrada from "../src/domain/calcularPrecioEntrada";

describe("calcularPrecioEntrada", () => {
  test("TC-54: cobra el precio regular completo a un adulto sin descuento", () => {
    const precio = calcularPrecioEntrada(30, "Regular");

    expect(precio).toBe(10000);
  });

  test("TC-57: aplica 50% de descuento a un visitante de 4 años con pase regular", () => {
    const precio = calcularPrecioEntrada(4, "Regular");

    expect(precio).toBe(5000);
  });
});
