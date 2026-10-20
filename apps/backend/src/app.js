import express from 'express';
import { procesarCompra } from './procesarCompra.js';
import { crearPersistenciaSQLite } from './persistenciaCompras.js';

const crearApp = ({
  persistencia = crearPersistenciaSQLite(),
  opcionesCompra = {},
} = {}) => {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/compras', async (req, res) => {
    try {
      const compra = await procesarCompra(req.body, {
        obtenerEntradasPrevias: persistencia.obtenerEntradasPrevias,
        guardarCompra: persistencia.guardar,
        actualizarCompra: persistencia.actualizar,
        ...opcionesCompra,
      });
      const status = compra.estado === 'RECHAZADA' ? 402 : 201;
      res.status(status).json({ compra });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/compras/:id', (req, res) => {
    const compra = persistencia.obtenerPorId(Number(req.params.id));
    if (!compra) {
      res.status(404).json({ error: 'No se encontró la compra solicitada' });
      return;
    }
    res.json({ compra });
  });

  return app;
};

const app = crearApp();

export { crearApp };
export default app;
