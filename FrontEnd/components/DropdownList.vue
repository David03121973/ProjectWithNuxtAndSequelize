// DropdownList.vue
<template>
  <div class="dropdown-list">
    <button class="dropdown-button" @click="toggleDropdown">
      {{ selectedOption || title }}
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" v-if="isOpen">
      <li v-for="(item, index) in items" :key="index" @click="selectOption(item)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    items: Array,
    modelValue: String // Agrega esta propiedad para recibir el valor actual
  },
  data() {
    return {
      isOpen: false,
      selectedOption: this.modelValue // Inicializa el valor seleccionado con el valor actual
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    selectOption(option) {
      this.selectedOption = option
      this.$emit('update:modelValue', option) // Emite el evento update:modelValue con el nuevo valor
      this.isOpen = false
    }
  }
}
</script>
  
  <style scoped>
  .dropdown-list {
    position: relative;
    display: inline-block;
    background-color: #393E46;
    border: 1px solid #892CDC;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .dropdown-button {
    background-color: #393E46;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .dropdown-button:hover {
    background-color: #6a1b9a;
  }
  
  .caret {
    display: inline-block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: #fff transparent transparent transparent;
    margin-left: 10px;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #393E46;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-menu li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }
  
  .dropdown-menu li:hover {
    background-color: #6a1b9a;
  }
  
  .dropdown-menu li:last-child {
    border-bottom: none;
  }
  </style>