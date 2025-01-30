<template>
  <header>
    <nuxt-link to="/">
      <img src="~/assets/logo.png" alt="Bienvenido a Web Cartas" class="header-image" />
    </nuxt-link>
    <SearchBar v-model="filters.nombre" @input="handleSearch" />
    <ButtonHeader v-if="usuario.nombre_usuario" variant="primary" class="w-full sm:w-auto mb-2" @click="handleVender">Vender</ButtonHeader>
    <ButtonHeader v-if="usuario.nombre_usuario" variant="primary" class="w-full sm:w-auto mb-2" @click="() => handleMisVentas()">Mis Ventas</ButtonHeader>
    <ButtonHeader v-if="usuario.nombre_usuario" variant="primary" class="w-full sm:w-auto mb-2" @click="() => handleMisCompras()">Mis Compras</ButtonHeader>
    <ButtonHeader variant="primary" class="w-full sm:w-auto mb-2" @click="() => handleLogin('login')">Login</ButtonHeader>

    <div v-if="usuario.nombre_usuario" class="user-info-container flex items-center">
      <ButtonHeader variant="primary" class="ml-2" @click="handleCerrarSesion">Cerrar sesión</ButtonHeader>
    </div>
    <img src="~/assets/usuario.png" alt="Bienvenido a Web Cartas" class="header-user-image" @click="() => handleLogin('login')" />
    <div class="usuario-info ml-2">
      <p>{{ usuario.nombre_usuario }}</p>
      <p>{{ usuario.email }}</p>
    </div>
  </header>
  <Collapsible v-if="showFilters">
    <div class="filter-container">
      <div class="filter-input-container">
        <label class="text-producto-container">Tipo de Carta</label>
        <input type="text" placeholder="Tipo de Carta" v-model="filters.tipo" @input="handleSearch"
          class="filter-input" />
      </div>
      <div class="filter-input-container">
        <label class="text-producto-container">Arquetipo</label>
        <input type="text" placeholder="Arquetipo" v-model="filters.arquetipo" @input="handleSearch"
          class="filter-input" />
      </div>
    </div>
  </Collapsible>
</template>

<script>
export default {
  props: {
    showFilters: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filters: {
        nombre: '',
        tipo: '',
        arquetipo: ''
      },
      usuario: JSON.parse(localStorage.getItem('usuario')) || {},
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.filters);
    },
    handleVender() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      } else {
        this.$emit('vender');
      }
    },
    handleMisVentas() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      } else {
        this.$emit('MisVentas');
      }
    },
    handleMisCompras() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      } else {
        this.$emit('MisCompras');
      }
    },
    handleLogin(llamada) {
      const token = localStorage.getItem('token');
      if (!token || llamada === "login") {
        this.$router.push('/login');
      } else {
        this.$emit('login');
      }
    },
    handleCerrarSesion() {
      localStorage.clear();
      this.usuario = {};
      this.$router.push('/login');
    },
    toggleFilters() {
      this.$emit('update:showFilters', !this.showFilters)
    }
  }
}
</script>

<style scoped>
/* Estilos para el header */
header {
  background-color: #393E46;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto; /* Allow height to adjust */
}

.user-info-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.text-producto-container {
  color: white;
}

.usuario-info {
  margin-left: 10px; /* Espacio entre la imagen y la información del usuario */
}

/* Estilos para la imagen del logo */
.header-image {
  width: 150px;
  height: auto;
}

/* Estilos para la imagen del usuario */
.header-user-image {
  height: 50px;
  border: 2px solid #892CDC;
  border-radius: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* Estilos para las etiquetas de los filtros */
.text-producto-container {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.filter-input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 50px;
}

.filter-input {
  background-color: #393E46;
  border: 2px solid #892CDC;
  color: white;
  font-size: 1rem;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
}

.filter-input:focus {
  border-color: #6a1b9a;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  outline: none;
}

.filter-input:hover {
  border-color: #6a1b9a;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  header {
    flex-direction: column; /* Stack elements vertically */
    height: auto; /* Allow height to adjust */
  }

  .header-image {
    width: 100px; /* Adjust logo size */
  }

  .header-user-image {
    height: 40px; /* Adjust user image size */
  }

  .usuario-info {
    margin-left: 0; /* Remove margin for smaller screens */
  }

  .filter-input-container {
    margin-right: 0; /* Remove margin for smaller screens */
  }
}
</style>
