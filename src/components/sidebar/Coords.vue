<template>
  <div class="sidebar-quest-coords">
    <p class="sidebar-elem-title">Расположение</p>
    <div class="quest-coords-inputs">
            <span class="sidebar-default-button quest-coords-input">
              <p class="coords-letter">X</p>
              <input class="coords-value" type="text"
                     :value="quest.displayX"
                     @change="editDisplayX($event)"
              />
            </span>
      <span class="sidebar-default-button quest-coords-input">
              <p class="coords-letter">Y</p>
              <input class="coords-value" type="text"
                     :value="quest.displayY"
                     @change="editDisplayY($event)"
              />
            </span>
    </div>
  </div>
</template>

<script setup>

import {inject} from "vue";

const props = defineProps({
  quest: {
    type: Object,
    required: true,
  }
})

const saveSnapshot = inject('saveSnapshot')

const editDisplayX = (event) => {
  props.quest.displayX = event.target.value;
  saveSnapshot()
}

const editDisplayY = (event) => {
  props.quest.displayY = event.target.value;
  saveSnapshot()
}

</script>

<style scoped>

.coords-value {
  width: 100%;
  background: transparent;
  text-align: center;
  font-weight: 600;
  border: none;
  color: white;
  font-family: Inter, sans-serif;
}

.coords-letter {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  padding-left: 0.25rem;
  width: 1.5rem;
  height: 2rem;
  font-size: 1.125rem;
  text-shadow:
      -0   -1px 1px #000000,
      0   -1px 1px #000000,
      -0    1px 1px #000000,
      0    1px 1px #000000,
      -1px -0   1px #000000,
      1px -0   1px #000000,
      -1px  0   1px #000000,
      1px  0   1px #000000,
      -1px -1px 1px #000000,
      1px -1px 1px #000000,
      -1px  1px 1px #000000,
      1px  1px 1px #000000,
      -1px -1px 1px #000000,
      1px -1px 1px #000000,
      -1px  1px 1px #000000,
      1px  1px 1px #000000;
}

.quest-coords-input {
  display: flex;
}

</style>