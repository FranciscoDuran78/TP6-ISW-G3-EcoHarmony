import { createApp } from '../../src/app.js';

const dos = (n) => String(n).padStart(2, '0');
const fechaLocal = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;

// Fechas relativas a hoy: dentro del mes, ni lunes ni 25/12 ni 1/1.
const diasAbiertos = () => {
  const abiertos = [];
  for (let i = 1; i <= 29; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const f = fechaLocal(d);
    if (d.getDay() !== 1 && !['12-25', '01-01'].includes(f.slice(5))) abiertos.push(f);
  }
  return abiertos;
};
const [FECHA] = diasAbiertos();

const proximoLunes = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  return fechaLocal(d);
};

const adulto = { edad: 30, tipoPase: 'VIP' };
const nino = { edad: 10, tipoPase: 'Regular' };
const bebe = { edad: 3, tipoPase: 'Regular' };
const compraBase = (extra = {}) => ({
  fechaVisita: FECHA,
  visitantes: [adulto, nino, bebe],
  formaPago: 'tarjeta',
  ...extra,
});

let server;
let pedir;

const levantar = async (opciones) => {
  server = createApp(opciones).listen(0);
  await new Promise((resolve) => { server.once('listening', resolve); });
  const base = `http://127.0.0.1:${server.address().port}`;
  pedir = async (metodo, ruta, cuerpo) => {
    const respuesta = await fetch(`${base}${ruta}`, {
      method: metodo,
      headers: { 'content-type': 'application/json' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    return { status: respuesta.status, body: await respuesta.json() };
  };
};

afterEach(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => { server.close(resolve); });
});

export { fechaLocal, FECHA, proximoLunes, adulto, nino, bebe, compraBase, levantar, pedir };
