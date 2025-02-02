<template>
  <div class="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-sm text-gray-300 mx-4">TCG Cell - Crear Cuenta</h1>
    <div class="relative sm:max-w-sm w-full">
      <div class="card bg-purple-600 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
      <div class="card bg-purple-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
      <div class="relative w-full rounded-3xl px-6 py-4 bg-gray-800 shadow-md">
        <label for="" class="block mt-3 text-sm text-gray-300 text-center font-semibold">
          Crear Cuenta
        </label>
        <form @submit.prevent="handleCrearCuenta">
          <div>
            <input type="text" placeholder="Nombre de usuario"
              class="mt-1 block w-full border-none bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-purple-600 focus:bg-purple-600 focus:ring-0"
              v-model="userData.nombre_usuario">
          </div>
          <div class="mt-7">
            <input type="email" placeholder="Correo electrónico"
              class="mt-1 block w-full border-none bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-purple-600 focus:bg-purple-600 focus:ring-0"
              v-model="userData.email">
          </div>
          <div class="mt-7">
            <input type="password" placeholder="Contraseña"
              class="mt-1 block w-full border-none bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-purple-600 focus:bg-purple-600 focus:ring-0"
              v-model="userData.contrasenna">
          </div>
          <div class="mt-7">
            <button type="submit"
              class="bg-purple-600 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
              Crear Cuenta
            </button>
          </div>
        </form>
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
import { createUsuario } from '~/services/usuarioServices';

export default {
  data() {
    return {
      messageMesage: "",
      titleMesage: "",
      showDialog: false,
      userData: {
        nombre_usuario: '',
        email: '',
        contrasenna: ''
      },
    };
  },
  methods: {
    async handleCrearCuenta() {
      try {
        const response = await createUsuario(this.userData);
        if (response.id_usuario) {
          this.titleMesage = "Bienvenido";
          this.messageMesage = "Usuario creado con éxito.";
          this.showDialog = true;
        } else {
          throw response;
        }
      } catch (error) {
        if (error instanceof Response) {
          error.json().then((data) => {
            this.titleMesage = "Error";
            this.messageMesage = data.message;
            this.showDialog = true;
            console.error("Error al crear la cuenta:", data);
          });
        } else {
          this.titleMesage = "Error";
          this.messageMesage = "Ocurrió un error desconocido";
          this.showDialog = true;
          console.error("Error al crear la cuenta:", error);
        }
      }
    }
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  .card {
    width: 90%;
    height: auto;
  }
}
</style>
