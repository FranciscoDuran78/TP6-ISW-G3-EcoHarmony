const obtenerPartesFechaArgentina = (fecha = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
}).formatToParts(fecha).reduce((partes, parte) => ({
  ...partes,
  [parte.type]: parte.value,
}), {});

const obtenerCalendarioDisponible = (ahora = new Date()) => {
  const partes = obtenerPartesFechaArgentina(ahora);
  const hoy = `${partes.year}-${partes.month}-${partes.day}`;
  const [anio, mes, dia] = hoy.split('-').map(Number);
  const ultimoDia = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const mesSiguiente = mes === 12 ? 1 : mes + 1;
  const anioSiguiente = mes === 12 ? anio + 1 : anio;
  const maximo = `${anioSiguiente}-${String(mesSiguiente).padStart(2, '0')}-${String(
    Math.min(dia, ultimoDia),
  ).padStart(2, '0')}`;
  const dias = [];

  for (let fecha = hoy; fecha <= maximo;) {
    const date = new Date(`${fecha}T12:00:00.000Z`);
    const esFeriado = fecha.endsWith('-12-25') || fecha.endsWith('-01-01');
    const fueraDeHorario = fecha === hoy && (
      Number(partes.hour) > 17 || (Number(partes.hour) === 17 && Number(partes.minute) > 30)
    );
    const diaSemana = new Intl.DateTimeFormat('es-AR', {
      weekday: 'short', timeZone: 'UTC',
    }).format(date);
    dias.push({
      fechaIso: fecha,
      diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1),
      numero: date.getUTCDate(),
      cerrado: date.getUTCDay() === 1 || esFeriado || fueraDeHorario,
    });

    const siguiente = new Date(`${fecha}T12:00:00.000Z`);
    siguiente.setUTCDate(siguiente.getUTCDate() + 1);
    fecha = siguiente.toISOString().slice(0, 10);
  }
  return dias;
};

export default obtenerCalendarioDisponible;
