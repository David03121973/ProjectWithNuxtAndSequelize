<template>
  <div v-if="carta" class="flex flex-col min-h-screen bg-gray-800 overflow-y-auto">
    <h1 class="text-sm text-gray-300 mx-4">TCG Cell - Detalles de Carta</h1>
    <NavBar @search="handleSearch" @vender="handleVender" @misVentas="handleMisVentas" @misCompras="handleMisCompras"
      @login="handleLogin" :showFilters="false" />
    <main class="flex flex-wrap justify-between items-start p-5 border border-purple-500 rounded-lg bg-gray-700">
      <div class="flex justify-center items-center w-90 h-96 mr-5">
        <img :src="carta.imagen" alt="carta.nombre" class="w-64 h-96 object-cover rounded-lg" />
      </div>
      <div class="w-96 text-white text-lg">
        <h1 class="text-2xl font-bold mb-2">{{ carta.nombre }}</h1>
        <p>Tipo: {{ carta.tipo }}</p>
        <p>Descripción: {{ carta.descripcion }}</p>
        <p>Raza: {{ carta.raza }}</p>
        <p>Arquetipo: {{ carta.arquetipo }}</p>
      </div>
      <div class="w-full md:w-2/5 h-96 ml-auto bg-gray-700 border border-purple-500 rounded-lg p-5 shadow-md">
        <h2 class="text-center text-white text-xl mb-3">Mejor Precio</h2>
        <p class="text-lg font-bold text-white">Estado: {{ ventas[0] ? ventas[0].estado : '' }}</p>
        <p class="text-lg font-bold text-white">Fecha de publicación: {{ ventas[0] ? new
          Date(ventas[0].fecha_venta).toLocaleDateString() : '' }}</p>
        <p class="text-2xl font-bold text-green-500">Precio: {{ ventas[0] ? "$" + ventas[0].precio_venta : 'Agotado' }}
        </p>
        <div v-if="ventas[0]" class="mt-4">
          <button
            class="bg-purple-500 text-white px-5 py-3 rounded-lg w-36 h-14 text-lg hover:bg-purple-700 transition duration-300"
            @click="confirmationComprarCarta(ventas[0])">Comprar</button>
        </div>
        <canvas id="ventas-chart" width="400" height="200"></canvas>
      </div>
    </main>
    <div
      class="w-11/12 ml-5 mt-4 h-96 overflow-y-auto p-5 bg-gray-700 border border-purple-500 rounded-lg shadow-md mb-8 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
      <h2 class="text-white text-xl mb-3">Ventas de la carta</h2>
      <div class="space-y-4">
  <div v-for="venta in ventas" :key="venta.id_venta"
    class="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-gray-800 border border-purple-500 rounded-lg">
    <div class="flex flex-col items-start justify-center text-white mb-4 md:mb-0 md:mr-4">
      <p>Estado: {{ venta.estado }}</p>
      <p>Fecha Venta: {{ new Date(venta.fecha_venta).toLocaleDateString() }}</p>
      <p>Vendedor: {{ venta.vendedor.nombre_usuario }}</p>
      <div class="flex items-center">
        <span v-for="star in 5" :key="star">
          <i v-if="star <= venta.vendedor.valoracionPromedio" class="text-yellow-500">*</i>
          <i v-else class="text-gray-500">*</i>
        </span>
      </div>
    </div>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between w-full md:w-auto">
      <div class="mb-4 md:mb-0 md:mr-4">
        <button class="bg-purple-500 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          Ver Reseñas del Vendedor
        </button>
      </div>
      <div class="text-green-500 text-2xl font-bold p-3 mb-4 md:mb-0 md:mr-4">
        <p>Precio: ${{ venta.precio_venta }}</p>
      </div>
      <div>
        <button class="bg-purple-500 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
          @click="() => confirmationComprarCarta(venta)">Comprar</button>
      </div>
    </div>
  </div>
