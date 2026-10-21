const generarCorreoConfirmacion = (datos) => ({
  destinatario: datos.emailUsuario,
  fecha: datos.fecha,
  cantidad: datos.cantidad,
  pases: datos.pases,
  adjunto: datos.adjunto || null,
});

const generarResumenCompra = (datos) => ({
  cantidadEntradas: datos.cantidad,
  fecha: datos.fecha,
  totalPases: datos.pases ? datos.pases.length : 0,
});

export { generarCorreoConfirmacion, generarResumenCompra };
