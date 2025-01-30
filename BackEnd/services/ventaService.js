// services/ventaService.js

const Venta = require("../models/venta"); // Importar el modelo de venta
const Usuario = require("../models/usuario"); // Importar el modelo de usuario
const Carta = require("../models/carta"); // Importar el modelo de carta

/**
 * Obtener todas las ventas
 */
const getAllVentas = async () => {
  try {
      const ventas = await Venta.findAll({
          include: [
              {
                  model: Carta,
                  as: "carta",
                  required: true
              },
              {
                  model: Usuario,
                  as: 'vendedor',
                  required: true,
                  include: [
                      {
                          model: Resenna,
                          as: 'resennas',
                          required: false
                      }
                  ]
              },
              {
                  model: Usuario,
                  as: 'comprador',
                  required: false
              }
          ]
      });

      // Calcular el promedio de valoraciones del vendedor para cada venta
      ventas.forEach(venta => {
          const vendedor = venta.vendedor;
          if (vendedor && vendedor.resennas && vendedor.resennas.length > 0) {
              if (vendedor.resennas.length < 5) {
                  vendedor.dataValues.valoracionPromedio = 3; // Si hay menos de 5 reseñas, el promedio es 3
              } else {
                  const totalValoraciones = vendedor.resennas.reduce((sum, resenna) => sum + resenna.valoracion, 0);
                  vendedor.dataValues.valoracionPromedio = totalValoraciones / vendedor.resennas.length;
              }
          } else {
              vendedor.dataValues.valoracionPromedio = 3; // Si no hay reseñas, el promedio es 0
          }
      });

      return ventas;
  } catch (error) {
      console.log("Error en los servicios de getAllVentas: ", error);
      throw error;
  }
};

/**
 * Obtener una venta por ID
 */
const getVentaById = async (id) => {
  try {
      const venta = await Venta.findOne({
          where: { id_venta: id },
          include: [
              {
                  model: Carta,
                  as: 'carta',
                  required: true
              },
              {
                  model: Usuario,
                  as: 'vendedor',
                  required: true,
                  include: [
                      {
                          model: Resenna,
                          as: 'resennas',
                          required: false
                      }
                  ]
              },
              {
                  model: Usuario,
                  as: 'comprador',
                  required: false
              }
          ]
      });

      if (!venta) {
          return null;
      }

      // Calcular el promedio de valoraciones del vendedor
      const vendedor = venta.vendedor;
      if (vendedor && vendedor.resennas && vendedor.resennas.length > 0) {
          if (vendedor.resennas.length < 5) {
              vendedor.dataValues.valoracionPromedio = 3; // Si hay menos de 5 reseñas, el promedio es 3
          } else {
              const totalValoraciones = vendedor.resennas.reduce((sum, resenna) => sum + resenna.valoracion, 0);
              vendedor.dataValues.valoracionPromedio = totalValoraciones / vendedor.resennas.length;
          }
      } else {
          vendedor.dataValues.valoracionPromedio = 3; // Si no hay reseñas, el promedio es 0
      }

      return venta;
  } catch (error) {
      console.error("Error en los servicios de getVentaById: ", error);
      throw error;
  }
};

const createVenta = async (ventaData) => {
    try {
        return await Venta.create(ventaData); // Ya maneja el campo `estado` si se pasa en `ventaData`
    } catch (error) {
        console.log("Error en el servicio de crear venta: ", error);
        throw error;
    }
};

const updateVenta = async (id, ventaData) => {
    try {
        const venta = await Venta.findOne({ where: { id_venta: id } });
        if (venta) {
            return await venta.update(ventaData); // Ya maneja el campo `estado` si se pasa en `ventaData`
        }
        return null;
    } catch (error) {
        console.log("Error en el servicio de actualizar venta: ", error);
        throw error;
    }
};

/**
 * Eliminar una venta
 */
const deleteVenta = async (id) => {
    try {
        const venta = await Venta.findOne({ where: { id_venta: id } });
        if (venta) {
            return await venta.destroy(); // Elimina la venta si se encuentra
        }
        return null; // Si no se encuentra la venta
    } catch (error) {
        console.log("Error en el servicio de eliminar venta: ", error);
        throw error; // Lanza el error para que el controlador pueda manejarlo
    }
};
/**
 * Obtener todas las ventas por ID de carta
 */
const getVentasByCartaId = async (id_carta) => {
  try {
      const ventas = await Venta.findAll({
          where: {
              id_carta,
              id_usuario_comprador: null,
          },
          order: [['precio_venta', 'ASC']],
          include: [
              {
                  model: Carta,
                  as: 'carta',
                  required: true
              },
              {
                  model: Usuario,
                  as: 'vendedor',
                  required: true,
                  include: [
                      {
                          model: Resenna,
                          as: 'resennas',
                          required: false
                      }
                  ]
              },
              {
                  model: Usuario,
                  as: 'comprador',
                  required: false
              }
          ]
      });

      // Calcular el promedio de valoraciones del vendedor para cada venta
      ventas.forEach(venta => {
          const vendedor = venta.vendedor;
          if (vendedor && vendedor.resennas && vendedor.resennas.length > 0) {
              if (vendedor.resennas.length < 5) {
                  vendedor.dataValues.valoracionPromedio = 3; // Si hay menos de 5 reseñas, el promedio es 3
              } else {
                  const totalValoraciones = vendedor.resennas.reduce((sum, resenna) => sum + resenna.valoracion, 0);
                  vendedor.dataValues.valoracionPromedio = totalValoraciones / vendedor.resennas.length;
              }
          } else {
              vendedor.dataValues.valoracionPromedio = 3; // Si no hay reseñas, el promedio es 0
          }
      });

      return ventas;
  } catch (error) {
      console.log("Error en los servicios de getVentasByCartaId: ", error);
      throw error;
  }
};

  /**
 * Obtener todas las compras por ID de carta
 */
  const { Op } = require('sequelize'); // Asegúrate de importar Op desde sequelize
