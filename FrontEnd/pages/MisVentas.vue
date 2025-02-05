<template>
  <div class="bg-gray-900 h-screen flex flex-col">
    <h1 class="text-sm text-gray-300 mx-4">TCG Sell - Mis Ventas</h1>
    <NavBar @search="handleSearch" @vender="handleVender" @misVentas="handleMisVentas" @login="handleLogin"
      @misCompras="handleMisCompras" :showFilters="false" />
    <main class="container mx-auto p-4 pt-6 flex-1 overflow-y-auto">
      <div class="flex flex-col gap-4">
        <div v-for="venta in misVentas" :key="venta.id_venta"
          class="bg-gray-700 border border-purple-500 rounded-lg p-4 hover:bg-gray-600 mb-4">
          <div class="flex flex-col md:flex-row justify-between">
            <nuxt-link :to="{ path: '/cartaDetails', query: { id: venta.carta.id_carta } }"
              class="w-full h-48 md:w-1/3 md:h-96 mb-4 md:mb-0 md:mr-5">
              <nuxt-img :src="`${cerverHost}${venta.carta.imagen}`" alt="Imagen"
                class="w-50 h-full object-cover rounded-lg" />
            </nuxt-link>
            <div class="w-full md:w-96 text-white text-lg mb-4 md:mb-0">
              <nuxt-link :to="{ path: '/cartaDetails', query: { id: venta.carta.id_carta } }">
                <h1 class="text-2xl font-bold mb-2">{{ venta.carta.nombre }}</h1>
              </nuxt-link>
              <p>Tipo: {{ venta.carta.tipo }}</p>
              <p>Descripción: {{ venta.carta.descripcion }}</p>
              <p>Raza: {{ venta.carta.raza }}</p>
              <p>Arquetipo: {{ venta.carta.arquetipo }}</p>
            </div>
            <div
              class="bg-gray-800 border border-purple-500 h-auto text-white font-bold text-center rounded-lg p-4 w-full md:w-80">
              <p>Precio: {{ venta.precio_venta }}</p>
              <p>Estado: {{ venta.estado }}</p>
              <p>Fecha: {{ new Date(venta.fecha_venta).toLocaleDateString() }}</p>
              <div class="flex justify-between mt-2">
                <div v-if="venta.comprador === null" class="flex items-center">
                  <span class="text-red-600">No comprada</span>
                  <svg class="h-6 w-6 text-red-600 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <button @click="cancelarVenta(venta.id_venta)"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg ml-4 hover:bg-red-700 transition duration-300">
                    Cancelar venta
                  </button>
                </div>
                <div v-else class="flex items-center">
                  <span class="text-green-600">Comprada</span>
                  <svg class="h-6 w-6 text-green-600 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showDialogCheck"
      class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity flex justify-center items-center">
      <div
        class="bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="titleMessageCheck === 'Error' ? 'bg-red-100' : (titleMessageCheck === '¿Confirmación?' ? 'bg-yellow-100' : 'bg-green-100')">

              <svg v-if="titleMessageCheck === 'Error'" class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <svg v-else-if="titleMessageCheck === '¿Confirmación?'" class="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M12 16h0M12 6h0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <svg v-else class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
                {{ titleMessageCheck }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-300">
                  {{ messageMessageCheck }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 px-4 py-3 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
          <button type="button" @click="acceptVentaCheck()"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Aceptar
          </button>
          <button type="button" @click="cancelVentaCheck()"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDialog"
      class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity flex justify-center items-center">
      <div
        class="bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="titleMesage === 'Error' ? 'bg-red-100' : 'bg-green-100'">
              <svg v-if="titleMesage === 'Error'" class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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
import { useHead } from '@unhead/vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '~/components/NavBar.vue';
import { deleteVenta, getVentasByVendedor } from '~/services/ventaServices';
import { useSeoMeta } from '#app';

useSeoMeta({
  title: 'TCG Sell - Tienda de cartas de Yu-Gi-Oh',
  description: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.',
  keywords: 'Yu-Gi-Oh, Cuba, Venta, cartas, Juego, TCG, Tienda, Cubana, Coleccionables, Duelos',
  openGraph: {
    title: 'TCG Sell - Tienda de cartas de Yu-Gi-Oh',
    description: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.',
    image: 'https://projectwithnuxtandsequelize-1.onrender.com/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tu_usuario',
    creator: '@tu_usuario',
  },
});

const showDialogCheck = ref(false);
const titleMessageCheck = ref('');
const messageMessageCheck = ref('');
const showDialog = ref(false);
const titleMesage = ref('');
const messageMesage = ref('');

const misVentas = ref([]);
const cerverHost = ref('');
const idVentaCancelar = ref(0);

const router = useRouter();

onMounted(() => {
  if (typeof window !== 'undefined') {
    cerverHost = window.location.port ? `${window.location.protocol}//${window.location.hostname}` : `${window.location.origin}`;
  }
  getVentsByVendedorUsuario();
});

async function getVentsByVendedorUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const resultVentasByUser = await getVentasByVendedor(usuario.id_usuario);
    misVentas.value = resultVentasByUser;
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
  }
}

async function cancelarVenta(idVenta) {
  try {
    titleMessageCheck.value = '¿Confirmación?';
    messageMessageCheck.value = '¿Estás seguro de que deseas cancelar la venta?';
    idVentaCancelar.value = idVenta;
    showDialogCheck.value = true;
  } catch (error) {
    idVentaCancelar.value = 0;
    console.error('Error al cancelar la venta:', error);
  }
}
async function acceptVentaCheck() {
  this.showDialogCheck = false; // Oculta el diálogo check
  this.titleMesage = "Espere un momento";
  this.messageMesage = "Cancelando venta...";
  this.showDialog = true; // Mostrar dialog de mensaje
  try {
    await deleteVenta(idVentaCancelar.value);
    misVentas.value = misVentas.value.filter((venta) => venta.id_venta !== idVentaCancelar.value);
    this.titleMesage = "Mensaje";
    this.messageMesage = "Venta eliminada correctamente";
    this.showDialog = true; // Mostrar dialog de mensaje
  } catch (error) {
    alert("Error al eliminar venta");
    console.log("Error al eliminar venta", error);
  }
}

async function cancelVentaCheck() {
  this.showDialogCheck = false; // Oculta el diálogo
}

function handleVender() {
  router.push('/vender');
}

function handleLogin() {
  router.push('/login');
}

function handleMisVentas() {
  router.push('/MisVentas');
}

function handleMisCompras() {
  router.push('/MisCompras');
}
</script>

<style scoped>
/* Estilos para el componente */
</style>