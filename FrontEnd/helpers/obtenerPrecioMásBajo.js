
export function obtenerPrecioMasBajo(ventas) {
    // Si la lista está vacía, retornar "Agotado"
    if (ventas.length === 0) {
      return "Agotado";
    }
  
    // Obtener el precio más bajo
    const precioMasBajo = ventas.reduce((min, venta) => {
      const precioActual = parseFloat(venta.precio_venta);
      return precioActual < min ? precioActual : min;
    }, parseFloat(ventas[0].precio_venta));
  
    // Retornar el precio más bajo como string
    return ("$ " + precioMasBajo.toString());
  }