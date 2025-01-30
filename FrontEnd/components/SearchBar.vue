<template>
  <div class="search-bar">
    <input type="text" :value="modelValue" @input="handleInput" placeholder="Buscar..." class="search-input" />
    <img src="~/assets/loupe.png" alt="Buscar" class="search-icon" @click="handleInputClick" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Definir las props y los eventos
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'input']);

// Función para manejar el evento input
function handleInput(event) {
  const value = event.target.value;
  emit('update:modelValue', value); // Actualiza el valor del v-model
  emit('input', value); // Emite el evento input con el valor
}

// Función para manejar el clic en el ícono de búsqueda (opcional)
function handleInputClick() {
  // Aquí puedes agregar lógica adicional si es necesario
  console.log('Ícono de búsqueda clickeado');
}
</script>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  background-color: #393e46;
  border: 2px solid #892cdc;
  color: white;
  font-size: 1.2rem;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  padding-right: 40px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  margin-right: 10px;
  width: 350px;
}

.search-input:hover {
  background-color: #393e46;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 5px;
}
</style>