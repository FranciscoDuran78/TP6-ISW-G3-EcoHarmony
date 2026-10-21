import calcularPrecioEntrada from "../../src/domain/precios/calcularPrecioEntrada.js";

describe("Precio de entrada y descuentos por edad", () => {
  test("TC-54: cobra el precio regular completo a un adulto sin descuento", () => {
    const precio = calcularPrecioEntrada(30, "Regular");

    expect(precio).toBe(10000);
  });

  test("TC-57: aplica 50% de descuento a un visitante de 4 años con pase regular", () => {
    const precio = calcularPrecioEntrada(4, "Regular");

    expect(precio).toBe(5000);
  });

  test("TC-58: aplica 50% de descuento en el límite de 15 años con pase VIP", () => {
    const precio = calcularPrecioEntrada(15, "VIP");

    expect(precio).toBe(10000);
  });

  test("TC-59: cobra el precio completo a un visitante de 16 años con pase regular", () => {
    const precio = calcularPrecioEntrada(16, "Regular");

    expect(precio).toBe(10000);
  });

  test("TC-60: cobra el precio completo a un visitante de 59 años con pase regular", () => {
    const precio = calcularPrecioEntrada(59, "Regular");

    expect(precio).toBe(10000);
  });

  test("TC-61: aplica 50% de descuento en el límite de 60 años con pase VIP", () => {
    const precio = calcularPrecioEntrada(60, "VIP");

    expect(precio).toBe(10000);
  });
});
