const url = `${import.meta.env.VITE_BACKEND_URL}/resenna`;

/**
 * Obtener todas las resennas
 */
async function getAllResennas() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener todas las resennas:", error);
    }
}

/**
 * Obtener una resenna por ID
 * @param {string} id - ID de la resenna a obtener
 */
async function getResennaById(id) {
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener la resenna con ID ${id}:`, error);
    }
}

/**
 * Crear una nueva resenna
 * @param {Object} resennaData - Datos de la resenna a crear
 */
async function createResenna(resennaData) {
    try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
        const response = await fetch(`${url}/createResenna`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // Agregar el token de autenticación en el header
            },
            body: JSON.stringify(resennaData),
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
        console.error("Error al crear la resenna:", error);
    }
}

/**
 * Actualizar una resenna
 * @param {string} id - ID de la resenna a actualizar
 * @param {Object} resennaData - Nuevos datos de la resenna
 */
async function updateResenna(id, resennaData) {
    try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
        const response = await fetch(`${url}/updateResenna/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // Agregar el token de autenticación en el header
            },
            body: JSON.stringify(resennaData),
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
        console.error(`Error al actualizar la resenna con ID ${id}:`, error);
    }
}
/**
 * Eliminar una resenna
 * @param {string} id - ID de la resenna a eliminar
 */
async function deleteResenna(id) {
    try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación del almacenamiento local
        const response = await fetch(`${url}/deleteResenna/${id}`, {
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
        console.error(`Error al eliminar la resenna con ID ${id}:`, error);
    }
}

// Exportar las funciones para su uso en otros módulos
export {
    getAllResennas,
    getResennaById,
    createResenna,
    updateResenna,
    deleteResenna
};
