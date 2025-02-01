const { Sequelize } = require('sequelize');

// Configuración de la base de datos local
const localSequelize = new Sequelize('Ventas_web_cartas', 'postgres', 'pg', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

// Configuración de la base de datos de Supabase
const supabaseSequelize = new Sequelize('postgres', 'postgres.agdlnnlgjlhxaqpvrxkz', 'Floqui*0312', {
  host: 'aws-0-us-west-1.pooler.supabase.com',
  dialect: 'postgres',
  logging: false,
});

// Función para copiar datos de una tabla
async function copyTableData(tableName, localSequelize, supabaseSequelize) {
  try {
    // Seleccionar todos los datos de la tabla local
    const localData = await localSequelize.query(`SELECT * FROM "${tableName}"`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (localData.length > 0) {
      // Truncar la tabla en Supabase antes de insertar los datos
      await supabaseSequelize.query(`TRUNCATE TABLE "${tableName}" CASCADE`, {
        type: Sequelize.QueryTypes.DELETE,
      });

      // Insertar los datos en la tabla de Supabase
      for (const row of localData) {
        const columns = Object.keys(row).map((col) => `"${col}"`).join(', ');
        const values = Object.values(row)
          .map((value) => {
            if (value instanceof Date) {
              return `'${value.toISOString()}'`;
            } else if (typeof value === 'string') {
              // Escapar comillas simples en cadenas de texto
              return `'${value.replace(/'/g, "''")}'`;
            } else if (value === null || value === undefined) {
              return 'NULL';
            } else {
              return value;
            }
          })
          .join(', ');

        await supabaseSequelize.query(
          `INSERT INTO "${tableName}" (${columns}) VALUES (${values})`,
          {
            type: Sequelize.QueryTypes.INSERT,
          }
        );
      }

      console.log(`Datos de la tabla ${tableName} copiados exitosamente.`);
    } else {
      console.log(`La tabla ${tableName} está vacía.`);
    }
  } catch (error) {
    console.error(`Error al copiar datos de la tabla ${tableName}:`, error);
  }
}

// Función principal para migrar todas las tablas en el orden especificado
async function migrateData() {
  try {
    // Definir manualmente las tablas y el orden de migración
    const tables = ['usuarios', 'resennas', 'carta', 'venta'];

    // Iterar sobre las tablas y copiar los datos
    for (const tableName of tables) {
      console.log(`Copiando datos de la tabla: ${tableName}`);
      await copyTableData(tableName, localSequelize, supabaseSequelize);
    }

    console.log('Migración completada exitosamente.');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await localSequelize.close();
    await supabaseSequelize.close();
  }
}

// Ejecutar la migración
migrateData();