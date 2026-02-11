<template>
  <div class="sidebar-quest-visual">
    <p class="sidebar-elem-title">Визуал</p>
    <div class="quest-visual-inputs">

      <SelectButton
          class="sidebar-default-button quest-visual-input-size"
          :items="wordSizes"
          :selected="quest.iconSize"
          @change-select="editSize"
          title="Размер квеста"
      />

      <select
          @change="editColor($event)"
          class="sidebar-default-button quest-visual-input-color"

          :key="quest + '-color'"
          :style="{background: questRarities[quest.rarity ?? 'UNCOMMON']}"
          name="quest-color" :id="quest + '-color'"
          title="Цвет квеста"
      >
        <option
            v-for="color in Object.keys(questRarities)"
            class="quest-visual-input-color-option"
            :value="color"
            :selected="color === quest.rarity"
            :style="{background: questRarities[color]}"
        >
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>

import SelectButton from "@/components/ui/SelectButton.vue";
import {wordSizes, questRarities} from "@/constants/questConstants.js";
import {inject} from "vue";

const props = defineProps({
  quest: {
    type: Object,
    required: true,
  }
})

const saveSnapshot = inject('saveSnapshot')

const editSize = (event) => {
  props.quest.iconSize = event
  saveSnapshot()
}

const editColor = (event) => {
  props.quest.rarity = event.target.value
  saveSnapshot()
}


</script>


<style scoped>

.quest-visual-input-size {
  text-align: center;
  font-weight: 600;
  color: white;
  font-family: Inter, sans-serif;
  padding: 0;
  transition: all 0.2s ease;
}

.quest-visual-input-color {
  padding: 0;
  transition: scale 0.2s ease;
}

.quest-visual-input-size:hover {
  background: var(--primary-hover);
}

.quest-visual-input-size:active, .quest-visual-input-color:active {
  scale: 0.95;
}


</style>