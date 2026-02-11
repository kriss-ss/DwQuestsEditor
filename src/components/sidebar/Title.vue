<template>
  <div class="sidebar-quest-title">
    <input class="quest-title-name"
           :value="quest.displayName || questName"
           @change="editDisplayName($event)"
           title="Название квеста"
    >
    <div
        class="quest-title-icon"
        @click="showItemPicker($event, editQuestIcon, 'NaN')"
    >
      <img loading="lazy" class="sidebar-item-icon" :src="questIcon" alt=""/>
    </div>
  </div>
</template>


<script setup>

import {iconByQuestName} from "@/utils/getIcon.js";
import {computed, inject} from "vue";

const props = defineProps({
  quest: {
    type: Object,
    required: true,
  },
  questName: {
    type: String,
    required: true,
  },
  itemSelector: {
    type: Object,
    required: true,
  },
  tabID: {
    type: String,
    required: true
  }
})

const saveSnapshot = inject('saveSnapshot')

const questIcon = computed(() =>
    iconByQuestName(props.questName, props.quest.iconItem, props.tabID)
)

const editDisplayName = (event) => {
  props.quest.displayName = event.target.value;
  saveSnapshot()
}

const editQuestIcon = (questIcon, item) => {
  props.quest.iconItem = item;
  saveSnapshot()
}

const showItemPicker = (event, func, data) => {
  props.itemSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}

</script>

<style scoped>

.sidebar-item-icon {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.quest-title-name {
  font-size: 1.25rem;
  font-weight: bold;
  /*text-align: center;*/
  background: transparent;
  width: 100%;
}

</style>
