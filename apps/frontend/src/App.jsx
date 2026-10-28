import React, { useEffect, useState } from 'react';
import {
  cotizarCompra,
  crearCompra,
  obtenerCalendario,
  reintentarPago,
  resolverPago,
  validarEnBoleteria,
} from './services/api.js';
import './App.css';

// Filas de visitantes que puede mostrar el formulario (el máximo de compra lo valida el backend).
const FILAS_MAXIMAS = 15;

// Solo texto para el usuario: el precio y los descuentos los calcula el backend.
const obtenerEtiquetaDescuento = (edad) => {
  const edadNumerica = Number(edad);
  if (edad === '' || Number.isNaN(edadNumerica)) return 'Sin calcular';
  if (edadNumerica <= 3) return '100% OFF (Menor de 3 años)';
  if (edadNumerica <= 15) return '50% OFF (Tarifa Menor)';
  if (edadNumerica >= 60) return '50% OFF (Tarifa Jubilado)';
  return 'Tarifa Completa';
};

const ESTADOS_COMPRA = {
  pagada: { texto: 'CONFIRMADA', clase: 'estado-ok' },
  validada: { texto: 'PAGO VALIDADO EN BOLETERÍA', clase: 'estado-ok' },
  pendiente: { texto: 'PENDIENTE DE VALIDACIÓN EN BOLETERÍA', clase: 'estado-pendiente' },
};

