
const url = `${import.meta.env.VITE_BACKEND_URL}/carta`;

/**
 * Obtener todas las cartas
 */
async function getAllCartas() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener todas las cartas:", error);
    }
}

/**
 * Obtener una carta por ID
 * @param {string} id - ID de la carta a obtener
 */
async function getCartaById(id) {
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener la carta con ID ${id}:`, error);
    }
}

/**
 * Crear una nueva carta
 * @param {Object} cartaData - Datos de la carta a crear
 */
async function createCarta(cartaData) {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
      const response = await fetch(`${url}/createCarta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}` // Agregar el token de autenticación en el header
        },
        body: JSON.stringify(cartaData),
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
      console.error("Error al crear la carta:", error);
    }
  }

/**
 * Actualizar una carta
 * @param {string} id - ID de la carta a actualizar
 * @param {Object} cartaData - Nuevos datos de la carta
 */
async function updateCarta(id, cartaData) {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
      const response = await fetch(`${url}/updateCarta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}` // Agregar el token de autenticación en el header
        },
        body: JSON.stringify(cartaData),
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
      console.error(`Error al actualizar la carta con ID ${id}:`, error);
    }
  }
/**
 * Eliminar una carta
 * @param {string} id - ID de la carta a eliminar
 */
async function deleteCarta(id) {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
      const response = await fetch(`${url}/deleteCarta/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}` // Agregar el token de autenticación en el header
        },
      });
      if (!response.ok) {
        if (response.status === 403) { // Si la respuesta es un error de acceso denegado, navegar hacia "/login"
          localStorage.clear();
          useRouter().push('/login');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.status === 204; // Retorna true si la carta fue eliminada
    } catch (error) {
      console.error(`Error al eliminar la carta con ID ${id}:`, error);
    }
  }

/**
 * Obtener cartas con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Número de cartas por página
 */
async function getCartasWithPagination(page, limit) {
    try {
        const response = await fetch(`${url}/paginated/${page}/${limit}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener cartas en la página ${page}:`, error);
    }
}

/**
 * Obtener cartas filtradas con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Número de cartas por página
 * @param {Object} filters - Filtros de búsqueda (nombre, tipo, arquetipo)
 */
async function getCartasFilteredWithPagination(page, limit, filters) {
    console.log(filters);
    
    try {
        const response = await fetch(`${url}/filtered/${page}/${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener las cartas filtradas:", error);
    }
}

/**
 * Obtener una selección aleatoria de cartas
 * @param {number} cantidad - Número de cartas a obtener
 * @param {string} arquetipo - Arquetipo de las cartas a obtener
 */
async function getCartasAleatorias(cantidad, arquetipo) {
    try {
      const response = await fetch(`${url}/aleatorias/${cantidad}/${arquetipo}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener las cartas aleatorias:", error);
    }
  }

// Exportar las funciones para su uso en otros módulos
export {
    getAllCartas,
    getCartaById,
    createCarta,
    updateCarta,
    deleteCarta,
    getCartasWithPagination,
    getCartasFilteredWithPagination,
    getCartasAleatorias
};