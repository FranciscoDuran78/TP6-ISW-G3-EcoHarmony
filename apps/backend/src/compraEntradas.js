//  ----------------  ETAPA GREEN ---------------- 
// ---------------- CASO DE PRUEBA 10 ----------------
const validarCantidadEntradas = (cantidad) => {
  if (cantidad > 10) {
    throw new Error('La cantidad de entradas no puede ser mayor a 10');
  }
  return true;
};

module.exports = {
  validarCantidadEntradas,
};
