const url = `${import.meta.env.VITE_BACKEND_URL}/Usuario`;

/**
 * Crear un nuevo usuario
 * @param {Object} userData - Datos del usuario a crear
 */
async function createUsuario(userData) {
    try {
        const response = await fetch(`${url}/createUsuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw response;
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Obtener todos los usuarios
 */
async function getUsuarios() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}`, {
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
        console.error("Error al obtener los usuarios:", error);
    }
}

/**
 * Obtener un usuario por ID
 * @param {string} id - ID del usuario a obtener
 */
async function getUsuarioById(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/${id}`, {
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
        console.error(`Error al obtener el usuario con ID ${id}:`, error);
    }
}

/**
 * Actualizar un usuario
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} userData - Nuevos datos del usuario
 */
async function updateUsuario(id, userData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/updateUsuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify(userData),
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
        console.error(`Error al actualizar el usuario con ID ${id}:`, error);
    }
}

/**
 * Eliminar un usuario
 * @param {string} id - ID del usuario a eliminar
 */
async function deleteUsuario(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/deleteUsuario/${id}`, {
            method: 'DELETE',
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
        return response.status === 204; // Retorna true si el usuario fue eliminado
    } catch (error) {
        console.error(`Error al eliminar el usuario con ID ${id}:`, error);
    }
}

/**
 * Iniciar sesión
 * @param {Object} userData - Datos del usuario para iniciar sesión
 */
async function login(userData) {
    try {
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
}

// Exportar las funciones para su uso en otros módulos
export {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    login,
};