function App() {
  const [pasoActual, setPasoActual] = useState('FORMULARIO');
  const [calendario, setCalendario] = useState([]);
  const [fechaVisita, setFechaVisita] = useState('');
  const [cantidadEntradas, setCantidadEntradas] = useState(3);
  const [visitantes, setVisitantes] = useState([
    { id: 1, edad: 28, tipoPase: 'VIP' },
    { id: 2, edad: 10, tipoPase: 'Regular' },
    { id: 3, edad: 2, tipoPase: 'Regular' },
  ]);
  const [formaPago, setFormaPago] = useState('TARJETA');
  const [mensajeError, setMensajeError] = useState('');
  const [cotizacion, setCotizacion] = useState({ visitantes: [], total: 0 });
  const [compra, setCompra] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Los días abiertos los define el backend; se preselecciona el primero disponible.
  useEffect(() => {
    obtenerCalendario()
      .then((dias) => {
        setCalendario(dias);
        setFechaVisita((actual) => actual || dias.find((dia) => !dia.cerrado)?.fechaIso || '');
      })
      .catch((error) => setMensajeError(error.message));
  }, []);

  // El precio de cada visitante lo calcula el backend mientras se completa el formulario.
  useEffect(() => {
    let vigente = true;
    const espera = setTimeout(() => {
      cotizarCompra(visitantes)
        .then((resultado) => {
          if (vigente) setCotizacion(resultado);
        })
        .catch((error) => {
          if (vigente) setMensajeError(error.message);
        });
    }, 250);

    return () => {
      vigente = false;
      clearTimeout(espera);
    };
  }, [visitantes]);

  const actualizarCantidadEntradas = (nuevaCantidad) => {
    const valor = Number(nuevaCantidad);
    setCantidadEntradas(valor);
    setMensajeError('');

    if (!Number.isInteger(valor) || valor < 1 || valor > FILAS_MAXIMAS) {
      return;
    }

    setVisitantes((actuales) => Array.from(
      { length: valor },
      (_, i) => actuales[i] ?? { id: i + 1, edad: 25, tipoPase: 'Regular' },
    ));
  };

  const actualizarVisitante = (indice, campo, valor) => {
    const copiaVisitantes = [...visitantes];
    copiaVisitantes[indice] = {
      ...copiaVisitantes[indice],
      [campo]: valor,
    };
    setVisitantes(copiaVisitantes);
  };

  // Ejecuta una llamada al backend y refleja la compra que devuelve (o el error).
  const ejecutar = async (accion, alExito) => {
    setEnviando(true);
    try {
      const actualizada = await accion();
      setCompra(actualizada);
      setMensajeError('');
      if (alExito) alExito(actualizada);
    } catch (error) {
      setMensajeError(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const manejarConfirmarFormulario = (evento) => {
    evento.preventDefault();

    ejecutar(
      () => crearCompra({
        fechaVisita,
        cantidad: cantidadEntradas,
        visitantes,
        formaPago,
      }),
      (nueva) => setPasoActual(nueva.formaPago === 'tarjeta' ? 'MERCADO_PAGO' : 'CONFIRMACION'),
    );
  };

  const volverAlFormulario = () => {
    setCompra(null);
    setMensajeError('');
    setPasoActual('FORMULARIO');
  };

  const pagoRechazado = compra?.estado === 'rechazada';
  const puedeVerPago = compra?.formaPago === 'tarjeta';
  const puedeVerConfirmacion = Boolean(compra) && (compra.pagada || compra.formaPago === 'efectivo');
  const estadoCompra = ESTADOS_COMPRA[compra?.estado] ?? ESTADOS_COMPRA.pendiente;

  const alertaError = mensajeError && (
    <div className="alerta-error" role="alert">
      <strong>⚠️ No se pudo procesar la solicitud:</strong> {mensajeError}
    </div>
  );

  return (
    <div className="ecoharmony-app">
      {/* Cabecera Oficial con Logo Propuesto y Sesión Mockeada */}
      <header className="header-parque">
        <div className="contenedor-header">
          <div className="logo-parque">
            <div className="icono-logo" aria-hidden="true">🌿</div>
            <div>
              <h1 className="titulo-logo">EcoHarmony Park</h1>
              <span className="subtitulo-logo">Reserva Natural &amp; Aventura</span>
            </div>
          </div>

          <div className="estado-sesion">
            <span className="punto-activo" />
            <div>
              <p className="nombre-usuario">Bruno García (Usuario Registrado)</p>
              <p className="email-usuario">visitante@ecoharmony.com.ar</p>
            </div>
          </div>
        </div>
      </header>

      <main className="contenedor-principal">
        {/* PANTALLA 1: FORMULARIO DE COMPRA DE ENTRADAS */}
        {pasoActual === 'FORMULARIO' && (
          <section className="tarjeta-principal">
            <div className="encabezado-seccion">
              <h2>Comprar Entradas</h2>
              <p>
                Asegurá tu visita al parque. Horario de apertura: Martes a Domingo de 08:30 a 19:00 hs.
              </p>
            </div>

            {alertaError}

            <form onSubmit={manejarConfirmarFormulario} className="formulario-compra">
              {/* Selección de Fecha con Calendario que bloquea Lunes */}
              <div className="bloque-campo">
                <label className="etiqueta-campo" htmlFor="selector-fecha">
                  1. Seleccioná la fecha de tu visita (Máximo 1 mes de anticipación)
                </label>
                <p className="nota-campo">
                  * Lunes, 25 de diciembre y 1 de enero el parque permanece cerrado.
                  Compras para el día actual habilitadas hasta las 17:30 hs.
                </p>

                <div className="grilla-calendario" id="selector-fecha">
                  {calendario.map((item, indice) => {
                    const estaSeleccionado = fechaVisita === item.fechaIso;
                    const muestraMes = indice === 0 || item.numero === 1;
                    let claseDia = 'celda-dia';
                    if (item.cerrado) claseDia += ' dia-deshabilitado';
                    if (estaSeleccionado) claseDia += ' dia-seleccionado';

                    return (
                      <button
                        key={item.fechaIso}
                        type="button"
                        disabled={item.cerrado}
                        title={item.motivo ?? undefined}
                        className={claseDia}
                        onClick={() => {
                          setFechaVisita(item.fechaIso);
                          setMensajeError('');
                        }}
                      >
                        <span className="nombre-dia">
                          {muestraMes ? `${item.diaSemana} · ${item.mes}` : item.diaSemana}
                        </span>
                        <span className="numero-dia">{item.numero}</span>
                        <span className="estado-dia">
                          {item.cerrado ? 'Cerrado' : 'Abierto'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selección de Cantidad de Entradas */}
              <div className="bloque-campo fila-cantidad">
                <div>
                  <label className="etiqueta-campo" htmlFor="input-cantidad">
                    2. Cantidad de entradas requeridas
                  </label>
                  <p className="nota-campo">
                    Máximo permitido: 10 entradas por transacción (podés hacer más de una compra para la misma fecha).
                  </p>
                </div>
                <input
                  id="input-cantidad"
                  type="number"
                  min="1"
                  max={FILAS_MAXIMAS}
                  value={cantidadEntradas}
                  onChange={(e) => actualizarCantidadEntradas(e.target.value)}
                  className="input-numero"
                />
              </div>

              {/* Detalle de Edad y Tipo de Pase por cada Visitante */}
              <div className="bloque-campo">
                <span className="etiqueta-campo">
                  3. Datos de cada visitante y Tipo de Pase
                </span>
                <p className="nota-campo">
                  Menores de hasta 3 años: Sin cargo ($0) | De 4 a 15 años y mayores de 60 años: 50% OFF.
                </p>

                <div className="lista-visitantes">
                  {visitantes.map((visitante, index) => {
                    const subtotal = cotizacion.visitantes[index]?.precio ?? 0;

                    return (
                      <div key={visitante.id} className="fila-visitante">
                        <div className="badge-visitante">
                          Visitante #{index + 1}
                        </div>

                        <div className="grupo-input">
                          <label htmlFor={`edad-${visitante.id}`}>Edad (años)</label>
                          <input
                            id={`edad-${visitante.id}`}
                            type="number"
                            min="0"
                            max="110"
                            value={visitante.edad}
                            onChange={(e) => actualizarVisitante(index, 'edad', e.target.value)}
                            className="input-estandar"
                          />
                        </div>

                        <div className="grupo-input">
                          <label htmlFor={`pase-${visitante.id}`}>Tipo de Pase</label>
                          <select
                            id={`pase-${visitante.id}`}
                            value={visitante.tipoPase}
                            onChange={(e) => actualizarVisitante(index, 'tipoPase', e.target.value)}
                            className="input-estandar"
                          >
                            <option value="Regular">Regular ($10.000)</option>
                            <option value="VIP">VIP ($20.000)</option>
                          </select>
                        </div>

                        <div className="resumen-precio-visitante">
                          <span className="etiqueta-descuento">
                            {obtenerEtiquetaDescuento(visitante.edad)}
                          </span>
                          <strong className="monto-subtotal">
                            ${subtotal.toLocaleString('es-AR')}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selección de Forma de Pago */}
              <div className="bloque-campo">
                <span className="etiqueta-campo">4. Seleccioná la forma de pago</span>
                <div className="opciones-pago">
                  <label
                    className={
                      formaPago === 'TARJETA'
                        ? 'tarjeta-pago seleccionada'
                        : 'tarjeta-pago'
                    }
                    htmlFor="pago-tarjeta"
                  >
                    <input
                      id="pago-tarjeta"
                      type="radio"
                      name="formaPago"
                      value="TARJETA"
                      checked={formaPago === 'TARJETA'}
                      onChange={(e) => setFormaPago(e.target.value)}
                    />
                    <div>
                      <strong>💳 Tarjeta de Crédito (Mercado Pago)</strong>
                      <p>Redirección segura al confirmar. Confirmación inmediata.</p>
                    </div>
                  </label>

                  <label
                    className={
                      formaPago === 'EFECTIVO'
                        ? 'tarjeta-pago seleccionada'
                        : 'tarjeta-pago'
                    }
                    htmlFor="pago-efectivo"
                  >
                    <input
                      id="pago-efectivo"
                      type="radio"
                      name="formaPago"
                      value="EFECTIVO"
                      checked={formaPago === 'EFECTIVO'}
                      onChange={(e) => setFormaPago(e.target.value)}
                    />
                    <div>
                      <strong>💵 Efectivo en Boletería</strong>
                      <p>La reserva queda en estado PENDIENTE hasta validar el pago en el parque.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pie con Total y Botón de Acción Principal */}
              <div className="pie-compra">
                <div className="bloque-total">
                  <span>Total a abonar ({visitantes.length} entradas):</span>
                  <strong className="precio-final">
                    ${cotizacion.total.toLocaleString('es-AR')}
                  </strong>
                </div>

                <button type="submit" className="btn-confirmar" disabled={enviando}>
                  {formaPago === 'TARJETA'
                    ? 'Continuar a Mercado Pago'
                    : 'Confirmar Reserva de Entradas'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* PANTALLA 2: SIMULACIÓN DE PASARELA MERCADO PAGO */}
        {pasoActual === 'MERCADO_PAGO' && puedeVerPago && (
          <section className="tarjeta-principal vista-mp">
            <div className="banner-mp">
              <div>
                <span className="badge-mp">Módulo Externo Simulado</span>
                <h3>Mercado Pago · Checkout Seguro</h3>
              </div>
              <span className="monto-mp">${compra.total.toLocaleString('es-AR')}</span>
            </div>

            <div className="cuerpo-mp">
              {pagoRechazado && (
                <div className="alerta-error" role="alert">
                  <strong>Transacción rechazada:</strong> el pago no fue aprobado y la compra no figura
                  como pagada. Podés reintentar.
                </div>
              )}
              {alertaError}

              <div className="detalle-transaccion-mp">
                <h4>Resumen de la Transacción</h4>
                <ul>
                  <li>
                    <span>Comercio:</span>
                    <strong>EcoHarmony Park S.A.</strong>
                  </li>
                  <li>
                    <span>Concepto:</span>
                    <strong>{compra.cantidad}x Entradas al Parque</strong>
                  </li>
                  <li>
                    <span>Fecha de visita:</span>
                    <strong>{compra.fechaVisita}</strong>
                  </li>
                  <li>
                    <span>Intento de pago:</span>
                    <strong>#{compra.intentos.length}</strong>
                  </li>
                  <li>
                    <span>Comprador:</span>
                    <strong>visitante@ecoharmony.com.ar</strong>
                  </li>
                </ul>
              </div>

              <div className="simulador-tarjeta-mp">
                <h4>Datos de tu Tarjeta de Crédito</h4>
                <div className="campo-mp">
                  <label htmlFor="num-tarjeta">Número de tarjeta</label>
                  <input
                    id="num-tarjeta"
                    type="text"
                    readOnly
                    value="4509 •••• •••• 8821 (VISA Crédito)"
                  />
                </div>
                <div className="fila-mp">
                  <div className="campo-mp">
                    <label htmlFor="titular-tarjeta">Titular</label>
                    <input id="titular-tarjeta" type="text" readOnly value="BRUNO A GARCIA" />
                  </div>
                  <div className="campo-mp">
                    <label htmlFor="cuotas-tarjeta">Cuotas</label>
                    <input
                      id="cuotas-tarjeta"
                      type="text"
                      readOnly
                      value={`1 cuota de $${compra.total.toLocaleString('es-AR')}`}
                    />
                  </div>
                </div>
              </div>

              <div className="acciones-mp">
                {pagoRechazado ? (
                  <>
                    <button
                      type="button"
                      className="btn-cancelar"
                      onClick={volverAlFormulario}
                    >
                      Volver al formulario
                    </button>
                    <button
                      type="button"
                      className="btn-confirmar"
                      disabled={enviando}
                      onClick={() => ejecutar(() => reintentarPago(compra.id))}
                    >
                      Reintentar pago
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-cancelar"
                      disabled={enviando}
                      onClick={() => ejecutar(() => resolverPago(compra.id, 'rechazada'))}
                    >
                      Simular Rechazo
                    </button>
                    <button
                      type="button"
                      className="btn-confirmar"
                      disabled={enviando}
                      onClick={() => ejecutar(
                        () => resolverPago(compra.id, 'aprobada'),
                        () => setPasoActual('CONFIRMACION'),
                      )}
                    >
                      Pagar ${compra.total.toLocaleString('es-AR')} y Confirmar
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* PANTALLA 3: RESUMEN DE COMPRA Y SIMULACIÓN DE EMAIL CON ADJUNTO */}
        {pasoActual === 'CONFIRMACION' && puedeVerConfirmacion && (
          <div className="contenedor-confirmacion">
            <section className="tarjeta-principal resumen-exito">
              <div className="icono-exito">✓</div>
              <h2>¡Operación Registrada con Éxito!</h2>
              <p className="subtitulo-exito">
                Se procesó tu solicitud para visitar <strong>EcoHarmony Park</strong>.
              </p>

              {alertaError}

              <div className="grilla-datos-finales">
                <div className="dato-final">
                  <span>Cantidad de entradas compradas</span>
                  <strong>{compra.resumen.cantidadEntradas} entradas</strong>
                </div>
                <div className="dato-final">
                  <span>Fecha de visita</span>
                  <strong>{compra.resumen.fecha}</strong>
                </div>
                <div className="dato-final">
                  <span>Medio de pago</span>
                  <strong>
                    {compra.formaPago === 'tarjeta'
                      ? 'Tarjeta de Crédito (Mercado Pago)'
                      : 'Efectivo en Boletería'}
                  </strong>
                </div>
                <div className="dato-final">
                  <span>Estado de la compra</span>
                  <strong className={estadoCompra.clase}>{estadoCompra.texto}</strong>
                </div>
              </div>

              {compra.formaPago === 'efectivo' && compra.estado === 'pendiente' && (
                <button
                  type="button"
                  className="btn-secundario"
                  disabled={enviando}
                  onClick={() => ejecutar(() => validarEnBoleteria(compra.id))}
                >
                  Simular validación del pago en boletería
                </button>
              )}
            </section>

            {/* Simulación de Cliente de Correo Electrónico */}
            {compra.correo ? (
              <section className="tarjeta-principal cliente-email">
                <div className="cabecera-ventana-mail">
                  <span>📧 Simulación de Envío de Correo de Confirmación</span>
                  <span className="tag-orden">
                    Orden #EH-2026-{String(compra.id).padStart(4, '0')}
                  </span>
                </div>

                <div className="metadatos-mail">
                  <p>
                    <strong>De:</strong> reservas@ecoharmonypark.com.ar
                  </p>
                  <p>
                    <strong>Para:</strong> {compra.correo.destinatario}
                  </p>
                  <p>
                    <strong>Asunto:</strong> Confirmación de compra de entradas - Visita {compra.correo.fecha}
                  </p>
                </div>

                <div className="cuerpo-mail">
                  <p>Hola <strong>Bruno</strong>,</p>
                  <p>
                    Te enviamos el resumen representativo de tu transacción para ingresar a
                    <strong> EcoHarmony Park</strong> el día <strong>{compra.correo.fecha}</strong>:
                  </p>

                  <table className="tabla-mail">
                    <thead>
                      <tr>
                        <th>Visitante</th>
                        <th>Edad</th>
                        <th>Tipo de Pase</th>
                        <th>Bonificación</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compra.correo.pases.map((vis, idx) => (
                        // eslint-disable-next-line react/no-array-index-key -- los pases no tienen id propio
                        <tr key={idx}>
                          <td>Visitante #{idx + 1}</td>
                          <td>{vis.edad} años</td>
                          <td>{vis.tipoPase}</td>
                          <td>{obtenerEtiquetaDescuento(vis.edad)}</td>
                          <td>${vis.precio.toLocaleString('es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4"><strong>TOTAL DE LA TRANSACCIÓN</strong></td>
                        <td><strong>${compra.total.toLocaleString('es-AR')}</strong></td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Archivo Adjunto requerido por el PO */}
                  <div className="caja-adjunto">
                    <div className="icono-pdf">📄</div>
                    <div className="info-adjunto">
                      <strong>{compra.correo.adjunto}</strong>
                      <span>
                        Archivo PDF adjunto · Incluye {compra.correo.cantidad} códigos QR de acceso
                      </span>
                    </div>
                    <button type="button" className="btn-descargar">
                      Descargar Adjunto
                    </button>
                  </div>
                </div>

                <div className="pie-confirmacion">
                  <button
                    type="button"
                    className="btn-secundario"
                    onClick={volverAlFormulario}
                  >
                    ← Realizar una nueva compra
                  </button>
                </div>
              </section>
            ) : (
              <section className="tarjeta-principal cliente-email">
                <div className="cuerpo-mail">
                  <p>
                    {compra.errorCorreo
                      ? `La compra está confirmada, pero no se pudo enviar el correo: ${compra.errorCorreo}`
                      : 'El correo de confirmación se envía cuando se valida el pago en boletería.'}
                  </p>
                </div>

                <div className="pie-confirmacion">
                  <button
                    type="button"
                    className="btn-secundario"
                    onClick={volverAlFormulario}
                  >
                    ← Realizar una nueva compra
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
