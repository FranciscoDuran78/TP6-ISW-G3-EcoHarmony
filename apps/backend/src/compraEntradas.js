//  ----------------  ETAPA Green ---------------- 
// ---------------- CASO DE PRUEBA 11 ----------------
const validarCantidadEntradas = (cantidad) => {
  if (cantidad > 10) {
    throw new Error('La cantidad de entradas no puede ser mayor a 10');
  }
  return true;
};

export {
  validarCantidadEntradas,
};

