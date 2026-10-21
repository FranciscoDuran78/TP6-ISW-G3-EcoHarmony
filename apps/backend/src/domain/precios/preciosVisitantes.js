import calcularPrecioEntrada from './calcularPrecioEntrada.js';

const calcularPreciosVisitantes = (visitantes) => visitantes.map((visitante) => ({
  ...visitante,
  precio: calcularPrecioEntrada(visitante.edad, visitante.tipoPase),
}));

export { calcularPreciosVisitantes };