const Resenna = require("../models/resenna");

const getComprasByCartaId = async (id_carta) => {
  try {
      const compras = await Venta.findAll({
          where: {
              id_carta,
              id_usuario_comprador: { [Op.ne]: null },
          },
          order: [['precio_venta', 'ASC']],
          include: [
              {
                  model: Carta,
                  as: 'carta',
                  required: true
              },
              {
                  model: Usuario,
                  as: 'vendedor',
                  required: true,
                  include: [
                      {
                          model: Resenna,
                          as: 'resennas',
                          required: false
                      }
                  ]
              },
              {
                  model: Usuario,
                  as: 'comprador',
                  required: true
              }
          ]
      });

      // Calcular el promedio de valoraciones del vendedor para cada compra
      compras.forEach(compra => {
          const vendedor = compra.vendedor;
          if (vendedor && vendedor.resennas && vendedor.resennas.length > 0) {
              if (vendedor.resennas.length < 5) {
                  vendedor.dataValues.valoracionPromedio = 3; // Si hay menos de 5 reseñas, el promedio es 3
              } else {
                  const totalValoraciones = vendedor.resennas.reduce((sum, resenna) => sum + resenna.valoracion, 0);
                  vendedor.dataValues.valoracionPromedio = totalValoraciones / vendedor.resennas.length;
              }
          } else {
              vendedor.dataValues.valoracionPromedio = 3; // Si no hay reseñas, el promedio es 0
          }
      });

      return compras;
  } catch (error) {
      console.log("Error en los servicios de getComprasByCartaId: ", error);
      throw error;
  }
};

const getVentasByVendedor = async (id_vendedor) => {
  try {
      const ventas = await Venta.findAll({
          where: {
              id_usuario_vendedor: id_vendedor,
          },
          limit: 20,
          include: [
              {
                  model: Carta,
                  as: 'carta',
                  required: true
              },
              {
                  model: Usuario,
                  as: 'vendedor',
                  required: true,
                  include: [
                      {
                          model: Resenna,
                          as: 'resennas',
                          required: false
                      }
                  ]
              },
              {
                  model: Usuario,
                  as: 'comprador',
                  required: false
              }
          ]
      });

      // Calcular el promedio de valoraciones del vendedor para cada venta
      ventas.forEach(venta => {
          const vendedor = venta.vendedor;
          if (vendedor && vendedor.resennas && vendedor.resennas.length > 0) {
              if (vendedor.resennas.length < 5) {
                  vendedor.dataValues.valoracionPromedio = 3; // Si hay menos de 5 reseñas, el promedio es 3
              } else {
                  const totalValoraciones = vendedor.resennas.reduce((sum, resenna) => sum + resenna.valoracion, 0);
                  vendedor.dataValues.valoracionPromedio = totalValoraciones / vendedor.resennas.length;
              }
          } else {
              vendedor.dataValues.valoracionPromedio = 3; // Si no hay reseñas, el promedio es 0
          }
      });

      return ventas;
  } catch (error) {
      console.log("Error en los servicios de getVentasByVendedor: ", error);
      throw error;
  }
};

const getVentasByComprador = async (id_comprador) => {
  try {
      const ventas = await Venta.findAll({
          where: {
              id_usuario_comprador: id_comprador,
          },
          limit: 20,
          include: [
              {
                  model: Carta,
                  as: 'carta',
                  required: true
              },
              {
                  model: Usuario,
                  as: 'vendedor',
                  required: true,
                  include: [
                      {
                          model: Resenna,
                          as: 'resennas',
                          required: false
                      }
                  ]
              },
              {
                  model: Usuario,
                  as: 'comprador',
                  required: true
              }
          ]
      });

      // Calcular el promedio de valoraciones del vendedor para cada venta
      ventas.forEach(venta => {
          const vendedor = venta.vendedor;
          if (vendedor && vendedor.resennas && vendedor.resennas.length > 0) {
              if (vendedor.resennas.length < 5) {
                  vendedor.dataValues.valoracionPromedio = 3; // Si hay menos de 5 reseñas, el promedio es 3
              } else {
                  const totalValoraciones = vendedor.resennas.reduce((sum, resenna) => sum + resenna.valoracion, 0);
                  vendedor.dataValues.valoracionPromedio = totalValoraciones / vendedor.resennas.length;
              }
          } else {
              vendedor.dataValues.valoracionPromedio = 3; // Si no hay reseñas, el promedio es 0
          }
      });

      return ventas;
  } catch (error) {
      console.log("Error en los servicios de getVentasByComprador: ", error);
      throw error;
  }
};
  
module.exports = {
    getAllVentas,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta,
    getVentasByCartaId,
    getComprasByCartaId,
    getVentasByVendedor,
    getVentasByComprador
};