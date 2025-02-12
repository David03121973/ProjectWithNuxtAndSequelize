// controllers/usuarioController.js
/* global process */
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const usuarioService = require('../services/usuarioService');
/**
 * Obtener todos los usuarios
 */
const getUsuarios = async (req, res) => {
    try {
        // Obtener los usuarios desde el servicio
        const usuarios = await usuarioService.getAllUsuarios();

        // Verificar si hay usuarios
        if (!usuarios || usuarios.length === 0) {
            return res.status(200).json([]); // Retornar un array vacío si no hay usuarios
        }

        return res.status(200).json(usuarios); // Retornar la lista de usuarios
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};

/**
 * Obtener un usuario por ID
 */
const getUsuarioById = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros
    try {
        const usuario = await usuarioService.getUsuarioById(id);

        // Verificar si el usuario fue encontrado
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json(usuario); // Retornar el usuario encontrado
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return res.status(500).json({ message: "Error al obtener el usuario", error });
    }
};

/**
 * Crear un nuevo usuario
 */
const createUsuario = async (req, res) => {
  const { nombre_usuario, email, contrasenna } = req.body;

  // Validar entrada
  if (!nombre_usuario || !email || !contrasenna) {
    return res.status(400).json({
      message: "El nombre, email o contraseña no pueden ser nulos",
    });
  }

  // Verificar si el nombre de usuario ya existe
  try {
    const usuarioExists = await usuarioService.usuarioExists(nombre_usuario);
    if (usuarioExists) {
      return res.status(400).json({
        message: `Ya existe un usuario con el nombre de usuario: ${nombre_usuario}`,
      });
    }
  } catch (error) {
    console.error("Error al verificar el nombre de usuario:", error);
    return res.status(500).json({
      message: "Error al crear el usuario",
      error,
    });
  }

  // Verificar si el email ya existe
  try {
    const emailExists = await usuarioService.emailExists(email);
    if (emailExists) {
      return res.status(400).json({
        message: "El email ya existe",
      });
    }
  } catch (error) {
    console.error("Error al verificar el email:", error);
    return res.status(500).json({
      message: "Error al crear el usuario",
      error,
    });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(contrasenna, 10);

  const usuarioData = {
    nombre_usuario,
    email,
    contrasenna: hashedPassword,
  };

  try {
    // Aquí iría la lógica para crear el usuario
    const newUsuario = await usuarioService.createUsuario(usuarioData);
    return res.status(201).json(newUsuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al crear el usuario: " + error.message,
    });
  }
};

/**
 * Actualizar un usuario
 */
const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, email, contrasenna } = req.body;
  
    // Validar que se proporcione al menos un campo para actualizar
    if (!nombre_usuario && !email && !contrasenna) {
      return res.status(400).json({ message: "Se debe proporcionar al menos un campo para actualizar." });
    }
  
    try {
      // Verificar si el usuario existe
      const usuario = await usuarioService.getUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
  
      // Preparar los datos para la actualización
      const updatedUserData = {};
  
      // Actualizar el nombre de usuario si se proporciona
      if (nombre_usuario) {
        updatedUserData.nombre_usuario = nombre_usuario;
      }
  
      // Actualizar el email si se proporciona
      if (email) {
        updatedUserData.email = email;
      }
  
      // Actualizar la contraseña si se proporciona
      if (contrasenna) {
        const hashedPassword = await bcrypt.hash(contrasenna, 10);
        updatedUserData.contrasenna = hashedPassword;
      }
  
      // Actualizar el usuario
      const updatedUsuario = await usuarioService.updateUsuario(id, updatedUserData);
      if (!updatedUsuario) {
        return res.status(500).json({ message: "No se pudo actualizar el usuario. Verifique los datos." });
      }
  
      // Obtener el usuario actualizado
      const updatedUser  = await usuarioService.getUsuarioById(id);
      return res.status(200).json(updatedUser );
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
  };

/**
 * Eliminar un usuario
 */
const deleteUsuario = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros
    try {
        const result = await usuarioService.deleteUsuario(id);
        if (result) {
            return res.status(204).send(); // No content
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
};

const login = async (req, res) => {
  const { nombre_usuario, contrasenna } = req.body;

  try {
    const usuario = await usuarioService.getUsuarioByNombreUsuario(nombre_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "No se ha encontrado el usuario con el nombre de usuario pasado por parámetros." });
    }

    const isValidPassword = await bcrypt.compare(contrasenna, usuario.contrasenna);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: usuario.id_usuario }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

    const respuesta = {
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email
      },
      token: token,
      refreshToken
    };

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    login
};