</div>
    </div>
    <div class="mt-5 p-5 bg-gray-700 border border-purple-500 rounded-lg">
      <h2 class="text-white text-xl mb-3">Productos relacionados</h2>
      <div class="relative flex items-center">
        <!-- Botón para desplazar hacia la izquierda -->
        <button @click="scrollLeft"
          class="absolute left-0 top-1/2 w-12 h-14 bg-gray-800 border border-purple-500 rounded-lg transform -translate-y-1/2 p-2">
          <i class="text-white text-2xl">
            <</i>
        </button>
        <!-- Contenedor desplazable con el ref -->
        <div ref="productosLista"
          class="flex space-x-5 overflow-x-auto p-2 scroll-smooth cursor-grab scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
          <nuxt-link :to="{ path: '/cartaDetails', query: { id: producto.id_carta } }"
            class="w-64 flex-shrink-0 bg-gray-800 border border-purple-500 rounded-lg p-3 text-wheat hover:bg-gray-700"
            v-for="producto in productosRelacionados" :key="producto.id_carta">
            <img :src="producto.imagen" alt="producto.nombre" class="w-50 h-86 object-cover rounded-lg" />
            <div class="mt-2">
              <h3 class="text-lg font-bold text-white">{{ producto.nombre }}</h3>
              <p class="text-lg font-bold text-white">Precio: ${{ producto.precio }}</p>
            </div>
          </nuxt-link>
        </div>
        <!-- Botón para desplazar hacia la derecha -->
        <button @click="scrollRight"
          class="absolute right-0 top-1/2 w-12 h-14 bg-gray-800 border border-purple-500 rounded-lg transform -translate-y-1/2 p-2">
          <i class="text-white text-2xl">></i>
        </button>
      </div>
    </div>

    <div v-if="showDialogCheck"
      class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity flex justify-center items-center">
      <div
        class="bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="titleMessageCheck === 'Error' ? 'bg-red-100' : (titleMessageCheck === '¿Confirmación?' ? 'bg-yellow-100' : 'bg-green-100')">

              <!-- Ícono de Error -->
              <svg v-if="titleMessageCheck === 'Error'" class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <!-- Ícono de Confirmación -->
              <svg v-else-if="titleMessageCheck === '¿Confirmación?'" class="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M12 16h0M12 6h0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <!-- Ícono por defecto (Palomita) -->
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
          <button type="button" @click="acceptVentaCheck"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Aceptar
          </button>
          <button type="button" @click="cancelVentaCheck"
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

<script>
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
import { Chart, registerables } from 'chart.js';
import { getCartaById, getCartasAleatorias } from '~/services/cartaServices';
import { getComprasByCartaId, getVentasByCartaId, updateVenta } from '~/services/ventaServices';

const router = useRouter();

