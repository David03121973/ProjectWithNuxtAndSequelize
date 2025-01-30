<template>
  <div class="pagination-dots">
    <span 
      v-for="dot in totalPages" 
      :key="dot" 
      class="dot" 
      :class="{ active: dot === currentPage }" 
      @click="goToPage(dot)"
    ></span>
    <span class="info">{{ currentPage }} de {{ totalPages }} - Total: {{ totalProducts }} productos</span>
  </div>
</template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  totalProducts: Number,
  onPageChange: Function, // Asegúrate de que esta línea esté presente
});
  
const goToPage = (page) => {
  if (typeof props.onPageChange === 'function') {
    props.onPageChange(page);
  } else {
    console.error('onPageChange is not a function');
  }
};
  </script>
  
  <style scoped>
.pagination-dots {
  display: flex;
  align-items: center;
  justify-content: center; /* Centra horizontalmente */
  margin-top: 20px; /* Margen superior para separar de los productos */
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc; /* Color por defecto */
  margin: 0 5px; /* Espaciado entre los puntos */
  cursor: pointer;
}

.dot.active {
  background-color: #892CDC; /* Color para la página activa */
}

.info {
  margin-left: 10px;
  color: white; /* Color del texto */
}

.pagination-buttons {
  display: flex;
  justify-content: center; /* Centra los botones horizontalmente */
  margin-top: 20px; /* Margen superior para separar de los productos */
}

.pagination-buttons button {
  background-color: #892CDC; /* Color de fondo del botón */
  color: white; /* Color del texto en blanco */
  border: none; /* Sin borde */
  border-radius: 8px; /* Bordes redondeados */
  padding: 10px 20px; /* Espaciado interno */
  margin: 0 10px; /* Espacio entre los botones */
  cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
  transition: background-color 0.3s ease; /* Transición suave */
}
  </style>