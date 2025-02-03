<template>
    <div class="app-container">
        <h1 class="text-sm text-gray-300 mx-4">TCG Cell - Vender Carta</h1>
        <NavBar @search="handleSearch" @vender="handleVender" @misVentas="handleMisVentas" @login="handleLogin" @misCompras="handleMisCompras" :showFilters="false" />

        <!-- Contenedor principal -->
        <div class="main-container">
            <!-- Contenedor izquierdo -->
            <div class="left-container">
                <div class="cartas-container" @scroll="handleScroll">
                    <div v-for="carta in cartas" :key="carta.id_carta" class="carta-container"
                        @click="seleccionarCarta(carta)">
                        <img :src="`${cerverHost}${carta.imagen}`" alt="carta.nombre" class="carta-image" />
                        <div class="carta-info">
                            <h3 class="carta-nombre">{{ carta.nombre }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contenedor derecho -->
            <div class="right-container">
                <!-- Contenido de la página de vender -->
                <main>
                    <h1>Vender Producto</h1>
                    <form @submit.prevent="submitForm">
                        <div>
                            <label for="nombre">Nombre del producto:</label>
                            <input type="text" id="nombre" v-model="nombre" readonly />
                        </div>
                        <div>
                            <label for="precio">Estado de la carta:</label>
                            <DropdownList title="Opciones"
                                :items="['Nuevo', 'De uso-bueno', 'De uso-dañado', 'De uso-muy-dañado']"
                                v-model="estadoCarta" />
                        </div>
                        <div class="precio-container">
                            <div class="precio-label">Precio</div>
                            <div class="precio-inputs">
                                <div class="precio-input">
                                    <label>Precio de venta</label>
                                    <input type="number" v-model="precio2" @input="actualizarPrecioVenta" />
                                </div>
                                <div class="precio-input">
                                    <label>Precio a pagar</label>
                                    <input type="number" v-model="precio1" readonly />
                                </div>
                            </div>
                        </div>
                        <button type="submit" @click="publicarVenta">Publicar</button>
                    </form>
                </main>
            </div>
        </div>

        <div v-if="showDialog"
            class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity flex justify-center items-center">
            <div
                class="bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                            :class="titleMesage === 'Error' ? 'bg-red-100' : 'bg-green-100'">
                            <svg v-if="titleMesage === 'Error'" class="h-6 w-6 text-red-600"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <svg v-else class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
                                {{ titleMesage }}
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-300">
                                    {{ messageMesage }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-800 px-4 py-3 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
                    <button type="button" @click="() => showDialog = false"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Aceptar
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
useHead({
  title: 'TCG Cell - Tienda de cartas de Yu-Gi-Oh',
  meta: [
    {
      name: 'description',
      content: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.',
    },
    {
      name: 'keywords',
      content: 'Yu-Gi-Oh, Cuba, Venta, cartas, Juego, TCG, Tienda, Cubana, Coleccionables, Duelos',
    },
    {
      property: 'og:title',
      content: 'TCG Cell - Tienda de cartas de Yu-Gi-Oh',
    },
    {
      property: 'og:description',
      content: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.',
    },
    {
      property: 'og:image',
      content: 'https://projectwithnuxtandsequelize-1.onrender.com/logo.png',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '@tu_usuario',
    },
    {
      name: 'twitter:creator',
      content: '@tu_usuario',
    },
  ],
})
import { ref } from 'vue';
import DropdownList from '~/components/DropdownList.vue';
import { getCartasFilteredWithPagination, getCartasWithPagination } from '~/services/cartaServices';
import { createVenta } from '~/services/ventaServices';

let cerverHost = '';
if (typeof window !== 'undefined') {
  cerverHost = window.location.port ? `${window.location.protocol}//${window.location.hostname}:3000` : `${window.location.origin}:3000`;
}
const router = useRouter();

const showDialog = ref(false);
const titleMesage = ref("");
const messageMesage = ref("");

const cartas = ref([]);
const cartaSeleccionada = ref(null);
const estadoCarta = ref("");
const currentPage = ref(1);
const loading = ref(false);
const precio1 = ref(0);
const precio2 = ref(0);
const nombre = ref('');
const filters = ref({
    nombre: '',
    tipo: '',
    arquetipo: '',
});

function actualizarPrecioVenta() {
    precio1.value = parseFloat(precio2.value) * 1.15;
}

function seleccionarCarta(carta) {
    this.cartaSeleccionada = carta;
    nombre.value = carta.nombre;
}
// Función para obtener las cartas paginadas
async function fetchCartas() {
    try {
        loading.value = true; // Activar el estado de carga
        let response;
        if (filters.value.nombre) {
            response = await getCartasFilteredWithPagination(currentPage.value, 8, {
                nombre: filters.value.nombre
            });
        } else {
            response = await getCartasWithPagination(currentPage.value, 8);
        }
        cartas.value = [...cartas.value, ...response.cartas]; // Actualizar la lista de cartas
    } catch (error) {
        console.error("Error al obtener las cartas:", error);
    } finally {
        loading.value = false; // Desactivar el estado de carga
    }
}

// Función para publicar la venta de lproducto
async function publicarVenta() {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    let flag = true;
    let validarCampos = `Error al agregar venta. Compruebe los siguientes campos: \n`;

    if (!cartaSeleccionada.value) {
        validarCampos += "-No ha seleccionado un carta para vender.\n",
            flag = false
    }
    if (!estadoCarta.value) {
        validarCampos += "-No ha seleccionado un estado para la carta.\n",
            flag = false
    }
    if (!precio2.value) {
        validarCampos += "-No ha digitado el precio de la carta.\n",
            flag = false
    }

    if (flag) {

        const ventaData = {
            id_carta: cartaSeleccionada.value.id_carta,
            id_usuario_vendedor: usuario.id_usuario, // Debes reemplazar esto con el ID del usuario vendedor actual
            id_usuario_comprador: null,
            precio_venta: precio2.value,
            fecha_venta: new Date().toISOString(),
            estado: estadoCarta.value
        };

        try {
            const resultado = await createVenta(ventaData);
            titleMesage.value = "Agregado"
            messageMesage.value = `La venta se agregó con éxito. Usted ha pusto en venta la carta ${cartaSeleccionada.value.nombre}`
            showDialog.value = true
        } catch (error) {
            console.error('Error al crear la venta:', error);
        }
    } else {
        titleMesage.value = "Error"
        messageMesage.value = validarCampos
        showDialog.value = true
    }
}

// Función para buscar
const handleSearch = (query) => {
    // Actualizar los valores de filters
    filters.value = { ...query }; // Copiar los valores de query a filters
    cartas.value = []
    fetchCartas()
}

// Función para manejar el scroll del contenedor de cartas
const handleScroll = (event) => {
    const container = event.target;
    const scrollPosition = container.scrollTop + container.offsetHeight;
    const containerHeight = container.scrollHeight;

    if (scrollPosition >= containerHeight * 0.8 && !loading.value) {
        currentPage.value++;
        fetchCartas();
    }
};

const handleVender = () => {
  router.push('/vender');
}
const handleLogin = () =>{
  router.push('/login');
}
const handleMisVentas = () =>{
  router.push('/MisVentas')
}
const handleMisCompras =() =>{
  router.push('/MisCompras')
}

onMounted(() => {
    fetchCartas();
});

</script>

<style scoped>
.app-container {
    background-color: #222831;
    /* Color de fondo para toda la página */
    display: flex;
    flex-direction: column;
    /* Alinea los elementos en columna */
    min-height: 100vh;
    /* Asegura que el contenedor ocupe al menos la altura de la ventana */
    overflow-y: auto;
    /* Permite el scroll vertical si es necesario */
}

header {
    background-color: #393E46;
    /* Azul oscuro */
    color: white;
    padding: 1rem;
    display: flex;
    /* Habilita flexbox */
    flex-direction: row;
    /* Coloca los elementos en fila */
    align-items: center;
    /* Centra los elementos verticalmente */
    height: 60px;
}

.header-image {
    margin-left: 20px;
    height: 90px;
    margin-right: 90px;
}

.header-user-image {
    margin-left: 20px;
    height: 50px;
    border: 2px solid #892CDC;
    border-radius: 12px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    /* Sombra paralela */
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    /* Transición suave */
    cursor: pointer;
    /* Cambia el cursor al pasar sobre la imagen */
}

.header-user-image:hover {
    background-color: #892CDC;
    /* Cambia el color de fondo al pasar el mouse */
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    /* Aumentar sombra al pasar el mouse */
}

.main-container {
    display: flex;
    flex: 1;
    /* Ocupa el espacio restante */
}

.left-container {
    flex: 1;
    /* Ocupa el espacio disponible */
    background-color: #393E46;
    /* Color de fondo del contenedor izquierdo */
    padding: 20px;
    /* Espaciado interno */
    color: white;
    /* Color del texto */
    display: flex;
    flex-direction: column;
    height: 510px;
    width: 90%;
    margin-top: 15px;
    margin-left: 15px;
    border: 1px solid #892CDC;
    border-radius: 8px;
    align-items: center;
    /* Centra el contenido horizontalmente */
    justify-content: center;
    /* Centra el contenido verticalmente */
    overflow-y: auto;
    /* Permite el scroll vertical */
    max-height: 80vh;
    /* Establece un máximo de altura para el contenedor */
}

.cartas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 500px;
    /* Ajusta el alto del contenedor */
    overflow-y: auto;
    /* Permite el scroll vertical */
}

.carta-container:hover {
    background-color: #222831;
}

.carta-container {
    display: flex;
    cursor: pointer;
    align-items: center;
    margin-bottom: 20px;
    width: 90%;
    border: 1px solid #892CDC;
    border-radius: 8px;
}

.carta-image {
    width: 100px;
    /* Ajusta el tamaño de la imagen según sea necesario */
    height: auto;
    /* Mantener la proporción de la imagen */
    margin-right: 20px;
    /* Espacio entre la imagen y la información */
}

.carta-info {
    flex-grow: 1;
    /* Permitir que la información ocupe el espacio restante */
}

.right-container {
    flex: 1;
    /* Ocupa el espacio disponible */
    padding: 20px;
    /* Espaciado interno */
    background-color: #222831;
    /* Color de fondo del contenedor derecho */
    color: white;
    /* Color del texto */
}

main {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #892CDC;
    border-radius: 8px;
    background-color: #393E46;
}

label {
    display: block;
    margin-bottom: 8px;
    color: white;
}

input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #892CDC;
    border-radius: 4px;
    background-color: #222831;
    color: white;
}

.precio-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.precio-label {
    font-weight: bold;
    margin-bottom: 10px;
}

.precio-inputs {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.precio-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
}


.precio-input label {
    font-size: 14px;
    margin-bottom: 5px;
}

.precio-input input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button[type="submit"] {
    background-color: #892CDC;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #6a1b9a;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: white;
}

h2 {
    text-align: center;
    margin-bottom: 10px;
}
</style>