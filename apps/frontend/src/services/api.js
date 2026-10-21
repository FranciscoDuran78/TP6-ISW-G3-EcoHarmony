const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Los errores del backend llegan como { error: 'mensaje' } y se muestran tal cual.
async function pedir(metodo, ruta, cuerpo) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verificá que el backend esté levantado.');
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.error || `La solicitud falló (${respuesta.status})`);
  }

  return datos;
}

async function getApiHealth() {
  return pedir('GET', '/api/health');
}

export const obtenerCalendario = () => pedir('GET', '/api/calendario');

export const cotizarCompra =(visitantes) => pedir('POST', '/api/compras/cotizacion', { visitantes });

export const crearCompra = (datos) => pedir('POST', '/api/compras', datos);

export const resolverPago = (id, resultado) => pedir('POST', `/api/compras/${id}/pago`, { resultado });

export const reintentarPago = (id) => pedir('POST', `/api/compras/${id}/reintento`);

export const validarEnBoleteria = (id) => pedir('POST', `/api/compras/${id}/validacion-boleteria`, { validacion: 'aprobada' });

export default getApiHealth;
