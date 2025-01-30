<template>
  <div class="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
    <div class="relative sm:max-w-sm w-full">
      <div class="card bg-purple-600 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
      <div class="card bg-purple-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
      <div class="relative w-full rounded-3xl px-6 py-4 bg-gray-800 shadow-md">
        <label for="" class="block mt-3 text-sm text-gray-300 text-center font-semibold">
          Iniciar Sesión
        </label>
        <form>
          <div>
            <input placeholder="Nombre de usuario"
              class="mt-1 block w-full border-none bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-purple-600 focus:bg-purple-600 focus:ring-0"
              v-model="userData.nombre_usuario">
          </div>
          <div class="mt-7">
            <input type="password" placeholder="Contraseña"
              class="mt-1 block w-full border-none bg-gray-700 h-11 rounded-xl shadow-lg hover:bg-purple-600 focus:bg-purple-600 focus:ring-0"
              v-model="userData.contrasenna">
          </div>
          <div class="mt-7">
            <button type="button" @click="handleLogin"
              class="bg-purple-600 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
              Iniciar Sesión
            </button>
          </div>
          <div class="mt-7">
            <div class="flex justify-center items-center">
              <label class="mr-2 text-gray-300">¿Eres nuevo?</label>
              <nuxt-link to="/CrearCuenta"
                class="text-purple-500 transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                Crear cuenta
              </nuxt-link>
            </div>
          </div>
        </form>
      </div>
    </div>
    <Dialog ref="dialog" />
  </div>
</template>

<script>
import { login } from '~/services/usuarioServices';
import Dialog from '../components/Dialog.vue';

export default {
  components: { Dialog },
  data() {
    return {
      userData: {
        nombre_usuario: '',
        contrasenna: '',
      },
    };
  },
  methods: {
    async handleLogin() {
      if (this.validateFields()) {
        try {
          const response = await login(this.userData);
          console.log("Resultados del login: ", response);

          if (response) {
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            localStorage.setItem('token', response.token);
            this.$router.push('/');
          } else {
            this.$refs.dialog.openDialog('Error', 'Usuario o contraseña incorrectos');
          }
        } catch (error) {
          this.$refs.dialog.openDialog('Error', 'Error al iniciar sesión');
        }
      } else {
        this.$refs.dialog.openDialog('Error', 'Por favor, complete todos los campos');
      }
    },
    validateFields() {
      return this.userData.nombre_usuario !== '' && this.userData.contrasenna !== '';
    },
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
