const url = "http://localhost:4000/venta"; // Base URL para las rutas de venta

async function createVenta(ventaData) {
    try {
        const response = await fetch(`${url}/createVenta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear la venta:", error);
    }
}

async function getAllCartas() {
    try {
        const response = await fetch("http://localhost:4000/carta");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener todas las cartas:", error);
    }
}

// Método para generar una venta y enviarla al backend
async function generarYEnviarVenta(id_carta) {
    // Usuarios disponibles
    const usuarios = [14, 15, 16, 17];

    // Seleccionar un vendedor aleatorio
    const id_usuario_vendedor = usuarios[Math.floor(Math.random() * usuarios.length)];

    // Seleccionar un comprador aleatorio (30% de probabilidad de que exista y diferente al vendedor)
    let id_usuario_comprador = null;
    if (Math.random() < 0.3) {
        const usuariosDisponibles = usuarios.filter(id => id !== id_usuario_vendedor);
        id_usuario_comprador = usuariosDisponibles[Math.floor(Math.random() * usuariosDisponibles.length)];
    }

    // Generar un precio de venta aleatorio entre 0.25 y 20.00 con dos decimales
    const precio_venta = parseFloat((Math.random() * (20.00 - 0.25) + 0.25).toFixed(2));

    // Generar un estado con probabilidades específicas
    const estadoProbabilidad = Math.random();
    let estado;
    if (estadoProbabilidad < 0.5) {
        estado = 'De uso-bueno'; // 50% de probabilidad
    } else if (estadoProbabilidad < 0.8) {
        estado = 'Nuevo'; // 30% de probabilidad
    } else if (estadoProbabilidad < 0.95) {
        estado = 'De uso-dañado'; // 15% de probabilidad
    } else {
        estado = 'De uso-muy-dañado'; // 5% de probabilidad
    }

    // Generar una fecha de venta aleatoria entre 2024-06-01 y 2025-01-01
    const fechaInicio = new Date('2024-06-01').getTime();
    const fechaFin = new Date('2025-01-01').getTime();
    const fecha_venta = new Date(fechaInicio + Math.random() * (fechaFin - fechaInicio)).toISOString().split('T')[0];

    // Crear el objeto de la venta
    const ventaData = {
        id_carta,
        id_usuario_vendedor,
        id_usuario_comprador,
        precio_venta,
        estado,
        fecha_venta
    };

    // Llamar al método createVenta para enviar la venta al backend
    try {
        const resultado = await createVenta(ventaData);
        console.log("Venta creada exitosamente:", id_carta);
        return resultado;
    } catch (error) {
        console.error("Error al enviar la venta al backend:", error);
        throw error;
    }
}

// Función principal
async function main() {
        // Obtener todas las cartas
        const result = await getAllCartas();
        let flago = true;

        // Verificar que result sea un array
        if (!Array.isArray(result)) {
            flago = false;
            console.log("no array");
            
        }

        let index = 1;

        if (flago) {
            // Iterar sobre cada carta
        for (let item of result) {
            // Generar un número aleatorio entre 4 y 12
            const veces = Math.floor(Math.random() * (12 - 4 + 1)) + 4;

            // Ejecutar generarYEnviarVenta el número de veces generado
            for (let i = 0; i < veces; i++) {
                await generarYEnviarVenta(item.id_carta); // Usar await para esperar a que se complete
            }

            // Mostrar el progreso
            console.log(index, ": ", item.id_carta, " -> OK");
            index++;
        }
        }
}

// Ejecutar la función principal
main();