export default {
  data() {
    return {
      carta: null,
      ventas: [],
      productosRelacionados: [],
      ventasConCompradorData: [],
      ventasChartData: {
        labels: [],
        datasets: [{
          label: 'Ventas',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: 'rgba(255, 99, 132, 1)',
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointHitRadius: 10,
        }],
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white', // Cambia el color del texto en el eje Y
              },
            },
            x: {
              ticks: {
                color: 'white', // Cambia el color del texto en el eje X
              },
            },
          },
        },
      },
      showDialogCheck: false,
      titleMessageCheck: "",
      messageMessageCheck: "",
      titleMesage: "",
      messageMesage: "",
      showDialog: false,
      ventaCartaComprar: null
    }
  },
  beforeMount() {
    this.cargarCarta();
  },
  watch: {
    '$route.query.id': {
      handler: 'cargarCarta',
      immediate: true,
    },
  },
  methods: {
    async confirmationComprarCarta(venta) {
      this.ventaCartaComprar = venta;

      this.titleMessageCheck = "¿Confirmación?"
      this.showDialogCheck = true
      this.messageMessageCheck = `¿Estas seguro de que deseas comprar la carta ${venta.carta.nombre} por $${venta.precio_venta} ?`
    },
    async comprarCarta() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario')) || "";
        const ventaData = {
          id_usuario_comprador: usuario.id_usuario
        };
        const result = await updateVenta(this.ventaCartaComprar.id_venta, ventaData)
        this.ventas = this.ventas.filter(venta => venta.id_venta !== this.ventaCartaComprar.id_venta);
        this.titleMesage = "Carta Comprada";
        this.messageMesage = `Usted ha comprado una carta con el nombre de ${this.ventaCartaComprar.carta.nombre} a un precio de $${this.ventaCartaComprar.precio_venta}`
      } catch (error) {
        this.titleMesage = "Error";
        this.messageMesage = "Error al vender la carta"
        console.log("Error al vender la carta: ", error);
      }
    },
    acceptVentaCheck() {
      this.showDialogCheck = false; // Oculta el diálogo ckeck
      this.titleMesage = "Espere un momento"
      this.messageMesage = "Comprando carta espere un momento..."
      this.showDialog = true; //Mostrar dialog de mensaje
      this.comprarCarta();
    },
    cancelVentaCheck() {
      this.showDialogCheck = false; // Oculta el diálogo
    },
    scrollLeft() {
      const productosLista = this.$refs.productosLista;
      productosLista.scrollLeft -= 400;
    },
    scrollRight() {
      const productosLista = this.$refs.productosLista;
      productosLista.scrollLeft += 400;
    },
    async cargarCarta() {
      const id = this.$route.query.id;
      const carta = await getCartaById(id);
      this.carta = carta;
      this.fetchVentasByCartaId(carta.id_carta);
      this.fetchProductosRelacionados();
    },
    async fetchVentasByCartaId(id_carta) {
      try {
        const response = await getVentasByCartaId(id_carta)
        const responseCompras = await getComprasByCartaId(id_carta)
        this.ventas = response
        this.ventasConCompradorData = responseCompras
        this.updateChartData()
      } catch (error) {
        console.error(error)
      }
    },
    async getMejorPrecioByIdCarta(id_carta) {
      try {
        const result = await getVentasByCartaId(id_carta)
        return (result[0] ? result[0].precio_venta : 'Agotado')
      } catch (error) {
        console.error(error)
      }
    },
    async fetchProductosRelacionados() {
      try {
        const response = await getCartasAleatorias(20, this.carta.arquetipo);
        const productosConPrecio = await Promise.all(response.map(async (producto) => {
          const precio = await this.getMejorPrecioByIdCarta(producto.id_carta);
          return { ...producto, precio };
        }));
        this.productosRelacionados = productosConPrecio;
      } catch (error) {
        console.error("Error al obtener productos relacionados:", error);
      }
    },
    updateChartData() {
      const ventasConComprador = this.ventasConCompradorData.filter(venta => venta.comprador !== null)

      this.ventasChartData.labels = ventasConComprador.map(venta => new Date(venta.fecha_venta).toLocaleDateString())
      this.ventasChartData.datasets[0].data = ventasConComprador.map(venta => venta.precio_venta)
      this.renderChart()
    },
    renderChart() {
      const ctx = document.getElementById('ventas-chart').getContext('2d')
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'line',
          data: this.ventasChartData,
          options: {
            plugins: {
              title: {
                display: true,
                text: 'Ventas',
                color: 'white',
              },
            },
            scales: {
              x: {
                ticks: {
                  color: 'white',
                },
                title: {
                  display: true,
                  text: 'Fecha de Venta',
                  color: 'white',
                },
              },
              y: {
                ticks: {
                  color: 'white',
                },
                title: {
                  display: true,
                  text: 'Precio de Venta',
                  color: 'white',
                },
              },
            },
          },
        })
      } else {
        console.error('El elemento canvas no ha sido cargado');
      }
    },
    handleVender() {
      router.push('/vender');
    },
    handleLogin() {
      router.push('/login');
    },
    handleMisVentas() {
      router.push('/MisVentas')
    },
    handleMisCompras() {
      router.push('/MisCompras')
    }
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
  color: white;
  font-size: 18px;
  margin-top: 0;
}
</style>