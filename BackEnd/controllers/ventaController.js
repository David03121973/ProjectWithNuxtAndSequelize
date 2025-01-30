// controllers/ventaController.js

const ventaService = require("../services/ventaService");

/**
 * Obtener todas las ventas
 */
const getVentas = async (req, res) => {
    try {
        const ventas = await ventaService.getAllVentas();

        // Verificar si hay ventas
        if (!ventas || ventas.length === 0) {
            return res.status(200).json([]); // Retornar un array vacío si no hay ventas
        }

        return res.status(200).json(ventas);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        return res.status(500).json({ message: "Error al obtener las ventas", error });
    }
};

/**
 * Obtener una venta por ID
 */
const getVentaById = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros
    try {
        const venta = await ventaService.getVentaById(id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        return res.status(200).json(venta);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener la venta", error });
    }
};

const createVenta = async (req, res) => {
    const { id_carta, id_usuario_vendedor, id_usuario_comprador, precio_venta, fecha_venta, estado } = req.body;

    // Validar campos
    if (!id_carta || !id_usuario_vendedor || !precio_venta || !estado) {
        return res.status(400).json({ message: "Los campos id_carta, id_usuario_vendedor, precio_venta y estado son obligatorios." });
    }

    try {
        const ventaData = { id_carta, id_usuario_vendedor, id_usuario_comprador, precio_venta, fecha_venta, estado };
        const newVenta = await ventaService.createVenta(ventaData);
        return res.status(201).json(newVenta);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear la venta", error });
    }
};

const updateVenta = async (req, res) => {
    const { id } = req.params;
    const { id_carta, id_usuario_vendedor, id_usuario_comprador, precio_venta, fecha_venta, estado } = req.body;

    // Validar que se proporcione al menos un campo para actualizar
    if (!id_carta && !id_usuario_vendedor && !id_usuario_comprador && !precio_venta && !fecha_venta && !estado) {
        return res.status(400).json({ message: "Se debe proporcionar al menos un campo para actualizar." });
    }

    try {
        // Obtener la venta existente
        const venta = await ventaService.getVentaById(id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        // Preparar los datos para la actualización
        const updatedVentaData = {};

        // Actualizar el id_carta si se proporciona
        if (id_carta) {
            updatedVentaData.id_carta = id_carta;
        }

        // Actualizar el id_usuario_vendedor si se proporciona
        if (id_usuario_vendedor) {
            updatedVentaData.id_usuario_vendedor = id_usuario_vendedor;
        }

        // Actualizar el id_usuario_comprador si se proporciona
        if (id_usuario_comprador) {
            updatedVentaData.id_usuario_comprador = id_usuario_comprador;
        }

        // Actualizar el precio_venta si se proporciona
        if (precio_venta) {
            updatedVentaData.precio_venta = precio_venta;
        }

        // Actualizar la fecha_venta si se proporciona
        if (fecha_venta) {
            updatedVentaData.fecha_venta = fecha_venta;
        }

        // Actualizar el estado si se proporciona
        if (estado) {
            updatedVentaData.estado = estado;
        }

        // Actualizar la venta
        const updatedVenta = await ventaService.updateVenta(id, updatedVentaData);
        return res.status(200).json(updatedVenta);
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        return res.status(500).json({ message: "Error al actualizar la venta", error });
    }
};

/**
 * Eliminar una venta
 */
const deleteVenta = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros
    try {
        const result = await ventaService.deleteVenta(id);
        if (result) {
            return res.status(204).send(); // No content
        } else {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        return res.status(500).json({ message: "Error al eliminar la venta", error });
    }
};
/**
 * Obtener todas las ventas por ID de carta
 */
const getVentasByCartaId = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la carta desde los parámetros
  
    // Validar que el ID sea un número
    if (isNaN(id)) {
      return res.status(400).json({ message: "El ID de la carta debe ser un número." });
    }
  
    try {
      const ventas = await ventaService.getVentasByCartaId(id);
  
      // Verificar si hay ventas
      if (!ventas || ventas.length === 0) {
        return res.status(200).json([]); // Retornar un array vacío si no hay ventas
      }
  
      return res.status(200).json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas por ID de carta:", error);
      return res.status(500).json({ message: "Error al obtener las ventas", error });
    }
  };

  /**
 * Obtener todas las compras por ID de carta
 */
  const getComprasByCartaId = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la carta desde los parámetros
  
    // Validar que el ID sea un número
    if (isNaN(id)) {
      return res.status(400).json({ message: "El ID de la carta debe ser un número." });
    }
  
    try {
      const ventas = await ventaService.getComprasByCartaId(id);
  
      // Verificar si hay ventas
      if (!ventas || ventas.length === 0) {
        return res.status(200).json([]); // Retornar un array vacío si no hay ventas
      }
  
      return res.status(200).json(ventas);
    } catch (error) {
      console.error("Error al obtener las compras por ID de carta:", error);
      return res.status(500).json({ message: "Error al obtener las compras", error });
    }
  };

  const getVentasByVendedor = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros
  
    // Validar que el ID sea un número entero positivo
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "El ID del usuario debe ser un número entero positivo" });
    }
  
    try {
      const ventas = await ventaService.getVentasByVendedor(id);
      if (!ventas || ventas.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado o no tiene ventas" });
      }
      return res.status(200).json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas del vendedor:", error);
      return res.status(500).json({ message: "Error al obtener las ventas", error });
    }
  };

  const getVentasByComprador = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros
  
    // Validar que el ID sea un número entero positivo
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "El ID del usuario debe ser un número entero positivo" });
    }
  
    try {
      const ventas = await ventaService.getVentasByComprador(id);
      if (!ventas || ventas.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado o no tiene ventas" });
      }
      return res.status(200).json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas del comprador:", error);
      return res.status(500).json({ message: "Error al obtener las ventas", error });
    }
  };

module.exports = {
    getVentas,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta,
    getVentasByCartaId,
    getComprasByCartaId,
    getVentasByVendedor,
    getVentasByComprador
};