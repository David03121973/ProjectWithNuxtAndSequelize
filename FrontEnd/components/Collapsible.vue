<template>
    <div>
      <div class="toggle" @click="toggle">
        <span>{{ isOpen ? '▲' : '▼' }}</span> <!-- Flecha hacia arriba o hacia abajo -->
        <span>Opciones de Filtrado</span>
      </div>
      <div v-if="isOpen" class="collapsible-content">
        <slot></slot> <!-- Aquí se insertarán los botones y otras opciones -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isOpen = ref(false);
  
  const toggle = () => {
    isOpen.value = !isOpen.value;
  };
  </script>
  
  <style scoped>
  .toggle {
    display: flex;
    align-items: center;
    cursor: pointer; /* Cambia el cursor al pasar sobre el área de la flecha */
    background-color: #892CDC; /* Color de fondo del toggle */
    color: white; /* Color del texto */
    padding: 0.75rem 1.5rem; /* Espaciado interno */
    border-radius: 12px; /* Bordes redondeados */
    margin-bottom: 1rem; /* Espacio inferior */
    transition: background-color 0.3s ease; /* Transición suave */
  }
  
  .toggle:hover {
    background-color: #393E46; /* Cambia el color al pasar el mouse */
  }
  
  .collapsible-content {
    padding: 1rem;
    background-color: #222831; /* Color de fondo del contenido colapsable */
    border-radius: 12px; /* Bordes redondeados */
  }
  </style>