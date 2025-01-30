<template>
  <button
    class="button"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  variant: {
      type: String, 
      default: 'primary', // Puedes usar 'primary', 'secondary', etc.
  },
  onClick: {
      type: Function,
      default: () => {},
  },
});

const handleClick = () => {
  props.onClick();
};
</script>

<style scoped>
/* Estilos para el botón */
.button {
  height: 50px;
  background-color: #393E46; /* Azul claro */
  border: 2px solid #892CDC; /* Borde azul claro */
  color: white; /* Color del texto en blanco */
  font-size: 1rem; /* Tamaño del texto */
  border-radius: 12px; /* Bordes redondeados */
  padding: 0.75rem 1.5rem; /* Espaciado interno */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra paralela */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* Transición suave */
  margin-right: 10px;
}

/* Efecto al pasar el mouse */
.button:hover {
  background-color: #892CDC; /* Azul oscuro */
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3); /* Aumentar sombra al pasar el mouse */
}
</style>