import { FECHA, compraBase, levantar, pedir } from '../helpers/api.js';

describe("Forma de pago al crear la compra", () => {
  beforeEach(() => levantar());

  test('TC-38: tarjeta válida crea la compra pendiente con su total', async () => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase());

    expect(status).toBe(201);
    expect(body).toMatchObject({
      fechaVisita: FECHA,
      cantidad: 3,
      total: 25000,
      formaPago: 'tarjeta',
      estado: 'pendiente',
      pagada: false,
    });
    expect(body.id).toBeDefined();
    expect(body.intentos).toHaveLength(1);
    expect(body.correo).toBeNull();
  });

  test('TC-85: efectivo queda pendiente de validación y sin mail', async () => {
    const { status, body } = await pedir('POST', '/api/compras', compraBase({ formaPago: 'EFECTIVO' }));

    expect(status).toBe(201);
    expect(body).toMatchObject({ formaPago: 'efectivo', estado: 'pendiente', pagada: false });
    expect(body.intentos).toEqual([]);
    expect(body.resumen).toMatchObject({ cantidadEntradas: 3, fecha: FECHA });
    expect(body.correo).toBeNull();
  });
});
