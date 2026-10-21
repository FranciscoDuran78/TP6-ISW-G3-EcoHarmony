import express from 'express';
import { crearServicioCompras } from './compras.js';

// createApp recibe las dependencias (reloj, mail, usuario) para poder probarlas.
export const createApp = (opciones) => {
  const app = express();
  const compras = crearServicioCompras(opciones);

  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/calendario', (req, res) => {
    res.json(compras.calendario());
  });

  app.post('/api/compras/cotizacion', (req, res) => {
    res.json(compras.cotizar(req.body));
  });

  app.post('/api/compras', (req, res) => {
    res.status(201).json(compras.crear(req.body));
  });

  app.get('/api/compras/:id', (req, res) => {
    res.json(compras.obtener(req.params.id));
  });

  app.post('/api/compras/:id/pago', (req, res) => {
    res.json(compras.resolverPago(req.params.id, req.body?.resultado));
  });

  app.post('/api/compras/:id/reintento', (req, res) => {
    res.json(compras.reintentarPago(req.params.id));
  });

  app.post('/api/compras/:id/validacion-boleteria', (req, res) => {
    res.json(compras.validarEnBoleteria(req.params.id, req.body?.validacion));
  });

  // eslint-disable-next-line no-unused-vars -- Express reconoce el handler de errores por sus 4 parámetros
  app.use((error, req, res, next) => {
    if (!error.status) {
      console.error(error);
    }

    res.status(error.status ?? 500).json({
      error: error.status ? error.message : 'Error interno del servidor',
    });
  });

  return app;
};

export default createApp();
