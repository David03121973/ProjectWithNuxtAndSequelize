// controllers/resennaController.js

const resennaService = require("../services/resennaService");
const usuarioService = require("../services/usuarioService")

/**
 * Obtener todas las reseñas
 */
const getResennas = async (req, res) => {
    try {
        const resennas = await resennaService.getAllResennas();

        // Verificar si hay usuarios
        if (!resennas || resennas.length === 0) {
            return res.status(200).json([]); // Retornar un array vacío si no hay usuarios
        }

        return res.status(200).json(resennas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las reseñas", error });
    }
};

/**
 * Obtener una reseña por ID
 */
const getResennaById = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros
    try {
        const resenna = await resennaService.getResennaById(id);
        if (!resenna) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        return res.status(200).json(resenna);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener la reseña", error });
    }
};

/**
 * Crear una nueva reseña
 */
const createResenna = async (req, res) => {
    const { descripcion, valoracion, id_usuario } = req.body; // Obtener los datos de la reseña desde el cuerpo de la solicitud

    // Validar campos
    if (!descripcion || !valoracion || !id_usuario) {
        return res.status(400).json({ message: "La descripción, valoración y ID de usuario son obligatorios." });
    }

    // Validar que la valoración esté en el rango permitido
    if (valoracion < 1 || valoracion > 5) {
        return res.status(400).json({ message: "La valoración debe estar entre 1 y 5." });
    }

    try {
        // Verificar si el usuario existe
        const usuario = await usuarioService.getUsuarioById(id_usuario);
        
        
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const resennaData = { descripcion, valoracion, id_usuario }; // Preparar los datos para la creación
        const newResenna = await resennaService.createResenna(resennaData);
        return res.status(201).json(newResenna);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear la reseña", error });
    }
};

/**
 * Actualizar una reseña
 */
const updateResenna = async (req, res) => {
    const { id } = req.params;
    const { descripcion, valoracion, id_usuario } = req.body;

    // Validar que se proporcione al menos un campo para actualizar
    if (!descripcion && !valoracion && !id_usuario) {
        return res.status(400).json({ message: "Se debe proporcionar al menos un campo para actualizar." });
    }

    try {
        // Obtener la reseña existente
        const resenna = await resennaService.getResennaById(id);
        if (!resenna) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        // Preparar los datos para la actualización
        const updatedResennaData = {};

        // Actualizar la descripción si se proporciona
        if (descripcion) {
            updatedResennaData.descripcion = descripcion;
        }

        // Actualizar la valoración si se proporciona
        if (valoracion) {
            updatedResennaData.valoracion = valoracion;
        }

        // Actualizar el id_usuario si se proporciona
        if (id_usuario) {
            updatedResennaData.id_usuario = id_usuario;
        }

        // Actualizar la reseña
        const updatedResenna = await resennaService.updateResenna(id, updatedResennaData);
        return res.status(200).json(updatedResenna);
    } catch (error) {
        console.error("Error al actualizar la reseña:", error);
        return res.status(500).json({ message: "Error al actualizar la reseña", error });
    }
};

/**
 * Eliminar una reseña
 */
const deleteResenna = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros
    try {
        const result = await resennaService.deleteResenna(id);
        if (result) {
            return res.status(204).send(); // No content
        } else {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la reseña", error });
    }
};

module.exports = {
    getResennas,
    getResennaById,
    createResenna,
    updateResenna,
    deleteResenna,
};