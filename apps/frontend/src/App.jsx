import React, { useState } from 'react';
import obtenerCalendarioDisponible from './calendario.js';
import './App.css';

const PRECIOS_BASE = {
  Regular: 10000,
  VIP: 20000,
};

const calcularPrecioVisitante = (edad, tipoPase) => {
  const edadNumerica = Number(edad);
  const precioBase = PRECIOS_BASE[tipoPase] || 0;

  if (edad === '' || Number.isNaN(edadNumerica) || edadNumerica < 0) {
    return 0;
  }
  if (edadNumerica <= 3) {
    return 0;
  }
  if (edadNumerica <= 15 || edadNumerica >= 60) {
    return precioBase * 0.5;
  }
  return precioBase;
};

const obtenerEtiquetaDescuento = (edad) => {
  const edadNumerica = Number(edad);
  if (edad === '' || Number.isNaN(edadNumerica)) return 'Sin calcular';
  if (edadNumerica <= 3) return '100% OFF (Menor de 3 años)';
  if (edadNumerica <= 15) return '50% OFF (Tarifa Menor)';
  if (edadNumerica >= 60) return '50% OFF (Tarifa Jubilado)';
  return 'Tarifa Completa';
};

function App() {
  const [pasoActual, setPasoActual] = useState('FORMULARIO');
  const [diasCalendario] = useState(obtenerCalendarioDisponible);
  const [fechaVisita, setFechaVisita] = useState(() => (
    diasCalendario.find((dia) => !dia.cerrado)?.fechaIso || ''
  ));
  const [cantidadEntradas, setCantidadEntradas] = useState(3);
  const [visitantes, setVisitantes] = useState([
    { id: 1, edad: 28, tipoPase: 'VIP' },
    { id: 2, edad: 10, tipoPase: 'Regular' },
    { id: 3, edad: 2, tipoPase: 'Regular' },
  ]);
  const [formaPago, setFormaPago] = useState('TARJETA');
  const [mensajeError, setMensajeError] = useState('');
  const [compraConfirmada, setCompraConfirmada] = useState(null);
  const [resultadoTransaccion, setResultadoTransaccion] = useState(null);

  const actualizarCantidadEntradas = (nuevaCantidad) => {
    const valor = Number(nuevaCantidad);
    setCantidadEntradas(valor);

    if (valor > 10) {
      setMensajeError('La cantidad de entradas no puede ser mayor a 10 por fecha.');
      return;
    }

    if (valor < 1) {
      setMensajeError('La cantidad de entradas debe ser al menos 1.');
      return;
    }

    setMensajeError('');
    const nuevosVisitantes = [...visitantes];

    if (valor > nuevosVisitantes.length) {
      for (let i = nuevosVisitantes.length; i < valor; i += 1) {
        nuevosVisitantes.push({ id: i + 1, edad: 25, tipoPase: 'Regular' });
      }
    } else {
      nuevosVisitantes.length = valor;
    }

    setVisitantes(nuevosVisitantes);
  };

  const actualizarVisitante = (indice, campo, valor) => {
    const copiaVisitantes = [...visitantes];
    copiaVisitantes[indice] = {
      ...copiaVisitantes[indice],
      [campo]: valor,
    };
    setVisitantes(copiaVisitantes);
  };

  const totalCompra = visitantes.reduce(
    (acumulador, vis) => acumulador + calcularPrecioVisitante(vis.edad, vis.tipoPase),
    0,
  );

  const enviarCompra = async () => {
    setMensajeError('');
    try {
      const respuesta = await fetch('/api/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaVisita,
          visitantes: visitantes.map(({ edad, tipoPase }) => ({ edad: Number(edad), tipoPase })),
          formaPago,
        }),
      });
      const resultado = await respuesta.json();
      if (resultado.compra?.pago) setResultadoTransaccion(resultado.compra.pago);
      if (!respuesta.ok) {
        setMensajeError(resultado.error || 'No se pudo procesar la compra.');
        return;
      }
      setCompraConfirmada(resultado.compra);
      setPasoActual('CONFIRMACION');
    } catch {
      setMensajeError('No se pudo contactar al servicio de compras. Intentá nuevamente.');
    }
  };

  const manejarConfirmarFormulario = async (evento) => {
    evento.preventDefault();

    if (!fechaVisita) {
      setMensajeError('Debe seleccionar una fecha de visita válida.');
      return;
    }

    if (!Number.isInteger(cantidadEntradas) || cantidadEntradas > 10 || cantidadEntradas < 1) {
      setMensajeError('La cantidad de entradas debe ser de 1 a 10.');
      return;
    }

    const faltaEdad = visitantes.some((vis) => vis.edad === '' || vis.edad === null);

    if (faltaEdad) {
      setMensajeError('Cada visitante debe indicar su edad.');
      return;
    }

    const faltaPase = visitantes.some((vis) => !['VIP', 'Regular'].includes(vis.tipoPase));
    if (faltaPase) {
      setMensajeError('Cada visitante debe indicar tipo de pase VIP o Regular.');
      return;
    }

    if (!formaPago) {
      setMensajeError('Debe seleccionar una forma de pago para continuar.');
      return;
    }

    setMensajeError('');

    if (formaPago === 'TARJETA') {
      setPasoActual('MERCADO_PAGO');
    } else {
      await enviarCompra();
    }
  };

  return (
    <div className="ecoharmony-app">
      {/* Barra auxiliar para navegar rápido entre vistas y sacar capturas */}
      <div className="barra-prototipo">
        <span>🛠️ Vista de Prototipo PO:</span>
        <button
          type="button"
          className={pasoActual === 'FORMULARIO' ? 'btn-proto activo' : 'btn-proto'}
          onClick={() => {
            setMensajeError('');
            setPasoActual('FORMULARIO');
          }}
        >
          1. Formulario de Compra
        </button>
        <button
          type="button"
          className="btn-proto alerta"
          onClick={() => {
            setPasoActual('FORMULARIO');
            setFormaPago('');
            setMensajeError('Error: Debe seleccionar una forma de pago (Efectivo o Tarjeta).');
          }}
        >
          1b. Ver Estado de Error
        </button>
        <button
          type="button"
          className={pasoActual === 'MERCADO_PAGO' ? 'btn-proto activo' : 'btn-proto'}
          onClick={() => {
            setFormaPago('TARJETA');
            setPasoActual('MERCADO_PAGO');
          }}
        >
          2. Pasarela Mercado Pago
        </button>
        <button
          type="button"
          className={pasoActual === 'CONFIRMACION' ? 'btn-proto activo' : 'btn-proto'}
          onClick={() => setPasoActual('CONFIRMACION')}
        >
          3. Confirmación + Email Adjunto
        </button>
      </div>

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

            {mensajeError && (
              <div className="alerta-error" role="alert">
                <strong>⚠️ No se pudo procesar la solicitud:</strong> {mensajeError}
              </div>
            )}

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
                  {diasCalendario.map((item) => {
                    const estaSeleccionado = fechaVisita === item.fechaIso;
                    let claseDia = 'celda-dia';
                    if (item.cerrado) claseDia += ' dia-deshabilitado';
                    if (estaSeleccionado) claseDia += ' dia-seleccionado';

                    return (
                      <button
                        key={item.fechaIso}
                        type="button"
                        disabled={item.cerrado}
                        className={claseDia}
                        onClick={() => setFechaVisita(item.fechaIso)}
                      >
                        <span className="nombre-dia">{item.diaSemana}</span>
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
                    Máximo permitido: 10 entradas por usuario para una misma fecha.
                  </p>
                </div>
                <input
                  id="input-cantidad"
                  type="number"
                  min="1"
                  max="15"
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
                    const subtotal = calcularPrecioVisitante(
                      visitante.edad,
                      visitante.tipoPase,
                    );

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
                    ${totalCompra.toLocaleString('es-AR')}
                  </strong>
                </div>

                <button type="submit" className="btn-confirmar">
                  {formaPago === 'TARJETA'
                    ? 'Continuar a Mercado Pago'
                    : 'Confirmar Reserva de Entradas'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* PANTALLA 2: SIMULACIÓN DE PASARELA MERCADO PAGO */}
        {pasoActual === 'MERCADO_PAGO' && (
          <section className="tarjeta-principal vista-mp">
            <div className="banner-mp">
              <div>
                <span className="badge-mp">Módulo Externo Simulado</span>
                <h3>Mercado Pago · Checkout Seguro</h3>
              </div>
              <span className="monto-mp">${totalCompra.toLocaleString('es-AR')}</span>
            </div>

            <div className="cuerpo-mp">
              <div className="detalle-transaccion-mp">
                <h4>Resumen de la Transacción</h4>
                <ul>
                  <li>
                    <span>Comercio:</span>
                    <strong>EcoHarmony Park S.A.</strong>
                  </li>
                  <li>
                    <span>Concepto:</span>
                    <strong>{visitantes.length}x Entradas al Parque</strong>
                  </li>
                  <li>
                    <span>Fecha de visita:</span>
                    <strong>{fechaVisita}</strong>
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
                      value={`1 cuota de $${totalCompra.toLocaleString('es-AR')}`}
                    />
                  </div>
                </div>
              </div>

              <div className="acciones-mp">
                {resultadoTransaccion?.estado === 'RECHAZADA' && (
                  <p role="alert">
                    Transacción rechazada: {resultadoTransaccion.codigo || 'resultado no disponible'}.
                    La compra no fue confirmada.
                  </p>
                )}
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setPasoActual('FORMULARIO');
                    setMensajeError(
                      'Transacción cancelada: El pago con tarjeta fue rechazado o abandonado.',
                    );
                  }}
                >
                  Simular Rechazo / Volver
                </button>
                <button
                  type="button"
                  className="btn-confirmar"
                  onClick={enviarCompra}
                >
                  Pagar ${totalCompra.toLocaleString('es-AR')} y Confirmar
                </button>
              </div>
            </div>
          </section>
        )}

        {/* PANTALLA 3: RESUMEN DE COMPRA Y SIMULACIÓN DE EMAIL CON ADJUNTO */}
        {pasoActual === 'CONFIRMACION' && (
          <div className="contenedor-confirmacion">
            <section className="tarjeta-principal resumen-exito">
              <div className="icono-exito">✓</div>
              <h2>¡Operación Registrada con Éxito!</h2>
              <p className="subtitulo-exito">
                Se procesó tu solicitud para visitar <strong>EcoHarmony Park</strong>.
              </p>

              <div className="grilla-datos-finales">
                <div className="dato-final">
                  <span>Cantidad de entradas compradas</span>
                  <strong>{compraConfirmada?.cantidad || visitantes.length} entradas</strong>
                </div>
                <div className="dato-final">
                  <span>Fecha de visita</span>
                  <strong>{compraConfirmada?.fechaVisita || fechaVisita}</strong>
                </div>
                <div className="dato-final">
                  <span>Medio de pago</span>
                  <strong>
                    {compraConfirmada?.formaPago === 'TARJETA'
                      ? 'Tarjeta de Crédito (Mercado Pago)'
                      : 'Efectivo en Boletería'}
                  </strong>
                </div>
                <div className="dato-final">
                  <span>Total de la compra</span>
                  <strong>${(compraConfirmada?.total ?? totalCompra).toLocaleString('es-AR')}</strong>
                </div>
                <div className="dato-final">
                  <span>Resultado de la transacción</span>
                  <strong>
                    {compraConfirmada?.pago?.estado || 'Pendiente'}
                    {compraConfirmada?.pago?.codigo
                      ? ` · ${compraConfirmada.pago.codigo}`
                      : ''}
                  </strong>
                </div>
                <div className="dato-final">
                  <span>Estado de la compra</span>
                  <strong className={compraConfirmada?.pagada ? 'estado-ok' : 'estado-pendiente'}>
                    {compraConfirmada?.estado === 'CONFIRMADA'
                      ? 'CONFIRMADA'
                      : 'PENDIENTE DE VALIDACIÓN EN BOLETERÍA'}
                  </strong>
                </div>
              </div>
            </section>

            {/* Simulación de Cliente de Correo Electrónico */}
            <section className="tarjeta-principal cliente-email">
              <div className="cabecera-ventana-mail">
                <span>📧 Simulación de Envío de Correo de Confirmación</span>
                <span className="tag-orden">Orden #{compraConfirmada?.id || 'pendiente'}</span>
              </div>

              <div className="metadatos-mail">
                <p>
                  <strong>De:</strong> reservas@ecoharmonypark.com.ar
                </p>
                <p>
                  <strong>Para:</strong> visitante@ecoharmony.com.ar
                </p>
                <p>
                  <strong>Asunto:</strong> Confirmación de compra de entradas - Visita {compraConfirmada?.fechaVisita || fechaVisita}
                </p>
              </div>

              <div className="cuerpo-mail">
                <p>Hola <strong>Bruno</strong>,</p>
                <p>
                  Te enviamos el resumen representativo de tu transacción para ingresar a
                  <strong> EcoHarmony Park</strong> el día <strong>{compraConfirmada?.fechaVisita || fechaVisita}</strong>:
                </p>
                <p>
                  <strong>Total:</strong> ${(compraConfirmada?.total ?? totalCompra).toLocaleString('es-AR')}
                  {' · '}
                  <strong>Transacción:</strong> {compraConfirmada?.pago?.estado || 'PENDIENTE'}
                  {compraConfirmada?.pago?.codigo ? ` (${compraConfirmada.pago.codigo})` : ''}
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
                    {visitantes.map((vis, idx) => (
                      <tr key={vis.id}>
                        <td>Visitante #{idx + 1}</td>
                        <td>{vis.edad} años</td>
                        <td>{vis.tipoPase}</td>
                        <td>{obtenerEtiquetaDescuento(vis.edad)}</td>
                        <td>
                          ${calcularPrecioVisitante(vis.edad, vis.tipoPase).toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4"><strong>TOTAL DE LA TRANSACCIÓN</strong></td>
                      <td><strong>${totalCompra.toLocaleString('es-AR')}</strong></td>
                    </tr>
                  </tfoot>
                </table>

                {/* Archivo Adjunto requerido por el PO */}
                <div className="caja-adjunto">
                  <div className="icono-pdf">📄</div>
                  <div className="info-adjunto">
                    <strong>{compraConfirmada?.correo?.adjunto?.nombre || 'comprobante-entradas.json'}</strong>
                    <span>
                      {compraConfirmada?.correo?.estado === 'FALLIDO'
                        ? `Compra confirmada; correo no enviado: ${compraConfirmada.correo.error}`
                        : `Adjunto simulado · Incluye el resumen de ${compraConfirmada?.cantidad || visitantes.length} entradas`}
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
                  onClick={() => setPasoActual('FORMULARIO')}
                >
                  ← Realizar una nueva compra
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
