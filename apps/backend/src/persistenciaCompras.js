import Database from 'better-sqlite3';
import path from 'node:path';

const RUTA_BASE_DATOS = path.resolve(process.cwd(), 'data.sqlite');

const crearPersistenciaCompras = (database) => {
  database.exec(`
    CREATE TABLE IF NOT EXISTS compras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      fecha_visita TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      total INTEGER NOT NULL,
      estado TEXT NOT NULL,
      compra_json TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS compras_usuario_fecha_idx
      ON compras (usuario_id, fecha_visita, estado);
  `);

  const insertarCompra = database.prepare(`
    INSERT INTO compras (usuario_id, fecha_visita, cantidad, total, estado, compra_json)
    VALUES (@usuarioId, @fechaVisita, @cantidad, @total, @estado, @compraJson)
  `);
  const obtenerCompra = database.prepare('SELECT compra_json FROM compras WHERE id = ?');
  const obtenerPrevias = database.prepare(`
    SELECT COALESCE(SUM(cantidad), 0) AS cantidad
    FROM compras
    WHERE usuario_id = ? AND fecha_visita = ? AND estado != 'RECHAZADA'
  `);
  const guardar = database.transaction((compra) => {
    const { lastInsertRowid: id } = insertarCompra.run({
      usuarioId: compra.usuario.id,
      fechaVisita: compra.fechaVisita,
      cantidad: compra.cantidad,
      total: compra.total,
      estado: compra.estado,
      compraJson: JSON.stringify(compra),
    });
    const compraGuardada = { ...compra, id: Number(id) };
    database.prepare('UPDATE compras SET compra_json = ? WHERE id = ?')
      .run(JSON.stringify(compraGuardada), id);
    return compraGuardada;
  });

  return {
    guardar,
    obtenerPorId(id) {
      const fila = obtenerCompra.get(id);
      return fila ? JSON.parse(fila.compra_json) : null;
    },
    obtenerEntradasPrevias(usuarioId, fechaVisita) {
      return obtenerPrevias.get(usuarioId, fechaVisita).cantidad;
    },
    actualizar(compra) {
      database.prepare('UPDATE compras SET compra_json = ? WHERE id = ?')
        .run(JSON.stringify(compra), compra.id);
      return compra;
    },
  };
};

const crearPersistenciaSQLite = (ruta = RUTA_BASE_DATOS) => (
  crearPersistenciaCompras(new Database(ruta))
);

export { crearPersistenciaCompras, crearPersistenciaSQLite };
