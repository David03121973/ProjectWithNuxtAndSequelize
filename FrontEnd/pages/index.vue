<template>
  <div class="bg-gray-900 h-screen flex flex-col">
    <h1 class="text-sm text-gray-300 mx-4">TCG Cell - Tienda de cartas de Yu-Gi-Oh</h1>
    <NavBar @search="handleSearch" @vender="handleVender" @misVentas="handleMisVentas" @misCompras="handleMisCompras" @login="handleLogin" :showFilters="true" />
    <main class="container mx-auto p-4 pt-6 flex-1 overflow-y-auto">
      <div v-if="loading">
        <NuxtLoadingIndicator color="#892CDC" height="3px" :throttle="200" :duration="3000" />
      </div>
      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <nuxt-link :to="{ path: '/cartaDetails', query: { id: product.id_carta } }" class="bg-gray-800 border border-purple-600 rounded-lg shadow-md p-4 hover:bg-purple-600"
            v-for="product in products" :key="product.id_carta">
            <div class="flex flex-col items-center">
              <img
                v-lazy="`${cerverHost}${product.imagen}`"
                :srcset="`
                  ${cerverHost}${product.imagen}?w=320 320w,
                  ${cerverHost}${product.imagen}?w=480 480w,
                  ${cerverHost}${product.imagen}?w=800 800w
                `"
                sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
                alt="product.name"
                class="w-32 h-42 object-cover"
              />
              <div class="mt-4">
                <h3 class="text-lg font-bold text-white">{{ product.nombre }}</h3>
                <p class="text-base text-gray-300">{{ product.tipo }}</p>
                <p class="text-base text-gray-300">{{ product.raza }}</p>
                <p class="text-base text-gray-300">Precio: {{ obtenerPrecioMasBajoDeCarta(product.id_carta) }}</p>
              </div>
            </div>
          </nuxt-link>
        </div>
        <div class="flex justify-center mt-4">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="bg-gray-800 border border-purple-600 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">Anterior</button>
          <span class="text-sm text-gray-300 mx-4">{{ currentPage }} de {{ totalPages }} - Total: {{ totalProducts }} productos</span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="bg-gray-800 border border-purple-600 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">Siguiente</button>
        </div>
      </div>
    </main>
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
import { ref, computed, onMounted } from 'vue';
import { getCartasWithPagination, getCartasFilteredWithPagination } from '~/services/cartaServices';
import { obtenerPrecioMasBajo } from '~/helpers/obtenerPrecioMásBajo';
import { getVentasByCartaId } from '~/services/ventaServices';
import { useRouter } from 'vue-router';

let cerverHost = '';
if (typeof window !== 'undefined') {
  cerverHost = window.location.port ? `${window.location.protocol}//${window.location.hostname}:3000` : `${window.location.origin}:3000`;
}
const router = useRouter();

const products = ref([]); // Lista de productos actuales
const currentPage = ref(1); // Página actual
const totalProducts = ref(0); // Total de productos
const totalPages = ref(0); // Total de páginas
const loading = ref(true); // Estado de carga
const ventasPorCarta = ref({}); // Almacena las ventas por carta para evitar llamadas repetidas
const searchQuery = ref(''); // Almacena el texto de búsqueda
const filters = ref({
  nombre: '',
  tipo: '',
  arquetipo: '',
});

// Función para obtener el precio más bajo de una carta específica
function obtenerPrecioMasBajoDeCarta(idCarta) {
  if (!ventasPorCarta.value[idCarta]) {
    return "Cargando..."; // Muestra un mensaje mientras se cargan las ventas
  }
  return obtenerPrecioMasBajo(ventasPorCarta.value[idCarta]);
}

// Función para cargar las ventas de una carta
async function cargarVentasDeCarta(idCarta) {
  try {
    const ventas = await getVentasByCartaId(idCarta);
    ventasPorCarta.value[idCarta] = ventas; // Almacena las ventas en el objeto
  } catch (error) {
    console.error(`Error al cargar ventas para la carta ${idCarta}:`, error);
    ventasPorCarta.value[idCarta] = []; // En caso de error, asigna un arreglo vacío
  }
}

// Función para obtener las cartas paginadas
async function fetchProducts() {
  try {
    loading.value = true; // Activar el estado de carga
    let response;
    if (searchQuery.value) {
      response = await getCartasFilteredWithPagination(currentPage.value, 8, {
        nombre: filters.value.nombre,
        tipo: filters.value.tipo,
        arquetipo: filters.value.arquetipo,
      });
    } else {
      response = await getCartasWithPagination(currentPage.value, 8);
    }
    products.value = response.cartas; // Actualizar la lista de productos
    totalProducts.value = response.totalCartas; // Actualizar el total de productos
    totalPages.value = response.totalPages; // Actualizar el total de páginas
    // Cargar las ventas para cada producto
    for (const product of products.value) {
      await cargarVentasDeCarta(product.id_carta);
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  } finally {
    loading.value = false; // Desactivar el estado de carga
  }
}

// Cambiar de página
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return; // Validar límites
  currentPage.value = page; // Actualizar la página actual
  fetchProducts(); // Obtener los productos de la nueva página
};

// Manejar la búsqueda
const handleSearch = (query) => {
  // Actualizar los valores de filters
  filters.value = { ...query }; // Copiar los valores de query a filters

  // Actualizar el texto de búsqueda
  searchQuery.value = query.nombre || ''; // Asegúrate de que query.nombre esté definido
  currentPage.value = 1; // Reiniciar la página actual

  // Obtener los productos con la búsqueda
  fetchProducts();
};

const handleVender = () => {
  router.push('/vender');
}
const handleLogin = () => {
  router.push('/login');
}
const handleMisVentas = () => {
  router.push('/MisVentas')
}
const handleMisCompras = () => {
  router.push('/MisCompras')
}
// Cargar los productos al montar el componente
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
</style>