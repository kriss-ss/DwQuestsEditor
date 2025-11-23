<template>
  <div class="sidebar-grid">
    <div class="sidebar-enable-grid-modifier">
      <label for="enable-grid-modifier">Выравнивание по сетке</label>
      <input
          @change="gridEnable = !gridEnable;$emit('changeGridEnable', gridEnable)"
          type="checkbox" id="enable-grid-modifier" name="scales" />
    </div>
    <div
        v-if="gridEnable"
        class="sidebar-grid-modifier">
      <input
          @input="$emit('changeGridSize', gridSize)"
          class="grid-modifier-range"
          type="range"
          min="25"
          max="150"
          value="50"
          v-model="gridSize"
          step="1"

      >
      <label class="grid-modifier-label">
        {{ gridSize }}px
      </label>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const gridEnable = ref(false)
const gridSize = ref(50)



</script>

<style scoped>

.sidebar-enable-grid-modifier {
  margin: 2rem 1rem 1rem 2rem;
}

#enable-grid-modifier {
  margin-left: 2.25rem;
}

#enable-grid-modifier:focus {
  border: none;
}

.sidebar-grid-modifier {
  margin: 2rem 1rem 1rem 2rem;
  display: grid;
  gap: 2.25rem;
  width: 12.5rem;
}

.grid-modifier-label {
  margin-left: 110px;
}

.grid-modifier-range {
  width: 250px;
  accent-color: #4E7F6B;
  appearance: none;
}

.grid-modifier-range::-webkit-slider-runnable-track {
  box-sizing: border-box;
  height: 10px;
  background-color: #D9D9D9;
}

.grid-modifier-range::-moz-range-track {
  box-sizing: border-box;
  background-color: #D9D9D9;
}

.grid-modifier-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  background-color: transparent;
  margin-top: -5px;
  width: 10px;
  height: 20px;
  box-shadow: 0 0 0 10px inset #4E7F6B;
}

/*.grid-modifier-range::-webkit-slider-thumb {*/
/*    -webkit-appearance: none;*/
/*    height: 20px;*/
/*    background: #4E7F6B;*/
/*}*/

/*.grid-modifier-range::-moz-range-thumb {*/
/*    height: 20px;*/
/*    background: #4E7F6B;*/
/*}*/

</style>