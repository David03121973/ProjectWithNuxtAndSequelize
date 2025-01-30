const url = `${import.meta.env.VITE_BACKEND_URL}/venta`;

/**
 * Obtener todas las ventas
 */
async function getAllVentas() {
    try {
        const response = await fetch(`${url}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener todas las ventas:", error);
    }
}

/**
 * Obtener una venta por ID
 * @param {string} id - ID de la venta a obtener
 */
async function getVentaById(id) {
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener la venta con ID ${id}:`, error);
    }
}

/**
 * Crear una nueva venta
 * @param {Object} ventaData - Datos de la venta a crear
 */
async function createVenta(ventaData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/createVenta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                id_carta: ventaData.id_carta,
                id_usuario_vendedor: ventaData.id_usuario_vendedor,
                id_usuario_comprador: ventaData.id_usuario_comprador,
                precio_venta: ventaData.precio_venta,
                fecha_venta: ventaData.fecha_venta,
                estado: ventaData.estado
            }),
        });
        if (!response.ok) {
            if (response.status === 403) { // Si la respuesta es un error de acceso denegado, navegar hacia "/login"
                localStorage.clear();
                useRouter().push('/login');
              }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear la venta:", error);
    }
}

/**
 * Actualizar una venta
 * @param {string} id - ID de la venta a actualizar
 * @param {Object} ventaData - Nuevos datos de la venta
 */
async function updateVenta(id, ventaData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/updateVenta/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                id_carta: ventaData.id_carta,
                id_usuario_vendedor: ventaData.id_usuario_vendedor,
                id_usuario_comprador: ventaData.id_usuario_comprador,
                precio_venta: ventaData.precio_venta,
                fecha_venta: ventaData.fecha_venta,
                estado: ventaData.estado
            }),
        });
        if (!response.ok) {
            if (response.status === 403) { // Si la respuesta es un error de acceso denegado, navegar hacia "/login"
                localStorage.clear();
                useRouter().push('/login');
              }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar la venta con ID ${id}:`, error);
    }
}

/**
 * Eliminar una venta
 * @param {string} id - ID de la venta a eliminar
 */
async function deleteVenta(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/deleteVenta/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.status === 204; // Retorna true si la venta fue eliminada
    } catch (error) {
        if (response.status === 403) { // Si la respuesta es un error de acceso denegado, navegar hacia "/login"
            localStorage.clear();
            useRouter().push('/login');
          }
        console.error(`Error al eliminar la venta con ID ${id}:`, error);
    }
}

/**
 * Obtener todas las ventas por ID de carta
 * @param {string} id - ID de la carta para obtener las ventas asociadas
 */
async function getVentasByCartaId(id) {
    try {
        const response = await fetch(`${url}/getVentasByCarta/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener las ventas para la carta con ID ${id}:`, error);
    }
}

/**
 * Obtener todas las compras por ID de carta
 * @param {string} id - ID de la carta para obtener las ventas
 */
async function getComprasByCartaId(id) {
    try {
      const response = await fetch(`${url}/getComprasByCarta/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener las compras para la carta con ID ${id}:`, error);
    }
  }

  /**
 * Obtener todas las ventas de un vendedor
 * @param {string} id - ID del usuario vendedor
 */
async function getVentasByVendedor(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/getVentasByVendedor/${id}`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        if (!response.ok) {
            if (response.status === 403) { // Si la respuesta es un error de acceso denegado, navegar hacia "/login"
                localStorage.clear();
                useRouter().push('/login');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener las ventas del vendedor con ID ${id}:`, error);
    }
}

/**
 * Obtener todas las ventas de un comprador
 * @param {string} id - ID del usuario comprador
 */
async function getVentasByComprador(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/getVentasByComprador/${id}`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        if (!response.ok) {
            if (response.status === 403) { // Si la respuesta es un error de acceso denegado, navegar hacia "/login"
                localStorage.clear();
                useRouter().push('/login');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener las ventas del comprador con ID ${id}:`, error);
    }
}

// Exportar las funciones para su uso en otros módulos
export {
    getAllVentas,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta,
    getVentasByCartaId,
    getComprasByCartaId,
    getVentasByComprador,
    getVentasByVendedor
};